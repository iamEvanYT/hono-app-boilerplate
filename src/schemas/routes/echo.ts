import { z } from "zod";

export const EchoSchema = z.object({
  text: z.string().nullable()
});
