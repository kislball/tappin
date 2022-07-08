import { createTemplate, token } from "../core/mod.ts";

export interface HttpOptionsService {
  hostname?: string
  port?: number
}

export const httpOptionsToken = token("HttpOptions");

export const httpOptionsServiceTemplate = createTemplate<HttpOptionsService>((dsl) =>
  dsl
    .token(httpOptionsToken)
);
