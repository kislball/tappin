import { ModuleDsl } from "../core/mod.ts";
import { httpModule } from "./http-module.ts";
import {
  HttpOptionsService,
  httpOptionsServiceTemplate,
} from "./http-options-service.ts";

/** Mixin to create HTTP server with default options */
export const httpMixin = (options: HttpOptionsService) =>
  (dsl: ModuleDsl) =>
    dsl
      .service(httpOptionsServiceTemplate((dsl) => dsl.provide(() => options)))
      .import(httpModule);
