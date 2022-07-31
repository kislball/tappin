import { resolve } from "path";

export const resolvePath = (name: string) => resolve("./docs", `${name}.md`);
