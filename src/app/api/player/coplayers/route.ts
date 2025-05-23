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
        { success: false, message: 'Only players can access co-player statistics' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get co-players statistics - players this player has played against
    const [coPlayers] = await db.query(`
      SELECT 
        u.username,
        u.name,
        u.surname,
        p.elo_rating as eloRating,
        COUNT(m.match_id) as matches_played
      FROM users u
      JOIN players p ON u.username = p.username
      JOIN matches m ON (
        (m.white_player_username = u.username AND m.black_player_username = ?) OR
        (m.black_player_username = u.username AND m.white_player_username = ?)
      )
      WHERE u.username != ?
      GROUP BY u.username, u.name, u.surname, p.elo_rating
      ORDER BY matches_played DESC, u.name
    `, [sessionData.username, sessionData.username, sessionData.username]);

    return NextResponse.json({
      success: true,
      coplayers: coPlayers
    });

  } catch (error: any) {
    console.error('Get co-players error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching co-player statistics' 
      },
      { status: 500 }
    );
  }
} 