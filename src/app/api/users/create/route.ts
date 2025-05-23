import { NextRequest, NextResponse } from 'next/server';
import { createUserModel } from '@/domains/user/model';
import { UserType } from '@/domains/user/types';
import { withTransaction } from '@/shared/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const cookieStore = await cookies();
    const authSession = cookieStore.get('auth_session');

    if (!authSession) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessionData = JSON.parse(authSession.value);
    if (sessionData.userType !== UserType.MANAGER) {
      return NextResponse.json(
        { success: false, message: 'Only database managers can create users' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userType, username, password, name, surname, nationality, ...additionalData } = body;

    if (!username || !password || !userType) {
      return NextResponse.json(
        { success: false, message: 'Username, password, and user type are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordErrors: string[] = [];
    if (password.length < 8) {
      passwordErrors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      passwordErrors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push("Password must contain at least one special character");
    }

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Password validation failed', errors: passwordErrors },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userModel = createUserModel();

    try {
      await withTransaction(async (conn) => {
        if (userType === UserType.PLAYER) {
          const { dateOfBirth, eloRating, fideId, titleId } = additionalData;
          
          if (!dateOfBirth || !eloRating || !fideId) {
            throw new Error('Date of birth, ELO rating, and FIDE ID are required for players');
          }

          if (eloRating <= 1000) {
            throw new Error('ELO rating must be greater than 1000');
          }

          // Create user
          await conn.query(
            `INSERT INTO users (username, password, name, surname, nationality, user_type) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, name, surname, nationality, userType]
          );

          // Create player
          await conn.query(
            `INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [username, dateOfBirth, eloRating, fideId, titleId || null]
          );

        } else if (userType === UserType.COACH) {
          // Create user
          await conn.query(
            `INSERT INTO users (username, password, name, surname, nationality, user_type) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, name, surname, nationality, userType]
          );

          // Create coach
          await conn.query(
            `INSERT INTO coaches (username) VALUES (?)`,
            [username]
          );

        } else if (userType === UserType.ARBITER) {
          const { experienceLevel } = additionalData;
          
          if (!experienceLevel) {
            throw new Error('Experience level is required for arbiters');
          }

          // Create user
          await conn.query(
            `INSERT INTO users (username, password, name, surname, nationality, user_type) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, name, surname, nationality, userType]
          );

          // Create arbiter
          await conn.query(
            `INSERT INTO arbiters (username, experience_level) VALUES (?, ?)`,
            [username, experienceLevel]
          );

        } else {
          throw new Error('Invalid user type');
        }
      });

      return NextResponse.json({
        success: true,
        message: `${userType} created successfully`,
        username: username
      });

    } catch (dbError: any) {
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { success: false, message: 'Username already exists' },
          { status: 409 }
        );
      }
      throw dbError;
    }

  } catch (error: any) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'An error occurred while creating the user' 
      },
      { status: 500 }
    );
  }
} 