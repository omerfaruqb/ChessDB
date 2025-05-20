import { NextRequest, NextResponse } from 'next/server';
import { createHallService } from '@/domains/hall/service';
import { createTableService } from '@/domains/table/service';
import { createHallModel } from '@/domains/hall/model';
import { createTableModel } from '@/domains/table/model';

// Get tables for a specific hall
export async function GET(
  request: NextRequest,
  { params }: { params: { hallId: string } }
) {
  try {
    const hallId = parseInt(params.hallId);
    
    if (isNaN(hallId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid hall ID' },
        { status: 400 }
      );
    }
    
    const hallModel = createHallModel();
    const hallService = createHallService(hallModel);
    
    const tableModel = createTableModel();
    const tableService = createTableService(tableModel);
    
    // First check if the hall exists
    const hall = await hallService.getHall(hallId);
    if (!hall) {
      return NextResponse.json(
        { success: false, message: 'Hall not found' },
        { status: 404 }
      );
    }
    
    // Get tables for this hall
    const tables = await tableService.getTablesByHall(hallId);
    
    return NextResponse.json({
      success: true,
      tables
    });
  } catch (error) {
    console.error(`Error fetching tables for hall ID ${params.hallId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
} 