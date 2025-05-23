import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Please use /api/users/create endpoint for creating users' 
    },
    { status: 400 }
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'User listing not implemented. Use specific endpoints for user operations.' 
    },
    { status: 404 }
  );
} 