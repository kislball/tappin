import { createModule } from "../core/module.ts";
import { httpReflectModule } from "./http-reflect/http-reflect-module.ts";
import { httpService } from "./http-service.ts";

/** Module for HTTP server */
export const httpModule = createModule((dsl) =>
  dsl.name("HTTPModule").import(httpReflectModule).service(httpService)
);
