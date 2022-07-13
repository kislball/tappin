import {
  createService,
  createTemplate,
  ModuleDsl,
  Service,
  ServiceDsl,
  token,
  TokenResolvable,
} from "../../core/mod.ts";
import { Middleware } from "../http-middleware.ts";

/** Token for controller path */
export const controllerPathKey = Symbol("ControllerPath");

/** Token for controller middlewares */
export const controllerMiddlewaresKey = Symbol("Controller middlewares");

/** Applies controller metadata to module */
export const controller = (path = "", ...middlewares: TokenResolvable[]) =>
  (dsl: ModuleDsl) =>
    dsl.set(controllerPathKey, path).set(controllerMiddlewaresKey, middlewares)
      .name(
        `Controller(${path.length > 0 ? path : "/"})`,
      );

export interface RouteMetadata {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
}

/** Token for route metadata */
export const routeMetadataToken = Symbol("routeMetadataToken");

/** Applies routeMetadata to service */
export const routeMetadata = (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
) =>
  (dsl: ServiceDsl<RouteHandler>) =>
    dsl.set<RouteMetadata>(routeMetadataToken, { method, path });

/** Self-explanatory */
export type RouteHandler = Middleware[];

const createRouteFactory = (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
) =>
  (
    path = "",
    f: (dsl: ServiceDsl<RouteHandler>) => ServiceDsl<RouteHandler>,
  ) =>
    createService<RouteHandler>((dsl) =>
      dsl.token(token(`${method}(${path.length > 0 ? `/${path}` : "/"})`))
        .apply(f).apply(routeMetadata(method, path))
    );

/** Creates GET handler */
export const createGet = createRouteFactory("GET");
/** Creates POST handler */
export const createPost = createRouteFactory("POST");
/** Creates DELETE handler */
export const createDelete = createRouteFactory("DELETE");
/** Creates PATCH handler */
export const createPatch = createRouteFactory("PATCH");
/** Creates PUT handler */
export const createPut = createRouteFactory("PUT");

/** Creates a middleware */
export const createMiddleware = createTemplate<Middleware>();

export const globalMiddlewareKey = Symbol("GlobalMiddleware");

/** Creates a global middleware */
export const createGlobalMiddleware = createTemplate<Middleware>((dsl) =>
  dsl.set(globalMiddlewareKey, true)
);

/** Marks an existing middleware as global */
export const globalify = (s: Service<Middleware>): Service<Middleware> => ({
  ...s,
  metadata: new Map(s.metadata).set(globalMiddlewareKey, true),
});
