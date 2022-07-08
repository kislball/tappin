import {
  createService,
  Module,
  rootModuleToken,
  Service,
  token,
} from "../core/mod.ts";

export interface ReflectService {
  getModules(f?: (m: Module) => boolean): Module[];
  getServices(f?: (s: Service) => boolean): Service[];
  getRoot(): Module;
}

export const reflectServiceToken = token("ReflectService");

export const reflectService = createService<ReflectService>((dsl) =>
  dsl.token(reflectServiceToken).inject(rootModuleToken).provide((
    root: Module,
  ) => ({
    getRoot: () => root,
    getModules: (f = () => true) => {
      const result: Module[] = [];

      const go = (m: Module) => {
        if (f(m)) result.push(m);

        for (const sub of m.imports) {
          go(sub);
        }
      };

      go(root);

      return result;
    },
    getServices: (f = () => true, begin = root) => {
      const result: Service[] = [];

      const go = (m: Module) => {
        for (const service of m.services) {
          if (f(service)) result.push(service);
        }
        for (const impor of m.imports) {
          go(impor);
        }
      };

      go(begin);

      return result;
    },
  }))
);
