import { Container } from "./container/container.ts";
import { createTemplate, token } from "./service.ts";

export const dependencyContainerToken = token("DependencyContainer");

export const containerServiceTemplate = createTemplate<Container>(
  (dsl) => dsl.token(dependencyContainerToken),
);
