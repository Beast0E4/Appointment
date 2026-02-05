import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyServices, createService } from '../../redux/slices/service.slice';

function ManageServices() {
  const dispatch = useDispatch();
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
      setFormData({
        name: '',
        description: '',
        duration: '',
        price: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              <span className="text-gradient">My Services</span>
            </h1>
            <p className="text-lg text-slate-600">
              Create and manage your service offerings
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Service'}
          </button>
        </div>

        {/* Add Service Form */}
        {showForm && (
          <div className="card mb-8 animate-slide-down">
            <h2 className="text-2xl font-display font-semibold mb-6">
              Create New Service
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label">
                    Service Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Haircut, Consultation"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="label">
                    Price ($)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="50.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="label">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="60"
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input-field"
                  placeholder="Describe your service..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </form>
          </div>
        )}

        {/* Services List */}
        {services.length === 0 ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Services Yet
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first service to get started
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + Add Your First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service._id}
                className="card group hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-display font-semibold mb-2 text-slate-800">
                  {service.name}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-700">
                      {service.duration} mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Price</span>
                    <span className="font-semibold text-emerald-600">
                      ${service.price}
                    </span>
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