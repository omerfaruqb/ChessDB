import { NextRequest, NextResponse } from 'next/server';
import { createHallService } from '@/domains/hall/service';
import { createHallModel } from '@/domains/hall/model';

// Route specifically for renaming halls (for database managers)
export async function PUT(
  request: NextRequest,
  { params }: { params: { hallId: string } }
) {
  try {
    const hallId = await parseInt(params.hallId);
    
    if (isNaN(hallId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid hall ID' },
        { status: 400 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { new_name } = body;
    
    if (!new_name || typeof new_name !== 'string' || new_name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Invalid hall name provided' },
        { status: 400 }
      );
    }
    
    const hallModel = createHallModel();
    const hallService = createHallService(hallModel);
    
    // Check if hall exists first
    const existingHall = await hallService.getHall(hallId);
    if (!existingHall) {
      return NextResponse.json(
        { success: false, message: 'Hall not found' },
        { status: 404 }
      );
    }
    
    // Update the hall with new name
    const updatedHall = await hallService.updateHall(hallId, {
      ...existingHall,
      hall_name: new_name.trim()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Hall name updated successfully',
      hall: updatedHall
    });
  } catch (error) {
    console.error(`Error updating hall with ID ${params.hallId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update hall name' },
      { status: 500 }
    );
  }
} 