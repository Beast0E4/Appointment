import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviderBookings } from '../../redux/slices/appointment.slice';
import { fetchMyServices } from '../../redux/slices/service.slice';
import { format } from 'date-fns';

// --- Reusable Icons ---
const Icons = {
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Calendar: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CheckCircle: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  List: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  Dots: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
};

function ProviderDashboard() {
  const dispatch = useDispatch();
  const { providerBookings } = useSelector((state) => state.appointments);
  const { services } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchProviderBookings());
    dispatch(fetchMyServices());
  }, [dispatch]);

  // --- FIX 1: Update Filtering Logic ---
  // The backend sends 'date' as "YYYY-MM-DD". We simply compare strings.
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const todayBookings = providerBookings.filter(
    (booking) => booking.date === todayStr
  );

  const pendingBookings = providerBookings.filter(
    (booking) => booking.status === 'PENDING'
  );

  const stats = [
    {
      label: 'My Services',
      value: services.length,
      icon: Icons.Briefcase,
      color: 'bg-indigo-500',
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
      link: '/provider/services',
    },
    {
      label: "Today's Schedule",
      value: todayBookings.length,
      icon: Icons.Calendar,
      color: 'bg-purple-500',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/provider/bookings',
    },
    {
      label: 'Pending Requests',
      value: pendingBookings.length,
      icon: Icons.Clock,
      color: 'bg-amber-500',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      link: '/provider/bookings',
    },
    {
      label: 'Total Bookings',
      value: providerBookings.length,
      icon: Icons.CheckCircle,
      color: 'bg-emerald-500',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/provider/bookings',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Provider Dashboard
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon />
                </div>
                {/* Optional: Add a small arrow or indicator */}
                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          
          {/* Left Column: Quick Actions & Availability */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/provider/services"
                  className="flex items-center p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icons.Plus />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">Add Service</h3>
                    <p className="text-xs text-slate-500">Create new offering</p>
                  </div>
                </Link>

                {/* Note: Availability usually needs a service ID, pointing to services list for now */}
                <Link
                  to="/provider/services" 
                  className="flex items-center p-4 rounded-xl border border-slate-100 hover:border-purple-100 hover:bg-purple-50/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Icons.Settings />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">Availability</h3>
                    <p className="text-xs text-slate-500">Manage time slots via Services</p>
                  </div>
                </Link>

                <Link
                  to="/provider/bookings"
                  className="flex items-center p-4 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icons.List />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">All Bookings</h3>
                    <p className="text-xs text-slate-500">View history</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">
                  Today's Appointments
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {format(new Date(), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div className="p-6 flex-1">
                {todayBookings.length > 0 ? (
                  <div className="space-y-4">
                    {todayBookings.slice(0, 5).map((booking) => {
                      // --- FIX 2: Create valid Date object for time formatting ---
                      // booking.startTime is "HH:MM", we prepend a dummy date to parse it correctly
                      const timeObj = new Date(`2000-01-01T${booking.startTime}`);

                      return (
                        <div key={booking._id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                          <div className="flex items-center space-x-4">
                            {/* Avatar / Initials */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-md text-white font-bold text-lg">
                              {booking.userId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                {booking.userId?.name}
                              </h3>
                              <div className="flex items-center text-sm text-slate-500 mt-0.5">
                                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded mr-2">
                                  {booking.serviceId?.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-slate-800 text-lg">
                              {/* Display formatted time */}
                              {format(timeObj, 'h:mm a')}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-800 font-medium">No appointments scheduled for today.</p>
                    <p className="text-slate-500 text-sm mt-1">Enjoy your free time!</p>
                  </div>
                )}
              </div>
              
              {todayBookings.length > 5 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-center">
                   <Link to="/provider/bookings" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                     View all {todayBookings.length} appointments
                   </Link>
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default ProviderDashboard;