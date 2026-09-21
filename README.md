# 折尺 · 常用工具箱

一个轻量、私密、纯浏览器运行的常用工具网站。

## 已包含工具

- JSON 格式化 / 压缩 / 校验
- Base64 编解码（支持 Unicode）
- URL Encode / Decode
- UUID v4 批量生成
- Unix 时间戳转换
- SHA-1 / SHA-256 / SHA-384 / SHA-512
- JWT Header / Payload 解析
- 文本统计与常见转换

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 自动部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。首次使用时，请在仓库的 **Settings → Pages → Build and deployment** 中将 Source 设置为 **GitHub Actions**。

技术栈：React 19、TypeScript、Vite 8、React Router、Tailwind CSS 4、Lucide Icons。所有工具计算均在浏览器本地完成。
