// Imports
import fs from "fs";
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { errorHandler } from "@/middlewares/error-handler.js";
import { logging } from "@/middlewares/logging.js";
import { parseGzippedJson } from "@/middlewares/parse-gzip-json.js";
import { port } from "@/modules/config.js";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import path from "path";
import mongoose from "mongoose";

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Spawn n-1 processes if not specified.
  let instances = numCPUs - 1;
  if (process.env.Instances) {
    instances = parseInt(process.env.Instances);
  }

  if (process.versions.bun) {
    // Bun can run webserver on the primary thread, nodejs cannot.
    instances -= 1;
  }

  // Fork workers.
  for (let i = 0; i < instances; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    process.exit();
  });
} else {
  console.log(`Worker ${process.pid} started`);
}

// Initialize Hono app
const app = new Hono();
app.use(trimTrailingSlash());
app.use(parseGzippedJson);
app.use(logging);

// Error handling middleware
app.onError(errorHandler);

// Function to recursively import routes
function importRoutes(folderPath = "", baseRoute = "") {
  const files = fs.readdirSync(folderPath);

  const importPromises: Promise<void>[] = [];

  const importFile = async (file: string) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively import routes from subdirectories
      await importRoutes(filePath, path.join(baseRoute, file));
    } else if (file.endsWith(".js") || file.endsWith(".ts")) {
      // Import and mount JavaScript files as routes
      const requiredRoutes = await import(filePath);
      const { routes } = requiredRoutes;

      const routeName = file === "index.js" ? "" : file === "index.ts" ? "" : path.parse(file).name;
      const fullRoute = path.join(baseRoute, routeName);
      app.route(fullRoute, routes);
    }
  };
  files.forEach((file) => {
    importPromises.push(importFile(file));
  });

  return Promise.all(importPromises);
}

// Import all routes from the routes folder
let fileDirectory = import.meta.dir;
if (process.versions.bun) {
  fileDirectory = import.meta.dir;
}

const apiFolder = path.join(fileDirectory, "routes");
await importRoutes(apiFolder, "");

app.get("/", (c) => c.text("Are you lost?", 404));
app.get("/*", (c) => c.text("Are you lost?", 404));

// Start the server
console.log(`Backend Server (Process ${process.pid}) listening on port ${port}`);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");

  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }

  process.exit(0);
});

const appFetch = app.fetch;
if (process.versions.bun) {
  Bun.serve({
    fetch: appFetch,
    port,
    reusePort: true
  });
} else {
  if (!cluster.isWorker) {
    import("@hono/node-server").then(({ serve: serveNodeJS }) => {
      serveNodeJS({
        fetch: appFetch,
        port
      });
    });
  }
}
