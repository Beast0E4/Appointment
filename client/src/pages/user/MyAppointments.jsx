import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { format } from 'date-fns';
import { fetchMyAppointments, cancelAppointment } from '../../redux/slices/appointment.slice';
import ConfirmationModal from '../../components/ConfirmationModal';

// --- Reusable Icons ---
const Icons = {
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  X: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Empty: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

function MyAppointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { appointments, loading } = useSelector((state) => state.appointments);
  const [filter, setFilter] = useState('all');

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const getStatusStyles = (status) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
      CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      CANCELLED: 'bg-slate-100 text-slate-800 border-slate-200',
      COMPLETED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-800';
  };

  const openCancelModal = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (appointmentToCancel) {
      await dispatch(cancelAppointment(appointmentToCancel));
      dispatch(fetchMyAppointments());
      setIsCancelModalOpen(false);
      setAppointmentToCancel(null);
    }
  };

  // 2. Handle Reschedule Navigation
  const handleReschedule = (appointment) => {
    // Navigate to the booking page for this service, but passing state to indicate it's a reschedule
    navigate(`/book/${appointment.serviceId._id}`, { 
      state: { 
        rescheduleMode: true, 
        appointmentId: appointment._id,
        currentDate: appointment.date,
        currentSlot: appointment.startTime
      } 
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    const aptDateTime = new Date(`${apt.date}T${apt.startTime}`);
    const now = new Date();

    if (filter === 'upcoming') {
      return aptDateTime >= now && apt.status !== 'CANCELLED' && apt.status !== 'REJECTED';
    }
    if (filter === 'past') {
      return aptDateTime < now || apt.status === 'COMPLETED';
    }
    return true;
  });

  if (loading && !isCancelModalOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 font-medium">Loading schedule...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] -left-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            My Appointments
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Track your upcoming sessions and history
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {['all', 'upcoming', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border capitalize ${
                filter === tab
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-center mb-4">
              <Icons.Empty />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Appointments Found
            </h3>
            <p className="text-slate-500">
              {filter === 'upcoming' 
                ? "You don't have any upcoming bookings." 
                : "You haven't booked any services yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => {
              const displayDate = new Date(`${appointment.date}T${appointment.startTime}`);
              const displayTime = new Date(`2000-01-01T${appointment.startTime}`);

              return (
                <div
                  key={appointment._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${(index + 1) * 0.05}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Side: Info */}
                    <div className="flex-1">
                      <div className="flex items-start md:items-center space-x-4 mb-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md">
                          <Icons.Briefcase />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {appointment.serviceId?.name}
                          </h3>
                          <p className="text-sm text-slate-500 flex items-center">
                            with {appointment.providerId?.name || 'Provider'}
                          </p>
                        </div>
                         {/* Mobile Status */}
                         <div className="ml-auto lg:hidden">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyles(appointment.status)}`}>
                              {appointment.status}
                            </span>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3">
                           <div className="text-indigo-500"><Icons.Calendar /></div>
                           <span className="text-sm font-semibold text-slate-700">
                            {format(displayDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-purple-500"><Icons.Clock /></div>
                          <span className="text-sm font-semibold text-slate-700">
                            {format(displayTime, 'h:mm a')}
                          </span>
                        </div>

                        <div className="hidden lg:flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Actions (Stacked Column) */}
                    {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                      <div className="flex flex-col space-y-3 w-full lg:w-auto mt-4 lg:mt-0">
                        {/* Cancel Button */}
                        <button
                          onClick={() => openCancelModal(appointment._id)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm font-medium text-sm"
                        >
                          <Icons.X /> Cancel Booking
                        </button>

                        {/* Reschedule Button */}
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl hover:bg-indigo-100 hover:border-indigo-200 transition-all shadow-sm font-medium text-sm"
                        >
                          <Icons.Refresh /> Reschedule
                        </button>
                      </div>
                    )}
                    
                    {['COMPLETED', 'CANCELLED', 'REJECTED'].includes(appointment.status) && (
                       <div className="flex items-center justify-end lg:w-32">
                          <span className="text-xs text-slate-400 font-medium italic">Archived</span>
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        isDanger={true}
        isLoading={loading}
      />
    </div>
  );
}

export default MyAppointments;