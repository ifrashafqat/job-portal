import { NextResponse } from 'next/server';

// NEW: Comprehensive validation function
function validateApplicationData(body: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields check
  const requiredFields = [
    'first_name', 'last_name', 'email', 'phone', 
    'ssn_no', 'occupation', 'address', 'city', 
    'state_province', 'zip_postal_code', 'country', 'role'
  ];
  
  requiredFields.forEach(field => {
    if (!body[field] || body[field].toString().trim() === '') {
      const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      errors.push(`${fieldName} is required`);
    }
  });

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (body.email && !emailRegex.test(body.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (accepts various formats)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[0-9\-\+\s\(\)]{10,}$/;
  if (body.phone) {
    const cleanedPhone = body.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanedPhone) || cleanedPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
  }

  // SSN validation (XXX-XX-XXXX format)
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  if (body.ssn_no && !ssnRegex.test(body.ssn_no)) {
    errors.push('SSN must be in format: XXX-XX-XXXX (with hyphens)');
  }

  // ZIP code validation (basic US format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (body.zip_postal_code && !zipRegex.test(body.zip_postal_code)) {
    errors.push('ZIP code must be 5 digits (optional +4: 12345-6789)');
  }

  // Check if role is from our allowed list
  const allowedRoles = [
    'Social Media Marketing Specialist',
    'Social Media Manager', 
    'Content Creator',
    'Digital Marketing Specialist',
    'Community Manager',
    'Paid Social Media Specialist',
    'Social Media Analyst',
    'Influencer Marketing Coordinator'
  ];
  
  if (body.role && !allowedRoles.includes(body.role)) {
    errors.push('Invalid role selected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(request: Request) {
  try {
    console.log('📦 Receiving new application...');
    
    const body = await request.json();
    console.log('📝 Data received for role:', body.role);

    // Use the new validation function
    const validation = validateApplicationData(body);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    // --- Prepare data for Supabase ---
    const supabaseData = {
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone,
      ssn_no: body.ssn_no,
      occupation: body.occupation.trim(),
      address: body.address.trim(),
      city: body.city.trim(),
      state_province: body.state_province.trim(),
      zip_postal_code: body.zip_postal_code,
      country: body.country,
      role: body.role,
      ssn_image_url: body.ssn_image_url || '',
      license_image_url: body.license_image_url || '',
      status: 'Pending'
    };

    // --- Save to Supabase ---
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables.');
      throw new Error('Server configuration error.');
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('applications')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Application saved to DB with ID:', data.id);
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      data: data
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit application. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Server configuration error.');
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('applied_at', { ascending: false });
    
    if (error) throw error;

    console.log('📊 Fetched applications from Supabase.');
    return NextResponse.json({
      success: true,
      data: data,
      source: 'supabase'
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