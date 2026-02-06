import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import { fetchMyAvailability, createAvailability, updateAvailability, deleteAvailability } from '../../redux/slices/availability.slice';
import ConfirmationModal from '../../components/ConfirmationModal'

// --- Reusable Icons ---
const Icons = {
  Calendar: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Plus: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Info: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Empty: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Holiday: () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v-2m0 4h.01" /></svg>,
  Pencil: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};

// --- Helper: Convert 24h string to 12h AM/PM ---
const formatTo12Hour = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12; 
  return `${formattedHour}:${minutes} ${ampm}`;
};

// --- Helper: Format Date for Display ---
const formatDate = (dateString) => {
    // Ensure we parse it as UTC to avoid display shifts
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        timeZone: 'UTC' // Force UTC display
    });
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
  
  // State for Holiday Management
  const [expandedSlot, setExpandedSlot] = useState(null); 
  const [holidayDate, setHolidayDate] = useState('');

  // State for Editing Availability Details
  const [editingSlot, setEditingSlot] = useState(null); 
  const [editFormData, setEditFormData] = useState({ startTime: '', endTime: '', slotDuration: '' });

  // State for Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, slotId: null });

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

  // --- Create Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (name === 'dayOfWeek' || name === 'slotDuration') 
      ? (value === '' ? '' : parseInt(value, 10)) 
      : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAvailability({ ...formData, serviceId })).unwrap();
      setFormData({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 60 });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create availability:', error);
    }
  };

  // --- Edit Mode Handlers ---
  const handleEditClick = (slot) => {
    setEditingSlot(slot._id);
    setEditFormData({
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotDuration: slot.slotDuration
    });
    setExpandedSlot(null); // Close holiday drawer if open
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditFormData({ startTime: '', endTime: '', slotDuration: '' });
  };

  const handleUpdate = async () => {
    try {
        await dispatch(updateAvailability({ _id: editingSlot, ...editFormData })).unwrap();
        setEditingSlot(null);
    } catch (error) {
        // Error handled by slice toast
    }
  };

  // --- Delete Handlers ---
  const initiateDelete = (slotId) => {
    setDeleteModal({ isOpen: true, slotId });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.slotId) {
      try {
        await dispatch(deleteAvailability(deleteModal.slotId)).unwrap();
        setDeleteModal({ isOpen: false, slotId: null });
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, slotId: null });
  };

  // --- Holiday Handlers ---
  const handleAddHoliday = async (slotId, currentHolidays, requiredDayOfWeek) => {
    if (!holidayDate) return;
    
    // Parse Input Date
    const [year, month, day] = holidayDate.split('-').map(Number);
    
    // 1. FIX: Create Date at UTC Midnight (00:00:00Z) to avoid timezone shifts
    // This ensures that when serialized, it remains the correct date.
    const selectedDate = new Date(Date.UTC(year, month - 1, day));

    // 2. FIX: Use .getUTCDay() to validate the day of the week
    if (selectedDate.getUTCDay() !== requiredDayOfWeek) {
        const requiredDayLabel = daysOfWeek.find(d => d.value === requiredDayOfWeek)?.label;
        toast.error(`Invalid Date! Please select a ${requiredDayLabel}.`);
        return;
    }

    // 3. FIX: Compare using ISO String date parts to detect duplicates safely
    const isDuplicate = currentHolidays.some(h => 
      new Date(h).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    );

    if(isDuplicate) {
        toast.error("This date is already marked as a holiday.");
        return;
    }

    try {
        const updatedHolidays = [...(currentHolidays || []), selectedDate];
        await dispatch(updateAvailability({ _id: slotId, holidays: updatedHolidays })).unwrap();
        setHolidayDate('');
    } catch (error) {
        console.error('Failed to add holiday:', error);
    }
  };

  const handleRemoveHoliday = async (slotId, currentHolidays, dateToRemove) => {
    try {
        // FIX: Robust comparison using date parts
        const targetDateString = new Date(dateToRemove).toISOString().split('T')[0];
        
        const updatedHolidays = currentHolidays.filter(h => 
           new Date(h).toISOString().split('T')[0] !== targetDateString
        );
        
        await dispatch(updateAvailability({ _id: slotId, holidays: updatedHolidays })).unwrap();
    } catch (error) {
        console.error('Failed to remove holiday:', error);
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
              <SelectField label="Day of Week" id="dayOfWeek" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange}>
                {daysOfWeek.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
              </SelectField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Start Time" id="startTime" name="startTime" type="time" required value={formData.startTime} onChange={handleChange} />
                <InputField label="End Time" id="endTime" name="endTime" type="time" required value={formData.endTime} onChange={handleChange} />
              </div>

              <InputField label="Slot Duration (minutes)" id="slotDuration" name="slotDuration" type="number" min="1" required value={formData.slotDuration} onChange={handleChange} />

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200">
                  {loading ? 'Saving...' : 'Save Availability'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Availability List */}
        {availability.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-slide-up">
            <div className="flex justify-center mb-4"><Icons.Empty /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Availability Set</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't set any working hours yet.</p>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors">
              <Icons.Plus /> Set Working Hours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daysOfWeek.map((day, index) => {
              const daySlots = availability.filter((slot) => slot.dayOfWeek === day.value);
              if (daySlots.length === 0) return null;

              return (
                <div key={day.value} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Card Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">{day.label}</h3>
                    <div className="text-indigo-500 bg-indigo-100 p-1.5 rounded-lg"><Icons.Calendar /></div>
                  </div>

                  {/* Slots List */}
                  <div className="p-4 space-y-3">
                    {daySlots.map((slot) => (
                      <div key={slot._id} className="rounded-xl border border-slate-100 bg-white transition-all duration-200">
                        
                        {/* CONDITION: Check if this slot is currently being edited */}
                        {editingSlot === slot._id ? (
                           // --- EDIT MODE VIEW ---
                           <div className="p-4 bg-indigo-50/50 rounded-xl">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Start</label>
                                        <input 
                                            type="time" 
                                            name="startTime"
                                            value={editFormData.startTime} 
                                            onChange={handleEditChange}
                                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">End</label>
                                        <input 
                                            type="time" 
                                            name="endTime"
                                            value={editFormData.endTime} 
                                            onChange={handleEditChange}
                                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm" 
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                     <label className="text-xs font-bold text-slate-500 uppercase">Duration (mins)</label>
                                     <input 
                                        type="number" 
                                        name="slotDuration"
                                        min="1"
                                        value={editFormData.slotDuration} 
                                        onChange={handleEditChange}
                                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm" 
                                     />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button onClick={handleCancelEdit} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button onClick={handleUpdate} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                        <Icons.Check /> Save
                                    </button>
                                </div>
                           </div>
                        ) : (
                           // --- NORMAL VIEW ---
                           <>
                                <div className="flex flex-wrap items-center justify-between p-3 gap-3">
                                    <div className="flex items-center">
                                    <div className="text-slate-400 mr-3"><Icons.Clock /></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <span className="font-semibold text-slate-700">
                                        {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                        {slot.slotDuration}m
                                        </span>
                                    </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                        {/* Manage Holidays Button */}
                                        <button 
                                            onClick={() => setExpandedSlot(expandedSlot === slot._id ? null : slot._id)}
                                            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors border ${
                                                expandedSlot === slot._id 
                                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                            }`}
                                        >
                                            <Icons.Holiday /> 
                                            {expandedSlot === slot._id ? 'Close' : 'Holidays'}
                                        </button>

                                        {/* Edit Button */}
                                        <button 
                                            onClick={() => handleEditClick(slot)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit Slot"
                                        >
                                            <Icons.Pencil />
                                        </button>

                                        {/* Delete Button */}
                                        <button 
                                            onClick={() => initiateDelete(slot._id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Slot"
                                        >
                                            <Icons.Trash />
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable Holiday Section */}
                                {expandedSlot === slot._id && (
                                    <div className="px-4 pb-4 pt-3 bg-slate-50/80 border-t border-slate-100 animate-slide-down">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase">
                                                Add Exception Date ({day.label}s only)
                                            </label>
                                            <div className="flex space-x-2">
                                                <input 
                                                    type="date" 
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={holidayDate}
                                                    onChange={(e) => setHolidayDate(e.target.value)}
                                                    className="block w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                />
                                                <button 
                                                    onClick={() => handleAddHoliday(slot._id, slot.holidays, slot.dayOfWeek)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* List of Holidays */}
                                        {slot.holidays && slot.holidays.length > 0 ? (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {slot.holidays.map((h, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                        {formatDate(h)}
                                                        <button 
                                                            onClick={() => handleRemoveHoliday(slot._id, slot.holidays, h)}
                                                            className="ml-1.5 text-red-400 hover:text-red-600 focus:outline-none"
                                                        >
                                                            <Icons.X />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-3 text-xs text-slate-400 italic">No exceptions set for this time slot.</p>
                                        )}
                                    </div>
                                )}
                           </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Availability"
        message="Are you sure you want to delete this time slot? This action cannot be undone and clients will no longer be able to book this time."
        isLoading={loading}
        confirmText="Delete Slot"
        cancelText="Keep Slot"
        isDanger={true}
      />
    </div>
  );
}

export default ManageAvailability;