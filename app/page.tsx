import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0b1e] via-[#1e1b38] to-[#2d1b69] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            TechNova Corp
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-purple-400 transition">Home</Link>
            <Link href="/apply" className="hover:text-purple-400 transition">Apply Now</Link>
            <Link href="/admin" className="bg-purple-700 px-4 py-2 rounded-lg hover:bg-purple-600 transition">
              Admin Login
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Join Our <span className="text-purple-400">Innovative</span> Team
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            We're building the future of technology. Be part of something extraordinary.
          </p>
          <Link
            href="/apply"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >
            Apply Now →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          {[
            { number: '50+', label: 'Open Positions' },
            { number: '15+', label: 'Countries' },
            { number: '500+', label: 'Team Members' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-dark p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-purple-400">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 border-t border-gray-800 pt-8 mt-16">
          <p>© 2024 TechNova Corp. All rights reserved.</p>
          <p className="mt-2">Building the future, one innovation at a time.</p>
        </footer>
      </div>
    </main>
  );
}