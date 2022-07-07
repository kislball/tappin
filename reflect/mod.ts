import { createModule } from "../core/mod.ts";
import { reflectService } from "./services/reflect-service.ts";

export const reflectModule = createModule((dsl) => dsl.service(reflectService));

export * from "./services/reflect-service.ts";