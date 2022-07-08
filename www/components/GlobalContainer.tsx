/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";

export default function GlobalContainer(
  { children }: { children: ComponentChildren },
) {
  return (
    <div
      class={tw
        `w-screen min-h-screen bg-paper p-7 md:p-11 border-box flex flex-col`}
    >
      <div
        class={tw
          `border-black border-8 rounded-[15px] flex items-center justify-center flex-col p-5 flex-1`}
      >
        {children}
      </div>
    </div>
  );
}
