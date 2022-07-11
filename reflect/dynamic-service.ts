import {
  Container,
  containerServiceTemplate,
  createService,
  resolveToken,
  token,
  TokenResolvable,
} from "../core/mod.ts";

/** Token for injection DynamicService */
export const dynamicServiceToken = token("DynamicService");

/** Service for dynamic loading */
export interface DynamicService {
  /** Gets a service */
  get: <T>(token: TokenResolvable) => Promise<T>;
}

/** Dynamic service */
export const dynamicService = createService<DynamicService>((dsl) =>
  dsl
    .token(dynamicServiceToken)
    .inject(containerServiceTemplate)
    .provide((container: Container) => {
      const get = <T>(token: TokenResolvable): Promise<T> =>
        container.resolve<T>(resolveToken(token));

      return {
        get,
      };
    })
);
