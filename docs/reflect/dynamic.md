---
title: Dynamic loading
description: Dynamically load your services and modules.
---

There are some rare use-cases when you would need to dynamically load a new
service. This is done using `dynamicService` with `DynamicService` as type
definitions.

Dynamic service has two functions:

| Name   | Purpose                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------- |
| `get`  | Dynamically injects a service. Accepts a raw token or a service object.                                   |
| `load` | Dynamically loads a module. It is out of context of RootModule and is **not** discoverable by reflection. |

## Example: dynamically inject discovered service(extends example in overview)

```ts
const discoverableKey = Symbol("discoverable");

const discoverableService = createService((dsl) =>
  dsl.set(discoverableKey, true).provide(() => 5 * 5)
);

const discoverer = createService((dsl) =>
  dsl
    .inject(reflectService, dynamicService)
    .provide(async (reflect: ReflectService, dynamic: DynamicService) => {
      const discoverable = reflect.getServices((service) =>
        service.metadata.get(discoverableKey) === true
      );

      const service = await dynamic.get<number>(discoverable);

      return {
        discoverable,
      };
    })
);
```
