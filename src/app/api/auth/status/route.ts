import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthService } from '@/domains/auth/service';

export async function GET() {
  try {
    // Get the auth session cookie
    const cookieStore = await cookies();
    const authSession = cookieStore.get('auth_session');
    
    console.log('Auth session cookie found:', !!authSession);
    if (authSession) {
      console.log('Cookie value:', authSession.value);
    }
    
    if (!authSession || !authSession.value) {
      console.log('No auth session cookie found');
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      });
    }
    
    try {
      // Parse session data
      const sessionData = JSON.parse(authSession.value);
      console.log('Session data parsed:', sessionData);
      
      const { username, userType } = sessionData;
      
      if (!username || !userType) {
        console.log('Missing username or userType in session');
        return NextResponse.json({
          isAuthenticated: false,
          user: null
        });
      }
      
      // Use AuthService to get user details
      const authService = createAuthService();
      const userDetails = await authService.getUserByUsername(username);
      
      if (!userDetails) {
        console.log('User details not found for username:', username);
        throw new Error('User details not found');
      }
      
      console.log('User authenticated:', username);
      
      return NextResponse.json({
        isAuthenticated: true,
        user: userDetails
      });
    } catch (err) {
      console.error('Session parsing error:', err);
      
      // Clear invalid session
      const cookieStore = await cookies();
      cookieStore.delete('auth_session');
      
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      });
    }
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false, 
        user: null,
        message: 'An error occurred while checking authentication status' 
      },
      { status: 500 }
    );
  }
} 