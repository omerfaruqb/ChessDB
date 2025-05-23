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
    if (sessionData.userType !== UserType.PLAYER) {
      return NextResponse.json(
        { success: false, message: 'Only players can access player profile' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get player profile information
    const [playerData] = await db.query(`
      SELECT 
        p.fide_id as fideId,
        p.elo_rating as eloRating,
        p.date_of_birth as dateOfBirth,
        t.title_name as titleName
      FROM players p
      LEFT JOIN titles t ON p.title_id = t.title_id
      WHERE p.username = ?
    `, [sessionData.username]);

    const profile = Array.isArray(playerData) && playerData.length > 0 ? playerData[0] : null;

    return NextResponse.json({
      success: true,
      profile: profile
    });

  } catch (error: any) {
    console.error('Get player profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching player profile' 
      },
      { status: 500 }
    );
  }
} 