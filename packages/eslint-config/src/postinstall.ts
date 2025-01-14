import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, readFileSync, writeFile } from "node:fs";
import { join } from "node:path";
import { env, exit } from "node:process";
import { promisify } from "node:util";
import type { TsConfigJson } from "type-fest";

if (env["CI"]) {
    exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/eslint-config", projectPath, "\n");

const configFile = ".eslintrc";

/**
 * Writes .eslintrc.js if it doesn't exist. Warns if it exists.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const writeEslintRc = async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of [configFile, `${configFile}.js`, `${configFile}.cjs`, `${configFile}.json`, `${configFile}.yaml`, `${configFile}.yml`]) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (existsSync(join(projectPath, filename))) {
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/eslint-config'
to work as it should: { extends: ["@anolilab/eslint-config"] }.`);

            return;
        }
    }

    const eslintPath = join(projectPath, `.eslintrc.${packageIsTypeModule ? "c" : ""}js`);

    let pluginExtends = "";
    let parserOptions = `
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: ${packageIsTypeModule ? '"module"' : '"commonjs"'},
    },`;

    const tsconfigPath = join(projectPath, "tsconfig.json");

    let ecmaVersion = "latest";

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(tsconfigPath)) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const tsConfig = JSON.parse(readFileSync(tsconfigPath, "utf8")) as TsConfigJson;

        if (tsConfig.compilerOptions?.target) {
            ecmaVersion = tsConfig.compilerOptions.target;

            ecmaVersion =
                ecmaVersion.toLowerCase() === "es2022" || ecmaVersion.toLowerCase() === "esnext" ? "latest" : ecmaVersion.toLowerCase().replace("es", "");

            if (ecmaVersion !== "latest" && ecmaVersion !== "2022" && ecmaVersion !== "2021" && ecmaVersion !== "6") {
                pluginExtends = `, "plugin:es-x/restrict-to-es${ecmaVersion}"`;
            }
        }

        parserOptions = `
    parserOptions: {
        project: true,
        ecmaVersion: ${ecmaVersion === "latest" ? `"${ecmaVersion}"` : ecmaVersion},
        sourceType: ${packageIsTypeModule ? '"module"' : '"commonjs"'},
    },`;
    }

    const content = `${
        ["es2015", "es2017", "es2020", "es2021", "latest"].includes(ecmaVersion) ? 'var { globals } = require("@anolilab/eslint-config/globals");\n\n' : ""
    }/** @ts-check */
/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@anolilab/eslint-config"${pluginExtends}],
    ignorePatterns: ["!**/*"],
    env: {
        // Your environments (which contains several predefined global variables)
        // Most environments are loaded automatically if our rules are added
    },${parserOptions}
    globals: {${
        ["es2015", "es2017", "es2020", "es2021", "latest"].includes(ecmaVersion)
            ? `\n        ...globals.${ecmaVersion === "latest" ? "es2021" : ecmaVersion},`
            : ""
    }
        // Your global variables (setting to false means it's not allowed to be reassigned)
        // myGlobal: false
    },
    rules: {
        // Customize your rules
    },
    overrides: [
        {
            files: [
                "*.ts",
                "*.tsx",
                "*.mts",
                "*.cts",
                "*.js",
                "*.jsx",
            ],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {},
            rules: {},
        },
        {
            files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {},
            rules: {},
        },
        {
            files: ["*.js", "*.jsx"],
            rules: {},
        },
    ],
};
`;

    await writeFileAsync(eslintPath, content, "utf8");
};

/**
 * Writes .eslintignore if it doesn't exist. Warns if it exists.
 */
const writeEslintIgnore = async () => {
    const eslintIgnorePath = join(projectPath, ".eslintignore");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(eslintIgnorePath)) {
        console.warn("⚠️  .eslintignore already exists");

        return;
    }

    await writeFileAsync(eslintIgnorePath, "", "utf8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        // eslint-disable-next-line compat/compat
        await Promise.all([writeEslintRc(), writeEslintIgnore()]);

        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        exit(1);
    }
})();
