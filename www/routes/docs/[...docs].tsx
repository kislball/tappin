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

export const handler: Handlers = {
  GET: (req, ctx) => {
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
      markdownData = Deno.readTextFileSync(path);
    } catch {
      return new Response("", {
        status: 307,
        headers: { Location: "/docs/introduction/welcome" },
      });
    }

    const parsed = parse(markdownData);
    return ctx.render({ markdownData: parsed.content, metadata: parsed.data });
  },
};

export default function DocArticle(
  props: PageProps<
    { markdownData: string; metadata: { title: string; description: string } }
  >,
) {
  const rendered = render(props.data.markdownData);

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
        <meta property="og:title" content={`${props.data.metadata.title} | Tappin`} />
        <meta property="og:description" content={props.data.metadata.description} />
        <meta property="og:image" content={asset('/minilogo.png')} />
      </Head>
      <div class={tw`bg-paper box-border text-[#3e3e3e] mt-10`}>
        <div
          dangerouslySetInnerHTML={{ __html: rendered }}
          class={`unreset ${tw("box-border max-w-[750px] mx-auto px-5 py-8")}`}
          data-color-mode="light" data-light-theme="light"
        >
        </div>
      </div>
    </Fragment>
  );
}
