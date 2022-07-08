import { latest } from './www/versions.ts'

let dry = false
let cmdName = Deno.args?.[0] ?? 'help'

if (!['help', 'new', 'dry'].includes(cmdName)) cmdName = 'help'

const help = `tappin-init v${latest} - initialize Tappin project with one command

Commands:
  - new  - creates a new project in working directory
  - help - shows this message
  - dry  - dry runs initializer`

if (cmdName === 'help') {
  console.log(help)
  Deno.exit()
} else if (cmdName === 'dry') {
  dry = true
}

const stringify = (a: any) => JSON.stringify(a, null, 2)

const tappinJson = stringify({
  version: latest,
  modules: ['core', 'dev'],
})

const mainTs = `import { start } from "$tappin/dev";

const appName = Deno.args?.[0];

if (appName === undefined) {
  console.error("Please give application name");
}

await start(appName, import.meta.url);
`

const devTs = `import { generate, start } from "$tappin/dev";

generate(import.meta.url);
console.log("Manifest generated");

const appName = Deno.args?.[0];

if (appName === undefined) {
  console.error("Please give application name");
}

await start(appName, import.meta.url);
`

const files = {
  'tappin.json': tappinJson,
  'main.ts': mainTs,
  'dev.ts': devTs,
}

const dirs = [
  'apps',
  'libs',
  'libs/dinosaurs-trivia',
  'apps/dinosaurs',
]

const content = Deno.readDirSync(".")
if ([ ...content ].length !== 0) {
  console.error('This directory is not empty. Empty it before usage of CLI.')
  Deno.exit()
}

for (const dir of dirs) {
  console.log(`Creating directory ${dir}`)
  if (!dry) {
    Deno.mkdirSync(dir)
  }
}

for (const entry of Object.entries(files)) {
  console.log(`Creating file ${entry[0]}`)
  if (!dry) {
    Deno.writeTextFileSync(entry[0], entry[1])
  }
}