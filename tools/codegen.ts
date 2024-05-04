import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";
import path from "path";

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
