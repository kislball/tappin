import { Container } from "./container/container.ts";
import { createServiceTemplate, token } from "./service.ts";

export const dependencyContainerToken = token("DependencyContainer");

export const containerServiceTemplate = createServiceTemplate<Container>(
  (dsl) => dsl.token(dependencyContainerToken),
);
