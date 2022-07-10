import { createService, onDestroy, OnDestroy, onStart, token } from "../core/mod.ts";
import {
  HttpOptionsService,
  httpOptionsToken,
} from "./http-options-service.ts";
import fast from "fast";
import { getLogger } from "log";

/** HTTP server service */
export interface HttpService extends OnDestroy {
  /** Starts this server */
  start: () => Promise<void>;
}

/** HTTP server service */
export const httpService = createService<HttpService>((dsl) =>
  dsl
    .token(token("HttpService"))
    .inject(httpOptionsToken)
    .provide((options: HttpOptionsService) => {
      const logger = getLogger("tappin");
      const abort = new AbortController();

      const app = fast();

      app.use(() => "hello, world!");

      const start = () =>
        new Promise<void>((resolve) => {
          app.serve({
            hostname: options.hostname,
            port: options.port,
            onListen: () => {
              resolve()
              logger.info({ message: "Started HTTP server!", port: options.port, hostname: options.hostname });
            },
            signal: abort.signal,
          });
        });

      return {
        start,
        ...onDestroy(() => {
          abort.abort();
        }),
        ...onStart(async () => {
          await start()
        }),
      };
    })
);
