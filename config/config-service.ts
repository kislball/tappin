import { createService, Service, token } from "../core/mod.ts";
import {
  DynamicService,
  dynamicService,
  ReflectService,
  reflectService,
} from "../reflect/mod.ts";
import { ConfigSource, configSourceMark } from "./config-source.ts";

/** Service used to aggregate data from multiple config sources */
export interface ConfigService {
  /** Gets a key */
  get<T>(key: string): Promise<T | null>;
  /** Gets a key, throws an exception if a key doesn't exist in any of config sources */
  require<T>(key: string): Promise<T>;
}

export const configServiceToken = token("ConfigService");

/** ConfigService impl */
export const configService = createService<ConfigService>((dsl) =>
  dsl
    .inject(reflectService, dynamicService)
    .token(configServiceToken)
    .provide(async (reflect: ReflectService, dynamic: DynamicService) => {
      const services: Service<ConfigSource>[] = reflect.getServices((s) =>
        s.metadata.get(configSourceMark) === true
      );
      const sources: ConfigSource[] = [];
      const cache = new Map<string, any>();

      for (const service of services) {
        sources.push(await dynamic.get(service));
      }

      const get = async <T>(key: string): Promise<T | null> => {
        const cached = cache.get(key);
        if (cached !== undefined) {
          return cached;
        }

        for (const source of sources) {
          const r = await source.get<T>(key);
          if (r !== null) {
            cache.set(key, r);
            return r;
          }
        }

        return null;
      };

      const require = async <T>(key: string): Promise<T> => {
        const value = await get<T>(key);
        if (value === null) {
          throw new TypeError(`Config key '${key}' was not found`);
        }

        return value;
      };

      return {
        get,
        require,
      };
    })
);
