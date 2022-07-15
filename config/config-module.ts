import { createModule } from "../core/mod.ts";
import { reflectModule } from "../reflect/mod.ts";
import { configService } from "./config-service.ts";

/** Module for configuration management */
export const configModule = createModule((dsl) =>
  dsl
    .import(reflectModule)
    .service(configService)
    .name("ConfigModule")
);
