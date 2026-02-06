'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // We'll use Next.js Image for better performance

// NEW Interface matching your updated database schema
interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  ssn_no: string;
  occupation: string;
  address: string;
  city: string;
  state_province: string;
  zip_postal_code: string;
  country: string;
  role: string;
  ssn_image_url: string;
  license_image_url: string;
  status: string;
  applied_at: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'detail'>('table');

 // Simple password protection - now uses environment variable
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  
  if (password === adminPassword) {
    setAuthenticated(true);
  } else {
    alert('Incorrect password');
  }
};

  useEffect(() => {
    if (authenticated) {
      fetchApplications();
    }
  }, [authenticated]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const result = await response.json();
        
        // Handle the API response format
        if (result.data && Array.isArray(result.data)) {
          setApplications(result.data);
        } else {
          setApplications([]);
        }
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (app: Application) => {
    setSelectedApp(app);
    setViewMode('detail');
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // For now, we'll just update locally
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      // In future, you can add API call to update in Supabase
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0b1e] via-[#1a162e] to-[#2d1b69] flex items-center justify-center p-4">
        <div className="glass-dark p-8 rounded-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-purple focus:outline-none"
                placeholder="Enter admin password"
              />
              <p className="text-sm text-gray-500 mt-2">Demo password: admin123</p>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-purple to-pink-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0b1e] via-[#1a162e] to-[#2d1b69] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Application Details</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode('table')}
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back to List
              </button>
              <button
                onClick={() => setAuthenticated(false)}
                className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Application Details Card */}
          <div className="glass-dark rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-4">Personal Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      <p className="text-white">{selectedApp.first_name} {selectedApp.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white">{selectedApp.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Phone</label>
                      <p className="text-white">{selectedApp.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">SSN/Tax ID</label>
                      <p className="text-white font-mono">{selectedApp.ssn_no}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Occupation</label>
                      <p className="text-white">{selectedApp.occupation}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-4">Address & Position</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Address</label>
                      <p className="text-white">{selectedApp.address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">City, State, ZIP</label>
                      <p className="text-white">{selectedApp.city}, {selectedApp.state_province} {selectedApp.zip_postal_code}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Country</label>
                      <p className="text-white">{selectedApp.country}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Applied Role</label>
                      <p className="text-white font-semibold">{selectedApp.role}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          selectedApp.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-300' :
                          selectedApp.status === 'Reviewed' ? 'bg-blue-900/30 text-blue-300' :
                          selectedApp.status === 'Accepted' ? 'bg-green-900/30 text-green-300' :
                          'bg-red-900/30 text-red-300'
                        }`}>
                          {selectedApp.status}
                        </span>
                        <select 
                          value={selectedApp.status}
                          onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                          className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Images */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-purple-300 mb-4">Uploaded Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">SSN / Tax ID Document</h3>
                    {selectedApp.ssn_image_url ? (
                      <a 
                        href={selectedApp.ssn_image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition">
                          <div className="aspect-video bg-gray-800 rounded flex items-center justify-center mb-2 overflow-hidden">
                            {/* Using img tag for external images */}
                            <img 
                              src={selectedApp.ssn_image_url} 
                              alt="SSN Document" 
                              className="max-h-48 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzE3MTgyMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM4ODg4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TU04gRG9jdW1lbnQ8L3RleHQ+PC9zdmc+';
                              }}
                            />
                          </div>
                          <p className="text-center text-sm text-gray-400">Click to view full image</p>
                        </div>
                      </a>
                    ) : (
                      <div className="bg-gray-900 rounded-lg p-8 text-center border border-dashed border-gray-700">
                        <p className="text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Driver's License / State ID</h3>
                    {selectedApp.license_image_url ? (
                      <a 
                        href={selectedApp.license_image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition">
                          <div className="aspect-video bg-gray-800 rounded flex items-center justify-center mb-2 overflow-hidden">
                            <img 
                              src={selectedApp.license_image_url} 
                              alt="License Document" 
                              className="max-h-48 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzE3MTgyMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM4ODg4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ecml2ZXIncyBMaWNlbnNlPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                          </div>
                          <p className="text-center text-sm text-gray-400">Click to view full image</p>
                        </div>
                      </a>
                    ) : (
                      <div className="bg-gray-900 rounded-lg p-8 text-center border border-dashed border-gray-700">
                        <p className="text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  Applied on: {new Date(selectedApp.applied_at).toLocaleString()} | 
                  Application ID: {selectedApp.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TABLE VIEW MODE
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0b1e] via-[#1a162e] to-[#2d1b69] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Applications Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchApplications}
              className="bg-purple-700 px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              Refresh
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Applications Table - Shows ALL important fields */}
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Phone</th>
                  <th className="text-left p-4 text-gray-400 font-medium">SSN</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Occupation</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      No applications yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-t border-gray-800 hover:bg-gray-900/50 transition">
                      <td className="p-4 text-white">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="p-4 text-gray-300">{app.email}</td>
                      <td className="p-4 text-gray-300">{app.phone}</td>
                      <td className="p-4 text-gray-300 font-mono text-sm">{app.ssn_no}</td>
                      <td className="p-4 text-gray-300">{app.occupation}</td>
                      <td className="p-4 text-gray-300">
                        {app.city}, {app.state_province}
                      </td>
                      <td className="p-4">
                        <span className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                          {app.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          app.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-300' :
                          app.status === 'Reviewed' ? 'bg-blue-900/30 text-blue-300' :
                          app.status === 'Accepted' ? 'bg-green-900/30 text-green-300' :
                          'bg-red-900/30 text-red-300'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button 
                          className="text-sm bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 px-3 py-1 rounded transition mr-2"
                          onClick={() => viewDetails(app)}
                        >
                          View All
                        </button>
                        <button 
                          className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition"
                          onClick={() => {
                            navigator.clipboard.writeText(`
Name: ${app.first_name} ${app.last_name}
Email: ${app.email}
Phone: ${app.phone}
SSN: ${app.ssn_no}
Address: ${app.address}, ${app.city}, ${app.state_province} ${app.zip_postal_code}, ${app.country}
Role: ${app.role}
                            `.trim());
                            alert('Application details copied to clipboard!');
                          }}
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-500">
          <p>Total Applications: <span className="text-white">{applications.length}</span></p>
          <p className="text-sm mt-2">
            {applications.filter(a => a.status === 'Pending').length} pending • 
            {applications.filter(a => a.status === 'Reviewed').length} reviewed • 
            {applications.filter(a => a.role === 'Social Media Marketing Specialist (Remote)').length} for Social Media role
          </p>
        </div>
      </div>
    </div>
  );
}