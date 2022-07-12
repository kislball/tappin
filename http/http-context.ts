export interface Context<T extends Record<string, unknown> = Record<string, unknown>> {
  req: Request;
  url: URL;
  metadata: T;
  params: Record<string, string>;
}
