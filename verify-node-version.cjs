let requiredVersion = require("node:fs").readFileSync(".nvmrc", { encoding: "utf8" }).trim();

if (!requiredVersion.includes("v")) {
    requiredVersion = `v${requiredVersion}`;
}

if (process.env.SKIP_CHECK !== undefined) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

if (process.version.split(".")[0] !== requiredVersion.split(".")[0]) {
    console.error(`[!] This project requires Node.js ${requiredVersion}, current version is ${process.version}`);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
}
