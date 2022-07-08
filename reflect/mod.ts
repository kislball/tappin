import { createModule } from "../core/mod.ts";
import { reflectService } from "./reflect-service.ts";

export const reflectModule = createModule((dsl) => dsl.service(reflectService));

export * from "./reflect-service.ts";
