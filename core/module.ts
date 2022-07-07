import { Service } from "./service.ts";

/** Context used during initialization of module */
export interface ModuleDsl {
  /** Imports another module into this module */
  import: (m: Module) => ModuleDsl;
  /** Adds a service to this module */
  service: (s: Service) => ModuleDsl;
  /** Compiles this DSL into module */
  build: () => Module;
}

/** Module */
export interface Module {
  /** Modules this module imports */
  imports: Module[];
  /** Services this module has added */
  services: Service[];
  /** Unique token of this module */
  token: symbol;
}

/** Creates a module dsl */
export const createModuleDsl = (module?: Module): ModuleDsl => {
  const m: Module = module ?? { imports: [], services: [], token: Symbol() };

  const build = () => m;

  const $import = (mod: Module) => {
    m.imports.push(mod);
    return createModuleDsl(m);
  };

  const service = (s: Service) => {
    m.services.push(s);
    return createModuleDsl(m);
  };

  return {
    build,
    import: $import,
    service,
  };
};

/** Creates a module */
export const createModule = (
  f: (dsl: ModuleDsl) => ModuleDsl = (d) => d,
): Module => f(createModuleDsl()).build();
