import { createModule } from "../core/module.ts";
import { httpService } from "./http-service.ts";

/** Module for HTTP server */
export const httpModule = createModule((dsl) => dsl.service(httpService));
