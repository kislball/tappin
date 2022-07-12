import { Context } from "./http-context.ts";
import { errors } from "../deps.ts";

export const serialize = (a: any) =>
  a instanceof Response ? a : new Response(a);

/** Represents a middleware */
export type Middleware = (ctx: Context, next: () => any) => any;

/**
 * Combines middlewares into a single function and returns a function
 * which receives Context
 */
export const combine = (...middlewares: Middleware[]) =>
  async (ctx: Context) => {
    const dispatch = (n: number): any => {
      if (n >= middlewares.length) {
        return;
      }

      return middlewares[n](ctx, () => dispatch(n + 1));
    };

    return serialize(await dispatch(0));
  };

/** Creates a guard middleware from a function returning boolean */
export const guard = (
  g: (ctx: Context) => Promise<boolean> | boolean,
): Middleware =>
  async (ctx: Context, next: () => any) => {
    const result = await g(ctx);
    if (result) {
      return next();
    } else {
      throw new errors.errors.Forbidden();
    }
  };
