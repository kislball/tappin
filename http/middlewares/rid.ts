import { createMiddleware } from "../http-reflect/http-reflect-templates.ts";
import { Context } from "../http-context.ts";

/** Adds a random request ID */
export const ridMiddleware = createMiddleware((dsl) =>
  dsl
    .provide(() =>
      (ctx: Context<Record<"requestID", unknown>>, next: () => any) => {
        ctx.metadata.requestID = crypto.randomUUID();
        return next();
      }
    )
);
