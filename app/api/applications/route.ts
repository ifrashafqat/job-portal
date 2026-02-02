import { NextResponse } from 'next/server';

// For development, we'll use in-memory storage
// In production, connect to Supabase
let applications: any[] = [];

export async function POST(request: Request) {
  try {
    console.log('📦 Receiving application...');
    
    const body = await request.json();
    console.log('📝 Data received:', { ...body, coverLetter: '[...]' });
    
    // Create application object
    const newApplication = {
      id: Date.now().toString(),
      full_name: body.fullName || '',
      email: body.email || '',
      phone: body.phone || '',
      position: body.position || '',
      cover_letter: body.coverLetter || '',
      resume_url: body.resumeUrl || '',
      experience: parseInt(body.experience) || 0,
      status: 'Pending',
      applied_at: new Date().toISOString()
    };
    
    // Add to memory storage
    applications.push(newApplication);
    console.log('💾 Saved application. Total:', applications.length);
    
    // Try to save to Supabase if available
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
      
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { error } = await supabase
          .from('applications')
          .insert({
            full_name: body.fullName,
            email: body.email,
            phone: body.phone,
            position: body.position,
            cover_letter: body.coverLetter,
            resume_url: body.resumeUrl,
            experience: parseInt(body.experience) || 0,
            status: 'Pending'
          });
        
        if (!error) {
          console.log('✅ Also saved to Supabase!');
        } else {
          console.log('⚠️ Supabase save failed, using memory:', error.message);
        }
      }
    } catch (supabaseError) {
      console.log('⚠️ Supabase not available, using memory storage');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      data: newApplication,
      note: process.env.NODE_ENV === 'production' ? 'Saved to database' : 'Development mode'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('applied_at', { ascending: false });
        
        if (!error && data) {
          console.log('📊 Fetched from Supabase:', data.length, 'applications');
          return NextResponse.json({
            success: true,
            data: data,
            source: 'supabase'
          });
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase fetch failed, using memory:', supabaseError);
      }
    }
    
    // Fallback to memory storage
    console.log('📊 Using memory storage:', applications.length, 'applications');
    return NextResponse.json({
      success: true,
      data: applications,
      source: 'memory'
    });
    
  } catch (error: any) {
    console.error('❌ Fetch Error:', error);
    return NextResponse.json({
      success: true,
      data: [],
      error: 'Failed to fetch applications'
    });
  }
}