import {
  createContainer,
  createContainerHelper,
  Scope,
} from "../../core/mod.ts";
import { assert } from "../deps.ts";

Deno.test("creates container without any errors", () => {
  createContainer();
});

Deno.test("creates container, registers a useValue provider and resolves it", async () => {
  const container = createContainer();
  container.register({
    token: "123",
    useValue: 123,
  });

  assert.assertEquals(await container.resolve("123"), 123);
});

Deno.test("creates container, registers a useValue Transient provider and fails", () => {
  const container = createContainer();

  assert.assertThrows(() => {
    container.register({
      token: "123",
      useValue: 132,
      scope: Scope.Transient,
    });
  });
});

Deno.test("creates container, registers a useFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
  });

  const one = await container.resolve("123");
  const two = await container.resolve("123");

  assert.assertEquals(one, two);
});

Deno.test("creates container, registers a Transient useFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
    scope: Scope.Transient,
  });

  const one = await container.resolve("123");
  const two = await container.resolve("123");

  assert.assertNotEquals(one, two);
});

Deno.test("creates container, registers a useAsyncFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    // deno-lint-ignore require-await
    useAsyncFactory: async () => Math.random(),
  });

  const one = await container.resolve("123");
  const two = await container.resolve("123");

  assert.assertEquals(one, two);
});

Deno.test("creates container, registers a Transient useAsyncFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    // deno-lint-ignore require-await
    useAsyncFactory: async () => Math.random(),
    scope: Scope.Transient,
  });

  const one = await container.resolve("123");
  const two = await container.resolve("123");

  assert.assertNotEquals(one, two);
});

Deno.test("creates container, registers a useFactory provider, resolves it, clears providers, resolves it and fails", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
    scope: Scope.Transient,
  });

  await container.resolve("123");

  container.clearProviders();

  assert.assertRejects(async () => {
    await container.resolve("123");
  });
});

Deno.test("creates container, registers a useFactory provider, resolves it, clears singletons, resolves it and results are different", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
    scope: Scope.Transient,
  });

  const one = await container.resolve("123");

  container.clearSingletons();

  const two = await container.resolve("123");

  assert.assertNotEquals(one, two);
});

Deno.test("creates container, registers a useFactory, resolves it, clears singletons, resolves it and compares", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
  });

  const one = await container.resolve("123");

  container.clearSingletons();

  const two = await container.resolve("123");

  assert.assertNotEquals(one, two);
});

Deno.test("creates container, creates container helper, reigsters a provider and check if everything works", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useValue: 123,
  });

  const helper = createContainerHelper(container);

  const v = await helper.provide(["123"], (val: number) => val);

  assert.assertEquals(v, 123);
});
