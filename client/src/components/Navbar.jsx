import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/auth.slice';

// --- Reusable Icons ---
const Icons = {
  Logo: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

// --- Helper for Navigation Links ---
const NavLink = ({ to, children, mobile = false, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = mobile
    ? "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
    : "text-sm font-medium transition-colors duration-200";

  const activeClasses = isActive
    ? "text-indigo-600 bg-indigo-50 font-semibold"
    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50";

  return (
    <Link to={to} className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
      {children}
    </Link>
  );
};

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check roles (safely handle undefined roles)
  const isProvider = user?.roles?.includes('PROVIDER');
  // Assume generic USER role is present or implied if authenticated, 
  // but explicitly checking allows for stricter control.
  const isClient = user?.roles?.includes('USER'); 

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Icons.Logo />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              BookEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-5">
                  {/* Provider Links */}
                  {isProvider && (
                    <>
                      <NavLink to="/provider/dashboard">Dashboard</NavLink>
                      <NavLink to="/provider/services">My Services</NavLink>
                      {/* Only show Availability link if needed globally, usually accessed via Services */}
                      {/* <NavLink to="/provider/availability">Availability</NavLink> */} 
                      <NavLink to="/provider/bookings">Client Requests</NavLink>
                    </>
                  )}

                  {/* Separator if user has both roles */}
                  {isProvider && isClient && (
                    <div className="h-5 w-px bg-slate-300 mx-2"></div>
                  )}

                  {/* Client/User Links */}
                  {isClient && (
                    <>
                      <NavLink to="/services">Browse</NavLink>
                      <NavLink to="/my-appointments">My Appointments</NavLink>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 ml-2"></div>

                {/* User Profile & Logout */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 pl-2 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                    <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Logout"
                  >
                    <Icons.Logout />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-indigo-600 p-2 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-slide-down h-screen overflow-y-auto pb-20">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                {/* Profile Header Mobile */}
                <div className="px-3 py-4 mb-2 flex items-center space-x-3 border-b border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>

                {/* Provider Section */}
                {isProvider && (
                  <div className="py-2">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Provider Area</p>
                    <NavLink mobile to="/provider/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
                    <NavLink mobile to="/provider/services" onClick={() => setIsMobileMenuOpen(false)}>My Services</NavLink>
                    <NavLink mobile to="/provider/bookings" onClick={() => setIsMobileMenuOpen(false)}>Client Requests</NavLink>
                  </div>
                )}

                {/* Divider if both */}
                {isProvider && isClient && <div className="border-t border-slate-100 my-2"></div>}

                {/* Client Section */}
                {isClient && (
                  <div className="py-2">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Personal</p>
                    <NavLink mobile to="/services" onClick={() => setIsMobileMenuOpen(false)}>Browse Services</NavLink>
                    <NavLink mobile to="/my-appointments" onClick={() => setIsMobileMenuOpen(false)}>My Appointments</NavLink>
                  </div>
                )}
                
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="mr-2"><Icons.Logout /></span>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="grid gap-3 p-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;