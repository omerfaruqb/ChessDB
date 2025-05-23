import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { UserType } from '@/domains/user/types';
import { cookies } from 'next/headers';

interface RouteParams {
  params: Promise<{
    matchId: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    
    // Only coaches can delete matches
    if (sessionData.userType !== UserType.COACH) {
      return NextResponse.json(
        { success: false, message: 'Only coaches can delete matches' },
        { status: 403 }
      );
    }

    const { matchId } = await params;
    const db = getDatabase();

    // First verify that the coach has permission to delete this match
    // (the match involves one of their teams)
    const [matchCheck] = await db.query(`
      SELECT m.match_id, t1.coach_username as team1_coach, t2.coach_username as team2_coach
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.team_id
      LEFT JOIN teams t2 ON m.team2_id = t2.team_id
      WHERE m.match_id = ?
    `, [matchId]) as any;

    if (matchCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Match not found' },
        { status: 404 }
      );
    }

    const match = matchCheck[0];
    const isAuthorized = match.team1_coach === sessionData.username || 
                        match.team2_coach === sessionData.username;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'You can only delete matches involving your teams' },
        { status: 403 }
      );
    }

    // Delete the match - this will delete all related data
    // Note: If there are foreign key constraints, we might need to delete related records first
    const [result] = await db.query(`
      DELETE FROM matches WHERE match_id = ?
    `, [matchId]) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Match not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Match deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete match error:', error);
    
    // Handle foreign key constraint errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot delete match: it has related data that must be removed first' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while deleting the match' 
      },
      { status: 500 }
    );
  }
} 