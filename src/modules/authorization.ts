import type { Context, Next } from "hono";
import { authKey, environment } from "./config";
import { timingSafeEqual } from "node:crypto";

export function isAuthorized(authHeader: string | undefined): boolean {
  if (environment === "Testing") {
    // In testing mode, we always return true.
    return true;
  }

  // If no auth key is set, then authentication is not needed.
  if (!authKey) return true;

  if (!authHeader) {
    // If no auth header is set, then we return false as no authentication method was provided.
    return false;
  }

  // Check if the length of the auth header is the same as the auth key.
  if (authHeader.length !== authKey.length) {
    return false;
  }

  // Check if the auth header matches the auth key via timingSafeEqual.
  const authHeaderBuffer = new TextEncoder().encode(authHeader);
  const authKeyBuffer = new TextEncoder().encode(authKey);
  return timingSafeEqual(authHeaderBuffer, authKeyBuffer);
}

// middleware to check if the user is authorized before allowing access to a route
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("authorization");
  const authorized = isAuthorized(authHeader);

  if (!authorized) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
  return;
}
