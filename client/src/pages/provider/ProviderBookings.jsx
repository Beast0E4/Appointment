import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fetchProviderBookings, updateAppointmentStatus } from '../../redux/slices/appointment.slice';

// --- Reusable Icons ---
const Icons = {
  Clock: () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Empty: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
};

function ProviderBookings() {
  const dispatch = useDispatch();
  const { providerBookings, loading } = useSelector((state) => state.appointments);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchProviderBookings());
  }, [dispatch]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await dispatch(updateAppointmentStatus({ appointmentId, status })).unwrap();
      dispatch(fetchProviderBookings());
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusStyles = (status) => {
    const styles = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20',
      CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500/20',
      REJECTED: 'bg-red-50 text-red-700 border-red-100 ring-red-500/20',
      CANCELLED: 'bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/20',
      COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20',
    };
    return styles[status] || 'bg-slate-50 text-slate-600';
  };

  const filteredBookings = providerBookings.filter((booking) => {
    const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
    const now = new Date();

    if (filter === 'pending') return booking.status === 'PENDING';
    if (filter === 'confirmed') return booking.status === 'CONFIRMED';
    
    if (filter === 'upcoming') {
      return (
        bookingDate >= now &&
        (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
      );
    }
    
    if (filter === 'past') {
      return bookingDate < now || booking.status === 'COMPLETED';
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 font-medium">Loading bookings...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Client Bookings
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Manage your schedule and incoming requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending Request' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'History' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                filter === tab.value
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-center mb-4">
              <Icons.Empty />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Bookings Found
            </h3>
            <p className="text-slate-500">
              {filter === 'pending'
                ? 'Great! You are all caught up on requests.'
                : 'No bookings match the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredBookings.map((booking, index) => {
              const displayDate = new Date(`${booking.date}T${booking.startTime}`);
              const displayTime = new Date(`2000-01-01T${booking.startTime}`);

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${(index + 1) * 0.05}s` }}
                >
                  <div className="flex flex-col md:flex-row">
                    
                    {/* LEFT: Date Badge Section */}
                    <div className="hidden md:flex flex-col items-center justify-center p-6 bg-slate-50 w-32 border-r border-slate-100 flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-1">
                        {format(displayDate, 'MMM')}
                      </span>
                      <span className="text-3xl font-extrabold text-slate-800">
                        {format(displayDate, 'dd')}
                      </span>
                      <span className="text-xs font-medium text-slate-400 mt-1">
                        {format(displayDate, 'yyyy')}
                      </span>
                    </div>

                    {/* MIDDLE: Content */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      {/* Mobile Date Header */}
                      <div className="md:hidden flex items-center mb-4 pb-4 border-b border-slate-50">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold mr-3">
                          {format(displayDate, 'MMM dd')}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusStyles(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Service & Time Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                              <Icons.Briefcase />
                              {booking.serviceId?.name || 'Unknown Service'}
                            </span>
                            {/* FIX: Combined classNames here */}
                            <span className={`hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ring-1 ring-inset transition-colors duration-200 uppercase tracking-wide scale-90 origin-left opacity-80 ${getStatusStyles(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="flex items-baseline space-x-2 mt-2">
                            <h3 className="text-xl font-bold text-slate-800">
                              {format(displayTime, 'h:mm a')}
                            </h3>
                            <span className="text-sm text-slate-400 font-medium">
                              - {format(displayDate, 'EEEE')}
                            </span>
                          </div>
                        </div>

                        {/* Divider on Large Screens */}
                        <div className="hidden lg:block w-px h-12 bg-slate-100 mx-4"></div>

                        {/* Client Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {booking.userId?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {booking.userId?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.userId?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="bg-slate-50 p-4 md:p-6 md:w-48 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center items-center">
                      {booking.status === 'PENDING' ? (
                        <div className="flex flex-col space-y-2 w-full">
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'CONFIRMED')}
                            className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium text-sm"
                          >
                            <Icons.Check /> Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'REJECTED')}
                            className="w-full flex items-center justify-center px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                          >
                            <Icons.X /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-400 italic text-center">
                          {booking.status === 'CONFIRMED' ? 'Scheduled' : 'No actions'}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderBookings;