import { ConnectionOptions } from "https://deno.land/x/cotton@v0.7.2/src/adapters/adapter.ts";
import { ObjectType } from "https://deno.land/x/cotton@v0.7.2/src/basemodel.ts";
import { createTemplate, token } from "../core/service.ts";
import { cotton } from "../deps.ts";

/** Connection config for Cotton */
export interface ConnectionConfig extends ConnectionOptions {
  type: cotton.DatabaseDialect;
  models?: ObjectType<cotton.BaseModel>[];
}

/** Cotton configuration object */
export type CottonOptionsService = string | ConnectionConfig;

export const cottonOptionsToken = token("CottonConfig");

export const cottonOptionsServiceTemplate = createTemplate<
  CottonOptionsService
>(
  (dsl) =>
    dsl
      .token(cottonOptionsToken),
);
