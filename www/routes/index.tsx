/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from "preact";
import { tw } from "@twind";
import { Head } from "https://deno.land/x/fresh@1.0.1/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tappin</title>
      </Head>
      <div className={tw`w-screen h-screen flex flex-col text-center items-center justify-center`}>
        <p>Tappin will soon be released.</p>
        <p>Stay tuned</p>
      </div>
    </>
  )
}