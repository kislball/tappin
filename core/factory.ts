import { Container, createContainer } from "./container/container.ts";
import { createProvide } from "./container/helper.ts";
import { createModule, Module } from "./module.ts";
import { Service } from "./service.ts";
import { containerServiceTemplate } from "./container-service.ts";
import { rootModuleServiceTemplate } from "./root-module-service.ts";

/** Creates application from root module */
export interface AppFactory {
  /** Initializes and starts app */
  init: () => Promise<void>;
  /** Returns container */
  container: () => Container;
  /** Returns root module */
  root: () => Module;
}

/** Creates a new factory */
export const createFactory = (root: Module): AppFactory => {
  const appContainer = createContainer();
  const appContainerService = containerServiceTemplate((dsl) =>
    dsl.provide(() => appContainer)
  );
  const rootModuleService = rootModuleServiceTemplate((dsl) =>
    dsl.provide(() => root)
  );

  const factoryModule = createModule((dsl) =>
    dsl.import(root).service(appContainerService).service(rootModuleService)
  );

  const initModule = async (mod: Module) => {
    for (const service of mod.services) {
      await initService(service);
    }

    for (const impor of mod.imports) {
      await initModule(impor);
    }

    await appContainer.forceInit(mod.services.map((e) => e.token));
  };

  const initService = async <T = any>(service: Service<T>) => {
    await appContainer.register({
      token: service.token,
      scope: service.scope,
      useAsyncFactory: createProvide(service.inject, service.provider),
    });
  };

  const init = async () => {
    await initModule(factoryModule);
  };

  return { init, container: () => appContainer, root: () => root };
};

/** Creates a factory and starts application */
export const createApp = async (root: Module) => {
  const factory = createFactory(root);
  await factory.init();
  return factory;
};
