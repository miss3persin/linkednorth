import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

const protectedRoutes = [
  '/dashboard',
  '/joblistings',
  '/library',
  '/resumebuilder',
  '/premium',
  '/post-job',
  '/recruiter',
];

const isJobDetailRoute = (pathname = '') => /^\/joblistings\/[^/]+\/?$/.test(pathname);

const isProtectedRoute = (pathname = '') => {
  if (isJobDetailRoute(pathname)) {
    return false;
  }
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};

const extractAccessToken = (req) => {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const tokenCookie = req.cookies.get('sb-access-token');
  if (tokenCookie?.value) {
    return tokenCookie.value;
  }

  return null;
};

const isAuthenticated = async (req) => {
  const token = extractAccessToken(req);
  if (!token) return false;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    console.error('Unauthorized middleware access:', error?.message ?? 'no user');
    return false;
  }

  return true;
};

export default async function middleware(req) {
  if (!isProtectedRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authorized = await isAuthenticated(req);
  if (!authorized) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!api|trpc|.*\\..*|_next).*)'],
};
