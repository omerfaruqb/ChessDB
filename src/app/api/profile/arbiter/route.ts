import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { UserType } from '@/domains/user/types';
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

    const sessionData = JSON.parse(authSession.value);
    if (sessionData.userType !== UserType.ARBITER) {
      return NextResponse.json(
        { success: false, message: 'Only arbiters can access arbiter profile' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get arbiter profile information
    const [arbiterData] = await db.query(`
      SELECT 
        a.experience_level as experienceLevel
      FROM arbiters a
      WHERE a.username = ?
    `, [sessionData.username]);

    const profile = Array.isArray(arbiterData) && arbiterData.length > 0 ? arbiterData[0] : null;

    return NextResponse.json({
      success: true,
      profile: profile
    });

  } catch (error: any) {
    console.error('Get arbiter profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching arbiter profile' 
      },
      { status: 500 }
    );
  }
} 