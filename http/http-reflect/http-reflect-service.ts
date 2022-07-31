import {
  controllerMiddlewaresKey,
  controllerPathKey,
  globalMiddlewareKey,
  RouteHandler,
  RouteMetadata,
  routeMetadataToken,
} from "./http-reflect-templates.ts";
import { createService, token, TokenResolvable } from "../../core/mod.ts";
import {
  DynamicService,
  dynamicService,
  ReflectService,
  reflectService,
} from "../../reflect/mod.ts";
import { Middleware } from "../http-middleware.ts";

/** Service responsible for loading all controllers/services */
export interface HTTPReflectService {
  /** Gets all routes */
  getRoutes(): Promise<[RouteMetadata, Middleware[]][]>;
  /** Gets all global middlewares */
  getGlobalMiddlewares(): Promise<Middleware[]>;
}

export const httpReflectToken = token("HTTPReflectService");

/** Implements HTTPReflectService */
export const httpReflectService = createService<HTTPReflectService>((dsl) =>
  dsl
    .token(httpReflectToken)
    .inject(reflectService, dynamicService)
    .provide((reflect: ReflectService, dynamic: DynamicService) => {
      const getGlobalMiddlewares = async () => {
        const middlewares: Middleware[] = [];
        const middlewareServices = await reflect.getServices((ser) =>
          ser.metadata.get(globalMiddlewareKey) === true
        );

        for (const service of middlewareServices) {
          middlewares.push(await dynamic.get(service));
        }

        return middlewares;
      };

      const getRoutes = async () => {
        const result: [RouteMetadata, Middleware[]][] = [];
        const controllers = reflect.getModules((mod) =>
          mod.metadata.has(controllerPathKey)
        );

        for (const controller of controllers) {
          const controllerMetadata = controller.metadata.get(
            controllerPathKey,
          )! as string;

          const controllerMiddlewaresMetadata =
            (controller.metadata.get(controllerMiddlewaresKey) ??
              []) as TokenResolvable[];

          for (const service of controller.services) {
            const controllerMiddlewares: Middleware[] = [];

            for (const token of controllerMiddlewaresMetadata) {
              controllerMiddlewares.push(
                await dynamic.get<Middleware>(token),
              );
            }

            if (service.metadata.has(routeMetadataToken)) {
              const loaded = await dynamic.get<RouteHandler>(service);
              const metadata = service.metadata.get(
                routeMetadataToken,
              )! as RouteMetadata;

              result.push([{
                method: metadata.method,
                path: `${controllerMetadata}/${metadata.path}`,
              }, [...controllerMiddlewares, ...loaded]]);
            }
          }
        }

        return result;
      };

      return {
        getRoutes,
        getGlobalMiddlewares,
      };
    })
);
