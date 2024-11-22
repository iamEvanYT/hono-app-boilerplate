import { gunzip } from "zlib";
import { promisify } from "util";
import { Context, Next } from "hono";

const gunzipAsync = promisify(gunzip);

export async function parseGzippedJson(c: Context, next: Next) {
  if (c.req.header("content-type") === "application/json" && c.req.header("content-encoding") === "gzip") {
    const buffer = await c.req.arrayBuffer();
    try {
      const decompressed = await gunzipAsync(new Uint8Array(buffer));
      c.req.json = () => Promise.resolve(JSON.parse(decompressed.toString("utf-8")));
    } catch {
      c.status(400);
      return c.json({ error: "Invalid gzipped JSON" });
    }
  }
  await next();
}
