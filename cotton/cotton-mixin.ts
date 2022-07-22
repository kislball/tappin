import { DynamicService, dynamicService } from "../reflect/dynamic-service.ts";
import {
  CottonOptionsService,
  cottonOptionsServiceTemplate,
} from "./cotton-options.ts";

/** Creates a service with static Cotton options */
export const cottonStaticOptions = (options: CottonOptionsService) =>
  cottonOptionsServiceTemplate((dsl) => dsl.provide(() => options));

/** Creates a cotton options service with dynamic injected */
export const cottonDynamicOptions = (
  options: (
    dynamic: DynamicService,
  ) => CottonOptionsService | Promise<CottonOptionsService>,
) =>
  cottonOptionsServiceTemplate((dsl) =>
    dsl.inject(dynamicService).provide(options)
  );
