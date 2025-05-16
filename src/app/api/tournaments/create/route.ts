// import { NextRequest, NextResponse } from 'next/server';
// import { requireRole } from '@/shared/middleware/auth.middleware';
// import { UserType } from '@/domains/user/types';

// async function handler(request: NextRequest) {
//   if (request.method !== 'POST') {
//     return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
//   }

//   try {
//     // Your tournament creation logic here
//     const data = await request.json();
    
//     // Example response
//     return NextResponse.json({
//       success: true,
//       message: 'Tournament created successfully',
//       data: {
//         ...data,
//         id: 'generated-id',
//         createdAt: new Date(),
//       }
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create tournament' },
//       { status: 500 }
//     );
//   }
// }

// // Protect this route - only ARBITER can access
// export const POST = requireRole([UserType.ARBITER])(handler); 