import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protected routes require Clerk auth.
// /demo is intentionally open for unauthenticated demo viewing.
// /dashboard requires auth so real customer data stays scoped.
const isProtectedRoute = createRouteMatcher([
  '/setup(.*)',
  '/onboard(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
