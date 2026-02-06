import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchMyServices, createService, deleteService, updateService } from '../../redux/slices/service.slice';
import ConfirmationModal from '../../components/ConfirmationModal';

// --- Reusable Icons ---
const Icons = {
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Plus: () => <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  X: () => <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Clock: () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  DotsVertical: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>,
  Pencil: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  EmptyBox: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
};

// --- Helper Components ---
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

// --- MODIFIED: SelectField now handles 'disabled' prop ---
const SelectField = ({ label, id, children, disabled, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <select
        id={id}
        disabled={disabled}
        className={`block w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm appearance-none
          ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

function ManageServices() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, loading } = useSelector((state) => state.services);
  
  const [showForm, setShowForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null); 
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  useEffect(() => {
    dispatch(fetchMyServices());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMenuClick = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setServiceToDeleteId(id);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmDelete = async () => {
    if (serviceToDeleteId) {
      try {
        await dispatch(deleteService(serviceToDeleteId)).unwrap();
        dispatch(fetchMyServices());
        setIsDeleteModalOpen(false);
        setServiceToDeleteId(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEditClick = (e, service) => {
    e.stopPropagation();
    // Pre-fill data
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
    });
    setEditingServiceId(service._id);
    setShowForm(true);
    setActiveMenuId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await dispatch(updateService({ serviceId: editingServiceId, data: formData })).unwrap();
      } else {
        await dispatch(createService(formData)).unwrap();
      }
      
      setFormData({ name: '', description: '', duration: '', price: '' });
      setShowForm(false);
      setEditingServiceId(null);
      dispatch(fetchMyServices()); 
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingServiceId(null);
    setFormData({ name: '', description: '', duration: '', price: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 animate-slide-up gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
              My Services
            </h1>
            <p className="mt-2 text-slate-500 text-lg">
              Manage your service offerings
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditingServiceId(null); setFormData({ name: '', description: '', duration: '', price: '' }); }}
            className={`inline-flex items-center px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
              showForm 
                ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-red-500' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
            }`}
          >
            {showForm ? <><Icons.X /> Cancel</> : <><Icons.Plus /> Add Service</>}
          </button>
        </div>

        {/* Service Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 mb-10 animate-slide-down">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingServiceId ? 'Update Service' : 'Create New Service'}
              </h2>
              {editingServiceId && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                  Editing Mode
                </span>
              )}
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MODIFIED: Added disabled prop based on editing status */}
                <SelectField
                  label="Service Type"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!!editingServiceId} // Disable if editing
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
                min="1" // Allows any positive number
                // step="15" // Removed to allow any minute value
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 45"
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  // required // Removed required attribute
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm resize-none"
                  placeholder="Describe what your service includes..."
                />
              </div>

              <div className="flex justify-end pt-2 space-x-3">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Saving...' : (editingServiceId ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="flex flex-col space-y-4">
          {services.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-slide-up">
              <div className="flex justify-center mb-4">
                <Icons.EmptyBox />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                No Services Yet
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                You haven't added any services yet. Create your first service to start accepting bookings.
              </p>
              <button 
                onClick={() => setShowForm(true)} 
                className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
              >
                <Icons.Plus /> Create First Service
              </button>
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service._id}
                onClick={() => navigate(`/provider/availability/${service._id}`)}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 cursor-pointer relative animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  
                  {/* Left: Icon & Info */}
                  <div className="flex items-start space-x-5 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 text-white shrink-0">
                      <Icons.Briefcase />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-1 mb-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                          <Icons.Clock />
                          <span>{service.duration} min</span>
                        </div>
                        <div className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                          ${service.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      Set Availability &rarr;
                    </span>

                    {/* Menu Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuClick(e, service._id)}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Icons.DotsVertical />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === service._id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-scale-in origin-top-right">
                          <button
                            onClick={(e) => handleEditClick(e, service)}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center transition-colors"
                          >
                            <Icons.Pencil /> Edit Service
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(e, service._id)}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors border-t border-slate-50"
                          >
                            <Icons.Trash /> Delete Service
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone and will remove all associated availability slots."
        confirmText="Delete Service"
        isDanger={true}
        isLoading={loading}
      />
    </div>
  );
}

export default ManageServices;