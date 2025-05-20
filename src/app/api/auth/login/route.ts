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
      
      // Set session cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'auth_session',
        value: JSON.stringify({
          username: userData.username,
          userType: userData.userType,
        }),
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'strict',
      });

      return NextResponse.json({
        success: true,
        user: userData,
      });
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