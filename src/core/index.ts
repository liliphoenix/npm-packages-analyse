#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import express from 'express';
// import opn from "opn";
import colors from 'colors';
const opn = require('opn');
import { getFullDepTree } from './readDep/printDependencyGraph';
import fs from 'fs';
import os from 'os';
const program = new Command();
import portfinder from "portfinder";
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
			// console.log(JSON.stringify(getFullDepTree(process.cwd()), null, 2));
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
		`  analyze -a, --json = <filepath>  Specify the path and output a json file`
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
	console.log(colors.bold.blue('......'));
	console.log(colors.bold.blue('......'));
	// 限制层数的话就传入限制的层数
	if (data.depth) {
		dependenciesTree = getFullDepTree(process.cwd(), data.depth);
	} else {
		dependenciesTree = getFullDepTree(process.cwd());
	}
	if (!data.json) {
		// active vue project
		const app = express();
		const vuePath: string = '../../packages/npm-packages-ui/dist';
		const port = process.env.PORT || 3000;
		const vueDistPath = path.join(__dirname, vuePath);
		// 设置静态资源路径
		app.use(express.static(vueDistPath));
		app.get('/getNpmAnalyzeRes', (req, res) => {
			const data = { analyzeRes: dependenciesTree };
			res.json(data); // 返回 JSON 数据
		});

		const host = "localhost"
		portfinder.setBasePort(3000);
		portfinder.getPort((_: Error, port: number) => {
			app.listen(port, () => {
				const url = 'http://'+`${host}`+':' + port;
				console.log(colors.green(`✨ Server is running ${colors.bold(url)}`));
				opn(url);
			});
		});
	} else {
		const writeMacFile = (macPath:string)=>{
			fs.writeFile(
				macPath,
				JSON.stringify(dependenciesTree, null, 2),
				(err) => {
					if (err) {
					}
					console.log(
						colors.bold.green(' 🎉 🎉 🎉 成功写入json文件 🎉 🎉 🎉')
					);
					console.log(
						colors.green(`🎊 保存路径为: ${colors.bold(macPath)}`)
					);
				}
			);
		}
		//操作系统是linux和Mac的情况下
		if (os.type() == 'Darwin' || os.type() == 'Linux') {
			const macReg=new RegExp('/^/([a-zA-Z0-9_-]+/?)+$/')
			// relativeReg.test(jsonFilePath);
			let macPath: string = '';
			console.log(macPath);
			
			if (
				data.json.split('/')[0] == '.' ||
				data.json.split('/')[0] == '..'
			) {
				//说明是相对路径
				if (data.json.includes('.json')) {
					macPath = path.join(process.cwd(), data.json);
				} else {
					macPath = path.join(
						process.cwd(),
						data.json,
						'dependenciesTree.json'
					);
				}
				let json = macPath.split('/');
				json.pop();
				let macDir = json.join('/');
				if (!fs.existsSync(macDir)) {
					fs.mkdir(macDir, () => {});
				}
				writeMacFile(macPath)
			} else if(data.json.substring(0,1)=='/'){
				//说明是绝对路径
				if (data.json.includes('.json')) {
					macPath = path.join(data.json);
				} else {
					macPath = path.join(data.json, 'dependenciesTree.json');
				}
				let json = macPath.split('/');
				json.pop();
				let macDir = json.join('/');
				if (!fs.existsSync(macDir)) {
					fs.mkdir(macDir, () => {});
				}
				writeMacFile(macPath)
			}else{
				console.log(
					colors.bold.red('❎ Wrong file path,your file path should be like:')
				);
				console.log(
					colors.yellow(
						'✨ Absolute path:' +
							colors.bold('/root/dependenciesTree.json')
					)
				);
				console.log(
					colors.yellow(
						'✨ Relative path:' + colors.bold('./dist/dependenciesTree.json ') + 'or' + colors.bold(' ../dist/dependenciesTree.json')
					)
				);
				console.log(
					colors.yellow(
						colors.bold(
							'Of course, you can also choose not to specify a file name, and we will assign a default file name called "dependenciesTree.json".'
						)
					)
				);
			}
			
		} else {
			//操作系统是win的情况下
			//相对路径
		const relativeReg = new RegExp('^[^/]+(?:/[^/]+)*.json$');
		//绝对路径
		// 如果是绝对路径就不在拼接地址
		let jsonFilePath: string = '';
		if (data.json.split(':')[0].length == 1) {
			if (fs.existsSync(data.json.split(':')[0] + ':\\')) {
				jsonFilePath = data.json;
				if (data.json.includes('.json')) {
					jsonFilePath = path.join(data.json);
				} else {
					jsonFilePath = path.join(data.json, 'dependenciesTree.json');
				}
			} else {
			}
		} else {
			if (data.json.includes('.json')) {
				jsonFilePath = path.join(process.cwd(), data.json);
			} else {
				jsonFilePath = path.join(
					process.cwd(),
					data.json,
					'dependenciesTree.json'
				);
			}
		}
			if (relativeReg.test(jsonFilePath)) {
				console.log();
				let pathDir: fs.PathLike;
				const judgeExist = (pathDir: string) => {
					if (pathDir.split(':')[0].length == 1) {
						if (!fs.existsSync(pathDir)) {
							fs.mkdir(pathDir, () => {});
						}
						writeToFile();
					} else {
						if (!fs.existsSync(path.join(__dirname, pathDir))) {
							fs.mkdir(pathDir, () => {});
						}
						writeToFile();
					}
				};
				const writeToFile = () => {
					fs.writeFile(
						jsonFilePath,
						JSON.stringify(dependenciesTree, null, 2),
						(err) => {
							if (err) {
							}
							console.log(
								colors.bold.green(' 🎉 🎉 🎉 成功写入json文件 🎉 🎉 🎉')
							);
							console.log(
								colors.green(`🎊 保存路径为: ${colors.bold(jsonFilePath)}`)
							);
						}
					);
				};
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
				console.log(
					colors.yellow(
						colors.bold(
							'Of course, you can also choose not to specify a file name, and we will assign a default file name called "dependenciesTree.json".'
						)
					)
				);
			}
		}
	}
};
program.parse(process.argv);
