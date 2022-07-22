import { createModule } from "../core/module.ts";
import { cottonService } from "./cotton-service.ts";

export const cottonModule = createModule((dsl) =>
  dsl
    .name("CottonModule")
    .service(cottonService)
);
