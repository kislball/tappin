import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";

export * from "twind";

export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  theme: {
    colors: {
      lilblack: "rgba(0, 0, 0, 0.20)",
    },
    fontFamily: {
      serif: ['Inter', 'sans-serif']
    },
  },
};

if (IS_BROWSER) setup(config);
