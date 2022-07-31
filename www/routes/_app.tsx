/** @jsx h */
import { Fragment, FunctionalComponent, h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { tw } from "twind";
import Header from "../components/Header.tsx";
import { asset, Head } from "$fresh/runtime.ts";

export default function App(
  { Component }: PageProps & { Component: FunctionalComponent },
) {
  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href={asset("/font.css")} />
      </Head>
      <div class={tw`text-lilblack border-box`}>
        <Header />
        <Component />
      </div>
    </Fragment>
  );
}
