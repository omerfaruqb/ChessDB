import { NextRequest, NextResponse } from 'next/server';
import { createHallService } from '@/domains/hall/service';
import { createHallModel } from '@/domains/hall/model';

export async function GET(request: NextRequest) {
  try {
    const hallModel = createHallModel();
    const hallService = createHallService(hallModel);
    const halls = await hallService.getAllHalls();
    
    return NextResponse.json({
      success: true,
      halls
    });
  } catch (error) {
    console.error('Error fetching halls:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch halls' },
      { status: 500 }
    );
  }
} 