import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { UserType } from '@/domains/user/types';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
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
    
    // Don't allow manager profile updates
    if (sessionData.userType === UserType.MANAGER) {
      return NextResponse.json(
        { success: false, message: 'Manager profiles cannot be updated' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    const { name, surname, nationality, eloRating, experienceLevel } = await request.json();

    // Update basic user information
    await db.query(`
      UPDATE users 
      SET name = ?, surname = ?, nationality = ?
      WHERE username = ?
    `, [name, surname, nationality, sessionData.username]);

    // Update role-specific information
    if (sessionData.userType === UserType.PLAYER && eloRating) {
      await db.query(`
        UPDATE players 
        SET elo_rating = ?
        WHERE username = ?
      `, [eloRating, sessionData.username]);
    } else if (sessionData.userType === UserType.ARBITER && experienceLevel) {
      await db.query(`
        UPDATE arbiters 
        SET experience_level = ?
        WHERE username = ?
      `, [experienceLevel, sessionData.username]);
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while updating profile' 
      },
      { status: 500 }
    );
  }
} 