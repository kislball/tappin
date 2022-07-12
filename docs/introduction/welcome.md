---
title: Welcome
description: A friendly introduction to Tappin
---

## What is Tappin?

Tappin is a modern and powerful application framework for building fast and
maintainable applications using [Deno](https://deno.land/). It uses
[classless OOP](https://medium.com/front-end-weekly/classless-oop-in-javascript-ebf6631f22b7)
in combination with
[dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) to
produce maintainable and fast code.

Here is a quick example of Tappin in action:

```ts
import {
  createFactory,
  createModule,
  createService,
} from "https://deno.land/x/tappin/core/mod.ts";
import {
  controller,
  createGet,
  httpModule,
  httpStaticOptions,
} from "https://deno.land/x/tappin/http/mod.ts";
import { reflectModule } from "https://deno.land/x/tappin/reflect/mod.ts";

const getRandomFactRoute = createGet("facts", (dsl) =>
  dsl
    .provide(() => [
      () => {
        const facts = [
          "Dinosaurs were around millions of years ago!",
          "Dinosaurs were around in the Mesozoic Era or \“The Age of Dinosaurs.\”",
          "There were more than 700 species.",
          "Dinosaurs lived on all continents.",
          "The word dinosaur came from an English palaeontologist.",
          "One of the biggest dinosaurs was the Argentinosaurus.",
        ];

        return facts[Math.random() * (facts.length - 1)];
      },
    ]));

const dinosaursController = createModule((dsl) =>
  dsl
    .apply(controller("dinosaurs"))
    .service(getRandomFactRoute)
);

const appModule = createModule((dsl) =>
  dsl
    .name("AppModule")
    .service(httpStaticOptions({ port: 3000 }))
    .import(reflectModule)
    .import(dinosaursController)
    .import(httpModule)
);

const factory = createFactory(appModule);

await factory.start();
```

At first, this may look overwhelming and barely readable. However, as time
passes, you will get used to it and get most from Tappin.

## Why Tappin?

There are a lot of HTTP frameworks for Deno - oak, Denotrain and others. A lot
of people are using them, some are fast, some are customizable. However, none
have ever solved the main issue - architecture.

Time has shown, that dependency injection is the solution - many enterprise
frameworks like ASP.NET, NestJS, Spring had shown that it solves a lot of
problems. Tappin follows "the DI" way but a bit differently.

In its core, Tappin is an advanced dependency container. It intializes a
**module**. Module is a set of **services** which are identified by **tokens**.
A module can **import** other modules. Services can **inject** other services
and access what they **provide** using tokens. Behind a token, there can be any
implementation. This implements dependency inversion principle.

In short, your application turns into a Lego set.

## Getting started

The example above doesn't facilitate all power of Tappin.

Tappin comes with a simple yet powerful tool - Tappin CLI.

Create a new directory, `cd` in it and run this command:

```bash
$ deno run -A -r https://tappin.deno.dev new
```

And run this command to start `dinosaurs` application:

```bash
$ deno task start dinosaurs
```

## Learn more

Go through the documentation. It will teach you all the basics and intermediates
of Tappin.
