import { createModule } from "../core/module.ts";
import { httpService } from "./http-service.ts";

export const httpModule = createModule(dsl => dsl.service(httpService))