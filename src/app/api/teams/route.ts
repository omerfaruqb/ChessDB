import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
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

    const db = getDatabase();
    
    // Get all teams with coach information
    const [teams] = await db.query(`
      SELECT 
        t.team_id,
        t.team_name,
        t.coach_username,
        u.name as coach_name,
        u.surname as coach_surname
      FROM teams t
      LEFT JOIN users u ON t.coach_username = u.username
      ORDER BY t.team_name
    `);

    return NextResponse.json({
      success: true,
      teams: teams
    });

  } catch (error: any) {
    console.error('Get teams error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching teams' 
      },
      { status: 500 }
    );
  }
} 