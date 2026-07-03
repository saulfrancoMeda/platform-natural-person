---
name: fe-security
description: >
  MEDA's complete frontend security standard for fintech — app security (XSS, tokens, secrets, CSP),
  dependency supply-chain (exact versions / no caret, lockfile, audit), and DevOps/deployment security
  (no plaintext secrets in Docker/k8s/CI, NEXT_PUBLIC_ misuse, package-manager consistency, safe
  /health). UNIVERSAL — use whenever handling tokens, user input, dependencies, or deploy config.
  Triggers on security, xss, token, secret, sanitize, csp, dependency, caret, package, npm audit,
  supply chain, lockfile, Docker, Kubernetes, k8s, deployment, CI/CD, pipeline, env var / "seguridad",
  "xss", "token", "secreto", "dependencia", "caret", "vulnerabilidad", "despliegue", "contenedor".
---
# Frontend Security (fintech) — app, dependencies, deployment

> Technical guidance, not legal compliance advice; validate regulatory aspects with compliance.

## A. Application security
### Secrets & tokens
- NO secrets/API keys in client code or `NEXT_PUBLIC_*` (those ship to the browser). Server-only
  secrets stay in server env, used in Server Components/Route Handlers.
- Tokens: prefer httpOnly cookies; avoid localStorage for sensitive tokens (XSS can read it).
  Never log tokens or PII (same red line as backend).
### XSS
- Avoid `dangerouslySetInnerHTML`; if unavoidable, sanitize (DOMPurify), never with untrusted data.
- React escapes by default — don't bypass it. Validate/encode anything reflected from URL/params.
### Input & data
- Validate and sanitize user input (Zod on forms); the backend re-validates regardless.
- Don't trust data from URL, localStorage, or third parties without validation.
### Headers / CSP
- Set a Content-Security-Policy to limit script sources. Use `rel="noopener noreferrer"` on external
  `target="_blank"` links.

## B. Dependency supply-chain security
> A compromised dependency version can exfiltrate secrets or inject malware into the bundle
> (event-stream, node-ipc, ua-parser-js precedents). Top fintech risk.
- **Pin EXACT versions** (no `^`/`~`) for prod deps. `^1.2.3` lets a fresh install pull any 1.x.x — a
  future bad patch ships silently. Use `pnpm add -E`.
  - ✗ `"react": "^19.2.4"`  ✓ `"react": "19.2.4"`
- **Commit the lockfile** (`pnpm-lock.yaml`); review its diffs (a surprise transitive bump is a signal).
- **Audit**: `pnpm audit` in CI; block on high/critical. Update deliberately in reviewed PRs, never
  via automatic caret ranges or auto-merged bumps.
- **Vet new packages**: downloads, last publish, maintainers, CVEs, is it really needed.
- pnpm blocks install scripts by default — approve only vetted ones via `onlyBuiltDependencies`.
- Pin the package manager: `"packageManager": "pnpm@x.y.z"`.

## C. DevOps / deployment security
> Deploy configs leak secrets most — plain text, in git history, in image layers forever.
- **NEVER hardcode secrets** in k8s `Deployment` env `value:` (use `secretKeyRef`), Dockerfile
  `ENV`/`ARG` (pass at runtime), or CI YAML (use the platform secret store). If ever committed in
  plain text → treat as COMPROMISED, rotate it.
- **NEXT_PUBLIC_ bakes into the client bundle** — fine for public config, P0 for secrets. A
  `NEXT_PUBLIC_*_TOKEN`/`_KEY` is visible in DevTools. Maps-type keys: restrict by referrer/IP + rate
  limit; real secrets: move server-side, drop the prefix.
- **Don't echo env vars in build logs** (`RUN echo "$API_KEY"` leaks into CI logs).
- **Package-manager consistency (repo vs deploy)** — if the repo uses pnpm but the Dockerfile/CI uses
  `npm`/`yarn install`, FLAG it with impact (different resolver → tree differs from what was tested;
  the lockfile is ignored). State the goal (deploy installs with the SAME PM + lockfile as the team),
  but the decision depends on infra and the dev — surface and explain, don't auto-rewrite.
- **/health** returns `{ status: "ok" }` only — never env vars, URLs, or partial keys.
- Image hygiene: pin base image, multi-stage build, non-root, resource limits.

## Rules (all reviewed in assess / meda-fe-review)
- No PII in frontend logs; no secrets in the bundle; no unsanitized HTML.
- Auth boundary is the server, never the client alone (see `fe-auth`).
- Exact versions + committed lockfile; flag caret ranges.
- Plaintext secret in Docker/k8s/CI → P0 + rotate. NEXT_PUBLIC_ on a secret → P0.
- Package-manager mismatch repo↔deploy → flag + explain, don't auto-change.
