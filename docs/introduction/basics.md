---
title: Basics
description: This article explains a lot of concepts introduced previously.
---

## What are we going to learn?

In previous chapter, you've been introducted to several concepts:

- Module
- Service
- Token

In this chapter, we will go through all of these concepts in more detail.

## Note

All packages in this article are imported from `core`
package(https://deno.land/x/tappin/core/mod.ts).

## Module

A module is a simple wrapper. It encapsulates **how** we register services and
which. It can also import other modules.

In a typical Tappin application, your application has a single root module. It
imports other modules and includes services.

The way you split your services into modules doesn't usually matter.

A classic Tappin module looks something like this:

```ts
const appModule = createModule((dsl) =>
  // appModule in camel case
  dsl
    .name("AppModule") // name of module for easier debugging, PascalCase
    .import(otherModule) // import of otherModule
    .service(someService) // adds someService to container
);
```

## Service

Here it gets more interesting!

A service is a basic unit of a Tappin application. Service are a function, which
returns an object. Other services can inject another service using service
tokens.

If a Tappin application is a Lego set - service would be a brick. Bricks can
connect to each other and form interesting structures.

Tappin service also has a lifecycle. It consists of three stages:

| Name        | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `onInit`    | Runs after all services in the same module have been initialized     |
| `onStart`   | Runs after application has started. Usually, HTTP server starts here |
| `onDestroy` | Called after application is closing/factory.close() has been called  |

A class Tappin service looks something like this:

```ts
interface RandomService {
  getRandom: () => number;
}

const randomServiceToken = token("RandomService"); // also a good practice is too export the token

const randomService = createService<RandomService>((dsl) =>
  // a really good practice is to provide an interface for the service
  dsl
    .token(randomServiceToken)
    .inject(mathService) // inject a mathService. You can pass here a token or a service itself
    .provide((mathService: { floor: (n: number) => number }) => {
      return {
        ...onInit(() => generateSeed()),
        getRandom: () => mathService.floor(Math.random()),
      };
    })
);
```

### Templates

You can use `createTemplate` function to create a template for a service.

Template returns a service factory(similar to createService) with some
additional metadata.

There are two most common usecases:

- In a serivce in a library, which implementation is provided by user of library
- When you have to create a group of services and provide some common metadata

First use case:

```ts
const serviceOptionsToken = token("serviceOptions");

const optionsTemplate = createTemplate<ServiceOptions>((dsl) =>
  dsl.token(serviceOptionsToken) // do NOT put token() here. it will create a new, unique symbol every time this function is called
); // this function creates a template, which will only accept ServiceOptions implementations

// now you can inject optionsTemplate or optionsTemplate.token.

// this way you create an implementation for a service

const myOptions = createOptions((dsl) =>
  dsl.provide(() => ({/* some options */}))
);

// note: you only register myOptions
```

Second usecase uses [reflection](/docs/modules/reflect). Now, you will only get
to know how to apply metadata to a service

```ts
// since this template is more like a mixin and a factory,
// i recommend using createX pattern here
const createCrawler = createTemplate<Crawler>((dsl) =>
  dsl
    .set("isCrawler", true) // not recommended, you should use symbol instead
);

const googleCrawler = createCrawler(/* ... */);
const yandexCrawler = createCrawler(/* ... */);
const bingCrawler = createCrawler(/* ... */);

// now all three have isCrawler set to true
```

## Token

Token can be an any string or a symbol. The latter is prefered.

Tappin provides a built-in function for token generation:

```ts
const myToken = token("My unique token");
```

## Packages

Tappin does not have a single `mod.ts` file. Instead, you will import mod files
of those packages you need to use. A package is a directory in root of Tappin
repository.

## What's next?

All of that knowledge is pretty useless without the core aspect of Tappin -
`createFactory`. Learn more about it in the next section.
