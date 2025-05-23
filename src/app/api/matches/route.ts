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
    
    const db = getDatabase();
    
    // Get all matches with detailed information
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
      ORDER BY m.date DESC, m.time_slot
    `);

    return NextResponse.json({
      success: true,
      matches: matches
    });

  } catch (error: any) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching matches' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Only coaches can create matches
    if (sessionData.userType !== UserType.COACH) {
      return NextResponse.json(
        { success: false, message: 'Only coaches can create matches' },
        { status: 403 }
      );
    }

    const {
      date,
      time_slot,
      hall_id,
      table_id,
      team1_id,
      team2_id,
      white_player_username,
      black_player_username,
      arbiter_username
    } = await request.json();

    // Validate required fields
    if (!date || !time_slot || !hall_id || !table_id || !team1_id || !team2_id || !white_player_username || !black_player_username || !arbiter_username) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    
    // Get the next available match_id
    const [maxIdResult] = await db.query(`
      SELECT COALESCE(MAX(match_id), 0) + 1 as next_id FROM matches
    `) as any;
    
    const nextMatchId = maxIdResult[0].next_id;
    
    // Validate that players belong to the correct teams
    const [whitePlayerTeam] = await db.query(`
      SELECT pt.team_id 
      FROM player_teams pt 
      WHERE pt.username = ?
    `, [white_player_username]) as any;
    
    const [blackPlayerTeam] = await db.query(`
      SELECT pt.team_id 
      FROM player_teams pt 
      WHERE pt.username = ?
    `, [black_player_username]) as any;

    if (!Array.isArray(whitePlayerTeam) || !Array.isArray(blackPlayerTeam) || 
        !whitePlayerTeam.length || !blackPlayerTeam.length) {
      return NextResponse.json(
        { success: false, message: 'Selected players not found in teams' },
        { status: 400 }
      );
    }

    // Verify player-team assignments
    if (whitePlayerTeam[0].team_id !== team1_id) {
      return NextResponse.json(
        { success: false, message: 'White player must be from your team' },
        { status: 400 }
      );
    }

    if (blackPlayerTeam[0].team_id !== team2_id) {
      return NextResponse.json(
        { success: false, message: 'Black player must be from the opponent team' },
        { status: 400 }
      );
    }

    // Create the match with explicit match_id
    const [result] = await db.query(`
      INSERT INTO matches (
        match_id, date, time_slot, hall_id, table_id, team1_id, team2_id,
        white_player_username, black_player_username, arbiter_username
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nextMatchId, date, time_slot, hall_id, table_id, team1_id, team2_id,
      white_player_username, black_player_username, arbiter_username
    ]);

    return NextResponse.json({
      success: true,
      message: 'Match created successfully',
      match_id: nextMatchId
    });

  } catch (error: any) {
    console.error('Create match error:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: 'A match is already scheduled for this time and location' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while creating the match' 
      },
      { status: 500 }
    );
  }
} 