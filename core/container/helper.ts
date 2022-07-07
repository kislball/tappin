import { Container } from "./container.ts";

/** Wrapper around container */
export interface ContainerHelper {
  /** Provides given function with dependencies resolved by tokens in first array */
  provide: <T>(
    tokens: Array<symbol | string>,
    f: (...deps: any[]) => T | Promise<T>,
  ) => Promise<T>;
}

/** Creates container helper */
export const createContainerHelper = (
  container: Container,
) => ({
  provide: async <T>(
    tokens: Array<symbol | string>,
    f: (...deps: any[]) => T | Promise<T>,
  ): Promise<T> => {
    const deps = tokens.map((e) => container.resolve(e));
    const rDeps = [];

    for await (const dep of deps) {
      rDeps.push(dep);
    }

    return f(...rDeps);
  },
});

/** Returns a function, which accepts container and executes given function with injected tokens */
export const createProvide = <T>(
  tokens: Array<symbol | string>,
  f: (...deps: any[]) => T | Promise<T>,
) =>
  (container: Container) => {
    const helper = createContainerHelper(container);
    return () => helper.provide(tokens, f);
  };
