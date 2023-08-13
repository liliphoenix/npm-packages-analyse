import path from 'path';
let rootPath: string;
// 递归获取依赖关系树的函数
function getDepTree(
    packageName: string,
    pkgPath: string,
    depth = 1,
    stack: Array<string> = []
) {
    // 检查是否存在循环依赖
    if (stack.includes(packageName)) {
        return {
            name: packageName,
            version: null,
            circular: true,
        };
    }

    // 将当前包名加入堆栈，以检查循环依赖
    stack.push(packageName);

    // 加载当前包的 package.json 文件
    const pkgJson = require(pkgPath);
    const deps = pkgJson.dependencies || {};

    // 创建包信息对象
    let packageInfo: dependenciesType;
    packageInfo = {
        name: packageName,
        version: pkgJson.version || null,
        circular: false,
        dependencies: [],
    };
    // 如果深度大于0，继续递归遍历依赖关系
    if (depth > 0) {
        for (const [depName] of Object.entries(deps)) {
            // 获取直接依赖包的路径和 package.json 路径
            const depPkgDir = path.join(rootPath, 'node_modules', depName);
            const depPkgJsonPath = path.join(depPkgDir, 'package.json');

            // 递归获取直接依赖包的依赖关系树
            const depPkgTree: dependenciesType = getDepTree(
                depName,
                depPkgJsonPath,
                depth - 1,
                [...stack]
            );
            // @ts-ignore
            packageInfo.dependencies.push(depPkgTree);
        }
    }

    return packageInfo;
}

// 根据项目根目录下的 package.json 获取完整的依赖关系树
export function getFullDepTree(pkgJsonPath: string, depth = Infinity) {
    rootPath = pkgJsonPath;
    const rootPkgJsonPath = path.join(pkgJsonPath, 'package.json');
    const rootName = require(rootPkgJsonPath).name;
    return getDepTree(rootName, rootPkgJsonPath, depth);
}
