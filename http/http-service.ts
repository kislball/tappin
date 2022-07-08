import { createService, token } from "../core/mod.ts";
import {
  HttpOptionsService,
  httpOptionsToken,
} from "./http-options-service.ts";
import { serve } from "../deps.ts";

/** HTTP server service */
export interface HttpService {
  /** Starts this server */
  start: () => Promise<void>;
}

/** HTTP server service */
export const httpService = createService<HttpService>((dsl) =>
  dsl
    .token(token("HttpService"))
    .inject(httpOptionsToken)
    .provide((options: HttpOptionsService) => {
      const start = () => {
        return new Promise<void>((resolve) => {
          serve(handler, {
            port: options.port,
            hostname: options.hostname,
            onListen: () => {
              resolve();
            },
          });
        });
      };

      const handler = (): Response => {
        return new Response("Hello, world!");
      };

      return {
        start,
      };
    })
);
