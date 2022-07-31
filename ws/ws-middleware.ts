/** Base ws context */
export interface WsContext<
  T extends Record<string, any> = Record<string, any>,
> {
  /** Context metadata */
  metadata: T;
  /** Request that was upgraded */
  initialRequest: Request;
  /** Socket */
  socket: WebSocket;
  /** ID */
  id: string;
  /** Emits event to this context */
  emit: <
    E extends Record<string, unknown> = Record<string, any>,
    T extends keyof E = keyof E,
  >(
    eventName: T,
    data: E[T],
  ) => void;
  /** Adds client to a room */
  join(room: string): Promise<void>;
  /** Removes client from a room */
  leave(room: string): Promise<void>;
}

/** Websocket middleware */
export type WsMiddleware = (ctx: WsContext, next: () => any) => any;

export const compose = (...middlewares: WsMiddleware[]) =>
  (context: WsContext) => {
    const dispatch = (n: number): any => {
      if (n >= middlewares.length) {
        return;
      }

      const middle = middlewares[n];

      return middle(context, () => dispatch(n + 1));
    };

    return dispatch(0);
  };
