import { createModule } from "../core/module.ts";
import { dynamicService } from "./dynamic-service.ts";
import { reflectService } from "./reflect-service.ts";

/** Module for reflection */
export const reflectModule = createModule((dsl) =>
  dsl.name("ReflectModule").service(reflectService).service(dynamicService)
);
