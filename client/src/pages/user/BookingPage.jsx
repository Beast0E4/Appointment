import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, addDays, startOfWeek } from 'date-fns';
import {
  fetchAvailableSlots,
  bookAppointment,
  clearAvailableSlots,
} from '../../redux/slices/appointment.slice';

function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { availableSlots, loading } = useSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    // Generate week dates
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
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
    }
    return () => {
      dispatch(clearAvailableSlots());
    };
  }, [selectedDate, serviceId, dispatch]);

  const handleBooking = async () => {
    if (!selectedSlot) return;

    try {
      await dispatch(
        bookAppointment({
          serviceId,
          dateTime: selectedSlot,
        })
      ).unwrap();

      navigate('/my-appointments');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center text-slate-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Services
          </button>
          <h1 className="text-4xl font-display font-bold">
            <span className="text-gradient">Book Appointment</span>
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            Select your preferred date and time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up">
              <h2 className="text-xl font-display font-semibold mb-6">
                Select Date
              </h2>

              {/* Week Calendar */}
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                  const isSelected =
                    format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  const isPast = date < new Date().setHours(0, 0, 0, 0);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => !isPast && setSelectedDate(date)}
                      disabled={isPast}
                      className={`p-4 rounded-xl text-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg scale-105'
                          : isPast
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-2 border-slate-200 hover:border-primary-300 hover:scale-105'
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {format(date, 'EEE')}
                      </div>
                      <div className="text-2xl font-bold">
                        {format(date, 'd')}
                      </div>
                      <div className="text-xs mt-1">{format(date, 'MMM')}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Available Times</h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-slate-300"
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
                    <p>No available slots for this date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl text-center font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg scale-105'
                              : 'bg-slate-50 border-2 border-slate-200 hover:border-primary-300 hover:scale-105'
                          }`}
                        >
                          {format(new Date(slot), 'h:mm a')}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-display font-semibold mb-6">
                Booking Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="font-semibold text-slate-800">
                      {format(selectedDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {selectedSlot && (
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl animate-scale-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="font-semibold text-slate-800">
                        {format(new Date(selectedSlot), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedSlot || loading}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>

              <p className="text-xs text-slate-500 mt-4 text-center">
                You can cancel or reschedule later if needed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;