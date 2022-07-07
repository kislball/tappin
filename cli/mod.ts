import { createModule } from "../core/mod.ts";
import { commandService } from "./services/command-service.ts";

export const cliModule = createModule((dsl) => dsl.service(commandService));
