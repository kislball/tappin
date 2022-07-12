/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { versions } from "../../versions.ts";
import { tw } from "twind";
import Button from "../components/Button.tsx";

const latest = versions[0];

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
  "docs": "/docs",
  "github": "https://github.com/kislball/tappin",
};

const tagLine = "Powerful application framework for Deno";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tappin</title>
        <meta name="description" content={tagLine} />
        <meta property="og:title" content="Tappin" />
        <meta property="og:description" content={tagLine} />
        <meta property="og:image" content={asset("/minilogo.png")} />
      </Head>
      <div
        style="min-height: calc(100vh - 102px);"
        class={tw`flex justify-center items-center`}
      >
        <div class={tw`flex flex-col justify-center items-center`}>
          <p class={tw`text-[36px] font-medium text-center max-w-[500px]`}>
            {tagLine}
          </p>
          <div
            class={tw
              `flex justify-between flex-wrap items-center max-w-[400px] mt-5`}
          >
            {Object.entries(links).map((link) => (
              <Button href={link[1]}>{link[0]}</Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
