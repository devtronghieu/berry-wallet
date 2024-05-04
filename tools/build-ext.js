import * as esbuild from "esbuild";
import path from "path";

const buildContentScript = async () => {
  await esbuild.build({
    entryPoints: [path.resolve("src/extension/content.ts")],
    bundle: true,
    outfile: "dist/content.js",
  });
};

const buildInjectionScript = async () => {
  await esbuild.build({
    entryPoints: [path.resolve("src/extension/injection.ts")],
    bundle: true,
    outfile: "dist/injection.js",
  });
};

const buildBackgroundScript = async () => {
  await esbuild.build({
    entryPoints: [path.resolve("src/extension/background.ts")],
    bundle: true,
    outfile: "dist/background.js",
  });
};

const buildAll = async () => {
  await Promise.all([buildContentScript(), buildInjectionScript(), buildBackgroundScript()]);
};

buildAll();
