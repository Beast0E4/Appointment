import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  fetchProviderBookings,
  updateAppointmentStatus,
} from '../../redux/slices/appointment.slice';

function ProviderBookings() {
  const dispatch = useDispatch();
  const { providerBookings, loading } = useSelector((state) => state.appointments);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchProviderBookings());
  }, [dispatch]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await dispatch(updateAppointmentStatus({ appointmentId, status })).unwrap();
      dispatch(fetchProviderBookings());
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-pending',
      CONFIRMED: 'badge-confirmed',
      REJECTED: 'badge-rejected',
      CANCELLED: 'badge-cancelled',
      COMPLETED: 'badge-completed',
    };
    return badges[status] || 'badge';
  };

  const filteredBookings = providerBookings.filter((booking) => {
    if (filter === 'pending') return booking.status === 'PENDING';
    if (filter === 'confirmed') return booking.status === 'CONFIRMED';
    if (filter === 'upcoming') {
      return (
        new Date(booking.dateTime) >= new Date() &&
        (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
      );
    }
    if (filter === 'past') {
      return new Date(booking.dateTime) < new Date() || booking.status === 'COMPLETED';
    }
    return true;
  });

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
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="text-gradient">All Bookings</span>
          </h1>
          <p className="text-lg text-slate-600">
            View and manage all appointment requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filter === tab.value
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Bookings Found
            </h3>
            <p className="text-slate-500">
              {filter === 'pending'
                ? 'No pending requests at the moment'
                : 'No bookings match your filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking._id}
                className="card hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {booking.userId?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold text-slate-800">
                          {booking.userId?.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {booking.userId?.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-primary-500 flex-shrink-0"
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
                        <div>
                          <p className="text-xs text-slate-500">Service</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {booking.serviceId?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-accent-500 flex-shrink-0"
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
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {format(new Date(booking.dateTime), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-emerald-500 flex-shrink-0"
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
                        <div>
                          <p className="text-xs text-slate-500">Time</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {format(new Date(booking.dateTime), 'h:mm a')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Status</p>
                          <span className={`badge ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking._id, 'CONFIRMED')
                        }
                        className="btn-success whitespace-nowrap"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking._id, 'REJECTED')
                        }
                        className="btn-danger whitespace-nowrap"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking._id, 'COMPLETED')
                      }
                      className="btn-primary whitespace-nowrap"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderBookings;