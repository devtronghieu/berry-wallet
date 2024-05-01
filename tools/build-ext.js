import * as esbuild from "esbuild";
import path from "path";

await esbuild.build({
  entryPoints: [path.resolve("src/contentScript/index.ts")],
  bundle: true,
  outfile: "dist/contentScript.js",
});
