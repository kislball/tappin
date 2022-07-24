import {
  createService,
  createTemplate,
  ServiceDsl,
  token,
} from "../core/mod.ts";
import { DynamicService, dynamicService } from "../reflect/dynamic-service.ts";
import { ReflectService, reflectService } from "../reflect/reflect-service.ts";
import { WsMiddleware } from "./ws-middleware.ts";

/** Service responsinle for websocket reflection */
export interface WsReflectService {
  getWsEvents(): Promise<Map<string, WsMiddleware[]>>;
}

export const wsReflectToken = token("WsReflectService");

export const wsReflectService = createService<WsReflectService>((dsl) =>
  dsl
    .token(wsReflectToken)
    .inject(reflectService, dynamicService)
    .provide((reflect: ReflectService, dynamic: DynamicService) => {
      const getWsEvents = async () => {
        const map = new Map<string, WsMiddleware[]>();
        const handlers = reflect.getServices((s) =>
          s.metadata.has(wsEventHandlerToken)
        );

        for (const handler of handlers) {
          const eventName = handler.metadata.get(
            wsEventHandlerToken,
          )! as string;
          const resolved = await dynamic.get<WsMiddleware[]>(handler);

          if (map.has(eventName)) {
            map.set(eventName, [...map.get(eventName)!, ...resolved]);
          } else {
            map.set(eventName, resolved);
          }
        }

        return map;
      };

      return {
        getWsEvents,
      };
    })
);

export const wsEventHandlerToken = Symbol("WsEventHandler");

/** Creates ws event handler */
export const createEvent = (
  name: string,
  dslBuilder: (dsl: ServiceDsl) => ServiceDsl,
) =>
  createTemplate<WsMiddleware[]>((dsl) =>
    dsl
      .token(token(`WsEvent(${name})`))
      .apply(dslBuilder)
      .set(wsEventHandlerToken, name)
  );
