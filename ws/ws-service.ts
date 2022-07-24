import { createService, token } from "../core/mod.ts";
import { Middleware } from "../http/mod.ts";
import { errors } from "../deps.ts";
import { compose, WsContext, WsMiddleware } from "./ws-middleware.ts";
import { WsMessage } from "./ws-message.ts";

/** Websocket service. Exports route for upgrading request */
export interface WsService {
  /** HTTP handler which will upgrade connection to websocket */
  handler: Middleware[];
  /** List of client contexts */
  clients: Map<string, WsContext>;
  /** Emits event globally */
  emit<
    E extends Record<string, unknown> = Record<string, any>,
    T extends keyof E = keyof E,
  >(
    eventName: T,
    data: E[T],
  ): void;
}

export const wsServiceToken = token("WsService");

/** Websocket service */
export const wsService = createService<WsService>((dsl) =>
  dsl
    .token(wsServiceToken)
    .provide(() => {
      const clients = new Map<string, WsContext>();
      const handlers = new Map<string, WsMiddleware[]>();

      const emit: <
        E extends Record<string, unknown> = Record<string, any>,
        T extends keyof E = keyof E,
      >(
        eventName: T,
        data: E[T],
      ) => void = (event, data) => {
        for (const client of clients.values()) {
          client.socket.send(JSON.stringify({ event, data }));
        }
      };

      const handleEvent = (msg: MessageEvent<WsMessage>, ctx: WsContext) => {
        const handler = handlers.get(msg.data.event);
        if (handler === undefined) {
          return;
        }

        const composed = compose(...handler);
        composed(ctx);
      };

      const bindSocket = (ctx: WsContext) => {
        ctx.socket.addEventListener("message", (msg) => {
          handleEvent(msg, ctx);
        });
      };

      const handler: Middleware[] = [
        (ctx) => {
          if (ctx.req.headers.get("upgrade") !== "websocket") {
            throw new errors.errors.UpgradeRequired();
          }
          const { response } = Deno.upgradeWebSocket(ctx.req);

          bindSocket(undefined as any);

          return response;
        },
      ];

      return {
        handler,
        clients,
        emit,
      };
    })
);
