#!/usr/bin/env node
import { Command } from "commander";
//引入遍历包函数
import { getDependencies } from "./readDep"
import process from "process";
const program = new Command();

program
    .name("npm-cli")
    .description('NPM CLI to some JavaScript string utilities')
    .option('-v, --version', 'output the version number')
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
        //判断输入的是层数还是json地址
        if(data.depth){
            //传入要遍历的层数和当前cli的路径，这样就可以保证包下载到任何位置，但分析的起点始终在根package.json
            const dependenciesList= getDependencies(data.depth,process.cwd())
            console.log(dependenciesList);
        }else if(data.depth<=0){
            console.log("Please input a Integer");
        }
        //jsonFile
        if(data.json){
            //输出为json
            console.log("json", data.json)
        }
        // console.log("options", options)
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