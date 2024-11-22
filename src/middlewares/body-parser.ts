import type { Context, MiddlewareHandler, Next } from "hono";
import type { ZodTypeAny, infer as zodInfer } from "zod";

export type ContextWithParsedBody<Schema extends ZodTypeAny = ZodTypeAny> = Context & {
  bodyData: Schema extends ZodTypeAny ? zodInfer<Schema> : unknown;
};

type JSONBodyParserOptions<T extends ZodTypeAny> = {
  schema?: T;
};

export function parseJSONBody<T extends ZodTypeAny>({ schema }: JSONBodyParserOptions<T>): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    let failedToParse = false;
    const jsonBody = await c.req.json().catch(() => {
      failedToParse = true;
    });

    if (failedToParse) {
      return c.json({ error: "FailedToParseBody" }, 400);
    }

    const ctx = c as ContextWithParsedBody<T>;

    if (schema) {
      const parseResult = schema.safeParse(jsonBody);
      if (!parseResult.success) {
        return c.json({ error: parseResult.error.errors }, 400);
      }

      ctx.bodyData = parseResult.data;
    } else {
      ctx.bodyData = jsonBody;
    }

    await next();
    return;
  };
}
