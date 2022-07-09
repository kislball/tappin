# Tappin

<img src="./media/minilogo.png" align="right" />
🦖 Powerful application framework for Deno.

### Features

- Easy to use - Tappin does not include any complex OOP or SOLID principles.
  Tappin fully relies on functions.
- Dependency Injection - DI is a powerful paradigm. Most powerful frameworks use
  DI as their core principle.
- Extensible - Only Tappin's core is non-replacable, everything else can be
  easily replaced, thanks to Tappin's modularity principle.

### Getting started

First, you will have to install Deno. We highly recommend you use the latest version available.

Create a directory for your project. Cd into that directory and initialize the project with the following command:

```sh
$ deno run -r -A https://tappin.deno.dev/ new
```

Replace new with help to get help on more commands.

Start project in development mode:

```sh
$ deno task start dinosaurs
```

`dinosaurs` is the name of the application to start. Tappin supports multiple applications out of the box.

note: you can also use TAPPIN_APP environment variable to start application.

### Contributing

Checkout [CONTRIBUTING.md](./CONTRIBUTING.md) file for details.

### License

Tappin is licensed under MIT license. Read more in [LICENSE](./LICENSE) file.
