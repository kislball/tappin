/** @jsx h */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { resolvePath } from "../../utils/resolvePath.ts";
import { CSS, render } from "gfm";
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import { asset, Head } from "$fresh/runtime.ts";
import { parse } from "frontmatter";
import { tw } from "../../utils/twind.ts";
import Sidebar from "../../components/Sidebar.tsx";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const doc = ctx.params.docs;
    if (doc.length === 0 || doc === "introduction") {
      return new Response("", {
        status: 307,
        headers: { Location: "/docs/introduction/welcome" },
      });
    }
    const path = resolvePath(doc);

    let markdownData: string;

    try {
      markdownData = await Deno.readTextFile(path);
    } catch (e) {
      return new Response("", {
        status: 307,
        headers: { Location: "/docs/introduction/welcome" },
      });
    }

    const parsed = parse(markdownData);
    const rendered = render(parsed.content, { baseUrl: import.meta.url });
    return ctx.render({ markdownData: rendered, metadata: parsed.data });
  },
};

export default function DocArticle(
  props: PageProps<
    { markdownData: string; metadata: { title: string; description: string } }
  >,
) {
  return (
    <Fragment>
      <Head>
        <title>{props.data.metadata.title} | Tappin</title>
        <style>
          {CSS}
        </style>
        <link rel="stylesheet" href={asset("/unreset.css")} />
        <link rel="stylesheet" href={asset("/prism.css")} />
        <meta name="description" content={props.data.metadata.description} />
        <meta
          property="og:title"
          content={`${props.data.metadata.title} | Tappin`}
        />
        <meta
          property="og:description"
          content={props.data.metadata.description}
        />
        <meta property="og:image" content={asset("/minilogo.png")} />
      </Head>
      <div
        class={tw
          `bg-paper box-border text-[#3e3e3e] mt-10 grid grid-cols-1 lg:grid-cols-4 max-w-[1100px] mx-auto px-5 py-8`}
      >
        <Sidebar />
        <div class={`unreset ${tw("box-border col-span-3")}`}>
          <h1>{props.data.metadata.title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: props.data.markdownData }}
            data-color-mode="light"
            data-light-theme="light"
          >
          </div>
        </div>
      </div>
    </Fragment>
  );
}
