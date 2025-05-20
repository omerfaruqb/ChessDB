import { NextRequest, NextResponse } from 'next/server';
import { createAuthService } from '@/domains/auth/authService';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const authService = createAuthService();
    
    try {
      const token = await authService.login(username, password);
      return NextResponse.json({ token });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      return NextResponse.json({ message }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 