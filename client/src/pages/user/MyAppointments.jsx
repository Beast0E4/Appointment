import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  fetchMyAppointments,
  cancelAppointment,
} from '../../redux/slices/appointment.slice';

function MyAppointments() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointments);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

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

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await dispatch(cancelAppointment(appointmentId));
      dispatch(fetchMyAppointments());
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'upcoming') {
      return new Date(apt.dateTime) >= new Date() && apt.status !== 'CANCELLED';
    }
    if (filter === 'past') {
      return new Date(apt.dateTime) < new Date() || apt.status === 'COMPLETED';
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="text-gradient">My Appointments</span>
          </h1>
          <p className="text-lg text-slate-600">
            View and manage all your appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              filter === 'upcoming'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              filter === 'past'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
            }`}
          >
            Past
          </button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Appointments Found
            </h3>
            <p className="text-slate-500 mb-6">
              You haven't booked any appointments yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment._id}
                className="card hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
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
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold text-slate-800">
                          {appointment.serviceId?.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          with {appointment.providerId?.name || 'Provider'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-slate-600">
                          {format(new Date(appointment.dateTime), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-accent-500"
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
                          {format(new Date(appointment.dateTime), 'h:mm a')}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`badge ${getStatusBadge(appointment.status)}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {appointment.status === 'PENDING' ||
                  appointment.status === 'CONFIRMED' ? (
                    <div className="flex space-x-3 mt-4 lg:mt-0">
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="btn-danger"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;