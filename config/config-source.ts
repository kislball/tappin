import { createTemplate, ServiceDsl } from "../core/mod.ts";

/** Simple configuration source */
export interface ConfigSource {
  /** Gets a key */
  get<T>(key: string): Promise<T | null> | T | null;
}

/** Marks a config source */
export const configSourceMark = Symbol("ConfigSource");

/** Adds metadata to service */
export const configSource = () =>
  (dsl: ServiceDsl<ConfigSource>) => dsl.set(configSourceMark, true);

/** Creates a configuration source */
export const createConfigSource = createTemplate<ConfigSource>((dsl) =>
  dsl.apply(configSource())
);

/** Gets config from env source */
export const envConfigSource = createConfigSource((dsl) =>
  dsl
    .provide(() => ({
      get: <T>(key: string): T | null =>
        Deno.env.get(key) as unknown as T ?? null,
    }))
);