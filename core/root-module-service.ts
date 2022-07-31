import { Module } from "./module.ts";
import { createTemplate, token } from "./service.ts";

export const rootModuleToken = token("RootModule");

export const rootModuleServiceTemplate = createTemplate<Module>((dsl) =>
  dsl.token(rootModuleToken)
);
