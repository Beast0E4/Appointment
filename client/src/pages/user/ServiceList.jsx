import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyServices } from '../../redux/slices/service.slice';

function ServiceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchMyServices());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="text-gradient">Available Services</span>
          </h1>
          <p className="text-lg text-slate-600">
            Browse and book appointments with our service providers
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="card text-center py-12">
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
              No Services Available
            </h3>
            <p className="text-slate-500">
              Check back later for available services
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service._id}
                className="card group hover:-translate-y-2 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/book/${service._id}`)}
              >
                {/* Service Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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

                {/* Service Details */}
                <h3 className="text-xl font-display font-semibold mb-2 text-slate-800">
                  {service.name}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Service Info */}
                <div className="flex items-center justify-between mb-4">
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
                    <span className="text-sm text-slate-600">
                      {service.duration} mins
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-slate-700">
                      ${service.price}
                    </span>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {service.providerId?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {service.providerId?.name || 'Provider'}
                    </p>
                    <p className="text-xs text-slate-500">Service Provider</p>
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full mt-4 btn-primary">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceList;