import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthService } from '@/domains/auth/service';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const authService = createAuthService();
    
    try {
      const userData = await authService.login(username, password);
      
      // Make sure userType is included in the session data
      if (!userData.userType) {
        console.error('User data missing userType:', userData);
        return NextResponse.json(
          { success: false, message: 'User type information is missing' },
          { status: 500 }
        );
      }
      
      // Create a serialized session value
      const sessionValue = JSON.stringify({
        username: userData.username,
        userType: userData.userType,
      });
      
      console.log('Setting auth_session cookie with value:', sessionValue);
      
      // Use NextResponse to set cookie directly
      const response = NextResponse.json({
        success: true,
        user: userData,
      });
      
      // Set the cookie on the response
      response.cookies.set({
        name: 'auth_session',
        value: sessionValue,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'lax', // Use 'lax' for development
      });
      
      return response;
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message || 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 