import {
  Container,
  containerServiceTemplate,
  createService,
  resolveToken,
  token,
  TokenResolvable,
} from "../core/mod.ts";

/** Token for injection LazyService */
export const lazyServiceToken = token("LazyService");

/** Service for lazy loading */
export interface LazyService {
  /** Gets a server */
  get: <T>(token: TokenResolvable) => Promise<T>;
}

/** Lazy service */
export const lazyService = createService<LazyService>((dsl) =>
  dsl
    .token(lazyServiceToken)
    .inject(containerServiceTemplate)
    .provide((container: Container) => {
      const get = <T>(token: TokenResolvable): Promise<T> =>
        container.resolve<T>(resolveToken(token));

      return {
        get,
      };
    })
);
