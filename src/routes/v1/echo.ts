import { Hono } from "hono";
import { type ContextWithParsedBody, parseJSONBody } from "@/middlewares/body-parser";
import { authMiddleware } from "@/modules/authorization";
import { EchoSchema } from "@/schemas/routes/echo";
import { Message } from "@/modules/database";

const routes = new Hono();

routes.post("/", authMiddleware, parseJSONBody({ schema: EchoSchema }), async (c) => {
  const { text } = (c as ContextWithParsedBody<typeof EchoSchema>).bodyData;

  if (!text) {
    return c.json({ success: true, status: "NoTextFound" });
  }

  const userId = Math.floor(Math.random() * 1000); // Generate a random user ID for demonstration purposes

  const message = new Message({
    userId,
    message: text
  });
  await message.save();

  return c.json({
    success: true,
    status: "TextSaved",
    text
  });
});

export { routes };
