import { Module } from "./module.ts";

/** Creates application from root module */
export interface AppFactory {
  /** Initializes and starts app */
  init: () => Promise<void>;
}

/** Creates a new factory */
export const createFactory = (_root: Module): AppFactory => {
  const init = async () => {};

  return { init };
};

/** Creates a factory and starts application */
export const createApp = async (root: Module) => {
  const factory = createFactory(root);
  await factory.init();
  return factory;
};
