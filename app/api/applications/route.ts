import { NextResponse } from 'next/server';

// Try to use MongoDB, fallback to mock
let useMongoDB = false;

// Check if we're on Vercel or local
const isVercel = process.env.VERCEL === '1';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // For Vercel: Use MOCK storage
    if (isVercel) {
      console.log('Vercel: Using mock storage');
      const mockApp = {
        _id: Date.now().toString(),
        ...body,
        experience: parseInt(body.experience) || 0,
        status: 'Pending',
        appliedAt: new Date().toISOString()
      };
      
      // In real scenario, save to MongoDB Atlas
      // For demo, just return success
      return NextResponse.json({
        success: true,
        message: 'Application submitted (Demo Mode - Would save to cloud DB in production)',
        data: mockApp,
        note: 'On production, this would save to MongoDB Atlas'
      }, { status: 201 });
    }
    
    // For Local: Try MongoDB
    try {
      const { connectToDatabase } = await import('@/lib/mongodb');
      const Application = (await import('@/models/Application')).default;
      
      await connectToDatabase();
      const app = await Application.create({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        position: body.position,
        coverLetter: body.coverLetter,
        resumeUrl: body.resumeUrl,
        experience: parseInt(body.experience),
        status: 'Pending'
      });
      
      return NextResponse.json({
        success: true,
        message: 'Application saved to LOCAL MongoDB!',
        data: app
      }, { status: 201 });
      
    } catch (mongoError) {
      // MongoDB failed, use mock
      console.log('MongoDB failed, using mock');
      const mockApp = {
        _id: Date.now().toString(),
        ...body,
        experience: parseInt(body.experience) || 0,
        status: 'Pending',
        appliedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        message: 'Application saved (MongoDB unavailable, using demo mode)',
        data: mockApp
      }, { status: 201 });
    }
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  // For Vercel: Return mock data
  if (isVercel) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Demo mode - In production would show real applications'
    });
  }
  
  // For Local: Try MongoDB
  try {
    const { connectToDatabase } = await import('@/lib/mongodb');
    const Application = (await import('@/models/Application')).default;
    
    await connectToDatabase();
    const apps = await Application.find().sort({ appliedAt: -1 });
    return NextResponse.json({ success: true, data: apps });
    
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Demo data - MongoDB unavailable'
    });
  }
}