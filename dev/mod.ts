/** Configuration for Tappin import map generaotr */
export interface TappinJson {
  version: string;
  modules: string[];
}

/** Generates import maps */
export const generateImportMap = (
  projects: Record<string, string>,
  { version, modules }: TappinJson,
) => {
  if (!modules.includes("dev")) modules.push("dev");
  const map: { import_map: Record<string, string> } = {
    import_map: {},
  };

  for (const entry of Object.entries(projects)) {
    map.import_map[`$lib/${entry[0]}`] = entry[1];
  }

  for (const module of modules) {
    map.import_map[`$tappin/${module}`] =
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

  const r = generateImportMap(projects, info);
  Deno.writeTextFileSync(tappinUrl, r);
};

/** Starts given application */
export const start = async (appName: string, base: string) => {
  await import(new URL(`apps/${appName}/main.ts`, base).href);
};
