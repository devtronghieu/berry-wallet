import type { CodegenConfig } from "@graphql-codegen/cli";
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "..", ".env.local");

dotenv.config({ path: envPath });

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_GRAPHQL_ENDPOINT,
  generates: {
    "./src/utils/gqlTypes.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
