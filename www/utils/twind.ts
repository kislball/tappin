import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";

export * from "twind";

export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  theme: {
    colors: {
      paper: '#FFF5C1',
      black: 'rgba(0, 0, 0, 0.14)',
    },
  },
};

if (IS_BROWSER) setup(config);
