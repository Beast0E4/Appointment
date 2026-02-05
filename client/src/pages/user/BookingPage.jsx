import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fetchAvailableSlots, bookAppointment, clearAvailableSlots } from '../../redux/slices/appointment.slice';

// --- Reusable Icons ---
const Icons = {
  ChevronLeft: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  Calendar: () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Empty: () => <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { availableSlots, loading } = useSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  // Generate next 7 days
  useEffect(() => {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setWeekDates(dates);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      dispatch(
        fetchAvailableSlots({
          serviceId,
          date: format(selectedDate, 'yyyy-MM-dd'),
        })
      );
      setSelectedSlot(null);
    }
    return () => {
      dispatch(clearAvailableSlots());
    };
  }, [selectedDate, serviceId, dispatch]);

  const handleBooking = async () => {
    if (!selectedSlot) return;
    try {
      await dispatch(bookAppointment({ serviceId, dateTime: selectedSlot })).unwrap();
      navigate('/my-appointments');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium text-sm group"
          >
            <div className="bg-white p-1 rounded-lg border border-slate-200 mr-2 group-hover:border-indigo-200 transition-colors">
               <Icons.ChevronLeft />
            </div>
            Back to Services
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Book Appointment
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Select a convenient date and time for your session
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Calendar & Slots */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Date Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg mr-2"><Icons.Calendar /></span>
                Select Date
              </h2>

              {/* Horizontal Scrollable Date Picker */}
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {weekDates.map((date) => {
                  const isSelected = isSameDay(date, selectedDate);
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-20 p-3 rounded-2xl text-center transition-all duration-200 border-2 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 transform scale-105'
                          : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className={`text-xs font-medium mb-1 uppercase ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {format(date, 'EEE')}
                      </div>
                      <div className="text-xl font-bold">
                        {format(date, 'd')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg mr-2"><Icons.Clock /></span>
                Available Times
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-12">
                   <div className="flex flex-col items-center">
                      <svg className="animate-spin h-8 w-8 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-slate-400 text-sm">Checking availability...</span>
                   </div>
                </div>
              ) : availableSlots?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                  <Icons.Empty />
                  <p className="text-slate-800 font-medium">No slots available</p>
                  <p className="text-slate-500 text-sm">Please select another date</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => {
                    // --- 1. Construct Date Object ---
                    // Combine 'selectedDate' (Date) with 'slot.startTime' ("HH:MM")
                    const [hours, minutes] = slot.startTime.split(':').map(Number);
                    const slotDateTime = new Date(selectedDate);
                    slotDateTime.setHours(hours, minutes, 0, 0);

                    // --- 2. Create ISO String for Value ---
                    // This is what we store in state and send to backend
                    const slotIsoString = slotDateTime.toISOString();

                    const isSelected = selectedSlot === slotIsoString;
                    const isDisabled = !slot.isAvailable;

                    return (
                      <button
                        key={slot.startTime}
                        onClick={() => !isDisabled && setSelectedSlot(slotIsoString)}
                        disabled={isDisabled}
                        className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-200 ring-offset-1'
                            : isDisabled 
                              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed decoration-slate-300 line-through'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm'
                        }`}
                      >
                        {format(slotDateTime, 'h:mm a')}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Booking Summary
              </h2>

              <div className="space-y-4 mb-8">
                {/* Date Row */}
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Date</p>
                    <p className="font-bold text-slate-800">
                      {format(selectedDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Time Row */}
                <div className={`flex items-center p-3 rounded-xl border transition-all duration-300 ${
                    selectedSlot 
                    ? 'bg-purple-50 border-purple-100' 
                    : 'bg-slate-50 border-slate-100 opacity-60'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 ${
                      selectedSlot ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-400'
                  }`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Time</p>
                    <p className="font-bold text-slate-800">
                      {selectedSlot ? format(new Date(selectedSlot), 'h:mm a') : 'Select a time'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedSlot || loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {loading ? 'Processing...' : (
                    <>
                    Confirm Booking <Icons.Check />
                    </>
                )}
              </button>

              <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                By confirming, you agree to our cancellation policy. You can manage this booking in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;