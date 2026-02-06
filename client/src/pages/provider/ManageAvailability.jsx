import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMyAvailability, createAvailability } from '../../redux/slices/availability.slice';

// --- Reusable Icons ---
const Icons = {
  Calendar: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Plus: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  X: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Info: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Empty: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// --- Helper: Convert 24h string to 12h AM/PM ---
const formatTo12Hour = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12; // Converts 0 to 12
  return `${formattedHour}:${minutes} ${ampm}`;
};

// --- Reusable Form Elements ---
const SelectField = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <select
        id={id}
        className="block w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm appearance-none"
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

const InputField = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <input
      id={id}
      className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
      {...props}
    />
  </div>
);

function ManageAvailability() {
  const dispatch = useDispatch();
  const { serviceId } = useParams();
  const { availability, loading } = useSelector((state) => state.availability);
  const [showForm, setShowForm] = useState(false);
  
  // Mapping numbers to labels (1 = Monday, ..., 0 = Sunday)
  const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
  ];

  const [formData, setFormData] = useState({
    dayOfWeek: 1, 
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 60,
  });

  useEffect(() => {
    dispatch(fetchMyAvailability(serviceId));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If changing day or duration, ensure it's a number
    const finalValue = (name === 'dayOfWeek' || name === 'slotDuration') 
      ? (value === '' ? '' : parseInt(value, 10)) // Handle empty input gracefully
      : value;

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAvailability({ ...formData, serviceId })).unwrap();
      // Reset form (dayOfWeek resets to 1)
      setFormData({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 60 });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[0%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 animate-slide-up gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
              Availability Settings
            </h1>
            <p className="mt-2 text-slate-500 text-lg">
              Define when clients can book appointments with you
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`inline-flex items-center px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
              showForm 
                ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-red-500' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
            }`}
          >
            {showForm ? <><Icons.X /> Cancel</> : <><Icons.Plus /> Add Time Slot</>}
          </button>
        </div>

        {/* Add Availability Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 mb-10 animate-slide-down">
            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
              Set New Availability
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <SelectField
                label="Day of Week"
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </SelectField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Start Time"
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                />
                <InputField
                  label="End Time"
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>

              {/* MODIFIED: Changed from SelectField to InputField */}
              <InputField
                label="Slot Duration (minutes)"
                id="slotDuration"
                name="slotDuration"
                type="number"
                min="1"
                placeholder="e.g. 60"
                required
                value={formData.slotDuration}
                onChange={handleChange}
              />

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Saving...' : 'Save Availability'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Availability List */}
        {availability.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-slide-up">
            <div className="flex justify-center mb-4">
              <Icons.Empty />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Availability Set
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You haven't set any working hours yet. Clients won't be able to book appointments until you add availability.
            </p>
            <button 
              onClick={() => setShowForm(true)} 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Icons.Plus /> Set Working Hours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daysOfWeek.map((day, index) => {
              const daySlots = availability.filter((slot) => slot.dayOfWeek === day.value);
              
              if (daySlots.length === 0) return null;

              return (
                <div
                  key={day.value}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up hover:shadow-md transition-shadow duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">
                      {day.label}
                    </h3>
                    <div className="text-indigo-500 bg-indigo-100 p-1.5 rounded-lg">
                      <Icons.Calendar />
                    </div>
                  </div>

                  {/* Slots List */}
                  <div className="p-4 space-y-3">
                    {daySlots.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="text-slate-400 mr-3">
                            <Icons.Clock />
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-700">
                              {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)}
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {slot.slotDuration}m slots
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-10 bg-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-800 p-3 rounded-xl shrink-0">
              <Icons.Info />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                How Availability Works
              </h4>
              <ul className="space-y-2 text-indigo-200 text-sm sm:text-base">
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span> Set specific working hours for each day of the week.</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span> The "Slot Duration" determines how long each appointment lasts.</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span> Users will only see time slots that fall within these ranges.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ManageAvailability;