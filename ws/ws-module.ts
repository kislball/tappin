import { createModule } from "../core/module.ts";
import { reflectModule } from "../reflect/reflect-module.ts";
import { wsReflectService } from "./ws-reflect-service.ts";
import { wsService } from "./ws-service.ts";

/** Websocket module */
export const wsModule = createModule((dsl) =>
  dsl
    .import(reflectModule)
    .service(wsService)
    .service(wsReflectService)
);
