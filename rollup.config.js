import path from "path"
import ts from "rollup-plugin-typescript2"
import {dts} from "rollup-plugin-dts";
export default [
    {
        input: "./src/cron/index.ts",
        output: [
            {
                file: path.resolve(__dirname, './dist/index.esm.js'),
                format:"es",
                banner: '#!/usr/bin/env node',
            },
            {
                file: path.resolve(__dirname, './dist/index.cjs.js'),
                format:"cjs",
                banner: '#!/usr/bin/env node',
            },
            {
                file: path.resolve(__dirname, './dist/index.js'),
                format:"umd",
                name: "tracker",
                banner: '#!/usr/bin/env node',
            }
        ],
        plugins:[
            ts(),
        ]
    },
    {
        input: "./src/cron/index.ts",
        output: {
            file: path.resolve(__dirname, './dist/index.d.js'),
            format:"es",
            banner: '#!/usr/bin/env node',
        },
        plugins: [
            dts(),
        ]
    }
]