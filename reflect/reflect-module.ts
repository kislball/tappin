import { createModule } from "../core/module.ts";
import { lazyService } from "./lazy-service.ts";
import { reflectService } from "./reflect-service.ts";

/** Module for reflection */
export const reflectModule = createModule((dsl) =>
  dsl.service(reflectService).service(lazyService)
);
