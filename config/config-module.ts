import { createModule } from "../core/mod.ts";
import { configService } from "./config-service.ts";

/** Module for configuration management */
export const configModule = createModule((dsl) =>
  dsl
    .service(configService)
    .name("ConfigModule")
);
