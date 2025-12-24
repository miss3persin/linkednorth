import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes need a login
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/joblistings(.*)', '/library(.*)', '/resumebuilder(.*)', '/premium(.*)',])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If the user isn't logged in and tries to access a protected route
  // Clerk will handle the redirect to your Sign In page automatically
  if (!userId && isProtectedRoute(req)) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};