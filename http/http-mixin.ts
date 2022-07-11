import { DynamicService, dynamicService } from "../reflect/dynamic-service.ts";
import {
  HTTPOptionsService,
  httpOptionsServiceTemplate,
} from "./http-options-service.ts";

/** Creates a service with static http options */
export const httpStaticOptions = (options: HTTPOptionsService) =>
  httpOptionsServiceTemplate((dsl) => dsl.provide(() => options));

/** Creates a http options service with dynamic injected */
export const httpDynamicOptions = (
  options: (dynamic: DynamicService) => HTTPOptionsService,
) =>
  httpOptionsServiceTemplate((dsl) => dsl.inject(dynamicService).provide(options));
