import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";

const hasSortPackageJson = hasDependency("sort-package-json") || hasDevDependency("sort-package-json");

const group: Config = {
    [`**/*.{${["json", "json5", "jsonc"].join(",")}}`]: (filenames: string[]) => [`prettier --write ${concatFiles(filenames)}`],
    ...(hasSortPackageJson ? { "package.json,{packages,apps}/*/package.json": (filenames: string[]) => [`sort-package-json ${concatFiles(filenames)}`] } : {}),
};

export default group;
