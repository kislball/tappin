import { Container } from "./container.ts";

/** Provider lifetime */
export enum Scope {
  /** Object is created once and always used */
  Singleton = "Singleton",
  /** Object is created each time it is requested */
  Transient = "Transient",
}

/** Base provider */
export interface BaseProvider {
  /** Token by which this provider will be resolved */
  token: symbol | string;
  /** Scope in which this provider will be valid */
  scope?: Scope;
}

/** Creates value by calling a function */
export interface FactoryProvider<T> extends BaseProvider {
  /** Factory */
  useFactory: (container: Container) => T;
}

/** Checks if given value is a FactoryProvider */
export const isFactoryProvider = (t: any): t is FactoryProvider<any> =>
  t.useFactory !== undefined && typeof t.useFactory === "function";

/** Creates value by using existing one */
export interface ValueProvider<T> extends BaseProvider {
  useValue: T;
}

/** Checks if given value is a ValueProvider */
export const isValueProvider = (t: any): t is ValueProvider<any> =>
  t.useValue !== undefined;

/** Creates value by calling an async function */
export interface AsyncFactoryProvider<T> extends BaseProvider {
  useAsyncFactory: (container: Container) => T;
}

/** Check if given value is an async provider */
export const isAsyncFactoryProvider = (
  t: any,
): t is AsyncFactoryProvider<any> =>
  t.useAsyncFactory !== undefined && typeof t.useFactory === "function";

/** Common provider type */
export type Provider<T> =
  | FactoryProvider<T>
  | ValueProvider<T>
  | AsyncFactoryProvider<T>;
