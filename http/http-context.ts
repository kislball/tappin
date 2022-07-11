export interface Context {
  req: Request;
  url: URL;
  metadata: Record<string, unknown>;
  params: Record<string, string>;
}
