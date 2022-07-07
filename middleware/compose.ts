/** Middleware function */
export type Middleware<T> = (
  ctx: T,
  next: () => Promise<void>,
) => Promise<void> | void;

/** Composes multiple middlewares into one function */
export const compose = <T>(...middlewares: Middleware<T>[]) => {
  const dispatch = async (ctx: T, i: number) => {
    if (middlewares.length <= i) {
      return;
    } else {
      await middlewares[i](ctx, () => dispatch(ctx, i + 1));
    }
  };

  return (ctx: T) => dispatch(ctx, 0);
};
