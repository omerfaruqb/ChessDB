import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const resolvedParams = await params;
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

    const teamId = parseInt(resolvedParams.teamId);
    
    if (isNaN(teamId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid team ID' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    
    // Get players for the specified team
    const [players] = await db.query(`
      SELECT 
        p.username,
        u.name,
        u.surname,
        p.elo_rating,
        p.fide_id
      FROM player_teams pt
      JOIN players p ON pt.username = p.username
      JOIN users u ON p.username = u.username
      WHERE pt.team_id = ?
      ORDER BY p.elo_rating DESC
    `, [teamId]);

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