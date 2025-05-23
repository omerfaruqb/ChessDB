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
    if (sessionData.userType !== UserType.COACH) {
      return NextResponse.json(
        { success: false, message: 'Only coaches can access team players' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get players from the coach's team
    const [players] = await db.query(`
      SELECT 
        u.username,
        u.name,
        u.surname,
        p.elo_rating,
        p.fide_id,
        t.title_name
      FROM teams team
      JOIN player_teams pt ON team.team_id = pt.team_id
      JOIN users u ON pt.username = u.username
      JOIN players p ON u.username = p.username
      LEFT JOIN titles t ON p.title_id = t.title_id
      WHERE team.coach_username = ?
      ORDER BY u.name, u.surname
    `, [sessionData.username]);

    return NextResponse.json({
      success: true,
      players: players
    });

  } catch (error: any) {
    console.error('Get team players error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching team players' 
      },
      { status: 500 }
    );
  }
} 