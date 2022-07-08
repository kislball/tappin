import { AppFactory, Container, ContainerHelper, createContainerHelper, resolveToken, TokenResolvable } from "../core/mod.ts";

export interface Tester {
  container: () => Container;
  resolve: <T>(token: TokenResolvable) => Promise<T>;
  helper: () => ContainerHelper;
}

export const createTester = (factory: AppFactory): Tester => {
  const container = factory.container
  
  const resolve = async <T>(t: TokenResolvable): Promise<T> => {
    return await container().resolve<T>(resolveToken(t))
  }

  const helper = () => createContainerHelper(container())

  return {
    container,
    resolve,
    helper,
  }
}