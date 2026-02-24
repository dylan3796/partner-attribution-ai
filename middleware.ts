import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only protect setup — dashboard is intentionally open for demo viewing
// (unauthenticated users see the demo org; authenticated users see their own org)
const isProtectedRoute = createRouteMatcher([
  '/setup(.*)',
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
