---
name: fe-error-handling
description: >
  MEDA frontend standard: error boundaries, API error handling, toasts, fallbacks, and frontend
  logging. Use whenever handling failures or building error UI. Triggers on error handling, error
  boundary, toast, fallback, catch, error state / "manejo de errores", "error boundary", "toast".
---
# Error Handling

## Layers
- **Route error boundaries**: `error.tsx` per segment catches render errors with a recovery action.
- **API errors**: the client throws `MedaApiError` (from status:"ERROR"); hooks surface it; UI shows
  a friendly message (toast or inline), mapping `errorCode` to a readable text when useful.
- **Empty/loading**: always handle alongside error (see `fe-data-fetching`).

## UX
- User-facing messages are friendly and actionable; never dump raw stack traces or codes to users.
- Toasts for transient errors; inline messages for form/field errors; full-page fallback for fatal.

## Logging
- Log frontend errors to the observability pipeline (no PII in logs — same rule as backend).
- Capture enough context (route, action) to debug, without sensitive data.

## Rules
- Never swallow errors silently; never leave a promise rejection unhandled.
- Every data fetch and mutation handles its error path.
- Don't show technical error codes to end users (map them).
