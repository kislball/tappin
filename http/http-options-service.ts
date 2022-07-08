import { createServiceTemplate, token } from "../core/mod.ts";

export interface HttpOptionsService {
  hostname?: string
  port?: number
}

export const httpOptionsToken = token("HttpOptions");

export const httpOptionsServiceTemplate = createServiceTemplate<HttpOptionsService>((dsl) =>
  dsl
    .token(httpOptionsToken)
);
