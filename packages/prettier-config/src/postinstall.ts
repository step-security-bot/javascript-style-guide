import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import content from ".";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/prettier-config", projectPath, "\n");

const configFile = ".prettierrc";

/**
 * Writes .prettierrc.${m|c}js if it doesn't exist. Warns if it exists.
 */
const writePrettierRc = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of [
        configFile,
        `${configFile}.js`,
        `${configFile}.cjs`,
        `${configFile}.json`,
        `${configFile}.json5`,
        `${configFile}.yaml`,
        `${configFile}.yml`,
        `${configFile}.toml`,
        "prettier.config.js",
        "prettier.config.cjs",
    ]) {
        if (existsSync(join(projectPath, filename))) {
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/prettier-config to work as it should:
${JSON.stringify(content, undefined, 4)}\n`);

            return Promise.resolve();
        }
    }

    const prettierPath = join(projectPath, ".prettierrc.js");

    return writeFileAsync(
        prettierPath,
        `${packageIsTypeModule ? "export default" : "module.exports ="} ${JSON.stringify(content, undefined, 2).replace(
            "rangeEnd: null,",
            "rangeEnd: Number.POSITIVE_INFINITY,",
        )}\n`,
        "utf8",
    );
};

/**
 * Writes .prettierignore if it doesn't exist. Warns if it exists.
 */
const writePrettierIgnore = () => {
    const prettierPath = join(projectPath, ".prettierignore");

    if (existsSync(prettierPath)) {
        console.warn("⚠️  .prettierignore already exists");

        return Promise.resolve();
    }

    return writeFileAsync(
        prettierPath,
        `${["*.md", "*.sh", "*.yml", "*.svg", "*.gif", "*.log", ".DS_Store", "CNAME", "AUTHORS", "LICENSE", "es/", "lib/", "dist/", "coverage/"].join("\n")}\n`,
        "utf8",
    );
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        // eslint-disable-next-line compat/compat
        await Promise.all([writePrettierRc(), writePrettierIgnore()]);

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
})();
