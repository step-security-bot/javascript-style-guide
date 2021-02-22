const { hasAnyDep, hasTypescript } = require("./lib/utils");
const isModuleAvailable = require("./lib/is-module-available");

// Base rules
const rules = ["best-practices", "errors", "style", "es6", "variables"];

// Base plugin rules
const pluginRules = [
    "eslint-comments",
    "import",
    "jsdoc",
    "json",
    "markdown",
    "optimize-regex",
    "promise",
    "simple-import-sort",
    "unicorn",
    "you-dont-need-lodash-underscore",
    "you-dont-need-momentjs",

    // Security Rules
    "no-secrets",
    "radar",
];

// Optionals rules based on project dependencies
const depRules = [
    "html",
    "mdx",
    "array-func",
    "redux",
    "no-unsanitized",
    "lodash",
    ["lodash", "lodash-fp"],
    "react",
    ["mdx", "eslint-plugin-react"],
    ["react-a11y", "react"],
    ["react-hooks", "react"],
];

const testRules = [
    "cypress",
    "jest",
    ["jest", "jest-async", "jest-dom"],
    "jest-dom",
    ["jest-formatting", "jest"],
    ["@testing-library/jest-dom", "jest-dom"],
    ["@testing-library/dom", "testing-library"],
];

// Extra required optional packages
const extraInstallPackage = [];

depRules.forEach((depRule) => {
    const rule = typeof depRule === "string" ? [depRule, depRule] : depRule;

    if (hasAnyDep(rule[0])) {
        pluginRules.push(rule[1]);
    }
});

testRules.forEach((depRule) => {
    const rule = typeof depRule === "string" ? [depRule, depRule] : depRule;

    if (isModuleAvailable(rule[0])) {
        pluginRules.push(rule[1]);
    }
});

if (hasTypescript) {
    pluginRules.push("typescript");
    extraInstallPackage.push(["@typescript-eslint/parser", "@typescript-eslint/eslint-plugin"]);

    if (hasAnyDep("eslint-plugin-typescript-sort-keys")) {
        pluginRules.push("typescript-sort-keys");
    }
}

module.exports = { rules, pluginRules, extraInstallPackage };
