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
    
    // Get all halls with their table counts
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
    console.error('Get halls error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching halls' 
      },
      { status: 500 }
    );
  }
} 