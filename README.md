### 字节第六期青训营项目一 - 包的分析工具
#### 1. 需求
- 需要封装为 node 命令行工具；
- 支持 xx-cli analyze 命令，用于分析从当前目录 package.json 开始递归查找到的全量依赖关系(包名 & 版本号)，分析完成后自动打开网页，并渲染依赖关系图；
    - 注意处理好循环依赖问题，避免陷入死循环；
    - 支持 --depth=n 参数，限制向下递归分析的层次深度；
    - 支持 --json=[file-path] 参数，传入后不再打开网页，只是将依赖关系以 JSON 形式存储到用户指定的文件；
- 在打开页面中，除了渲染依赖关系图外，期望对依赖关系做出初步分析，例如：
    - 是否包含循环依赖；
    - 同一个 package 是否包含多个版本实例；
      分析页面的具体样式，由各组自行决定；的
#### 2. 技术栈
- 功能开发：
    - 依赖关系图：antv/x6、echarts、D3 等均可；
- 工程化：
    - 使用 TypeScript 开发；
    - 使用 vitest/jest 实现单元测试；
    - 接入 eslint、lint-staged 工具；
#### 3. 产出
- 源码，期望提交到 github；
- 发布到 npm 的 CLI 工具包；
- 项目说明文档
- 最迟2023-08-30结束

#### 步骤
```
  1. 使用build命令进行打包
  2. 使用link命令将一个本地的 npm 包链接到全局环境
  3. 即可测试命令
```

#### 注意
```
- package.json 中的name，要与bin中的key一致方可使用
```