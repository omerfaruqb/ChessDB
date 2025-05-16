import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/shared/middleware/auth.middleware';

// Add paths that should be public (no auth required)
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  // @TODO: Add more public paths
];

// Add paths that require specific roles
const ROLE_PROTECTED_PATHS = {
  '/api/tournaments/create': ['ARBITER'],
  '/api/tournaments/manage': ['ARBITER'],
  '/api/coaching': ['COACH'],
  // @TODO: Add more role-protected paths as needed
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  const auth = verifyAuth(request);
  
  if (!auth.isAuthenticated) {
    // For API routes, return JSON response
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access
  const requiredRoles = Object.entries(ROLE_PROTECTED_PATHS)
    .find(([path]) => pathname.startsWith(path))?.[1];

  if (requiredRoles && !requiredRoles.includes() {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    // For page routes, redirect to home or show forbidden
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 