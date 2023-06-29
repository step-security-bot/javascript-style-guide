import type { Config } from "lint-staged";
import { env } from "node:process";

import getNearestConfigPath from "../utils/get-nearest-config-path";

const group: Config = {
    [`*.{${["ts", "mts", "cts"].join(",")}}`]: (filenames: string[]) => {
        const commands = new Set<string>();

        filenames.forEach((filePath) => {
            try {
                // eslint-disable-next-line no-template-curly-in-string
                const tsconfigPath = getNearestConfigPath("tsconfig.json", filePath as "/${string}");

                commands.add(`tsc --noEmit --project ${tsconfigPath}`);
            } catch (error: any) {
                if (env["DEBUG"]) {
                    console.error(error);
                }
            }
        });

        return [...commands];
    },
};

export default group;