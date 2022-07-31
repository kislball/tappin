---
title: Philosophy
description: This article describes philosophy behind Tappin.
---

## The scope of core package

As you may already know, Tappin is split into packages(see
[basics](/docs/introduction/basics) for details).

Usually, packages would export a root module. However, there is a special
package in Tappin - the core package.

Core package contains a `createFactory` function. It is responsible for
attaching lifecycle hooks, initializing modules and services. That's it. The
core package should do nothing more. That's the reason, why Tappin is so fast -
it tries to keep abstractions minimal and yet easy-to-use.

## A factory of factories of an abstract factory, yahoo!

Quite a long name for a section, huh?

In further chapters, you will find out that Tappin services themselves do not
handle HTTP/WS requests. Instead, they return a handler which is registered only
once. This allows to remove _any_ Tappin middlewares from the chain and minimize
overhead.

## Conclusion

With this article, we've finally finished our Introduction section! In further
chapters, we will discuss modules in more detail(HTTP, configuration, etc.).
