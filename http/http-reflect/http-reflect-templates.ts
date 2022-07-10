import { createService, ModuleDsl, ServiceDsl, token } from "../../core/mod.ts";
import { fast } from "../../deps.ts";

/** Token for controller path */
export const controllerPath = Symbol("ControllerPath");

/** Applies controller metadata to module */
export const controller = (path = '') =>
  (dsl: ModuleDsl) => dsl.set(controllerPath, path).name(`Controller(${path.length > 0 ? path : '/'})`);

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
export type RouteHandler = fast.Middleware[];

const createRouteFactory = (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
) =>
  (
    path = '',
    f: (dsl: ServiceDsl<RouteHandler>) => ServiceDsl<RouteHandler>,
  ) =>
    createService<RouteHandler>((dsl) =>
      dsl.token(token(`${method}(${path.length > 0 ? `/${path}` : '/'})`)).apply(f).apply(routeMetadata(method, path))
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
