import { pkg } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

if (global.anolilabEslintConfigNodeRules === undefined && pkg?.engines?.["node"]) {
    const version: string = pkg.engines["node"];

    global.anolilabEslintConfigNodeRules = {
        "n/no-unsupported-features/es-builtins": ["error", { version }],
        "n/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"], version }],
        "n/no-unsupported-features/node-builtins": ["error", { version }],
    };
}

// @see https://github.com/eslint-community/eslint-plugin-n
const config: Linter.Config = {
    env: {
        node: true,
    },
    extends: ["plugin:n/recommended"],
    overrides: [
        {
            files: ["*.js", "*.mjs", "*.cjs"],
            rules: {
                // We have this enabled in addition to `import/extensions` as this one has an auto-fix.
                "n/file-extension-in-import": ["error", "always"],
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 2021,
    },
    plugins: ["n"],
    rules: {
        // https://eslint.org/docs/rules/global-require
        "global-require": "error",
        // enforce return after a callback
        "n/callback-return": "off",

        "n/file-extension-in-import": "off",
        // enforces error handling in callbacks (node environment)
        "n/handle-callback-err": "off",

        // Redundant with `import/no-extraneous-dependencies`.
        "n/no-extraneous-import": "off",

        "n/no-extraneous-require": "off",

        // require all requires be top-level
        // Redundant with `import/no-unresolved`.
        "n/no-missing-import": "off", // This rule is also buggy and doesn't support `node:`.

        "n/no-missing-require": "off",

        // disallow use of the Buffer() constructor
        // disallow mixing regular variable and require declarations
        "n/no-mixed-requires": [
            "error",
            {
                allowCall: true,
                grouping: true,
            },
        ],

        // disallow use of new operator with the require function
        "n/no-new-require": "error",

        // disallow use of process.env
        "n/no-process-env": "off",

        // disallow string concatenation with __dirname and __filename
        // unicorn/no-process-exit is enabled instead.
        "n/no-process-exit": "off",

        // restrict usage of specified node modules
        "n/no-restricted-modules": "off",

        // disallow process.exit()
        // disallow use of synchronous methods (off by default)
        "n/no-sync": "off",

        "n/no-unpublished-bin": "error",

        "n/process-exit-as-throw": "error",

        // https://eslint.org/docs/rules/no-buffer-constructor
        "no-buffer-constructor": "error",

        // https://eslint.org/docs/rules/no-path-concat
        "no-path-concat": "error",

        ...global.anolilabEslintConfigNodeRules,
    },
};

export default config;
