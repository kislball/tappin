export interface Context<
  T = Record<string, unknown>,
> {
  req: Request;
  url: URL;
  metadata: T;
  params: Record<string, string>;
}
