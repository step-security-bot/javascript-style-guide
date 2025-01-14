import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import { env } from "node:process";

import anolilabEslintConfig from "../../utils/eslint-config";
import bestPracticesConfig from "../best-practices";
import errorsConfig from "../errors";
// eslint-disable-next-line unicorn/prevent-abbreviations
import eS6Config from "../es6";
import styleConfig from "../style";
import variablesConfig from "../variables";
import { createConfigs } from "../../utils/create-config";

const bestPracticesRules = bestPracticesConfig.rules as Linter.RulesRecord;
// @ts-expect-error TODO: find the correct type
const errorsRules = errorsConfig.overrides[0].rules as Linter.RulesRecord;
// @ts-expect-error TODO: find the correct type
const styleRules = styleConfig.overrides[0].rules as Linter.RulesRecord;
// eslint-disable-next-line unicorn/prevent-abbreviations
const eS6Rules = eS6Config.rules as Linter.RulesRecord;
const variablesRules = variablesConfig.rules as Linter.RulesRecord;

const { indent, quotes, semi } = styleRules;

if (global.anolilabEslintConfigTypescriptPrettierRules === undefined && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.anolilabEslintConfigTypescriptPrettierRules = {
        "@typescript-eslint/block-spacing": "off",
        "@typescript-eslint/brace-style": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/comma-spacing": "off",
        "@typescript-eslint/func-call-spacing": "off",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/key-spacing": "off",
        "@typescript-eslint/keyword-spacing": "off",
        "@typescript-eslint/lines-around-comment": 0,
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/no-extra-parens": "off",
        "@typescript-eslint/no-extra-semi": "off",
        "@typescript-eslint/object-curly-spacing": "off",
        "@typescript-eslint/quotes": 0,
        "@typescript-eslint/semi": "off",
        "@typescript-eslint/space-before-blocks": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/space-infix-ops": "off",
        "@typescript-eslint/type-annotation-spacing": "off",
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commaDangle = styleRules["comma-dangle"] as any[];

let showUnsupportedTypeScriptVersionWarning: boolean = env["DISABLE_ESLINT_WARN_UNSUPPORTED_TYPESCRIPT_VERSION"] !== "true";

if (anolilabEslintConfig["warn_on_unsupported_typescript_version"] !== undefined) {
    showUnsupportedTypeScriptVersionWarning = anolilabEslintConfig["warn_on_unsupported_typescript_version"];
}

const config: Linter.Config = createConfigs([
    {
        config: {
            extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/stylistic", "plugin:@typescript-eslint/strict"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                sourceType: "module",
                warnOnUnsupportedTypeScriptVersion: showUnsupportedTypeScriptVersionWarning,
            },
            plugins: ["@typescript-eslint"],
            rules: {
                // Disabled because of perfectionist/sort-interfaces rule
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md
                "@typescript-eslint/adjacent-overload-signatures": "off",

                // Replace 'brace-style' rule with '@typescript-eslint' version
                // Requires using either T[] for arrays (array-type)
                "@typescript-eslint/array-type": [
                    "error",
                    {
                        default: "array",
                        readonly: "generic",
                    },
                ],
                // Enforces that types will not to be used
                "@typescript-eslint/ban-types": [
                    "error",
                    {
                        types: {
                            Array: { message: "Provide a more specific type" },
                            Boolean: { fixWith: "boolean", message: "Use boolean instead" },
                            Number: { fixWith: "number", message: "Use number instead" },
                            Object: { fixWith: "object", message: "Use object instead" },
                            String: { fixWith: "string", message: "Use string instead" },
                        },
                    },
                ],

                // Replace 'camelcase' rule with '@typescript-eslint/naming-convention'
                "@typescript-eslint/brace-style": styleRules["brace-style"],

                "@typescript-eslint/comma-dangle": [
                    commaDangle[0],
                    {
                        ...commaDangle[1],
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                        enums: commaDangle[1].arrays,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                        generics: commaDangle[1].arrays,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                        tuples: commaDangle[1].arrays,
                    },
                ],

                // Replace 'comma-dangle' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-dangle.md
                "@typescript-eslint/comma-spacing": styleRules["comma-spacing"],
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-generic-constructors.md
                "@typescript-eslint/consistent-generic-constructors": "error",

                // Replace 'comma-spacing' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-type-imports.md
                "@typescript-eslint/consistent-type-imports": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
                "@typescript-eslint/explicit-member-accessibility": "error",

                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
                "@typescript-eslint/explicit-module-boundary-types": "error",

                // Replace 'func-call-spacing' rule with '@typescript-eslint' version
                "@typescript-eslint/func-call-spacing": styleRules["func-call-spacing"],
                "@typescript-eslint/indent": indent,

                // Replace 'indent' rule with '@typescript-eslint' version
                "@typescript-eslint/keyword-spacing": styleRules["keyword-spacing"],
                "@typescript-eslint/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: false }],

                // Replace 'keyword-spacing' rule with '@typescript-eslint' version
                // Disabled because of perfectionist/sort-interfaces rule
                "@typescript-eslint/member-ordering": "off",

                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/method-signature-style.md
                "@typescript-eslint/method-signature-style": "error",

                // Replace 'lines-between-class-members' rule with '@typescript-eslint' version
                // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
                "@typescript-eslint/naming-convention": [
                    "error",
                    // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
                    {
                        format: ["camelCase", "PascalCase", "UPPER_CASE"],
                        selector: "variable",
                    },
                    // Allow camelCase functions (23.2), and PascalCase functions (23.8)
                    {
                        format: ["camelCase", "PascalCase"],
                        selector: "function",
                    },

                    // recommends PascalCase for classes (23.3), and although it does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
                    {
                        format: ["PascalCase"],
                        selector: "typeLike",
                    },
                ],
                "@typescript-eslint/no-array-constructor": styleRules["no-array-constructor"],

                // Replace 'no-array-constructor' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-confusing-non-null-assertion.md
                "@typescript-eslint/no-confusing-non-null-assertion": "error",
                "@typescript-eslint/no-dupe-class-members": eS6Rules["no-dupe-class-members"],

                // Replace 'no-dupe-class-members' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-duplicate-enum-values.md
                "@typescript-eslint/no-duplicate-enum-values": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-dynamic-delete.md
                "@typescript-eslint/no-dynamic-delete": "warn",

                // Replace 'no-empty-function' rule with '@typescript-eslint' version
                "@typescript-eslint/no-empty-function": bestPracticesRules["no-empty-function"],
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-extra-non-null-assertion.md
                "@typescript-eslint/no-extra-non-null-assertion": "error",

                // Replace 'no-extra-parens' rule with '@typescript-eslint' version
                "@typescript-eslint/no-extra-parens": errorsRules["no-extra-parens"],
                "@typescript-eslint/no-extra-semi": errorsRules["no-extra-semi"],

                // Replace 'no-extra-semi' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-import-type-side-effects.md
                "@typescript-eslint/no-import-type-side-effects": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-invalid-void-type.md
                "@typescript-eslint/no-invalid-void-type": "warn",

                "@typescript-eslint/no-loop-func": bestPracticesRules["no-loop-func"],
                "@typescript-eslint/no-magic-numbers": bestPracticesRules["no-magic-numbers"],

                // Replace 'no-loop-func' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-misused-new.md
                "@typescript-eslint/no-misused-new": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-namespace.md
                "@typescript-eslint/no-namespace": "error",

                // Replace 'no-magic-numbers' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-asserted-nullish-coalescing.md
                "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

                // Replace 'no-redeclare' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
                "@typescript-eslint/no-non-null-assertion": "error",
                "@typescript-eslint/no-redeclare": bestPracticesRules["no-redeclare"],

                // Replace 'no-shadow' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-require-imports.md
                "@typescript-eslint/no-require-imports": "error",
                "@typescript-eslint/no-shadow": variablesRules["no-shadow"],

                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-this-alias.md
                "@typescript-eslint/no-this-alias": "error",

                // Replace 'no-unused-expressions' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-assertion.md
                "@typescript-eslint/no-unnecessary-type-assertion": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md
                "@typescript-eslint/no-unnecessary-type-constraint": "error",

                // Replace 'no-unused-vars' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-argument.md
                "@typescript-eslint/no-unsafe-argument": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md
                "@typescript-eslint/no-unsafe-assignment": "error",

                // Replace 'no-use-before-define' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-call.md
                "@typescript-eslint/no-unsafe-call": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-declaration-merging.md
                "@typescript-eslint/no-unsafe-declaration-merging": "error",

                // Replace 'no-useless-constructor' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-member-access.md
                "@typescript-eslint/no-unsafe-member-access": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-return.md
                "@typescript-eslint/no-unsafe-return": "error",

                // Replace 'quotes' rule with '@typescript-eslint' version
                "@typescript-eslint/no-unused-expressions": bestPracticesRules["no-unused-expressions"],
                "@typescript-eslint/no-unused-vars": variablesRules["no-unused-vars"],

                // Replace 'semi' rule with '@typescript-eslint' version
                "@typescript-eslint/no-use-before-define": variablesRules["no-use-before-define"],
                "@typescript-eslint/no-useless-constructor": eS6Rules["no-useless-constructor"],

                // Replace 'space-before-function-paren' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-useless-empty-export.md
                "@typescript-eslint/no-useless-empty-export": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/non-nullable-type-assertion-style.md
                "@typescript-eslint/non-nullable-type-assertion-style": "off",

                // Replace 'no-return-await' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-enum-initializers.md
                "@typescript-eslint/prefer-enum-initializers": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-function-type.md
                "@typescript-eslint/prefer-function-type": "error",

                // Replace 'space-infix-ops' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
                "@typescript-eslint/prefer-nullish-coalescing": "error",
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-optional-chain.md
                "@typescript-eslint/prefer-optional-chain": "error",

                // Append 'ts' and 'tsx' to 'import/extensions' rule
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-ts-expect-error.md
                "@typescript-eslint/prefer-ts-expect-error": "error",

                // Append 'ts' and 'tsx' extensions to 'import/no-extraneous-dependencies' rule
                "@typescript-eslint/quotes": quotes,

                // The following rules are enabled in config, but are already checked (more thoroughly) by the TypeScript compiler
                "@typescript-eslint/return-await": bestPracticesRules["no-return-await"],
                "@typescript-eslint/semi": semi,
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/sort-type-constituents.md
                "@typescript-eslint/sort-type-constituents": "error",
                "@typescript-eslint/space-before-function-paren": styleRules["space-before-function-paren"],
                "@typescript-eslint/space-infix-ops": styleRules["space-infix-ops"],

                // Disable rules that are handled by prettier
                ...global.anolilabEslintConfigTypescriptPrettierRules,
            },
        },
        type: "typescript",
    },
]);

export default config;
