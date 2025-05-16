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
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return {
        isAuthenticated: false,
        error: 'No token provided'
      };
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return {
        isAuthenticated: true,
        user: decoded
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        error: 'Invalid token'
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