---
title: Reflection overview
description: Introduction to Tappin reflection
---

## What is reflection?

Reflection allows a program to inspect itself and/or modify itself. Although
reflection is a concept mostly related to programming languages, however is
still useful in frameworks like Tappin.

For example, HTTP module uses reflection to detect all controllers/routes that
have specific metadata.

## Metadata

Every service or a module can have some metadata. It is set using `set` function
on `ModuleDsl` or `ServiceDsl`.

## Using reflection

Reflection is accessed using `reflectModule` it is imported from `reflect`
package. You inject `reflectService` with typings available in `ReflectService`
interface.

`ReflectService` has three functions:

| Name          | Purpose                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `getServices` | Gets all services. If predicate is specified, it will only get services matching the predicate. |
| `getModules`  | The same as above but for modules.                                                              |
| `getRoot`     | Gets root module of the application.                                                            |

## Example: Getting all services that have `Symbol("discoverable")` set to true

```ts
const discoverableKey = Symbol("discoverable");

const discoverableService = createService((dsl) =>
  dsl.set(discoverableKey, true)
);

const discoverer = createService((dsl) =>
  dsl
    .inject(reflectService)
    .provide((reflect: ReflectService) => {
      const discoverable = reflect.getServices((service) =>
        service.metadata.get(discoverableKey) === true
      );

      return {
        discoverable,
      };
    })
);
```
