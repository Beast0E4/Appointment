import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyAvailability,
  createAvailability,
} from '../../redux/slices/availability.slice';

function ManageAvailability() {
  const dispatch = useDispatch();
  const { availability, loading } = useSelector((state) => state.availability);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 60,
  });

  useEffect(() => {
    dispatch(fetchMyAvailability());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAvailability(formData)).unwrap();
      setFormData({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 60,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create availability:', error);
    }
  };

  const daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              <span className="text-gradient">Availability</span>
            </h1>
            <p className="text-lg text-slate-600">
              Set your available time slots for bookings
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Availability'}
          </button>
        </div>

        {/* Add Availability Form */}
        {showForm && (
          <div className="card mb-8 animate-slide-down">
            <h2 className="text-2xl font-display font-semibold mb-6">
              Add Availability Slot
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="dayOfWeek" className="label">
                  Day of Week
                </label>
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className="input-field"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startTime" className="label">
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="label">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="slotDuration" className="label">
                  Slot Duration (minutes)
                </label>
                <select
                  id="slotDuration"
                  name="slotDuration"
                  value={formData.slotDuration}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Add Availability'}
              </button>
            </form>
          </div>
        )}

        {/* Availability List */}
        {availability.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <svg
              className="w-20 h-20 mx-auto mb-4 text-slate-300"
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
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Availability Set
            </h3>
            <p className="text-slate-500 mb-6">
              Add your available time slots to start accepting bookings
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + Set Your Availability
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const daySlots = availability.filter(
                (slot) => slot.dayOfWeek === day
              );

              if (daySlots.length === 0) return null;

              return (
                <div
                  key={day}
                  className="card animate-slide-up"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display font-semibold text-slate-800">
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
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
                  </div>

                  <div className="space-y-3">
                    {daySlots.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-5 h-5 text-primary-500"
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
                            <span className="font-semibold text-slate-700">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </div>
                        <div className="badge badge-confirmed">
                          {slot.slotDuration} min slots
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 mt-8 animate-slide-up">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">
                How Availability Works
              </h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Set your available days and times for each week</li>
                <li>• Choose slot duration to control booking intervals</li>
                <li>• Users can only book during your available time slots</li>
                <li>• You can add multiple time ranges for each day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAvailability;