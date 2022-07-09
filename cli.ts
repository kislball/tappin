import { latest } from "./www/versions.ts";
import { generateImportMap } from "./dev/mod.ts";

let dry = false;
let cmdName = Deno.args?.[0] ?? "help";

if (!["help", "new", "dry"].includes(cmdName)) cmdName = "help";

const help =
  `tappin-init v${latest} - initialize Tappin project with one command

Commands:
  - new  - creates a new project in working directory
  - help - shows this message
  - dry  - dry runs initializer`;

if (cmdName === "help") {
  console.log(help);
  Deno.exit();
} else if (cmdName === "dry") {
  dry = true;
}

const stringify = (a: any) => JSON.stringify(a, null, 2);

const tappinJson = stringify({
  version: latest,
  modules: ["core", "dev"],
});

const mainTs = `import { start } from "$tappin/dev";

const appName = Deno.args?.[0];

if (appName === undefined) {
  console.error("Please give application name");
  Deno.exit();
}

await start(appName, import.meta.url);
`;

const devTs = `import { generate, start } from "$tappin/dev";

generate(import.meta.url);
console.log("Manifest generated");

const appName = Deno.args?.[0];

if (appName === undefined) {
  console.error("Please give application name");
  Deno.exit();
}

await start(appName, import.meta.url);
`;

const triviaService = `import { createService, token } from "$tappin/core";

export const triviaService = createService((dsl) =>
  dsl.token(token("TriviaService")).provide(() => "Denosaurs are really big!")
);
`;

const triviaModule = `import { createModule } from "$tappin/core";
import { triviaService } from "./trivia-service.ts";

export const triviaModule = createModule((dsl) =>
  dsl.name("TriviaModule").service(triviaService)
);
`;

const triviaMod = `export * from "./trivia-service.ts";
export * from "./trivia-module.ts";
`;

const appModule = `import { createModule, token } from "$tappin/core";
import { triviaModule, triviaService } from "$libs/dinosaurs-trivia";

export const appService = createService((dsl) =>
  dsl.token(token("AppService")).inject(triviaService).provide((fact: string) =>
    fact
  )
);

export const appModule = createModule((dsl) => dsl.import(triviaModule));
`

const appMain = `import { createFactory } from "$tappin/core";
import { appModule } from "./app-module.ts";

const factory = createFactory(appModule);
await factory.init();
`

const denoJson = stringify({
  importMap: "./import_map.json",
  tasks: {
    pretty: "deno fmt; deno lint",
    start: "deno run -A --watch --check ./dev.ts",
  },
});

const files = {
  "tappin.json": tappinJson,
  "main.ts": mainTs,
  "dev.ts": devTs,
  "deno.json": denoJson,
  "libs/dinosaurs-trivia/mod.ts": triviaMod,
  "libs/dinosaurs-trivia/trivia-service.ts": triviaService,
  "libs/dinosaurs-trivia/trivia-module.ts": triviaModule,
  "apps/dinosaurs/app-module.ts": appModule,
  "apps/dinosaurs/main.ts": appMain,
};

const dirs = [
  "apps",
  "libs",
  "libs/dinosaurs-trivia",
  "apps/dinosaurs",
];

const content = Deno.readDirSync(".");
if ([...content].length !== 0) {
  console.error("This directory is not empty. Empty it before usage of CLI.");
  Deno.exit();
}

for (const dir of dirs) {
  console.log(`Creating directory ${dir}`);
  if (!dry) {
    Deno.mkdirSync(dir);
  }
}

for (const entry of Object.entries(files)) {
  console.log(`Creating file ${entry[0]}`);
  if (!dry) {
    Deno.writeTextFileSync(entry[0], entry[1]);
  }
}

Deno.writeTextFileSync(
  "./import_map.json",
  generateImportMap({ "dinosaurs-trivia": "./libs/dinosaurs-trivia/mod.ts" }, {
    version: "0.2.0",
    modules: ["dev", "core"],
  }),
);
