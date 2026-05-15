# 日常修图关键词完善器

Next.js App Router + TypeScript + Tailwind CSS MVP for converting rough daily photo editing ideas into structured prompts.

## Run

```bash
npm install
npm run dev
```

## GitHub Pages

This project is configured as a static Next.js export for GitHub Pages.
Pushing to `main` runs `.github/workflows/pages.yml` and publishes the `out/`
folder automatically.

```bash
npm run build
```

The published URL is:

```text
https://gejibai.github.io/PhotoEditingKeywords/
```

This static version uses offline rules only and does not include a backend API.
