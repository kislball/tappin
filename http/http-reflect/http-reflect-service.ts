import {
  controllerPath,
  RouteHandler,
  RouteMetadata,
  routeMetadataToken,
} from "./http-reflect-templates.ts";
import { fast } from "../../deps.ts";
import { createService, token } from "../../core/mod.ts";
import {
  LazyService,
  lazyService,
  ReflectService,
  reflectService,
} from "../../reflect/mod.ts";

/** Service responsible for loading all controllers/services */
export interface HTTPReflectService {
  /** Gets all routes */
  getRoutes(): Promise<[RouteMetadata, fast.Middleware[]][]>;
}

export const httpReflectToken = token("HTTPReflectService");

/** Implements HTTPReflectService */
export const httpReflectService = createService<HTTPReflectService>((dsl) =>
  dsl
    .token(httpReflectToken)
    .inject(reflectService, lazyService)
    .provide((reflect: ReflectService, lazy: LazyService) => {
      const getRoutes = async () => {
        const result: [RouteMetadata, fast.Middleware[]][] = [];
        const controllers = reflect.getModules((mod) =>
          mod.metadata.has(controllerPath)
        );

        for (const controller of controllers) {
          const controllerMetadata = controller.metadata.get(
            controllerPath,
          )! as string;
          for (const service of controller.services) {
            if (service.metadata.has(routeMetadataToken)) {
              const loaded = await lazy.get<RouteHandler>(service);
              const metadata = service.metadata.get(
                routeMetadataToken,
              )! as RouteMetadata;

              result.push([{
                method: metadata.method,
                path: `${controllerMetadata}/${metadata.path}`,
              }, loaded]);
            }
          }
        }

        return result;
      };

      return {
        getRoutes,
      };
    })
);
