import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "./src/index.ts",
  output: {
    name: "maliketh",
    dir: "dist",
    format: "es",
    exports: "auto",
    globals: {
      axios: "axios",
      "generate-schema": "genSchema",
      path: "path",
      "json-schema-to-typescript": "jsonSchemaToTypescript",
      fs: "fs",
    },
  },
  plugins: [nodePolyfills(), typescript()],

  external: [
    "axios",
    "generate-schema",
    "path",
    "json-schema-to-typescript",
    "fs",
  ],
};

export default config;
