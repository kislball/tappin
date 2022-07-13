import {
  isAsyncFactoryProvider,
  isFactoryProvider,
  isValueProvider,
  Provider,
  Scope,
} from "./provider.ts";

/** Dependency injection container */
export interface Container {
  /** Adds a new provider to container */
  register: <T>(provider: Provider<T>) => Promise<void> | void;
  /** Resolves a provider */
  resolve: <T>(token: string | symbol) => Promise<T>;
  /** Cleans up singletons */
  clearSingletons: () => void;
  /** Clean up providers */
  clearProviders: () => void;
  /** Resets container */
  reset: () => void;
  /** Initializes given singletons */
  initialize: (which?: Array<string | symbol>) => Promise<any[]>;
}

/** Creates a default container */
export const createContainer = (
  provs?: Map<string | symbol, Provider<unknown>>,
  singles?: Map<string | symbol, unknown>,
) => {
  const providers = provs ?? new Map<string | symbol, Provider<unknown>>();
  const singletons = singles ?? new Map<string | symbol, unknown>();

  const initialized: Array<string | symbol> = [];

  const initialize = async (which: Array<string | symbol> = []) => {
    const res: any[] = [];
    for (
      const provider of [...providers.values()].filter((e) =>
        which.length == 0 || which.includes(e.token)
      )
    ) {
      if (
        provider.scope === Scope.Singleton &&
        !initialized.includes(provider.token)
      ) {
        res.push(await getSingleton(provider));
      }
    }

    return res;
  };

  const resolveProvider = async <T>(provider: Provider<any>): Promise<T> => {
    initialized.push(provider.token);
    if (isValueProvider(provider)) {
      return provider.useValue as T;
    } else if (isFactoryProvider(provider)) {
      return provider.useFactory(createContainer(providers, singletons)) as T;
    } else if (isAsyncFactoryProvider(provider)) {
      return await provider.useAsyncFactory(
        createContainer(providers, singletons),
      ) as T;
    } else {
      throw new Error("Unknown provider");
    }
  };

  const getSingleton = async <T>(provider: Provider<any>): Promise<T> => {
    const singleton = singletons.get(provider.token);

    if (singleton === undefined) {
      const prov = await resolveProvider<T>(provider);
      singletons.set(provider.token, prov);
      return prov;
    } else {
      return singleton as unknown as T;
    }
  };

  const register = <T>(provider: Provider<T>) => {
    const scope = provider.scope ?? Scope.Singleton;
    if (scope !== Scope.Singleton && isValueProvider(provider)) {
      throw new Error(
        `ValueProvider is only compatible with scope Scope.Singleton`,
      );
    }

    if (providers.has(provider.token)) {
      throw new Error(
        `Provider already registered - ${String(provider.token)}`,
      );
    }

    providers.set(provider.token, provider);
  };

  const resolve = <T>(
    token: string | symbol,
    forceScope?: Scope,
  ): Promise<T> => {
    const provider = providers.get(token);

    if (provider === undefined) {
      if (forceScope !== undefined) {
        throw new Error(
          `Provider with token ${String(token)}(${forceScope}) was not found`,
        );
      } else {
        throw new Error(`Provider with token ${String(token)} was not found`);
      }
    }

    const scope = forceScope ?? provider.scope ?? Scope.Singleton;
    if (scope === Scope.Singleton) {
      return getSingleton<T>(provider);
    } else {
      return resolveProvider<T>(provider);
    }
  };

  const clearSingletons = () => {
    singletons.clear();
  };

  const clearProviders = () => {
    providers.clear();
    clearSingletons();
  };

  const reset = () => {
    clearProviders();
  };

  return {
    clearProviders,
    reset,
    clearSingletons,
    register,
    resolve,
    initialize,
  };
};
