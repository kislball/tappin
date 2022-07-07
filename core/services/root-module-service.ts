import { Module } from "../module.ts";
import { createServiceTemplate, token } from "../service.ts";

export const rootModuleToken = token("RootModule");

export const rootModuleServiceTemplate = createServiceTemplate<Module>((dsl) =>
  dsl.token(rootModuleToken)
);
