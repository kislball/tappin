import { assert } from "../deps.ts";
import { createTemplate } from "../../core/service.ts";

Deno.test("tokens are different", () => {
  const a = createTemplate();
  const b = a();
  const c = a();

  assert.assertNotEquals(b.token, c.token);
});

Deno.test("tokens are not different", () => {
  const token = Symbol();
  const a = createTemplate((dsl) => dsl.token(token));
  const b = a();
  const c = a();

  assert.assertEquals(b.token, c.token);
});
