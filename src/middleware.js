import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define which routes need login
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/joblistings', // Main page protected
  '/library(.*)',
  '/resumebuilder(.*)',
  '/premium(.*)',
  '/post-job(.*)',
  '/recruiter(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If the user isn't logged in and tries to access a protected route
  if (!userId && isProtectedRoute(req)) {
    // Redirect to home page instead of Clerk login
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
