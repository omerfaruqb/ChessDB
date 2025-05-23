import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const authSession = cookieStore.get('auth_session');

    if (!authSession) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = getDatabase();
    
    // Get all arbiters
    const [arbiters] = await db.query(`
      SELECT 
        u.username,
        u.name,
        u.surname,
        a.experience_level
      FROM users u
      JOIN arbiters a ON u.username = a.username
      WHERE u.user_type = 'ARBITER'
      ORDER BY u.name, u.surname
    `);

    return NextResponse.json({
      success: true,
      arbiters: arbiters
    });

  } catch (error: any) {
    console.error('Get arbiters error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching arbiters' 
      },
      { status: 500 }
    );
  }
} 