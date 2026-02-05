import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchMyServices, createService } from '../../redux/slices/service.slice';

// --- Reusable Icons ---
const Icons = {
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Plus: () => <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  X: () => <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Clock: () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Currency: () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  EmptyBox: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
};

// --- Reusable Input Component ---
const InputField = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <input
      id={id}
      className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
      {...props}
    />
  </div>
);

// --- NEW: Reusable Select Component ---
const SelectField = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <select
        id={id}
        className="block w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm appearance-none"
        {...props}
      >
        {children}
      </select>
      {/* Custom Chevron Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

function ManageServices() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, loading } = useSelector((state) => state.services);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  useEffect(() => {
    dispatch(fetchMyServices());
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
      await dispatch(createService(formData)).unwrap();
      setFormData({ name: '', description: '', duration: '', price: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 animate-slide-up gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
              My Services
            </h1>
            <p className="mt-2 text-slate-500 text-lg">
              Manage services and set availability
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
            {showForm ? <><Icons.X /> Cancel</> : <><Icons.Plus /> Add Service</>}
          </button>
        </div>

        {/* Add Service Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 mb-10 animate-slide-down">
            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
              Create New Service
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MODIFIED: Replaced InputField with SelectField */}
                <SelectField
                  label="Service Type"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a service type</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Salon">Salon</option>
                  <option value="Car Rental">Car Rental</option>
                </SelectField>

                <InputField
                  label="Price ($)"
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50.00"
                />
              </div>

              <InputField
                label="Duration (minutes)"
                id="duration"
                name="duration"
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration}
                onChange={handleChange}
                placeholder="60"
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm resize-none"
                  placeholder="Describe what your service includes..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating...
                    </span>
                  ) : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-slide-up">
            <div className="flex justify-center mb-4">
              <Icons.EmptyBox />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Services Yet
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You haven't added any services yet. Create your first service to start accepting bookings from clients.
            </p>
            <button 
              onClick={() => setShowForm(true)} 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Icons.Plus /> Create First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {services.map((service, index) => (
              <div
                key={service._id}
                onClick={() => navigate(`/provider/availability/${service._id}`)}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 text-white">
                    <Icons.Briefcase />
                  </div>
                  
                  {/* Visual Cue that this is actionable */}
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
                    Set Availability &rarr;
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-grow">
                  {service.description}
                </p>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center text-slate-500 text-sm">
                    <Icons.Clock />
                    {service.duration} mins
                  </div>
                  <div className="flex items-center font-bold text-emerald-600 text-lg">
                    ${service.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageServices;