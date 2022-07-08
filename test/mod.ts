import {
  AppFactory,
  Container,
  ContainerHelper,
  createContainerHelper,
  resolveToken,
  TokenResolvable,
} from "../core/mod.ts";

/** Utility for testing Tappin apps */
export interface Tester {
  /** Gets container */
  container: () => Container;
  /** Resolves service */
  resolve: <T>(token: TokenResolvable) => Promise<T>;
  /** Returns helper */
  helper: () => ContainerHelper;
}

/** Creates tester from factory */
export const createTester = (factory: AppFactory): Tester => {
  const container = factory.container;

  const resolve = async <T>(t: TokenResolvable): Promise<T> => {
    return await container().resolve<T>(resolveToken(t));
  };

  const helper = () => createContainerHelper(container());

  return {
    container,
    resolve,
    helper,
  };
};
