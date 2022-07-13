/** @jsx h */
import { contents } from "../../docs/toc.ts";
import { Fragment, h } from "preact";
import { tw } from "../utils/twind.ts";

export default function Sidebar() {
  return (
    <ol class={`unreset ${tw`mt-[0.83em]`}`}>
      {Object.entries(contents).map((section) => (
        <Fragment>
          <li class={tw`font-bold`}>
            {section[0]}
            <ol class={tw`font-normal`}>
              {Object.entries(section[1]).map((e) => (
                <li>
                  <a href={`/docs${e[1].slice(1).replace('.md', '')}`}>{e[0]}</a>
                </li>
              ))}
            </ol>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
