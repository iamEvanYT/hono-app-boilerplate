import { Hono } from "hono";
import { type ContextWithParsedBody, parseJSONBody } from "@/middlewares/body-parser.js";
import { authMiddleware } from "@/modules/authorization.js";
import { EchoSchema } from "@/schemas/echo.js";

const routes = new Hono();

routes.get(
  "/",
  authMiddleware,
  parseJSONBody({ schema: EchoSchema }),
  async (c: ContextWithParsedBody<typeof EchoSchema>) => {
    const { text } = c.bodyData;

    if (!text) {
      return c.json({ success: true, status: "NoTextFound" });
    }

    return c.json({
      success: true,
      status: "TextFound",
      text
    });
  }
);

export { routes };
