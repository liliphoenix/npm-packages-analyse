import express from "express";
import path from 'path'
import { fileURLToPath } from 'url'
import openBrowser from "./src/utils/openBrowser.js";
const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)
const app = express();
const port = process.env.PORT || 3000;

// 静态资源路径
app.use(express.static(path.join(__dirnameNew, 'dist')));

// 处理所有页面请求返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirnameNew, 'dist', 'index.html'));
});

// 启动服务器
const localHost =  "http://localhost:"
app.listen(port, () => {
    const url = localHost + port
    console.log(`Server is running ${url}`);
    openBrowser(url)
});