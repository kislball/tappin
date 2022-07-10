import {
  createService,
  OnDestroy,
  onDestroy,
  onStart,
  token,
} from "../core/mod.ts";
import {
  HTTPOptionsService,
  httpOptionsToken,
} from "./http-options-service.ts";
import { fast, log } from "../deps.ts";
import {
  HTTPReflectService,
  httpReflectService,
} from "./http-reflect/http-reflect-service.ts";

/** HTTP server service */
export interface HTTPService extends OnDestroy {
  /** Starts this server */
  start: () => Promise<void>;
}

export const httpServiceToken = token("HTTPService");

/** HTTP server service */
export const httpService = createService<HTTPService>((dsl) =>
  dsl
    .token(httpServiceToken)
    .inject(httpOptionsToken, httpReflectService)
    .provide((options: HTTPOptionsService, reflect: HTTPReflectService) => {
      const logger = log.getLogger("tappin");
      const abort = new AbortController();

      const app = fast.default();

      const start = () =>
        new Promise<void>((resolve) => {
          app.serve({
            hostname: options.hostname,
            port: options.port,
            onListen: () => {
              resolve();
              logger.info({
                message: "Started HTTP server",
                port: options.port,
                hostname: options.hostname,
              });
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
          const routes = await reflect.getRoutes();

          for (const route of routes) {
            if (route[0].method === "DELETE") {
              app.delete(route[0].path, ...route[1]);
            } else if (route[0].method === "POST") {
              app.post(route[0].path, ...route[1]);
            } else if (route[0].method === "PUT") {
              app.put(route[0].path, ...route[1]);
            } else if (route[0].method === "GET") {
              app.get(route[0].path, ...route[1]);
            } else if (route[0].method === "PATCH") {
              app.patch(route[0].path, ...route[1]);
            }
            logger.info({
              message: "Registered route",
              path: route[0].path,
              method: route[0].method,
            });
          }

          await start();
        }),
      };
    })
);
