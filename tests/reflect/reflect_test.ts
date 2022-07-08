import {
  createContainerHelper,
  createFactory,
  createModule,
  createService,
} from "../../core/mod.ts";
import {
  reflectModule,
  ReflectService,
  reflectService,
} from "../../reflect/mod.ts";
import { assertEquals } from "../deps.ts";

Deno.test("gets all modules", async () => {
  const two = createModule();
  const root = createModule((dsl) => dsl.import(two).import(reflectModule));

  const factory = createFactory(root);
  await factory.init();

  const container = factory.container();
  const helper = createContainerHelper(container);

  const value = await helper.provide([reflectService], (s: ReflectService) => {
    const modules = s.getModules();
    return modules.length;
  });

  assertEquals(value, 3);
});

Deno.test("gets all modules with given metadata", async () => {
  const two = createModule((dsl) => dsl.set("lol", true));
  const root = createModule((dsl) => dsl.import(two).import(reflectModule));

  const factory = createFactory(root);
  await factory.init();

  const container = factory.container();
  const helper = createContainerHelper(container);

  const value = await helper.provide([reflectService], (s: ReflectService) => {
    const modules = s.getModules((e) => e.metadata.get("lol") === true);
    return modules.length;
  });

  assertEquals(value, 1);
});

Deno.test("gets all services", async () => {
  const two = createModule();
  const root = createModule((dsl) => dsl.import(two).import(reflectModule));

  const factory = createFactory(root);
  await factory.init();

  const container = factory.container();
  const helper = createContainerHelper(container);

  const value = await helper.provide([reflectService], (s: ReflectService) => {
    const services = s.getServices();
    return services.length;
  });

  assertEquals(value, 1);
});

Deno.test("gets all services with given metadata", async () => {
  const service = createService((dsl) => dsl.set("123", true));

  const two = createModule((dsl) => dsl.service(service));
  const root = createModule((dsl) => dsl.import(two).import(reflectModule));

  const factory = createFactory(root);
  await factory.init();

  const container = factory.container();
  const helper = createContainerHelper(container);

  const value = await helper.provide([reflectService], (s: ReflectService) => {
    const services = s.getServices((s) => s.metadata.get("123") === true);
    return services.length;
  });

  assertEquals(value, 1);
});

Deno.test("gets root module", async () => {
  const notRoot = createModule();
  const root = createModule((dsl) => dsl.import(notRoot).import(reflectModule));

  const factory = createFactory(root);
  await factory.init();

  const moduleRoot = await createContainerHelper(factory.container()).provide([
    reflectService,
  ], (reflect: ReflectService) => {
    return reflect.getRoot();
  });

  assertEquals(moduleRoot.token, root.token);
});
