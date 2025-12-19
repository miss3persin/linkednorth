import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/joblistings(.*)',
  '/jobs(.*)',
  '/library(.*)',
  '/resumebuilder(.*)',
  '/premium(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth() // Ensure auth is awaited

  // 1. If the user is logged in, do nothing (allow access)
  if (userId) {
    return NextResponse.next()
  }

  // 2. If the user is NOT logged in and trying to access a protected route
  if (!userId && isProtectedRoute(req)) {
    const homeUrl = new URL('/', req.url)
    homeUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(homeUrl)
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}