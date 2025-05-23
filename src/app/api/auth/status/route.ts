import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthService } from '@/domains/auth/service';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authSession = cookieStore.get('auth_session');

    if (!authSession) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      });
    }

    try {
      const sessionData = JSON.parse(authSession.value);
      const { username, userType } = sessionData;

      if (!username || !userType) {
        return NextResponse.json({
          isAuthenticated: false,
          user: null
        });
      }

      // Get the full user data from the database
      const authService = createAuthService();
      const user = await authService.getUserByUsername(username);

      if (!user) {
        // User no longer exists, clear the session
        const response = NextResponse.json({
          isAuthenticated: false,
          user: null
        });
        response.cookies.delete('auth_session');
        return response;
      }

      return NextResponse.json({
        isAuthenticated: true,
        user: {
          username: user.username,
          name: user.name,
          surname: user.surname,
          nationality: user.nationality,
          userType: user.userType
        }
      });
    } catch (parseError) {
      console.error('Error parsing session data:', parseError);
      // Clear invalid session
      const response = NextResponse.json({
        isAuthenticated: false,
        user: null
      });
      response.cookies.delete('auth_session');
      return response;
    }
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false, 
        user: null,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 