import { NextResponse } from 'next/server';
import Application from '@/models/Application';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('MongoDB connected!');

    const body = await request.json();
    console.log('Received data:', body);

    // Create application in MongoDB
    const application = await Application.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      position: body.position,
      coverLetter: body.coverLetter,
      resumeUrl: body.resumeUrl,
      experience: parseInt(body.experience),
      status: 'Pending'
    });

    console.log('Saved to MongoDB:', application._id);

    return NextResponse.json(
      { 
        success: true,
        message: 'Application submitted to database!',
        data: application 
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('MongoDB Error:', error.message);
    return NextResponse.json(
      { 
        success: false,
        error: 'Database error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const applications = await Application.find().sort({ appliedAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: applications
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch from database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}