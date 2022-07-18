---
title: HTTP overview
description: Overview of Tappin's HTTP functionality
---

## Concepts

### Note

All methods in this section are imported from the HTTP package.

### Middlewares

Tappin is based on a well-known concept - middlewares.

If you happen to not know it, middlewares are functions, which accept two
parameters - context and next function. A next function calls the next
middleware in the chain and returns what the next middleware has returned.
Context contains data about the request itself. Middlewares can return anything,
in the end, non-responses are wrapped into a response.

As per usual, a middleware is a service in Tappin. It allows them to inject
dependencies and be injected in route handlers.

#### Levels of middlewares

| Level      | Description                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Global     | Those middlewares are in front of all middlewares. They are always executed.                         |
| Controller | Those middlewares are executed after global and before all route middlewares in the same controller. |
| Route      | Those middlewares are only executed for specific route                                               |

```ts
// A global middleware. Register it as a service anywhere and it will be added automatically.
const globalMiddleware = createGlobalMiddleware(() =>
  (ctx, next) => {
    console.log(`Request! ${ctx.req.method} ${ctx.req.url}`);
    return next(); // note: you should ALWAYS returns something. usually, you would return a result of a next middleware or an
  }
);

const localMiddleware = createMiddleware(() =>
  (ctx, next) => {
    console.log("Oh! A request!");
    return next();
  }
);

// basically, the upper example is the same as createService<Middleware>(...).
// see Controllers and Routes for details of binding localMiddleware to controller/route
```

### Controllers

A controller is a wrapper for multiple routes. Controller usually prefixes its
routes with a common prefix and adds controller-level middleware.

Internally, a controller is a module.

```ts
const dinosaursController = createModule((dsl) =>
  // createModule is imported from core
  dsl
    .apply(controller("", localMiddleware)) // adds a controller to / and binds a localMiddleware to all routes inside this controller
);

// you can now import dinosaursController as a module in any module.
// it will be automatically detected by http server
```

### Routes

Route is a final processor of a request. It is an array of middlewares, every of
which is executed, if route matches request's URL and method.

Routes always belong to a controller.

```ts
const dinosaursController = createModule((dsl) =>
  dsl
    .service(getTotalRoute)
    .apply(controller())
);

const getTotalSpeciesRoute = createGet("totalSpecies", (dsl) =>
  // you can also have create(Put,Post,Delete,Patch,Head,Options,All)
  dsl
    .inject(localMiddleware)
    .provide((local: Middleware) => [
      local,
      () => 700,
    ]));
```

## What's next?

By default, Tappin does not start a HTTP server.

You should add one on your own. Thankfully, Tappin has an insanely fast HTTP
server out-of-the-box.
