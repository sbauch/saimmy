# AGENTS.md — saimmy repo rules

## ⚠️ Dev Server Rules

- **Never run `pnpm build` or `next build`** — it kills the running dev server
- Don't start or restart `pnpm dev` — that's the human's job
- To verify changes compile: use `tsc --noEmit` from `packages/web/` if needed
- Make file edits directly; the dev server hot-reloads automatically
