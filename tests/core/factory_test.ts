import { createFactory, createModule } from "../../core/mod.ts";

Deno.test("creates factory and instantiates an empty app", async () => {
  const factory = createFactory(createModule());

  await factory.init();
});

Deno.test("creates factory with two modules and instantiates it", async () => {
  const childModule = createModule((dsl) => dsl);
  const rootModule = createModule((dsl) => dsl.import(childModule));

  const factory = createFactory(rootModule);

  await factory.init();
});
