import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/shared/db';
import { UserType } from '@/domains/user/types';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
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
        { success: false, message: 'Only database managers can update hall names' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { hallId, newName } = body;

    if (!hallId || !newName) {
      return NextResponse.json(
        { success: false, message: 'Hall ID and new name are required' },
        { status: 400 }
      );
    }

    if (newName.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Hall name cannot be empty' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if hall exists
    const [existingHalls] = await db.query(
      'SELECT hall_id, hall_name FROM halls WHERE hall_id = ?',
      [hallId]
    );

    if (!Array.isArray(existingHalls) || existingHalls.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Hall not found' },
        { status: 404 }
      );
    }

    // Update hall name
    await db.query(
      'UPDATE halls SET hall_name = ? WHERE hall_id = ?',
      [newName.trim(), hallId]
    );

    // Get updated hall data
    const [updatedHalls] = await db.query(
      'SELECT hall_id, hall_name, hall_country, hall_capacity FROM halls WHERE hall_id = ?',
      [hallId]
    );

    return NextResponse.json({
      success: true,
      message: 'Hall name updated successfully',
      hall: Array.isArray(updatedHalls) ? updatedHalls[0] : null
    });

  } catch (error: any) {
    console.error('Update hall name error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while updating the hall name' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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
        { success: false, message: 'Only database managers can manage halls' },
        { status: 403 }
      );
    }

    const db = getDatabase();
    
    // Get all halls with their table counts for management
    const [halls] = await db.query(`
      SELECT 
        h.hall_id,
        h.hall_name,
        h.hall_country,
        h.hall_capacity,
        COUNT(t.table_id) as table_count
      FROM halls h
      LEFT JOIN tables t ON h.hall_id = t.hall_id
      GROUP BY h.hall_id, h.hall_name, h.hall_country, h.hall_capacity
      ORDER BY h.hall_name
    `);

    return NextResponse.json({
      success: true,
      halls: halls
    });

  } catch (error: any) {
    console.error('Get halls for management error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching halls for management' 
      },
      { status: 500 }
    );
  }
} 