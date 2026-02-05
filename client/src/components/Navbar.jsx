import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/auth.slice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
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
            <span className="text-xl font-display font-bold text-gradient">
              BookEase
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'PROVIDER' ? (
                  <>
                    <Link
                      to="/provider/dashboard"
                      className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/provider/services"
                      className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                      Services
                    </Link>
                    <Link
                      to="/provider/availability"
                      className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                      Availability
                    </Link>
                    <Link
                      to="/provider/bookings"
                      className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                      Bookings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/services"
                      className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                      Services
                    </Link>
                    <Link
                      to="/my-appointments"
                      className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                      My Appointments
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-slate-700 hover:text-red-600 font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;