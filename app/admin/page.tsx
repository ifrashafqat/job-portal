'use client';

import { useState, useEffect } from 'react';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  status: string;
  appliedAt: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password protection for demo (use proper auth in production)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
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
        const data = await response.json();
        // Make sure we're getting the array from the response
        if (data.data && Array.isArray(data.data)) {
          setApplications(data.data);
        } else if (Array.isArray(data)) {
          setApplications(data);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0b1e] via-[#1a162e] to-[#2d1b69] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Applications Dashboard</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats - FIXED with Array.isArray checks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-dark p-4 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {Array.isArray(applications) ? applications.length : 0}
            </div>
            <div className="text-gray-400">Total Applications</div>
          </div>
          <div className="glass-dark p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-400">
              {Array.isArray(applications) ? applications.filter(a => a.status === 'Pending').length : 0}
            </div>
            <div className="text-gray-400">Pending</div>
          </div>
          <div className="glass-dark p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-400">
              {Array.isArray(applications) ? applications.filter(a => a.status === 'Reviewed').length : 0}
            </div>
            <div className="text-gray-400">Reviewed</div>
          </div>
          <div className="glass-dark p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-400">
              {Array.isArray(applications) ? applications.filter(a => a.position && a.position.includes('Developer')).length : 0}
            </div>
            <div className="text-gray-400">Developer Roles</div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Position</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Experience</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : !Array.isArray(applications) || applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No applications yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="border-t border-gray-800 hover:bg-gray-900/50 transition">
                      <td className="p-4 text-white">{app.fullName}</td>
                      <td className="p-4 text-gray-300">{app.email}</td>
                      <td className="p-4">
                        <span className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                          {app.position}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{app.experience} years</td>
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
                      <td className="p-4 text-gray-400">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500">
          <p>Admin Panel - Total Applications: {Array.isArray(applications) ? applications.length : 0}</p>
          <p className="text-sm mt-2">Click on any application to view details (expandable in next version)</p>
        </div>
      </div>
    </div>
  );
}