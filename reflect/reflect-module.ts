import { createModule } from "../core/module.ts";
import { reflectService } from "./reflect-service.ts";

export const reflectModule = createModule((dsl) => dsl.service(reflectService));
