import { Context } from "./http-context.ts";

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
