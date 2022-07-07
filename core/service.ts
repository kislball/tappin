import { Scope } from "./container/provider.ts";

/** Service */
export interface Service<T = any> {
  /** Dependencies of this service */
  inject: Array<symbol | string>;
  /** Service's scope */
  scope: Scope;
  /** Function used to provide this service */
  provider: (...deps: any[]) => Promise<T> | T;
  /** Service token */
  token: string | symbol;
}

/** DSL used to create service */
export interface ServiceDsl<T = any> {
  /** Adds dependencies to this DSL */
  inject: (...tokens: Array<symbol | string>) => ServiceDsl<T>;
  /** Sets scope */
  scope: (scope: Scope) => ServiceDsl<T>;
  /** Sets injection token */
  token: (token: string | symbol) => ServiceDsl<T>;
  /** Sets provider function */
  provide: (f: (...deps: any[]) => Promise<T> | T) => ServiceDsl<T>;
  /** Compiles service */
  build: () => Service<T>;
}

/** Creates service dsl */
export const createServiceDsl = <T = any>(s?: Service<T>): ServiceDsl<T> => {
  const service: Service<T> = s ?? {
    inject: [],
    token: token(),
    provider: () => undefined as any,
    scope: Scope.Singleton,
  };

  const inject = (...tokens: Array<symbol | string>): ServiceDsl<T> => {
    service.inject = [...service.inject, ...tokens];
    return createServiceDsl(service);
  };

  const scope = (scope: Scope): ServiceDsl<T> => {
    service.scope = scope;
    return createServiceDsl(service);
  };

  const tokenFunction = (token: string | symbol): ServiceDsl<T> => {
    service.token = token;
    return createServiceDsl(service);
  };

  const provide = (
    provide: (...deps: any[]) => T | Promise<T>,
  ): ServiceDsl<T> => {
    service.provider = provide;
    return createServiceDsl(service);
  };

  const build = (): Service<T> => service;

  return {
    inject,
    scope,
    token: tokenFunction,
    provide,
    build,
  };
};

/** Creates service template */
export const creatServiceTemplate = <T>(
  f1: (dsl: ServiceDsl<T>) => ServiceDsl<T> = (d) => d,
) =>
  (f2: (dsl: ServiceDsl<T>) => ServiceDsl<T> = (d) => d) =>
    f2(f1(createServiceDsl()));

/** Creates service */
export const createService = <T>(
  f: (dsl: ServiceDsl<T>) => ServiceDsl<T>,
): Service<T> => f(createServiceDsl()).build();

/** Creates a unique token for service */
export const token = (name = "no name") => Symbol(`service(${name})`);
