#!/usr/bin/env node
import path from "path";
let stopFlag:number
let rootPath:string
function firstLoop(rootPath:string) {
  const getJsonfilePath = path.join(rootPath, "package.json");
  let files = require(getJsonfilePath);
  let dep:Array<dependenciesType> = [];
  for (let key in files.dependencies) {
    dep = [...dep, { name: key, version: files.dependencies[key] }];
  }
  return dep;
}
function readDep(rootObj:Array<dependenciesType>, flag:number, root = rootPath) {
  let files;
  let depList = rootObj;
  if (stopFlag <= flag) {
    return depList;
  } else {
    depList = rootObj.map((item) => {
      const packagePath = path.join(
        root,
        "/node_modules",
        item.name,
        "./package.json"
      );
      files = require(packagePath);
      let depChildList = [];
      if (files.dependencies) {
        for (let key in files.dependencies) {
          let depChild = {
            name: key,
            version: files.dependencies[key],
          };
          depChildList.push(depChild);
          item.chidDepList = depChildList;
        }
        readDep(depChildList, flag + 1);
      }
      return item;
    });
  }
  return depList;
}
export const getDependencies = function (depth:number, root:string) {
  //深度
  stopFlag = depth;
  //根路径
  rootPath = root;
  const rootDep = firstLoop(root);
  let finalList = readDep(rootDep, 1, root);
  return finalList;
};
