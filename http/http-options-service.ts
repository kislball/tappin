import { createTemplate, token } from "../core/mod.ts";

/** HTTP options */
export interface HTTPOptionsService {
  /** Hostname */
  hostname?: string;
  /** Port */
  port?: number;
}

/** Injection token for http service */
export const httpOptionsToken = token("HTTPOptions");

/** HTTP options template */
export const httpOptionsServiceTemplate = createTemplate<HTTPOptionsService>((
  dsl,
) =>
  dsl
    .token(httpOptionsToken)
);
