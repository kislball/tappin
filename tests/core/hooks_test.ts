import {
  createFactory,
  createModule,
  createService,
  onDestroy,
  onInit,
  onStart,
} from "../../core/mod.ts";
import { assert, mock } from "../deps.ts";

Deno.test("calls onInit hook after initialization", async () => {
  const onInitSpy = mock.spy(() => new Promise<void>((resolve) => resolve()));

  const onInitTest = createService((dsl) =>
    dsl.provide(() => onInit(onInitSpy))
  );
  const root = createModule((dsl) => dsl.service(onInitTest));

  const factory = createFactory(root);

  await factory.init();

  mock.assertSpyCall(onInitSpy, 0);
});

Deno.test({
  name: "calls onStart hook after start",
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  const onStartSpy = mock.spy(() => new Promise<void>((resolve) => resolve()));

  const onStartTest = createService((dsl) =>
    dsl.provide(() => onStart(onStartSpy))
  );
  const root = createModule((dsl) => dsl.service(onStartTest));

  const factory = createFactory(root);

  await factory.start();
  await factory.close();

  mock.assertSpyCall(onStartSpy, 0);
});

Deno.test("does not call onStart hook after init", async () => {
  const onStartSpy = mock.spy(() => new Promise<void>((resolve) => resolve()));

  const onStartTest = createService((dsl) =>
    dsl.provide(() => onStart(onStartSpy))
  );
  const root = createModule((dsl) => dsl.service(onStartTest));

  const factory = createFactory(root);

  await factory.init();
  await factory.close();

  assert.assertThrows(() => {
    mock.assertSpyCall(onStartSpy, 0);
  });
});

Deno.test("does not call onDestroy hook after start", async () => {
  const onDestroySpy = mock.spy(() =>
    new Promise<void>((resolve) => resolve())
  );

  const onDestroyTest = createService((dsl) =>
    dsl.provide(() => onDestroy(onDestroySpy))
  );
  const root = createModule((dsl) => dsl.service(onDestroyTest));

  const factory = createFactory(root);

  await factory.start();

  assert.assertThrows(() => {
    mock.assertSpyCall(onDestroySpy, 0);
  });
});

Deno.test("does call onDestroy hook after close", async () => {
  const onDestroySpy = mock.spy(() =>
    new Promise<void>((resolve) => resolve())
  );

  const onDestroyTest = createService((dsl) =>
    dsl.provide(() => onDestroy(onDestroySpy))
  );
  const root = createModule((dsl) => dsl.service(onDestroyTest));

  const factory = createFactory(root);

  await factory.start();
  await factory.close();

  mock.assertSpyCall(onDestroySpy, 0);
});
