'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    resumeUrl: '',
    experience: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log('Submitting form:', formData);
    
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('Server response:', result);

    if (response.ok) {
      alert('Application submitted successfully!');
      router.push('/');
    } else {
      alert(`Error: ${result.error || 'Submission failed'}`);
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('Network error. Please check console.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-[#2d1b69] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Company Banner */}
        <div className="mb-12">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">TechNova Corporation</h1>
                <p className="text-xl text-purple-200">Innovating Tomorrow, Today</p>
              </div>
            </div>
          </div>
          
          {/* Company Description */}
          <div className="glass-dark p-6 md:p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">About Us</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                TechNova is a leading technology company specializing in AI, blockchain, 
                and cloud solutions. We're committed to pushing the boundaries of innovation 
                and creating products that shape the future.
              </p>
              <p>
                Our team consists of passionate individuals who thrive on challenges 
                and believe in making a difference through technology. We offer a 
                dynamic work environment, continuous learning opportunities, and 
                competitive benefits.
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="glass-dark p-6 md:p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-2 text-white">Job Application Form</h2>
          <p className="text-gray-400 mb-8">Fill out the form below to apply for your dream position</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Position Applying For *</label>
                <select
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                >
                  <option value="">Select a position</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Resume URL *</label>
              <input
                type="url"
                name="resumeUrl"
                required
                value={formData.resumeUrl}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                placeholder="https://drive.google.com/your-resume"
              />
              <p className="text-sm text-gray-500 mt-2">Share a link to your resume (Google Drive, LinkedIn, etc.)</p>
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Experience (Years) *</label>
              <input
                type="number"
                name="experience"
                required
                min="0"
                max="50"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                placeholder="3"
              />
            </div>

            {/* Row 5 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Cover Letter *</label>
              <textarea
                name="coverLetter"
                required
                value={formData.coverLetter}
                onChange={handleChange}
                rows={6}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                placeholder="Tell us why you're the perfect candidate..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-purple to-pink-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className="text-center text-gray-500 mt-4">
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}