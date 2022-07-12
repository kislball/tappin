/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "twind";
import { asset } from "$fresh/runtime.ts";

export default function Header() {
  return (
    <div
      class={tw`border-b-[3px] flex justify-center`}
      style="border-bottom-color: rgba(0, 0, 0, 0.2);"
    >
      <a href="/">
        <img
          src={asset("/logo.svg")}
          alt="tappin logo - word 'tappin' with a period surrounded by black border"
          class={tw`relative`}
          style="transform: translateY(50%);"
        />
      </a>
    </div>
  );
}
