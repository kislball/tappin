---
title: Middlewares
description: Introduction to standard Tappin middlewares.
---

## Request ID middleware

Tappin includes middleware which adds request ID to every request it receives.

It uses `crypto.randomUUID()` for getting request ID.

### Example

```ts
export const someController = createModule(dsl => 
  dsl
    .apply(controller('', ridMiddleware)) // imported from http package
)
```