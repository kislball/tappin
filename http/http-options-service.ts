import { createTemplate, token } from "../core/mod.ts";

/** HTTP options */
export interface HttpOptionsService {
  /** Hostname */
  hostname?: string;
  /** Port */
  port?: number;
}

/** Injection token for http service */
export const httpOptionsToken = token("HttpOptions");

/** HTTP options template */
export const httpOptionsServiceTemplate = createTemplate<HttpOptionsService>((
  dsl,
) =>
  dsl
    .token(httpOptionsToken)
);
