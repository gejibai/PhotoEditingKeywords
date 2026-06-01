# 日常修图关键词完善器

一个纯静态的 Next.js App Router + TypeScript + Tailwind CSS 小工具，用来把粗略的日常修图想法整理成可复制的结构化提示词。

## 当前方向

- 只使用浏览器端离线规则。
- 可选接入 DeepSeek 安全代理，由服务端保存 API Key。
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

## DeepSeek 接入

前端是静态站点，不能直接保存 `DEEPSEEK_API_KEY`。如需启用页面里的「DeepSeek AI 拆解」，请部署一个后端代理或云函数，然后在构建时配置：

```bash
NEXT_PUBLIC_DEEPSEEK_PROXY_URL=https://your-domain.example.com/deepseek
```

代理接口接收前端传来的 `rawIdea/currentForm/categories/fields`，返回：

```json
{
  "category": "note",
  "patch": {
    "photoType": "餐桌/咖啡/甜品照片",
    "edit": "..."
  }
}
```

示例代理在 `examples/deepseek-proxy/server.js`，需要设置：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek Key
DEEPSEEK_MODEL=deepseek-v4-flash
ALLOW_ORIGIN=https://gejibai.github.io
```

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 会自动构建并发布 `out/` 目录。

发布地址：

```text
https://gejibai.github.io/PhotoEditingKeywords/
```
