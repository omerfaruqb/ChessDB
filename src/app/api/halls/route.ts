import { NextRequest, NextResponse } from 'next/server';
import { HallModel } from '@/domains/hall/model';

export async function GET(request: NextRequest) {
  try {
    const hallModel = new HallModel();
    const halls = await hallModel.getAllHalls();
    
    return NextResponse.json(halls);
  } catch (error) {
    console.error('Error fetching halls:', error);
    return NextResponse.json(
      { message: 'Error fetching halls' },
      { status: 500 }
    );
  }
} 