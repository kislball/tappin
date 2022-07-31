import { createModule } from "../../core/mod.ts";
import { httpReflectService } from "./http-reflect-service.ts";

/** Module which registers all controllers, middlewares, etc */
export const httpReflectModule = createModule((dsl) =>
  dsl.name("HTTPReflectModule").service(httpReflectService)
);
