import type { Context, Next } from "hono";
import { authKey, environment } from "./config.js";

export function isAuthorized(authHeader: string | undefined): boolean {
  if (environment !== "Testing") {
    return authHeader === authKey;
  }
  return true;
}

// middleware to check if the user is authorized before allowing access to a route
export async function authMiddleware(c: Context, next: Next) {
  if (!isAuthorized(c.req.header("authorization"))) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
  return;
}
