#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import express from "express";
import {getFullDepTree} from "./readDep/printDependencyGraph";

const opn = require("opn")
const program = new Command();
program
    .name("npm-cli")
    .description('NPM CLI to some JavaScript string utilities')
    .version(`${require('../package').version}`)
    .option('-v, --version', 'output the version number')
    .option('-a, --analyze', 'output the package analyze result', ()=>{
        console.log("这里是默认的分析逻辑")
    })
    .option('-n, --name', 'output the tool name', () => {
        console.log(`${require('../package').name}`)
    })
    .usage('<command> [options]');

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
    .option('-s, --json <filePath>', 'File path')
    .action((data, options) => {
        console.log("即将进行npm性能分析")
        // @ts-ignore
        let dependenciesTree;
        if (data.depth) {
            dependenciesTree = getFullDepTree(process.cwd(), data.depth);
        } else {
            dependenciesTree = getFullDepTree(process.cwd());
        }
        if (!data.json){
            // active vue project
            const app = express();
            const vuePath:string = "../packages/npm-packages-ui/dist"
            const port = process.env.PORT || 3000
            const vueDistPath = path.join(__dirname, vuePath);
            // 设置静态资源路径
            app.use(express.static(vueDistPath));

            app.get("/getNpmAnalyzeRes", (req, res) => {
                // @ts-ignore
                const data = { analyzeRes: dependenciesTree };
                res.json(data); // 返回 JSON 数据
            });

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

program.parse(process.argv);
