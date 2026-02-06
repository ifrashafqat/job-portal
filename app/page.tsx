import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0b1e] via-[#1e1b38] to-[#2d1b69] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation - WITHOUT ADMIN BUTTON */}
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Social Media Careers
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-purple-400 transition">Home</Link>
            <Link href="/apply" className="hover:text-purple-400 transition">Apply Now</Link>
            {/* Admin Login button has been removed per client request */}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Become Our Next <span className="text-purple-400">Social Media</span> Star
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            We're looking for creative minds to shape our digital presence. Work remotely from anywhere and build brands that inspire.
          </p>
          <Link
            href="/apply"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >
            Apply for Remote Position →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          {[
            { number: '100%', label: 'Remote Work' },
            { number: 'Global', label: 'Team Members' },
            { number: 'Flexible', label: 'Working Hours' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-dark p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-purple-400">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Job Preview Section */}
        <div className="glass-dark p-8 rounded-2xl mb-20">
          <h2 className="text-3xl font-bold mb-6 text-purple-300 text-center">Open Position</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Social Media Marketing Specialist</h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</span>
                  Full-Time Remote Position
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</span>
                  Create content for Facebook, Instagram, TikTok & more
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</span>
                  Run paid campaigns & analyze performance
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-2">✓</span>
                  Flexible hours & competitive compensation
                </li>
              </ul>
            </div>
            <div className="text-center">
              <Link
                href="/apply"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                View Full Job Details & Apply
              </Link>
              <p className="text-gray-400 mt-4 text-sm">
                Complete application takes 5-8 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 border-t border-gray-800 pt-8 mt-16">
          <p>© 2024 Social Media Careers. All rights reserved.</p>
          <p className="mt-2">Connecting talent with remote opportunities worldwide.</p>
        </footer>
      </div>
    </main>
  );
}