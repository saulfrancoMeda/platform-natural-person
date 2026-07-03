# MEDA Frontend Skills — on-demand knowledge

This repo has MEDA frontend skills in `.claude/skills/`. The developer writes naturally (EN/ES) and
the agent applies MEDA frontend standards (Next.js 16 App Router, TypeScript, Tailwind, pnpm). The
agent replies in the developer's language.

Entry point: **meda-fe-dev** (auto-activates or `/meda-fe-dev`). Commands:
- `/meda-fe-new` — scaffold a new app (reads MEDA-FE-SETUP.md if present).
- `/meda-fe-init` — unify an existing repo.
- `/meda-fe-component` — build a component.
- `/meda-fe-endpoint` — integrate a Java API endpoint (types + client + hook).
- `/meda-fe-review` — review frontend code.
- `/meda-fe-test` — generate tests.

State rule: Zustand default; Redux Toolkit for complex global state. Data: TanStack + RSC recommended.
Load few skills (1-4); no subagents for what fits in the thread.
