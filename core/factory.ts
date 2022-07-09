import { Container, createContainer } from "./container/container.ts";
import { createProvide } from "./container/helper.ts";
import { createModule, Module } from "./module.ts";
import { Service } from "./service.ts";
import { containerServiceTemplate } from "./container-service.ts";
import { rootModuleServiceTemplate } from "./root-module-service.ts";
import {
  isOnDestroy,
  isOnInit,
  isOnStart,
  OnDestroy,
  OnStart,
  runOnDestroy,
  runOnInit,
  runOnStart,
} from "./hooks.ts";

/** Creates application from root module */
export interface AppFactory {
  /** Initializes app */
  init: () => Promise<void>;
  /** Starts app */
  start: () => Promise<void>;
  /** Returns container */
  container: () => Container;
  /** Returns root module */
  root: () => Module;
  /** Closes application */
  close: () => Promise<void>;
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

  const onDestroyHooks: OnDestroy[] = [];
  const onStartHooks: OnStart[] = [];

  const initModule = async (mod: Module) => {
    for (const service of mod.services) {
      await initService(service);
    }

    for (const impor of mod.imports) {
      await initModule(impor);
    }

    const res = await appContainer.forceInit(mod.services.map((e) => e.token));

    for (const r of res) {
      if (isOnDestroy(r)) {
        onDestroyHooks.push(r);
      }

      if (isOnStart(r)) {
        onStartHooks.push(r);
      }

      if (isOnInit(r)) {
        await runOnInit(r);
      }
    }
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

  const start = async () => {
    await init();
    for (const start of onStartHooks) {
      await runOnStart(start);
    }
  };

  const close = async () => {
    for (const destroy of onDestroyHooks) {
      try {
        await runOnDestroy(destroy)
      } catch { /* */ }
    }
  };

  return {
    init,
    container: () => appContainer,
    root: () => root,
    close,
    start,
  };
};

/** Creates a factory and starts application */
export const createApp = async (root: Module) => {
  const factory = createFactory(root);
  await factory.init();
  return factory;
};
