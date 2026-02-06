import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- Reusable Icons ---
const Icons = {
  Calendar: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Shield: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Clock: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ArrowRight: () => <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
};

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Helper booleans for readability
  const isProvider = user?.roles?.includes("PROVIDER");
  const isUser = user?.roles?.includes("USER");

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] mix-blend-multiply animate-pulse"></div>
          <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[80px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 mb-8 animate-slide-up">
            <span className="flex w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Now supporting multi-role accounts
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 animate-slide-up leading-tight">
            Seamless Booking <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Made Simple
            </span>
          </h1>

          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect with top-tier service providers or manage your own business with ease. 
            The all-in-one platform for appointments, scheduling, and growth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              <>
                {/* 1. Provider Action (Primary if Provider) */}
                {isProvider && (
                  <Link to="/provider/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-1">
                    Provider Dashboard <Icons.ArrowRight />
                  </Link>
                )}

                {/* 2. User Action (Secondary if Provider is also present, Primary if only User) */}
                {isUser && (
                  <Link 
                    to="/services" 
                    className={`inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl transition-all duration-200 hover:-translate-y-1 ${
                      isProvider 
                        ? "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm" 
                        : "text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                    }`}
                  >
                    Browse Services <Icons.ArrowRight />
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-1">
                  Get Started Free
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all duration-200">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Hero Image / Placeholder UI */}
          <div className="mt-16 relative mx-auto max-w-5xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-3xl lg:p-4">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                 {/* This represents a dashboard preview. Ideally, use a real screenshot image here. */}
                 <div className="h-64 sm:h-96 w-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 text-indigo-500">
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                      </div>
                      <p className="text-slate-400 font-medium">Interactive Dashboard Preview</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything you need to manage time
            </p>
            <p className="mt-4 text-lg text-slate-500">
              Stop playing phone tag. Our platform automates scheduling so you can focus on what you do best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                <Icons.Calendar />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Scheduling</h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time availability prevents double booking. Customize your calendar to match your specific business hours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform duration-300">
                <Icons.Shield />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600 leading-relaxed">
                Enterprise-grade encryption keeps your data safe. We prioritize your privacy and your clients' information.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                <Icons.Clock />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Availability</h3>
              <p className="text-slate-600 leading-relaxed">
                Let clients book appointments while you sleep. Your business is open even when you're not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-indigo-900 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <svg className="h-full w-full text-indigo-400" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 C 20 0 50 0 100 100 Z"></path></svg>
            </div>
            
            <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to streamline your workflow?
              </h2>
              <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto mb-8">
                Join thousands of professionals who have transformed their appointment management with BookEase.
              </p>
              
              {!isAuthenticated && (
                <Link to="/register" className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 shadow-xl">
                  Create Your Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Simple */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
           <div className="text-slate-900 font-bold text-xl mb-4 md:mb-0">BookEaxy.</div>
           <p className="text-slate-500 text-sm">© {new Date().getFullYear()} BookEaxy Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;