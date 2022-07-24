/** A websocket message */
export interface WsMessage<
  E extends Record<string, unknown> = Record<string, any>,
  T extends keyof E = keyof E,
> {
  event: T;
  data: E[T];
}
