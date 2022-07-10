import { log } from "../deps.ts";

await log.setup({
  handlers: {
    "console": new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    "tappin-cli": {
      handlers: ["console"],
      level: "DEBUG",
    },
  },
});

const logger = log.getLogger("tappin-cli");

/** Configuration for Tappin import map generaotr */
export interface TappinJson {
  version: string;
  modules: string[];
}

/** Generates import maps */
export const generateImportMap = (
  projects: Record<string, string>,
  { version, modules }: TappinJson,
  map: { imports: Record<string, string> } = { imports: {} },
) => {
  if (!modules.includes("dev")) modules.push("dev");
  for (const entry of Object.entries(projects)) {
    map.imports[`$lib/${entry[0]}`] = entry[1];
  }

  for (const module of modules) {
    map.imports[`$tappin`] =
      `https://deno.land/x/tappin@${version}/${module}/mod.ts`;
  }

  return JSON.stringify(map, null, 2);
};

/** Generates import map from given JSON */
export const generate = (base: string) => {
  const tappinUrl = new URL("tappin.json", base).pathname;
  const data = Deno.readTextFileSync(tappinUrl);
  const info: TappinJson = JSON.parse(data);
  const libsDir = new URL("libs", base).pathname;
  const projects: Record<string, string> = {};

  try {
    const read = [...Deno.readDirSync(libsDir)];
    for (const dir of read) {
      if (dir.isDirectory) {
        projects[dir.name] = `./libs/${dir.name}/mod.ts`;
      }
    }
  } catch { /* */ }

  let existing = { imports: {} };

  try {
    existing = JSON.parse(
      Deno.readTextFileSync(new URL("import_map.json", base)),
    );
  } catch { /* */ }

  const r = generateImportMap(projects, info, existing);
  Deno.writeTextFileSync(new URL("import_map.json", base), r);
  logger.info({ message: "Generated manifest" });
};

/** Starts given application */
export const start = async (appName: string, base: string) => {
  logger.info({ message: "Starting application", appName, base });
  await import(new URL(`apps/${appName}/main.ts`, base).href);
};
