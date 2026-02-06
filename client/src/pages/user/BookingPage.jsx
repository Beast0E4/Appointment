import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval, 
  isBefore, 
  startOfDay 
} from 'date-fns';
import { 
  fetchAvailableSlots, 
  bookAppointment, 
  rescheduleAppointment, 
  clearAvailableSlots 
} from '../../redux/slices/appointment.slice';

// --- Reusable Icons ---
const Icons = {
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Calendar: () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Empty: () => <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Exclamation: () => <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const rescheduleMode = location.state?.rescheduleMode || false;
  const appointmentId = location.state?.appointmentId;
  const currentSlotDate = location.state?.currentDate;

  const { availableSlots, loading } = useSelector((state) => state.appointments);
  
  // State for selected date (for booking)
  const [selectedDate, setSelectedDate] = useState(
    rescheduleMode && currentSlotDate ? new Date(currentSlotDate) : new Date()
  );

  // State for the currently visible month in the calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // --- Calendar Logic ---
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Generate all days to be shown (including padding from prev/next months)
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return calendarDays.map((dayItem, idx) => {
      // Check if day is in the past (before today)
      const isPast = isBefore(dayItem, startOfDay(new Date()));
      const isSelected = isSameDay(dayItem, selectedDate);
      const isCurrentMonth = isSameMonth(dayItem, monthStart);
      
      return (
        <button
          key={dayItem.toString()}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(dayItem);
            // If user clicks a grayed out day from next month, switch view
            if (!isSameMonth(dayItem, currentMonth)) {
              setCurrentMonth(dayItem);
            }
          }}
          className={`
            relative h-10 w-full rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200
            ${!isCurrentMonth ? 'text-slate-300' : ''}
            ${isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-indigo-50 hover:text-indigo-600'}
            ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-700 hover:text-white transform scale-105 z-10' : 'text-slate-700'}
            ${isSameDay(dayItem, new Date()) && !isSelected ? 'text-indigo-600 font-bold border border-indigo-200' : ''}
          `}
        >
          {format(dayItem, dateFormat)}
        </button>
      );
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // --- Fetch Slots when Selected Date Changes ---
  useEffect(() => {
    if (selectedDate) {
      dispatch(
        fetchAvailableSlots({
          serviceId,
          date: format(selectedDate, 'yyyy-MM-dd'),
        })
      );
      setSelectedSlot(null);
      setErrorMessage(null);
    }
    return () => {
      dispatch(clearAvailableSlots());
    };
  }, [selectedDate, serviceId, dispatch]);

  const handleBooking = async () => {
    if (!selectedSlot) return;
    setErrorMessage(null);

    const dateObj = new Date(selectedSlot);
    const dateStr = format(dateObj, 'yyyy-MM-dd');
    const startTimeStr = format(dateObj, 'HH:mm');

    const slotData = availableSlots.find(slot => slot.startTime === startTimeStr);
    const endTimeStr = slotData ? slotData.endTime : null;

    try {
      if (rescheduleMode) {
        await dispatch(
          rescheduleAppointment({
            appointmentId,
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
          })
        ).unwrap();
      } else {
        await dispatch(
          bookAppointment({
            serviceId,
            dateTime: selectedSlot,
          })
        ).unwrap();
      }
      navigate('/my-appointments');
    } catch (error) {
      console.error('Booking/Reschedule failed:', error);
      const msg = error.message || error || "Action failed";
      
      if (msg.toLowerCase().includes("already booked") || msg.toLowerCase().includes("no longer available")) {
        setErrorMessage("This slot was just taken. Please choose another.");
        dispatch(fetchAvailableSlots({
          serviceId,
          date: format(selectedDate, 'yyyy-MM-dd'),
        }));
        setSelectedSlot(null);
      } else {
        setErrorMessage(msg);
      }
    }
  };

  console.log (availableSlots);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate(rescheduleMode ? '/my-appointments' : '/services')}
            className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium text-sm group"
          >
            <div className="bg-white p-1 rounded-lg border border-slate-200 mr-2 group-hover:border-indigo-200 transition-colors">
               <Icons.ChevronLeft />
            </div>
            {rescheduleMode ? 'Cancel Reschedule' : 'Back to Services'}
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            {rescheduleMode ? 'Reschedule Appointment' : 'Book Appointment'}
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Select a date from the calendar below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Calendar & Slots */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Calendar UI */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-slide-up">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg mr-2"><Icons.Calendar /></span>
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex space-x-2">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <Icons.ChevronLeft />
                  </button>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <Icons.ChevronRight />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg mr-2"><Icons.Clock /></span>
                Available Times for {format(selectedDate, 'MMM dd')}
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
                  <p className="text-slate-500 text-sm">Try selecting a different date</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => {
                    // Reconstruct logic
                    const [hours, minutes] = slot.startTime.split(':').map(Number);
                    const slotDateTime = new Date(selectedDate);
                    slotDateTime.setHours(hours, minutes, 0, 0);
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
                {rescheduleMode ? 'Reschedule Summary' : 'Booking Summary'}
              </h2>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start animate-pulse">
                  <Icons.Exclamation />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4 mb-8">
                {/* Date Row */}
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {rescheduleMode ? 'New Date' : 'Date'}
                    </p>
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
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {rescheduleMode ? 'New Time' : 'Time'}
                    </p>
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
                    {rescheduleMode ? 'Confirm Reschedule' : 'Confirm Booking'} <Icons.Check />
                    </>
                )}
              </button>

              <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                {rescheduleMode 
                  ? "Your previous appointment will be cancelled automatically once this is confirmed."
                  : "By confirming, you agree to our cancellation policy. You can manage this booking in your dashboard."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;