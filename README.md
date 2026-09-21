# 禄若阳的工具站

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
- 正则表达式实时测试
- 二、八、十、十六进制转换
- HEX / RGB / HSL 颜色转换
- 安全随机密码生成
- HTML 实体编解码
- URL 结构与查询参数解析
- 文本 Diff
- JSON 转 TypeScript 类型
- XML 格式化与压缩
- CSV / JSON 相互转换
- SQL 格式化与压缩
- Cron 表达式解析
- Markdown 安全预览
- Unix chmod 权限计算
- 列表排序、去重与清理
- CSS 单位转换

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
