/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "twind";

export default function Button(
  props: { children: ComponentChildren; href: string },
) {
  return (
    <a
      href={props.href}
      class={tw
        `rounded-[15px] border-[rgba(0,0,0,0.20)] px-4 py-2 border-[3px] text-[28px] mx-3 duration-200 hover:opacity-70 w-full md:w-[150px] text-center mt-2`}
    >
      {props.children}
    </a>
  );
}
