import { fromRoot, hasTypescript } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import { createConfigs } from "../../utils/create-config";

const config: Linter.Config = createConfigs([
    {
        config: {
            env: {
                es6: true,
            },

            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module",
            },
            plugins: ["import"],
            rules: {
                // Static analysis:

                // ensure imports point to files/modules that can be resolved
                // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/consistent-type-specifier-style.md
                "import/consistent-type-specifier-style": ["error", "prefer-top-level"],

                // ensure named imports coupled with named exports
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/default.md#when-not-to-use-it
                "import/default": "off",

                // ensure default import coupled with default export
                // https://github.com/benmosher/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/dynamic-import-chunkname.md
                "import/dynamic-import-chunkname": [
                    "off",
                    {
                        importFunctions: [],
                        webpackChunknameFormat: "[0-9a-zA-Z-_/.]+",
                    },
                ],

                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
                "import/export": "error",

                // Helpful warnings:

                // disallow invalid exports, e.g. multiple defaults
                // https://github.com/benmosher/eslint-plugin-import/blob/98acd6afd04dcb6920b81330114e146dc8532ea4/docs/rules/exports-last.md
                "import/exports-last": "error",

                // do not allow a default import name to match a named export
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
                "import/extensions": [
                    "error",
                    "ignorePackages",
                    {
                        cjs: "never",
                        js: "never",
                        jsx: "never",
                        mjs: "never",
                    },
                ],

                // warn on accessing default export property names that are also named exports
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
                "import/first": "error",

                // disallow use of jsdoc-marked-deprecated imports
                // https://github.com/benmosher/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/group-exports.md
                "import/group-exports": "off",

                // Forbid the use of extraneous packages
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
                // deprecated: use `import/first`
                "import/imports-first": "off",

                // Forbid mutable exports
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/max-dependencies.md
                "import/max-dependencies": ["off", { max: 10 }],

                // Module systems:

                // disallow require()
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md#when-not-to-use-it
                "import/named": "error",

                // disallow AMD require/define
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/namespace.md
                "import/namespace": "off",

                // No Node.js builtin modules
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
                "import/newline-after-import": "error",

                // Style guide:

                // disallow non-import statements appearing before import statements
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
                "import/no-absolute-path": "error",

                // disallow non-import statements appearing before import statements
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/imports-first.md
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
                "import/no-amd": "error",

                // disallow duplicate imports
                // https://github.com/benmosher/eslint-plugin-import/blob/d9b712ac7fd1fddc391f7b234827925c160d956f/docs/rules/no-anonymous-default-export.md
                "import/no-anonymous-default-export": [
                    "off",
                    {
                        allowAnonymousClass: false,
                        allowAnonymousFunction: false,
                        allowArray: false,
                        allowArrowFunction: false,
                        allowLiteral: false,
                        allowObject: false,
                    },
                ],

                // disallow namespace imports
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
                "import/no-commonjs": "off",

                // Ensure consistent use of file extension within the import path
                // https://medium.com/@steven-lemon182/are-typescript-barrel-files-an-anti-pattern-72a713004250
                "import/no-cycle": ["error", { maxDepth: "∞" }],

                // ensure absolute imports are above relative imports and that unassigned imports are ignored
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
                // https://github.com/benmosher/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-default-export.md
                "import/no-default-export": "off",

                // Require a newline after the last import/require in a group
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
                "import/no-deprecated": "off",

                // Require modules with a single export to use a default export
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
                "import/no-duplicates": "error",

                // Restrict which files can be imported in a given folder
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
                "import/no-dynamic-require": "error",

                // Forbid modules to have too many dependencies
                // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/no-empty-named-blocks.md
                "import/no-empty-named-blocks": "error",

                // Forbid import of modules using absolute paths
                //  are treated both as absolute paths, and relative to process.cwd()
                "import/no-extraneous-dependencies": [
                    "error",
                    {
                        devDependencies: [
                            "test/**", // tape, common npm pattern
                            "tests/**", // also common npm pattern
                            "spec/**", // mocha, rspec-like pattern
                            "**/fixture/**", // jest pattern
                            "**/__mocks__/**", // jest pattern
                            "test.{js,jsx}", // repos with a single test file
                            "test-*.{js,jsx}", // repos with multiple top-level test files
                            "**/*{.,_}{test,spec}.{js,jsx}", // tests where the extension or filename suffix denotes that it is a test
                            "**/jest.config.cjs", // jest config
                            "**/jest.setup.js", // jest setup
                            "**/vue.config.cjs", // vue-cli config
                            "**/webpack.config.cjs", // webpack config
                            "**/webpack.config.*.js", // webpack config
                            "**/rollup.config.cjs", // rollup config
                            "**/rollup.config.*.js", // rollup config
                            "**/gulpfile.js", // gulp config
                            "**/gulpfile.*.js", // gulp config
                            "**/Gruntfile{,.js}", // grunt config
                            "**/protractor.conf.js", // protractor config
                            "**/protractor.conf.*.js", // protractor config
                            "**/karma.conf.js", // karma config
                            "**/.eslintrc.js", // eslint config
                            "**/.eslintrc.cjs", // eslint config
                            "**/.eslintrc.mjs", // eslint config
                            "**/vite.config.js", // vite config
                            "**/vite.config.ts", // vite config
                            "**/vitest.config.js", // vitest config
                            "**/vitest.config.ts", // vitest config
                            "**/__tests__/**/*.?(c|m)[jt]s?(x)", // vitest config test include
                            "**/?(*.){test,spec}.?(c|m)[jt]s?(x)", // vitest config test include
                        ],
                        optionalDependencies: false,
                    },
                ],

                // Forbid require() calls with expressions
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
                "import/no-internal-modules": [
                    "off",
                    {
                        allow: [],
                    },
                ],

                // prevent importing the submodules of other modules
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
                "import/no-mutable-exports": "error",

                // Warn if a module could be mistakenly parsed as a script by a consumer
                // leveraging Unambiguous JavaScript Grammar
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/unambiguous.md
                // this should not be enabled until this proposal has at least been *presented* to TC39.
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
                "import/no-named-as-default": "error",

                // Forbid Webpack loader syntax in imports
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
                "import/no-named-as-default-member": "error",

                // Prevent unassigned imports
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-default.md
                "import/no-named-default": "error",

                // Prevent importing the default as if it were named
                // https://github.com/benmosher/eslint-plugin-import/blob/1ec80fa35fa1819e2d35a70e68fb6a149fb57c5e/docs/rules/no-named-export.md
                "import/no-named-export": "off",

                // Reports if a module's default export is unnamed
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
                "import/no-namespace": "error",

                // This rule enforces that all exports are declared at the bottom of the file.
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-nodejs-modules.md
                "import/no-nodejs-modules": "off",

                // Reports when named exports are not grouped together in a single export declaration
                // or when multiple assignments to CommonJS const config or exports object are present
                // in a single file.
                // https://github.com/benmosher/eslint-plugin-import/blob/c34f14f67f077acd5a61b3da9c0b0de298d20059/docs/rules/no-relative-parent-imports.md
                "import/no-relative-parent-imports": "off",

                // forbid default exports. this is a terrible rule, do not use it.
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md
                "import/no-restricted-paths": "off",

                // Prohibit named exports. this is a terrible rule, do not use it.
                // https://github.com/benmosher/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-self-import.md
                "import/no-self-import": "error",

                // Forbid a module from importing itself
                // importing for side effects is perfectly acceptable, if you need side effects.
                "import/no-unassigned-import": "off",

                // Forbid cyclical dependencies between modules
                // https://github.com/benmosher/eslint-plugin-import/blob/d81f48a2506182738409805f5272eff4d77c9348/docs/rules/no-cycle.md
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
                "import/no-unresolved": ["error", { caseSensitive: true, commonjs: true }],

                // Ensures that there are no useless path segments
                // Note: you must disable the base rule as it can report incorrect errors
                "import/no-unused-modules": "off",

                // dynamic imports require a leading comment with a webpackChunkName
                // https://github.com/benmosher/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/no-useless-path-segments.md
                "import/no-useless-path-segments": ["error", { commonjs: true, noUselessIndex: true }],

                // Use this rule to prevent imports to folders in relative parent paths.
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
                "import/no-webpack-loader-syntax": "error",

                // Reports modules without any exports, or with unused exports
                // https://github.com/benmosher/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
                "import/order": [
                    "error",
                    {
                        groups: [["builtin", "external", "internal"]],
                    },
                ],

                // enforce a consistent style for type specifiers (inline or top-level)
                // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/consistent-type-specifier-style.md
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
                "import/prefer-default-export": "error",

                // Reports the use of empty named import blocks.
                // At the moment, it's not a thing.
                "import/unambiguous": "off",
            },
            settings: {
                "import/core-modules": [],
                // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/extensions.md
                "import/extensions": [".js", ".cjs", ".mjs", ".jsx"],
                // Ensure consistent use of file extension within the import path
                "import/ignore": ["\\.(coffee|scss|css|less|hbs|svg|json)$"],
                "import/resolver": {
                    node: {
                        extensions: [".mjs", ".js", ".json"],
                    },
                    ...(hasTypescript
                        ? {
                              typescript: {
                                  alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                                  project: fromRoot("tsconfig.json"),
                              },
                          }
                        : {}),
                },
            },
        },
        type: "all",
    },
    {
        config: {
            extends: ["plugin:import/typescript"],
            rules: {
                // Does not work when the TS definition exports a default const.
                "import/default": "off",

                // Disabled because of https://github.com/benmosher/eslint-plugin-import/issues/1590
                "import/export": "off",

                // Disabled as it doesn't work with TypeScript.
                "import/extensions": [
                    "error",
                    "ignorePackages",
                    {
                        js: "never",
                        jsx: "never",
                        mjs: "never",
                        ts: "never",
                        tsx: "never",
                    },
                ],

                // This issue and some others: https://github.com/benmosher/eslint-plugin-import/issues/1341
                "import/named": "off",

                // Enforce consistent usage of type imports.
                "import/no-unresolved": "off",
            },
            settings: {
                // Append 'ts' extensions to 'import/extensions' setting
                "import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts", ".cjs", ".cts", ".mts"],

                // Resolve type definition packages
                "import/external-module-folders": ["node_modules", "node_modules/@types"],

                // Apply special parsing for TypeScript files
                "import/parsers": {
                    "@typescript-eslint/parser": [".ts", ".cts", ".mts", ".tsx", ".d.ts"],
                },

                // Append 'ts' extensions to 'import/resolver' setting
                "import/resolver": {
                    node: {
                        extensions: [".mjs", ".cjs", ".js", ".json", ".ts", ".d.ts"],
                    },
                },
            },
        },
        type: "typescript",
    },
    {
        config: {
            rules: {
                "import/no-duplicates": "off",
            },
        },
        type: "d.ts",
    },
]);

export default config;
