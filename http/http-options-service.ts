import { createTemplate, token } from "../core/mod.ts";

/** HTTP options */
export interface HTTPOptionsService {
  /** Hostname */
  hostname?: string;
  /** Port */
  port?: number;
  /** Error handler */
  onError?: (error: unknown) => Response | Promise<Response>;
  /** Default route */
  defaultRoute?: (req: Request) => Response | Promise<Response>;
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
