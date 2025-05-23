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
        { success: false, message: 'Only players can access player matches' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get all matches for this player
    const [matches] = await db.query(`
      SELECT 
        m.*,
        h.hall_name,
        h.hall_country,
        t1.team_name as team1_name,
        t2.team_name as team2_name,
        white_user.name as white_player_name,
        white_user.surname as white_player_surname,
        black_user.name as black_player_name,
        black_user.surname as black_player_surname,
        arbiter_user.name as arbiter_name,
        arbiter_user.surname as arbiter_surname
      FROM matches m
      LEFT JOIN halls h ON m.hall_id = h.hall_id
      LEFT JOIN teams t1 ON m.team1_id = t1.team_id
      LEFT JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN users white_user ON m.white_player_username = white_user.username
      LEFT JOIN users black_user ON m.black_player_username = black_user.username
      LEFT JOIN users arbiter_user ON m.arbiter_username = arbiter_user.username
      WHERE m.white_player_username = ? OR m.black_player_username = ?
      ORDER BY m.date DESC, m.time_slot
    `, [sessionData.username, sessionData.username]);

    return NextResponse.json({
      success: true,
      matches: matches
    });

  } catch (error: any) {
    console.error('Get player matches error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching player matches' 
      },
      { status: 500 }
    );
  }
} 