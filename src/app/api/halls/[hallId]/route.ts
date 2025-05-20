import { NextRequest, NextResponse } from 'next/server';
import { HallModel } from '@/domains/hall/model';

interface RouteParams {
  params: {
    hallId: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const hallId = parseInt(params.hallId);
    if (isNaN(hallId)) {
      return NextResponse.json(
        { message: 'Invalid hall ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { hall_name } = data;

    if (!hall_name || typeof hall_name !== 'string') {
      return NextResponse.json(
        { message: 'Hall name is required' },
        { status: 400 }
      );
    }

    const hallModel = new HallModel();
    
    // First check if the hall exists
    const existingHall = await hallModel.getHall(hallId);
    if (!existingHall) {
      return NextResponse.json(
        { message: 'Hall not found' },
        { status: 404 }
      );
    }

    // Update the hall name
    const updatedHall = await hallModel.updateHall(hallId, { hall_name });
    
    return NextResponse.json(updatedHall);
  } catch (error) {
    console.error('Error updating hall:', error);
    return NextResponse.json(
      { message: 'Error updating hall' },
      { status: 500 }
    );
  }
} 