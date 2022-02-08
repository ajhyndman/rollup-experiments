import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import rollupPluginReplace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

const moduleFormat = "amd";
const buildJsForProd = false;

export default {
  input: "src/main.js",
  preserveEntrySignatures: "allow-extension",
  preserveSymlinks: true,

  plugins: [
    nodeResolve({
      browser: true,
      mainFields: [
        "browser:module",
        "browser",
        "module",
        "jsnext:main",
        "main",
      ],
      modulesOnly: false,
      extensions: [".mjs", ".cjs", ".js", ".json"],
      preferBuiltins: false,
      moduleDirectories: ["node_modules"],
    }),

    // Expands env variables.
    rollupPluginReplace({
      values: {
        // Inputs are already minified however some npm dependencies needs this to be defined.
        // Current envification system skip those.
        "process.env.NODE_ENV": JSON.stringify(
          buildJsForProd ? "production" : "development"
        ),
        // Normally all replacement values should be JSON serialized, however we are using a trick
        // because our inputs are already envified, that is all process.env.* usages are already replaced by their
        // corresponding values from here build_tools/static_build/generate_env/env.py
        // In env file we replace process.env.ROLLUP with "ROLLUP_ENV.ROLLUP".
        // The replacement values below fix those their ultimate values.
        "ROLLUP_ENV.ROLLUP": "true",
        "ROLLUP_ENV.ROLLUP_FORMAT": moduleFormat,
      },
      preventAssignment: true,
    }),

    // Converts some commonjs npm modules into es modules.
    commonjs({
      // Only transform node modules
      include: [/\/node_modules\//, /\/npm\//],
      // Dynamic requires are amd way of loading.
      ignoreDynamicRequires: true,
      // Some of our dependencies tries to load 'crypto' node module to test whether they are in nodejs env.
      // ignore those.
      ignore: (id) => {
        return id === "crypto";
      },
    }),

    sourcemaps(),

    terser({ compress: true }),
  ],

  output: {
    file: "bundle.js",
    exports: "named",
    interop: "auto",
    minifyInternalExports: false,
    preserveModules: false,
    format: "cjs",
    sourcemap: true,
    // acorn: {
    //   ranges: true,
    //   allowAwaitOutsideFunction: moduleFormat === "es",
    // },
  },
};
