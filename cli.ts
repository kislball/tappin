import { createModule } from "./core/mod.ts";

const anotherModule = createModule((dsl) => dsl);

const appModule = createModule((dsl) => dsl.import(anotherModule));

console.log(appModule);
