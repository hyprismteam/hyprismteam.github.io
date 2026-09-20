## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages

Set Settings → Pages → Source to **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and publishes `dist`.

Do not publish the repository root directly from a branch: it contains uncompiled TypeScript, while public assets only move to their final URLs during the Vite build.
