import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the auth session cookie
    response.cookies.delete('auth_session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred during logout' 
      },
      { status: 500 }
    );
  }
} 