import { ModuleDsl } from "../core/mod.ts";
import { httpModule } from "./http-module.ts";
import {
  HttpOptionsService,
  httpOptionsServiceTemplate,
} from "./http-options-service.ts";

export const httpMixin = (options: HttpOptionsService) =>
  (dsl: ModuleDsl) =>
    dsl
      .service(httpOptionsServiceTemplate((dsl) => dsl.provide(() => options)))
      .import(httpModule);
