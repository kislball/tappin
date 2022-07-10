import { Scope } from "./container/provider.ts";

/** A simpl, unique token */
export type Token = symbol | string;

/** Resolvable token */
export type TokenResolvable = Token | { token: Token };

export const resolveToken = (t: TokenResolvable): string | symbol =>
  (t as { token: string | symbol }).token ?? t;

/** Service */
export interface Service<T = any> {
  /** Dependencies of this service */
  inject: Array<symbol | string | { token: symbol | string }>;
  /** Service's scope */
  scope: Scope;
  /** Function used to provide this service */
  provider: (...deps: any[]) => Promise<T> | T;
  /** Service token */
  token: string | symbol;
  /** Metadata */
  metadata: Map<string | symbol, unknown>;
}

/** DSL used to create service */
export interface ServiceDsl<T = any> {
  /** Adds dependencies to this DSL */
  inject: (
    ...tokens: Array<symbol | string | { token: symbol | string }>
  ) => ServiceDsl<T>;
  /** Sets scope */
  scope: (scope: Scope) => ServiceDsl<T>;
  /** Sets injection token */
  token: (token: string | symbol) => ServiceDsl<T>;
  /** Sets provider function */
  provide: (f: (...deps: any[]) => Promise<T> | T) => ServiceDsl<T>;
  /** Compiles service */
  build: () => Service<T>;
  /** Sets metadata */
  set: <V>(key: string | symbol, value: V) => ServiceDsl<T>;
  /** Applies DSL */
  apply: (f: (dsl: ServiceDsl<T>) => ServiceDsl<T>) => ServiceDsl<T>;
}

/** Creates service dsl */
export const createServiceDsl = <T = any>(s?: Service<T>): ServiceDsl<T> => {
  const service: Service<T> = s ?? {
    inject: [],
    token: token(),
    provider: () => undefined as any,
    scope: Scope.Singleton,
    metadata: new Map(),
  };

  const inject = (
    ...tokens: Array<symbol | string | { token: symbol | string }>
  ): ServiceDsl<T> => {
    service.inject = [...service.inject, ...tokens];
    return createServiceDsl(service);
  };

  const scope = (scope: Scope): ServiceDsl<T> => {
    service.scope = scope;
    return createServiceDsl(service);
  };

  const tokenFunction = (token: symbol | string): ServiceDsl<T> => {
    service.token = token;
    return createServiceDsl(service);
  };

  const provide = (
    provide: (...deps: any[]) => T | Promise<T>,
  ): ServiceDsl<T> => {
    service.provider = provide;
    return createServiceDsl(service);
  };

  const set = <T>(key: string | symbol, value: T) => {
    service.metadata.set(key, value);
    return createServiceDsl(service);
  };

  const apply = (f: (dsl: ServiceDsl<T>) => ServiceDsl<T>) => {
    return f(createServiceDsl(service));
  };

  const build = (): Service<T> => service;

  return {
    inject,
    scope,
    token: tokenFunction,
    provide,
    build,
    set,
    apply,
  };
};

/** Creates raw service template */
export const createRawTemplate = <T>(
  f1: (dsl: ServiceDsl<T>) => ServiceDsl<T> = (d) => d,
) => ((
  f2: (dsl: Omit<ServiceDsl<T>, "token">) => Omit<ServiceDsl<T>, "token"> = (
    d,
  ) => d,
) => f2(f1(createServiceDsl())).build());

export const createTemplate = <T>(
  f1: (dsl: ServiceDsl<T>) => ServiceDsl<T> = (d) => d,
) => {
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  const raw: ReturnType<typeof createRawTemplate> & { token: Token } =
    createRawTemplate(f1);

  raw.token = f1(createServiceDsl()).build().token;

  return raw;
};

/** Creates service */
export const createService = <T>(
  f: (dsl: ServiceDsl<T>) => ServiceDsl<T>,
): Service<T> => f(createServiceDsl()).build();

/** Creates a unique token for service */
export const token = (name = "no name") => Symbol(`Service(${name})`);
