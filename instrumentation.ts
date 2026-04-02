/**
 * Next.js Instrumentation — Error Monitoring Bootstrap
 *
 * This file is auto-loaded by Next.js on startup (both server and edge).
 * When Sentry is configured (SENTRY_DSN env var), it initializes error
 * tracking. Without the env var, this is a no-op.
 *
 * To enable:
 *   1. npm install @sentry/nextjs
 *   2. Set SENTRY_DSN in your environment
 *   3. Optionally set SENTRY_ENVIRONMENT (defaults to NODE_ENV)
 *
 * See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

export async function register() {
  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
        // Capture unhandled promise rejections
        integrations: [],
        // Don't send PII
        sendDefaultPii: false,
      });
      console.log("[sentry] Initialized error monitoring");
    } catch {
      // @sentry/nextjs not installed — skip silently
      console.log("[sentry] @sentry/nextjs not installed, skipping error monitoring");
    }
  }
}
