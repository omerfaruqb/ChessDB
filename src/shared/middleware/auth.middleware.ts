import { NextRequest, NextResponse } from 'next/server';
import { UserType } from '@/domains/user/types';

export interface AuthResult {
  isAuthenticated: boolean;
  user?: {
    username: string;
    userType: UserType;
  };
  error?: string;
}

export function verifyAuth(request: NextRequest): AuthResult {
  try {
    const authCookie = request.cookies.get('auth_session');

    if (!authCookie || !authCookie.value) {
      return {
        isAuthenticated: false,
        error: 'No authentication session found'
      };
    }

    try {
      const sessionData = JSON.parse(authCookie.value);
      const { username, userType } = sessionData;

      if (!username || !userType) {
        return {
          isAuthenticated: false,
          error: 'Invalid session data'
        };
      }

      // Validate userType is a valid enum value
      if (!Object.values(UserType).includes(userType)) {
        return {
          isAuthenticated: false,
          error: 'Invalid user type'
        };
      }

      return {
        isAuthenticated: true,
        user: {
          username,
          userType
        }
      };
    } catch (parseError) {
      return {
        isAuthenticated: false,
        error: 'Invalid session format'
      };
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      isAuthenticated: false,
      error: 'Authentication verification failed'
    };
  }
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