import {
  AppFactory,
  Container,
  containerServiceTemplate,
  createService,
  factoryServiceTemplate,
  Module,
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
  /** Dynamically loads a module */
  load: (m: Module) => Promise<void>;
}

/** Dynamic service */
export const dynamicService = createService<DynamicService>((dsl) =>
  dsl
    .token(dynamicServiceToken)
    .inject(containerServiceTemplate, factoryServiceTemplate)
    .provide((container: Container, factory: AppFactory) => {
      const get = <T>(token: TokenResolvable): Promise<T> =>
        container.resolve<T>(resolveToken(token));

      const load = async (m: Module) => {
        await factory.initModule(m);
      };

      return {
        get,
        load,
      };
    })
);
