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
        { success: false, message: 'Only coaches can access their team' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get the coach's team
    const [teams] = await db.query(`
      SELECT 
        team_id,
        team_name,
        coach_username
      FROM teams
      WHERE coach_username = ?
    `, [sessionData.username]);

    const team = Array.isArray(teams) && teams.length > 0 ? teams[0] : null;

    return NextResponse.json({
      success: true,
      team: team
    });

  } catch (error: any) {
    console.error('Get coach team error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching coach team' 
      },
      { status: 500 }
    );
  }
} 