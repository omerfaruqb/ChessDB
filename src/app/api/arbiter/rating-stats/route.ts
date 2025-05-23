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
        { success: false, message: 'Only arbiters can access rating statistics' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get rating statistics for this arbiter
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_matches,
        COUNT(rating) as rated_matches,
        AVG(rating) as average_rating
      FROM matches 
      WHERE arbiter_username = ?
    `, [sessionData.username]);

    const statistics = Array.isArray(stats) && stats.length > 0 ? stats[0] : {
      total_matches: 0,
      rated_matches: 0,
      average_rating: null
    };

    return NextResponse.json({
      success: true,
      stats: statistics
    });

  } catch (error: any) {
    console.error('Get arbiter rating stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching rating statistics' 
      },
      { status: 500 }
    );
  }
} 