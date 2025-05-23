import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { UserType } from '@/domains/user/types';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
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

    const sessionData = JSON.parse(authSession.value);
    if (sessionData.userType !== UserType.ARBITER) {
      return NextResponse.json(
        { success: false, message: 'Only arbiters can rate matches' },
        { status: 403 }
      );
    }

    const matchId = parseInt(resolvedParams.matchId);
    
    if (isNaN(matchId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid match ID' },
        { status: 400 }
      );
    }

    const { rating } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 10) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 10' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    
    // Verify the arbiter is assigned to this match
    const [matchCheck] = await db.query(`
      SELECT arbiter_username, rating, date
      FROM matches 
      WHERE match_id = ?
    `, [matchId]) as any;

    if (!Array.isArray(matchCheck) || !matchCheck.length) {
      return NextResponse.json(
        { success: false, message: 'Match not found' },
        { status: 404 }
      );
    }

    const match = matchCheck[0];

    if (match.arbiter_username !== sessionData.username) {
      return NextResponse.json(
        { success: false, message: 'You can only rate matches you are assigned to' },
        { status: 403 }
      );
    }

    // Check if match has already been rated
    if (match.rating !== null) {
      return NextResponse.json(
        { success: false, message: 'This match has already been rated' },
        { status: 400 }
      );
    }

    // Check if match date is in the past
    const matchDate = new Date(match.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    matchDate.setHours(0, 0, 0, 0);

    if (matchDate >= today) {
      return NextResponse.json(
        { success: false, message: 'You can only rate matches that have already occurred' },
        { status: 400 }
      );
    }

    // Update the match with the rating
    await db.query(`
      UPDATE matches 
      SET rating = ?
      WHERE match_id = ?
    `, [rating, matchId]);

    return NextResponse.json({
      success: true,
      message: 'Match rated successfully'
    });

  } catch (error: any) {
    console.error('Rate match error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while rating the match' 
      },
      { status: 500 }
    );
  }
} 