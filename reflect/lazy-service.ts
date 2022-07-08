import {
  Container,
  containerServiceTemplate,
  createService,
  resolveToken,
  token,
  TokenResolvable,
} from "../core/mod.ts";

export const lazyServiceToken = token("LazyService");

export interface LazyService {
  get: <T>(token: TokenResolvable) => Promise<T>;
}

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
