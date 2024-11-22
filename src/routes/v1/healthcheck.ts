import { Hono } from "hono";

const routes = new Hono();

routes.get("/", (c) => {
  return c.json({ success: true });
});

export { routes };
