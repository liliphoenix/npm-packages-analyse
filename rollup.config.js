import path from 'path';
import ts from 'rollup-plugin-typescript2';
import { defineConfig } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
export default defineConfig([
	{
		//min.js 压缩后的输出
		input: './src/core/index.ts',
		output: [
			// 生成umd格式文件，可以再node/webpack中导入，也可以通过src(CDN)的方式导入，默认使用umd模块，
			// 至于为什么用这种格式，因为兼容性强的一！
			{
				file: path.resolve(__dirname, './dist/min/index-umd.min.js'),
				format: 'umd',
				name: 'npm-cli',
				banner: '#!/usr/bin/env node',
			},
			// 生成cjs文件只可以在nodejs环境中被使用
			{
				file: path.resolve(__dirname, './dist/min/index-cjs.min.js'),
				format: 'cjs',
				name: 'npm-cli',
				banner: '#!/usr/bin/env node',
			},
			//生成esm模块，可以直接在浏览器导入
			{
				file: path.resolve(__dirname, './dist/min/index-esm.min.js'),
				format: 'esm',
				name: 'npm-cli',
				banner: '#!/usr/bin/env node',
			},
		],
		//作用分別是：ts支持，node的path库等支持，cjs的引入和导出方式支持，json文件的导入支持,代码的压缩打包.
		plugins: [ts(), resolve(), commonjs(), json(), terser()],
	},
	{
		//普通文件输出
		input: './src/core/index.ts',
		output: [
			// 生成umd格式文件，可以再node/webpack中导入，也可以通过src(CDN)的方式导入，默认使用umd模块，
			// 至于为什么用这种格式，因为兼容性强的一！
			{
				file: path.resolve(__dirname, './dist/common/index-umd.js'),
				format: 'umd',
				name: 'npm-cli',
				banner: '#!/usr/bin/env node',
			},
			// 生成cjs文件只可以在nodejs环境中被使用
			{
				file: path.resolve(__dirname, './dist/common/index-cjs.js'),
				format: 'cjs',
				name: 'npm-cli',
				banner: '#!/usr/bin/env node',
			},
			//生成esm模块，可以直接在浏览器导入
			{
				file: path.resolve(__dirname, './dist/common/index-esm.js'),
				format: 'esm',
				name: 'npm-cli',
				banner: '#!/usr/bin/env node',
			},
		],
		//作用分別是：ts支持，node的path库等支持，cjs的引入和导出方式支持，json文件的导入支持,代码的压缩打包.
		plugins: [ts(), resolve(), commonjs(), json()],
	},
]);
