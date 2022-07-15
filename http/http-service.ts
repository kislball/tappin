import {
  createService,
  OnDestroy,
  onDestroy,
  onStart,
  token,
} from "../core/mod.ts";
import {
  defaultErrorHandler,
  HTTPOptionsService,
  httpOptionsServiceTemplate,
} from "./http-options-service.ts";
import { log } from "../deps.ts";
import {
  HTTPReflectService,
  httpReflectService,
} from "./http-reflect/http-reflect-service.ts";
import { http } from "../deps.ts";
import { Context } from "./http-context.ts";
import { combine } from "./http-middleware.ts";

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
    .inject(httpOptionsServiceTemplate, httpReflectService)
    .provide((options: HTTPOptionsService, reflect: HTTPReflectService) => {
      const logger = log.getLogger("tappin");
      const abort = new AbortController();

      const start = async () => {
        const globalMiddlewares = await reflect.getGlobalMiddlewares();
        const getPathname = (path: string) =>
          `/${path}`.replace(/\/{2,}/, "/").replace(
            /\/$/,
            "",
          );
        const routes = (await reflect.getRoutes()).map(
          (e) =>
            [{
              method: e[0].method,
              urlPattern: new URLPattern({
                pathname: getPathname(e[0].path).length === 0
                  ? "/"
                  : getPathname(e[0].path),
              }),
            }, e[1]] as const,
        );
        const routeCache = new Map<
          string,
          [
            (ctx: Context) => Promise<Response>,
            Record<string, string> | undefined,
          ]
        >();
        const urlObjCache = new Map<string, URL>();

        http.serve(async (req) => {
          const id = req.method + req.url;
          const context: Partial<Context> = {
            metadata: {},
            req,
            url: urlObjCache.get(id),
          };

          if (context.url === undefined) {
            const url = new URL(req.url);
            urlObjCache.set(id, url);
            context.url = url;
          }

          const cached = routeCache.get(id);
          if (cached !== undefined) {
            return cached[0](
              { ...context, params: cached[1] ?? {} } as Context,
            );
          }

          for (const route of routes) {
            const match = route[0].urlPattern.test(req.url);

            if (
              (route[0].method === req.method || route[0].method === "ALL") &&
              match
            ) {
              const a = combine(...[...globalMiddlewares, ...route[1]]);

              if (route[0].urlPattern.pathname.includes(":")) {
                const { pathname: { groups } } = route[0].urlPattern.exec(
                  req.url,
                )!;
                routeCache.set(id, [a, groups]);
                return a(
                  { ...context, params: groups } as Context,
                );
              } else {
                routeCache.set(id, [a, undefined]);
                return a(
                  { ...context, params: {} } as Context,
                );
              }
            }
          }

          return await options.defaultRoute?.(req) ??
            new Response(undefined, { status: 404 });
        }, {
          signal: abort.signal,
          hostname: options.hostname,
          port: options.port,
          onListen: ({ hostname, port }) => {
            logger.info({ message: "Started HTTP server", hostname, port });
          },
          onError: options.onError ?? defaultErrorHandler,
        });
      };

      return {
        start,
        ...onDestroy(() => {
          abort.abort();
          logger.info({ message: "HTTP server aborted" });
        }),
        ...onStart(async () => {
          await start();
        }),
      };
    })
);
