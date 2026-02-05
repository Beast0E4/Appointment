import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center animate-slide-up">
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
              <span className="text-gradient">Effortless</span>
              <br />
              <span className="text-slate-800">Appointment Booking</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Connect with service providers and book appointments seamlessly. Whether you're a doctor, salon, or consultant - we've got you covered.
            </p>

            {isAuthenticated ? (
              <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {user?.role === 'PROVIDER' ? (
                  <Link to="/provider/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/services" className="btn-primary">
                    Browse Services
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Link to="/register" className="btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="text-gradient">Why Choose BookEase?</span>
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need for seamless appointment management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group hover:-translate-y-2 animate-slide-up">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-slate-600">
                Book appointments in seconds with our intuitive calendar interface. See real-time availability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card group hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Secure & Private</h3>
              <p className="text-slate-600">
                Your data is encrypted and protected. We take privacy seriously with enterprise-grade security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card group hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">24/7 Access</h3>
              <p className="text-slate-600">
                Book or manage appointments anytime, anywhere. Mobile-friendly and always available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-primary-500 to-accent-500 text-white text-center p-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust BookEase for their appointment needs
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 hover:scale-105 transition-all duration-200 shadow-xl">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;