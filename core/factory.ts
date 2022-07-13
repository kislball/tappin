import { Container, createContainer } from "./container/container.ts";
import { createProvide } from "./container/helper.ts";
import { createModule, Module } from "./module.ts";
import { resolveToken, Service, TokenResolvable } from "./service.ts";
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
import { log } from "../deps.ts";

export const stringifyToken = (token: TokenResolvable) => {
  const resolved = resolveToken(token);
  return typeof resolved === "string" ? resolved : resolved.description;
};

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
  const logger = log.getLogger("tappin");

  const appContainer = createContainer();
  const appContainerService = containerServiceTemplate((dsl) =>
    dsl.provide(() => appContainer)
  );
  const rootModuleService = rootModuleServiceTemplate((dsl) =>
    dsl.provide(() => root)
  );

  const factoryModule = createModule((dsl) =>
    dsl.name("FactoryModule").import(root).service(appContainerService).service(
      rootModuleService,
    )
  );

  const onDestroyHooks: OnDestroy[] = [];
  const onStartHooks: OnStart[] = [];

  const initModule = async (mod: Module) => {
    for (const service of mod.services) {
      await initService(service);
      logger.info({
        message: "Initialized service",
        service: stringifyToken(service),
      });
    }

    for (const impor of mod.imports) {
      await initModule(impor);
    }

    const res = await appContainer.initialize(mod.services.map((e) => e.token));

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

    logger.info({ message: "Initialized module", module: stringifyToken(mod) });
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
    logger.info({ message: "All modules initialized" });
  };

  const bindHooks = () => {
    Deno.addSignalListener("SIGINT", () => close());

    try {
      Deno.addSignalListener("SIGBREAK", () => close());
    } catch {
      /* */
    }
  };

  const start = async () => {
    bindHooks();
    await init();
    for (const start of onStartHooks) {
      await runOnStart(start);
    }
    logger.info({ message: "Application is ready to go!" });
  };

  const close = async () => {
    Deno.removeSignalListener("SIGINT", close);

    try {
      Deno.removeSignalListener("SIGBREAK", close);
    } catch {
      /* */
    }
    logger.info({ message: "Application closing..." });
    for (const destroy of onDestroyHooks) {
      try {
        await runOnDestroy(destroy);
      } catch (e) {
        logger.error({
          message: "One of the onDestroy hooks failed. Ignoring.",
          error: e,
        });
      }
    }
    await appContainer.reset();
    logger.info({ message: "Application closed" });
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
