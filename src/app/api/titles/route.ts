import { NextRequest, NextResponse } from 'next/server';
import { titleService } from '@/domains/title/controller';
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

    // Get all titles
    const titles = await titleService.getAllTitles();

    return NextResponse.json({
      success: true,
      titles: titles
    });

  } catch (error: any) {
    console.error('Get titles error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching titles' 
      },
      { status: 500 }
    );
  }
} 