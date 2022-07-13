---
title: Factory
description: This article will introduce you to the "chairman" of Tappin - createFactory
---

## What is a factory?

A factory is an initializer for your application.

Lets go back to our favorite analogy - Lego set!

If you are building a Lego set, congratulations, you are a factory! Tappin's
factory does exactly the same - it collects all modules and services, connectes
them and starts it.

## Using factory

Factory is created using `createFactory` function. It is located in `core`
package.

```ts
const appModule = createModule(...);

const factory = createFactory(appModule); // factory accepts ONE root module
await factory.start(); // starts entire application and calls onStart hooks
```

Factory also exports some functions you may find useful.
