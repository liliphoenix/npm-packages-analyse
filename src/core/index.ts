#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import express from 'express';
import { getFullDepTree } from './readDep/printDependencyGraph';
import fs from 'fs';
const colors = require('colors');
const opn = require('opn');
const program = new Command();
//定义生成的循环树
let dependenciesTree: dependenciesType;
program
	.name('npm-cli')
	.description(
		colors.bold.blue('🚀🚀🚀 NPM CLI to some JavaScript string utilities')
	)
	.option('-n, --name', 'output the package name')
	.option('-a, --analyze', 'display the dependencies tree in cmd')
	.option('-v, --version', 'output the package version')
	.action(() => {
		if (program.getOptionValue('analyze')) {
			console.log(JSON.stringify(getFullDepTree(process.cwd()), null, 2));
			analyzeDependencies({ depth: Infinity, json: null });
		}
		if (program.getOptionValue('name')) {
			console.log(
				'✨ package name is: ' +
					colors.blue.bold(
						`${require(path.join(process.cwd(), './package')).name}`
					)
			);
		}
		if (program.getOptionValue('version')) {
			console.log(
				'✨ package version is: ' +
					colors.blue.bold(
						`${require(path.join(process.cwd(), './package')).version}`
					)
			);
		}
	});
program.on('--help', function () {
	console.log(` `);
	console.log(colors.bold.blue('Examples:'));
	console.log(
		`  analyze -d, --depth = <depth>  Specify the depth and open in browser`
	);
	console.log(
		`  analyze --json = <filepath>  Specify the path and output a json file`
	);
	console.log(` `);
});
// 指令
program
	.command('name')
	.description('display the package name')
	.action((str, options) => {
		console.log(
			'✨ package name is: ' +
				colors.blue.bold(
					`${require(path.join(process.cwd(), './package')).name}`
				)
		);
	});
program
	.command('version')
	.description('display the package version')
	.action((str, options) => {
		console.log(
			'✨ package version is: ' +
				colors.blue.bold(
					`${require(path.join(process.cwd(), './package')).version}`
				)
		);
	});
program
	.command('analyze')
	.description('display the package dependenciesTree')
	.option('-d, --depth <numbers>', 'Specify the depth')
	.option('-s, --json <filePath>', 'file Path')
	.action((data, options) => {
		analyzeDependencies(data);
	});
// analyze 解析函數
const analyzeDependencies = (data: {
	depth: number | undefined;
	json: string | null;
}) => {
	console.log(colors.bold.blue('⭐️⭐️ 即将进行npm性能分析... ⭐️⭐️'));
	// 限制层数的话就传入限制的层数
	if (data.depth) {
		dependenciesTree = getFullDepTree(process.cwd(), data.depth);
	} else {
		dependenciesTree = getFullDepTree(process.cwd());
	}
	if (!data.json) {
		// active vue project
		const app = express();
		const vuePath: string = '../packages/npm-packages-ui/dist';
		const port = process.env.PORT || 3000;
		const vueDistPath = path.join(__dirname, vuePath);
		// 设置静态资源路径
		app.use(express.static(vueDistPath));
		app.get('/getNpmAnalyzeRes', (req, res) => {
			const data = { analyseRes: dependenciesTree };
			res.json(data); // 返回 JSON 数据
		});

		app.listen(port || 3000, () => {
			const url = 'http://localhost:' + port;
			console.log(colors.green(`✨ Server is running ${colors.bold(url)}`));
			opn(url);
		});
	} else {
		let jsonFilePath = path.join(process.cwd(), data.json);
		//相对路径
		const relativeReg = new RegExp('^[^/]+(?:/[^/]+)*.json$');
		//绝对路径
		// 如果是绝对路径就不在拼接地址
		if (data.json.split(':')[0].length == 1) {
			jsonFilePath = data.json;
		}
		//判断地址是否按照格式来写
		if (relativeReg.test(jsonFilePath)) {
			let pathDir: fs.PathLike;
			const judgeExist = (pathDir: string) => {
				if(pathDir.split(':')[0].length == 1){
					if (!fs.existsSync(pathDir)) {
						fs.mkdir(pathDir, () => {});
					}
					writeToFile()
				}else{
					if (!fs.existsSync(path.join(__dirname,pathDir))){
						fs.mkdir(pathDir, () => {});
					}
					writeToFile()
				}
			};
			const writeToFile=()=>{
				fs.writeFile(
					jsonFilePath,
					JSON.stringify(dependenciesTree, null, 2),
					(err) => {
						if (err) {
						}
						console.log(colors.bold.green(' 🎉 🎉 🎉 成功写入json文件 🎉 🎉 🎉'));
						console.log(
							colors.green(`🎊 保存路径为: ${colors.bold(jsonFilePath)}`)
						);
					}
				);
			}
			if (jsonFilePath.includes('/')) {
				let json = jsonFilePath.split('/');
				json.pop();
				pathDir = json.join('/');
				judgeExist(pathDir);
			} else if (jsonFilePath.includes('\\')) {
				let json = jsonFilePath.split('\\');
				json.pop();
				pathDir = json.join('\\');
				judgeExist(pathDir);
			}

			

			// fs.exists((err)=>{

			// })
		} else {
			console.log(
				colors.bold.red('❎ Wrong file path,your file path should be like:')
			);
			console.log(
				colors.yellow(
					'✨ Absolute path:' +
						colors.bold('D:/dist/dependenciesTree.json') +
						' or ' +
						colors.bold('D:\\dist\\dependenciesTree.json')
				)
			);
			console.log(
				colors.yellow(
					'✨ Relative path:' + colors.bold('/dist/dependenciesTree.json')
				)
			);
		}
	}
};
program.parse(process.argv);
