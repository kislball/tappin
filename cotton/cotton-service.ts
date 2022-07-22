import { Adapter } from "https://deno.land/x/cotton@v0.7.2/src/adapters/adapter.ts";
import { createService, token } from "../core/service.ts";
import { cotton } from "../deps.ts";
import {
  CottonOptionsService,
  cottonOptionsServiceTemplate,
} from "./cotton-options.ts";

/** Cotton service */
export type CottonService = Adapter;

export const cottonServiceToken = token("CottonService");

export const cottonService = createService((dsl) =>
  dsl
    .token(cottonServiceToken)
    .inject(cottonOptionsServiceTemplate)
    .provide((options: CottonOptionsService) => {
      if (typeof options === "string") {
        return cotton.connect(options);
      } else {
        return cotton.connect(options);
      }
    })
);
