/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "preact";
import { asset } from "$fresh/runtime.ts";
import { Head } from "https://deno.land/x/fresh@1.0.1/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import versions from "../../versions.json" assert { type: "json" };
import GlobalContainer from "../components/GlobalContainer.tsx";
import { tw } from "../utils/twind.ts";

const latest = versions.versions[0];

export const handler: Handlers = {
  GET(req, ctx) {
    const accept = req.headers.get("accept");
    if (accept !== null && !accept.includes("text/html")) {
      const path = `https://deno.land/x/tappin@${latest}/cli.ts`;
      return new Response(`Redirecting to ${path}`, {
        status: 307,
        headers: {
          Location: path,
        },
      });
    }

    return ctx.render();
  },
};

const links = {
  // 'docs': '/docs',
  "github": "https://github.com/kislball/tappin",
};

export default function Home() {
  return (
    <GlobalContainer>
      <Head>
        <title>Tappin</title>
      </Head>
      <img src={asset("/logo.svg")} alt="" />
      <p class={tw`text-black text-[28px] text-center mt-7`}>
        powerful application framework for Deno
      </p>
      <div class={tw(`flex justify-evenly max-w-[230px] w-full mt-3`)}>
        {Object.entries(links).map((e) => (
          <a
            class={tw
              `text-black text-[28px] mr-3 ml-3 duration-200 hover:opacity-70`}
            href={e[1]}
          >
            {e[0]}
          </a>
        ))}
      </div>
    </GlobalContainer>
  );
}
