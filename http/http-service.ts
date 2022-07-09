import { createService, token } from "../core/mod.ts";
import {
  HttpOptionsService,
  httpOptionsToken,
} from "./http-options-service.ts";
import fast from "fast";

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
      const app = fast();

      app.use(() => "hello, world!");

      const start = () =>
        new Promise<void>((resolve) => {
          app.serve({
            hostname: options.hostname,
            port: options.port,
            onListen: () => resolve(),
          });
        });

      return {
        start,
      };
    })
);
