import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import shim from "rollup-plugin-shim";
import { terser } from "rollup-plugin-terser";
import gzipPlugin  from "rollup-plugin-gzip";

export function openTelemetryCommonJs() {
  const namedExports = {};

  for (const key of ["@opentelemetry/api", "@azure/core-tracing/node_modules/@opentelemetry/api"]) {
    namedExports[key] = [
      "SpanKind",
      "TraceFlags",
      "getSpan",
      "setSpan",
      "SpanStatusCode",
      "getSpanContext",
      "setSpanContext",
    ];
  }

  const releasedOpenTelemetryVersions = ["0.10.2", "1.0.0-rc.0"];

  for (const version of releasedOpenTelemetryVersions) {
    namedExports[
      // working around a limitation in the rollup common.js plugin - it's not able to resolve these modules so the named exports listed above will not get applied. We have to drill down to the actual path.
      `../../../common/temp/node_modules/.pnpm/@opentelemetry/api@${version}/node_modules/@opentelemetry/api/build/src/index.js`
    ] = [
      "SpanKind",
      "TraceFlags",
      "getSpan",
      "setSpan",
      "StatusCode",
      "CanonicalCode",
      "getSpanContext",
      "setSpanContext",
    ];
  }

  return namedExports;
}

export default {
  input: "src/index.js",
  output: {
    file: "dist/rollup-bundle.js",
    format: "iife",
    name: "main",
  },
  plugins: [
    shim({
      fs: `
      export function stat() { }
      export function createReadStream() { }
      export function createWriteStream() { }
    `,
      os: `
      export const type = 1;
      export const release = 1;
    `,
      util: `
        export function promisify() { }
    `,
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ["module", "browser"],
    }),
    cjs({
      namedExports: {
        events: ["EventEmitter"],
        ...openTelemetryCommonJs(),
      },
    }),
    json(),
    terser(),
    gzipPlugin()
  ],
};
