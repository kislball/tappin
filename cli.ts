import { cliModule } from "./cli/mod.ts";
import {
  CommandService,
  commandService,
} from "./cli/services/command-service.ts";
import { createContainerHelper, createFactory } from "./core/mod.ts";

const factory = createFactory(cliModule);

await factory.init();

const helper = createContainerHelper(factory.container());
await helper.provide([commandService], (cmd: CommandService) => {
  cmd.showHelp();
});
