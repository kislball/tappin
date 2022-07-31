const getFolder = () => {
  if (Deno.args.length === 0) {
    console.error("❌ Please specify directory");
    Deno.exit();
  }
  return Deno.args[0];
};

try {
  Deno.run({
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
    cmd: [
      "git",
      "clone",
      "https://github.com/kislball/tappin-starter-app",
      getFolder(),
    ],
  });
} catch {
  console.log(`Cannot initialize Tappin app. Possible problems:
\t- Check if you have git installed\n\t- Check if you gave --allow-run permission to the CLI`);
}
