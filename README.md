# 日常修图关键词完善器

一个纯静态的 Next.js App Router + TypeScript + Tailwind CSS 小工具，用来把粗略的日常修图想法整理成可复制的结构化提示词。

## 当前方向

- 只使用浏览器端离线规则。
- 不上传图片，不处理真实图片，也不生成图片。
- 支持字段自动补全、结果复制、TXT 导出和 localStorage 恢复。
- 默认是轻量直观的三步流程：选方向、写想法、复制结果；详细字段收进高级设置。
- 内置“涂鸦快照风”模板，可生成真实手机随拍、霓虹数字马克笔、密集涂鸦覆盖风格提示词。
- 通过 GitHub Pages 自动发布静态站点。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 会自动构建并发布 `out/` 目录。

发布地址：

```text
https://gejibai.github.io/PhotoEditingKeywords/
```
