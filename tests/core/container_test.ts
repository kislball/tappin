import { createContainer, createContainerHelper, Scope } from "../../core/mod.ts";
import { assertEquals, assertNotEquals, assertRejects, assertThrows } from "../deps.ts";

Deno.test("creates container without any errors", () => {
  createContainer();
})

Deno.test("creates container, registers a useValue provider and resolves it", async () => {
  const container = createContainer();
  container.register({
    token: "123",
    useValue: 123,
  });

  assertEquals(await container.resolve("123"), 123);
})

Deno.test("creates container, registers a useValue Transient provider and fails", () => {
  const container = createContainer();
  
  assertThrows(() => {
    container.register({
      token: "123",
      useValue: 132,
      scope: Scope.Transient,
    })
  })
})

Deno.test("creates container, registers a useFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
  });

  const one = await container.resolve("123")
  const two = await container.resolve("123")

  assertEquals(one, two)
})

Deno.test("creates container, registers a Transient useFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
    scope: Scope.Transient,
  });

  const one = await container.resolve("123")
  const two = await container.resolve("123")

  assertNotEquals(one, two)
})

Deno.test("creates container, registers a useAsyncFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    // deno-lint-ignore require-await
    useAsyncFactory: async () => Math.random(),
  });

  const one = await container.resolve("123")
  const two = await container.resolve("123")

  assertEquals(one, two)
})

Deno.test("creates container, registers a Transient useAsyncFactory and resolves it", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    // deno-lint-ignore require-await
    useAsyncFactory: async () => Math.random(),
    scope: Scope.Transient,
  });

  const one = await container.resolve("123")
  const two = await container.resolve("123")

  assertNotEquals(one, two)
})

Deno.test("creates container, registers a useFactory provider, resolves it, clears providers, resolves it and fails", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
    scope: Scope.Transient,
  });

  await container.resolve("123")
  
  container.clearProviders();

  assertRejects(async () => {
    await container.resolve("123");
  })
})

Deno.test("creates container, registers a useFactory provider, resolves it, clears singletons, resolves it and results are different", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
    scope: Scope.Transient,
  });

  const one = await container.resolve("123")
  
  container.clearSingletons();

  const two = await container.resolve("123");

  assertNotEquals(one, two);
})

Deno.test("creates container, registers a useFactory, resolves it, clears singletons, resolves it and compares", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useFactory: () => Math.random(),
  });

  const one = await container.resolve("123")

  container.clearSingletons();

  const two = await container.resolve("123")

  assertNotEquals(one, two)
})

Deno.test("creates container, creates container helper, reigsters a provider and check if everything works", async () => {
  const container = createContainer();

  container.register({
    token: "123",
    useValue: 123,
  });

  const helper = createContainerHelper(container)

  const v = await helper.provide(["123"], (val: number) => val)

  assertEquals(v, 123);
})