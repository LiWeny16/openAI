import { defineConfig } from 'vite'
import { resolve } from "path"

export default defineConfig({
    build: {
        outDir: "docs", // 输出名称
        assetsDir: "static" // 静态资源目录
    },
    resolve: {
        // ↓路径别名，主要是这部分
        alias: {
            "@Image": resolve(__dirname, "./assets")
        }
    }
})