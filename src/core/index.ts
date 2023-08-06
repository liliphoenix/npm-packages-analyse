#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import express from "express";
// import opn from "opn";

const opn = require("opn")
const program = new Command();

program
    .name("npm-cli")
    .description('NPM CLI to some JavaScript string utilities')
    .option('-v, --version', 'output the version number')
    .option('-n, --name', 'output the version number')
    .option('-a, --analyze', 'output the version number')
    .version(`${require('../package').version}`)
    .usage('<command> [options]')

// 指令
program.command('name')
    .action((str, options) => {
        console.log(`${require('../package').name}`)
    });
program.command('version')
    .action((str, options) => {
    console.log(`${require('../package').version}`)
});
program
    .command('analyze')
    .option('-d, --depth <numbers>', 'Specify the depth')
    .option('-s, --json <fileName>', 'file name')
    .action((data, options) => {
        console.log("即将进行npm性能分析")
        // console.log("depth", data.depth)
        // console.log("json", data.json)
        // console.log("options", options)

        if (!data.json){
            // active vue project
            const app = express();
            const vuePath:string = "../packages/npm-packages-ui/dist"
            const port = process.env.PORT || 3000
            const vueDistPath = path.join(__dirname, vuePath);
            // 设置静态资源路径
            app.use(express.static(vueDistPath));

            app.listen(port || 3000, () => {
                const url = "http://localhost:" + port
                console.log(`Server is running ${url}`);
                opn(url)
            });
        }
    });

// 命令后面直接跟参数即可
// program
//     .command('npm-cli <depth> <json>')
//     .description('NPM CLI to some JavaScript string utilities')
//     .action((depth, jsonFileName) => {
//         console.log("即将进行npm性能分析")
//         console.log("depth", depth)
//         console.log("jsonFileName", jsonFileName)
//     })
//     .option('-v, --version', 'output the version number')
//     // .option('-n, --depth <numbers...>', 'specify numbers')
//     // .option('-j, --json <fileName...>', 'specify numbers')
//
//     .version(`${require('../package').version}`)
//     .usage('<command> [options]')
//

program.parse(process.argv)