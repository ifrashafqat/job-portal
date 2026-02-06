'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// List of countries for the dropdown (you can add more)
const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'India', 'Pakistan', 'United Arab Emirates', 'Saudi Arabia'
];

// UPDATED: 8 Job Roles extracted from the description
const jobRoles = [
  'Social Media Marketing Specialist',
  'Social Media Manager', 
  'Content Creator',
  'Digital Marketing Specialist',
  'Community Manager',
  'Paid Social Media Specialist',
  'Social Media Analyst',
  'Influencer Marketing Coordinator'
];

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingSsn, setUploadingSsn] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Form state matching the NEW database schema
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    ssn_no: '',
    occupation: '',
    address: '',
    city: '',
    state_province: '',
    zip_postal_code: '',
    country: countries[0], // Default to first country
    role: jobRoles[0],     // Default to the first role
    ssn_image_url: '',     // Will store the URL after upload
    license_image_url: '', // Will store the URL after upload
  });

  // State for the actual File objects
  const [ssnFile, setSsnFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // NEW: Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^[\+]?[1-9][\d]{0,15}$/.test(cleaned) && cleaned.length >= 10;
  };

  const validateSSN = (ssn: string) => {
    return /^\d{3}-\d{2}-\d{4}$/.test(ssn);
  };

  const validateZIP = (zip: string) => {
    return /^\d{5}(-\d{4})?$/.test(zip);
  };

  // NEW: Formatting functions
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
  };

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0,3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0,3)}-${numbers.slice(3,5)}-${numbers.slice(5,9)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // NEW: Apply formatting for specific fields
    if (name === 'phone') {
      value = formatPhone(value);
    }
    if (name === 'ssn_no') {
      value = formatSSN(value);
      // Limit to 11 characters (XXX-XX-XXXX)
      if (value.length > 11) value = value.slice(0, 11);
    }
    if (name === 'zip_postal_code') {
      // Allow only digits and hyphen
      value = value.replace(/[^\d\-]/g, '');
      if (value.length > 10) value = value.slice(0, 10);
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // Function to upload a file to ImgBB
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      alert('Image upload configuration error. Please contact support.');
      throw new Error('ImgBB API key missing');
    }

    const formData = new FormData();
    formData.append('image', file);
    // ImgBB expects the key as 'key', not 'apiKey'
    formData.append('key', apiKey);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      console.error('ImgBB upload failed:', result);
      throw new Error(`Image upload failed: ${result.error?.message || 'Unknown error'}`);
    }
    // Return the direct image URL
    return result.data.url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'ssn' | 'license') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation: check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    if (type === 'ssn') {
      setSsnFile(file);
    } else {
      setLicenseFile(file);
    }
  };

  // NEW: Validate entire form before submission
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Phone must be at least 10 digits (e.g., 123-456-7890)';
    }
    
    if (!formData.ssn_no.trim()) {
      errors.ssn_no = 'SSN is required';
    } else if (!validateSSN(formData.ssn_no)) {
      errors.ssn_no = 'SSN must be in format: XXX-XX-XXXX';
    }
    
    if (!formData.zip_postal_code.trim()) {
      errors.zip_postal_code = 'ZIP code is required';
    } else if (!validateZIP(formData.zip_postal_code)) {
      errors.zip_postal_code = 'ZIP must be 5 digits (optional +4: 12345-6789)';
    }
    
    // Check if at least one image is uploaded
    if (!ssnFile && !formData.ssn_image_url) {
      errors.ssn_image = 'SSN image is required';
    }
    if (!licenseFile && !formData.license_image_url) {
      errors.license_image = 'Driver\'s license image is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('Please fix the errors in the form before submitting.');
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setLoading(true);

    try {
      console.log('Starting submission...');

      // 1. Upload SSN Image if a new file is selected
      let ssnImageUrl = formData.ssn_image_url;
      if (ssnFile) {
        setUploadingSsn(true);
        try {
          ssnImageUrl = await uploadImageToImgBB(ssnFile);
          console.log('SSN image uploaded:', ssnImageUrl);
        } catch (error) {
          alert('Failed to upload SSN image. Please try again.');
          setLoading(false);
          setUploadingSsn(false);
          return;
        } finally {
          setUploadingSsn(false);
        }
      }

      // 2. Upload License Image if a new file is selected
      let licenseImageUrl = formData.license_image_url;
      if (licenseFile) {
        setUploadingLicense(true);
        try {
          licenseImageUrl = await uploadImageToImgBB(licenseFile);
          console.log('License image uploaded:', licenseImageUrl);
        } catch (error) {
          alert('Failed to upload License image. Please try again.');
          setLoading(false);
          setUploadingLicense(false);
          return;
        } finally {
          setUploadingLicense(false);
        }
      }

      // 3. Prepare final data with uploaded image URLs
      const finalFormData = {
        ...formData,
        ssn_image_url: ssnImageUrl,
        license_image_url: licenseImageUrl,
      };

      console.log('Submitting form data:', { ...finalFormData, ssn_image_url: '[...]', license_image_url: '[...]' });

      // 4. Submit the application data to our API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        alert('Application submitted successfully!');
        router.push('/'); // Go back to home page
      } else {
        alert(`Error: ${result.error || 'Submission failed'}\n${result.details?.join('\n') || ''}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error. Please check console and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-[#2d1b69] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Company & Job Banner */}
        <div className="mb-12">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Social Media Careers</h1>
                <p className="text-xl text-purple-200">Multiple Remote Positions Available</p>
              </div>
            </div>
          </div>
          
          {/* Detailed Job Description */}
          <div className="glass-dark p-6 md:p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Available Positions</h2>
            <div className="space-y-6 text-gray-300">
              <p><strong>Job Type:</strong> Full-Time & Contract<br/>
                 <strong>Work Mode:</strong> 100% Remote 🌍</p>

              <p>We are looking for creative and results-driven <strong>Social Media Professionals</strong> to join our remote team. Whether you specialize in content creation, community management, paid ads, or analytics, we have a role for you.</p>

              <div>
                <h3 className="text-xl font-semibold text-purple-200 mt-4 mb-2">📋 Open Positions Include:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {jobRoles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-200 mt-4 mb-2">✅ General Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Proven experience in Social Media or Digital Marketing</li>
                  <li>Strong understanding of social media platforms and algorithms</li>
                  <li>Experience with social media management tools</li>
                  <li>Basic graphic design and video editing knowledge</li>
                  <li>Ability to analyze data and improve performance</li>
                  <li>Excellent written communication skills in English</li>
                  <li>Self-motivated, organized, and comfortable working remotely</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-200 mt-4 mb-2">💎 What We Offer</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Flexible working hours</li>
                  <li>Remote work from anywhere</li>
                  <li>Competitive salary / project-based compensation</li>
                  <li>Growth and learning opportunities</li>
                  <li>Supportive and collaborative remote team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="glass-dark p-6 md:p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-2 text-white">Application Form</h2>
          <p className="text-gray-400 mb-8">Please fill out all fields below to apply. <span className="text-red-500">*</span> indicates required fields.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="first_name" 
                  required 
                  value={formData.first_name} 
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${formErrors.first_name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none`}
                  placeholder="John" 
                />
                {formErrors.first_name && <p className="text-red-400 text-sm mt-1">{formErrors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="last_name" 
                  required 
                  value={formData.last_name} 
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${formErrors.last_name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none`}
                  placeholder="Doe" 
                />
                {formErrors.last_name && <p className="text-red-400 text-sm mt-1">{formErrors.last_name}</p>}
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none`}
                  placeholder="john@example.com" 
                />
                {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone} 
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none`}
                  placeholder="(123) 456-7890" 
                />
                {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                <p className="text-xs text-gray-500 mt-1">Format: (123) 456-7890</p>
              </div>
            </div>

            {/* Row 3: SSN & Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    SSN / Tax ID <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.ssn_no.length}/11
                  </span>
                </div>
                <input 
                  type="text" 
                  name="ssn_no" 
                  required 
                  value={formData.ssn_no} 
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${formErrors.ssn_no ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none`}
                  placeholder="123-45-6789" 
                />
                {formErrors.ssn_no && <p className="text-red-400 text-sm mt-1">{formErrors.ssn_no}</p>}
                <p className="text-xs text-gray-500 mt-1">For verification purposes only. Format: XXX-XX-XXXX</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Current Occupation <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="occupation" 
                  required 
                  value={formData.occupation} 
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                  placeholder="e.g., Marketing Manager" 
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="address" 
                required 
                value={formData.address} 
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                placeholder="123 Main St" 
              />
            </div>

            {/* Row 4: City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  City <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="city" 
                  required 
                  value={formData.city} 
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                  placeholder="New York" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  State / Province <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="state_province" 
                  required 
                  value={formData.state_province} 
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                  placeholder="NY" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  ZIP / Postal Code <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="zip_postal_code" 
                  required 
                  value={formData.zip_postal_code} 
                  onChange={handleChange}
                  className={`w-full bg-gray-900 border ${formErrors.zip_postal_code ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none`}
                  placeholder="12345 or 12345-6789" 
                />
                {formErrors.zip_postal_code && <p className="text-red-400 text-sm mt-1">{formErrors.zip_postal_code}</p>}
              </div>
            </div>

            {/* Row 5: Country & Role Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Country <span className="text-red-500">*</span>
                </label>
                <select 
                  name="country" 
                  required 
                  value={formData.country} 
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Applying For Role <span className="text-red-500">*</span>
                </label>
                <select 
                  name="role" 
                  required 
                  value={formData.role} 
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                >
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the position you're applying for</p>
              </div>
            </div>

            {/* Row 6: File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  SSN / Tax ID Image <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  name="ssn_image" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'ssn')}
                  className={`w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${formErrors.ssn_image ? 'file:bg-red-900 file:text-red-300' : 'file:bg-purple-900 file:text-purple-300'} hover:file:bg-purple-800`}
                />
                {formErrors.ssn_image && <p className="text-red-400 text-sm mt-1">{formErrors.ssn_image}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a clear image of your SSN card or tax document. 
                  {uploadingSsn && <span className="text-yellow-400"> Uploading...</span>}
                </p>
                {formData.ssn_image_url && !ssnFile && <p className="text-xs text-green-400 mt-1">✓ Image already uploaded.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Driver's License / State ID Image <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  name="license_image" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'license')}
                  className={`w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${formErrors.license_image ? 'file:bg-red-900 file:text-red-300' : 'file:bg-purple-900 file:text-purple-300'} hover:file:bg-purple-800`}
                />
                {formErrors.license_image && <p className="text-red-400 text-sm mt-1">{formErrors.license_image}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a clear image of your driver's license or state ID.
                  {uploadingLicense && <span className="text-yellow-400"> Uploading...</span>}
                </p>
                {formData.license_image_url && !licenseFile && <p className="text-xs text-green-400 mt-1">✓ Image already uploaded.</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading || uploadingSsn || uploadingLicense}
                className="w-full bg-gradient-to-r from-primary-purple to-pink-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : (uploadingSsn || uploadingLicense) ? 'Uploading Images...' : 'Submit Application'}
              </button>
              <p className="text-center text-gray-500 mt-4">
                By submitting, you confirm that the information provided is accurate and complete.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}