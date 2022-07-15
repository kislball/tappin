---
title: Setting-up server
description: This section describes how to setup HTTP server
---

## HTTP module

As said many times before, Tappin itself is pretty minimal. Due to that
constraint, HTTP server is a seperate module. It is exported under `httpModule`
from http package.

## Starting a server

All you have to do is to import httpModule and add a service, which uses
httpOptionsServiceTemplate template.

For providing options, HTTP service exports two helpers:
httpStaticOptions(accepts raw HTTP object, useful when you have static
configuration) and httpDynamicOptions(accepts a function, which accepts a
DynamicService(see [reflection](/docs/reflect/overview) for details) and returns
a config). You can also create your own service, which uses
httpOptionsServiceTemplate.

```ts
const appModule = createModule((dsl) =>
  dsl
    .service(httpStaticOptions({ port: 8080 }))
    .import(httpModule)
);
```

### Why is it so fast?

In short - Tappin's HTTP server implementation aggresively caches:

- URL objects
- Middleware chains for specific pathnames

After each request, Tappin's HTTP server caches URL object for the pathname and
middleware chain for specific path.
