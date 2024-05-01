import * as esbuild from "esbuild";
import path from "path";

const buildContentScript = async () => {
  await esbuild.build({
    entryPoints: [path.resolve("src/contentScript/index.ts")],
    bundle: true,
    outfile: "dist/contentScript.js",
  });
};

const buildInjectionScript = async () => {
  await esbuild.build({
    entryPoints: [path.resolve("src/contentScript/injection.ts")],
    bundle: true,
    outfile: "dist/injection.js",
  });
};

const buildAll = async () => {
  await Promise.all([buildContentScript(), buildInjectionScript()]);
};

buildAll();
