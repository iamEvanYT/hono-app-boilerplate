// Load Environment Variables
export const authKey = process.env.AuthKey;
export const port = parseInt(process.env.Port || "3000");
export const environment = process.env.Environment || "Testing";

export const mongoUrl = process.env.MongoUrl || "mongodb://localhost:27017";

// Database
export const DB_ENABLED = false;
export const dbName = "database";
export const mainCollectionName = "main";
