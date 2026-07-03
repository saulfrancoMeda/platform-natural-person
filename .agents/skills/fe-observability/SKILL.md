---
name: fe-observability
description: >
  MEDA standard for frontend observability — product analytics (GA4/GTM funnels without PII) AND
  real-time error/health monitoring (knowing when an API is failing or users can't log in). Use when
  adding tracking, setting up analytics events, instrumenting errors, or deciding how to detect
  outages. Triggers on analytics, GA4, GTM, tracking, funnel, conversion, monitoring, error tracking,
  Sentry, observability, outage, alert / "analítica", "monitoreo", "embudo", "conversión", "caída",
  "error", "alerta".
---
# Observability (analytics + monitoring)

Three different layers — don't confuse them. Each answers a different question.

## Layer 1 — Product analytics (GA4 / GTM)
Answers: how do users move through the product? (funnel, conversion, drop-off).
- Use GA4 via GTM for behavioral events: `step_viewed`, `step_completed`, `form_submitted`.
- **NEVER send PII** (name, email, CURP, account number, phone) as event params. Use anonymized IDs.
- Good event: `{ event: "onboarding_step", step: 3, status: "completed" }`.
- Bad event: `{ event: "submit", email: "user@x.com", curp: "..." }` ← PII leak, regulatory risk.
- Analytics is **delayed and sampled** — it is NOT for detecting outages. Don't rely on a GA4 drop to
  learn an API is down; you'd find out late and imprecisely.
- Centralize tracking in a `lib/analytics.ts` wrapper (one `track(event, params)` fn) so events are
  consistent and PII filtering happens in one place. Don't scatter `dataLayer.push` across components.

## Layer 2 — Real-time error & failure monitoring
Answers: is an API failing RIGHT NOW? are users unable to log in?
- This is NOT GTM. Use an error-tracking tool (e.g. Sentry) that captures JS errors, failed fetches,
  and `status:"ERROR"` responses in real time, with alerting.
- Instrument the API client: when a call returns `status:"ERROR"` or throws, report it (with a trace
  id, endpoint, and error code — NOT the user's PII or the payload).
- Track key flows explicitly: login failures, KYC step failures, payment submission errors. A spike
  should page someone.
- Capture Core Web Vitals + error rate; alert on thresholds (e.g. error rate > X% over 5 min).

## Layer 3 — Health checks (availability)
Answers: is the service alive? (used by Kubernetes liveness/readiness to restart pods).
- `/health` returns `{ status: "ok" }` (+ maybe version). **Never expose env vars, URLs, or keys**
  (see fe-security). This is the one that's legitimately an endpoint.

## Choosing for "an API is failing / users can't enter"
- Real-time detection + alert → Layer 2 (error monitoring). THIS is what you want for outages.
- "How many reached step 3" → Layer 1 (GA4).
- "Should K8s restart the pod" → Layer 3 (/health).

## Rules
- One analytics wrapper (`lib/analytics.ts`); PII filtering in one place.
- No PII in any analytics event or error report — fintech regulatory requirement.
- Don't use GA4/GTM as an outage detector; use real-time error monitoring with alerts.
- Report errors with trace id + endpoint + code, never payload/PII.

## Visualizing metrics
For dashboards and metric visualization in the UI, use the MEDA charts (Recharts wrappers) —
see fe-meda-ui. AreaTrendChart for trends, BarVolumeChart for volume, LineMetricChart for rates.
