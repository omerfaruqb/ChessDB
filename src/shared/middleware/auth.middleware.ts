  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';
  import jwt from 'jsonwebtoken';
  import { UserType } from '@/domains/user/types';

  const JWT_SECRET = process.env.JWT_SECRET || "secret";

  interface JwtPayload {
    username: string;
    userType: UserType;
  }

  export function verifyAuth(request: NextRequest) {
    // First try to get token from authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Check if we have a auth_session cookie as an alternative
    const sessionCookie = request.cookies.get('auth_session');
    
    console.log('Middleware checking auth - Token:', !!token, 'Cookie:', !!sessionCookie);
    
    // No auth methods available
    if (!token && !sessionCookie) {
      return {
        isAuthenticated: false,
        error: 'No authentication provided'
      };
    }

    // Try JWT token first if available
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return {
          isAuthenticated: true,
          user: decoded
        };
      } catch (error) {
        // If token verification fails, fall through to check cookie
        console.log('JWT verification failed, checking cookie instead');
      }
    }
    
    // If no valid token, try cookie
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        
        // Validate the session data has required fields
        if (sessionData && sessionData.username && sessionData.userType) {
          return {
            isAuthenticated: true,
            user: sessionData
          };
        }
      } catch (error) {
        console.error('Session cookie parsing error:', error);
      }
    }
    
    // All authentication methods failed
    return {
      isAuthenticated: false,
      error: 'Invalid authentication'
    };
  }

  export function requireAuth(handler: Function) {
    return async function(request: NextRequest) {
      const auth = verifyAuth(request);
      
      if (!auth.isAuthenticated) {
        return NextResponse.json(
          { error: auth.error },
          { status: 401 }
        );
      }
      
      return handler(request, auth.user);
    };
  }

  export function requireRole(allowedRoles: UserType[]) {
    return function(handler: Function) {
      return async function(request: NextRequest) {
        const auth = verifyAuth(request);
        
        if (!auth.isAuthenticated) {
          return NextResponse.json(
            { error: auth.error },
            { status: 401 }
          );
        }

        if (!allowedRoles.includes(auth.user!.userType)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
        
        return handler(request, auth.user);
      };
    };
  } 