import { AppFactory } from "./factory.ts";
import { createTemplate, token } from "./service.ts";

export const factoryServiceToken = token("FactoryService");

export const factoryServiceTemplate = createTemplate<AppFactory>(
  (dsl) => dsl.token(factoryServiceToken),
);
