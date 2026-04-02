import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/portal(.*)',
  '/onboard(.*)',
  '/admin(.*)',
]);

// API routes that are public (webhooks, health checks)
const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks(.*)',
  '/api/stripe/webhook(.*)',
  '/api/stripe/billing-webhook(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard, portal, and admin routes
  if (isProtectedRoute(req) && !isPublicApiRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
