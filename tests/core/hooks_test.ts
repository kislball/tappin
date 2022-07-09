import { assertSpyCall, spy } from "mock";
import {
  createFactory,
  createModule,
  createService,
  onDestroy,
  onInit,
onStart,
} from "../../core/mod.ts";
import { assertThrows } from "assert";

Deno.test("calls onInit hook after initialization", async () => {
  const onInitSpy = spy(() => new Promise<void>((resolve) => resolve()));

  const onInitTest = createService((dsl) =>
    dsl.provide(() => onInit(onInitSpy))
  );
  const root = createModule((dsl) => dsl.service(onInitTest));

  const factory = createFactory(root);

  await factory.init();

  assertSpyCall(onInitSpy, 0);
});

Deno.test("calls onStart hook after start", async () => {
  const onStartSpy = spy(() => new Promise<void>((resolve) => resolve()));

  const onStartTest = createService((dsl) =>
    dsl.provide(() => onStart(onStartSpy))
  );
  const root = createModule((dsl) => dsl.service(onStartTest));

  const factory = createFactory(root);

  await factory.start();

  assertSpyCall(onStartSpy, 0);
});

Deno.test("does not call onStart hook after init", async () => {
  const onStartSpy = spy(() => new Promise<void>((resolve) => resolve()));

  const onStartTest = createService((dsl) =>
    dsl.provide(() => onStart(onStartSpy))
  );
  const root = createModule((dsl) => dsl.service(onStartTest));

  const factory = createFactory(root);

  await factory.init();

  assertThrows(() => {
    assertSpyCall(onStartSpy, 0);
  });
});

Deno.test("does not call onDestroy hook after start", async () => {
  const onDestroySpy = spy(() => new Promise<void>((resolve) => resolve()));

  const onDestroyTest = createService((dsl) =>
    dsl.provide(() => onDestroy(onDestroySpy))
  );
  const root = createModule((dsl) => dsl.service(onDestroyTest));

  const factory = createFactory(root);

  await factory.start();

  assertThrows(() => {
    assertSpyCall(onDestroySpy, 0);
  });
});

Deno.test("does call onDestroy hook after close", async () => {
  const onDestroySpy = spy(() => new Promise<void>((resolve) => resolve()));

  const onDestroyTest = createService((dsl) =>
    dsl.provide(() => onDestroy(onDestroySpy))
  );
  const root = createModule((dsl) => dsl.service(onDestroyTest));

  const factory = createFactory(root);

  await factory.start();
  await factory.close();

  assertSpyCall(onDestroySpy, 0);
});