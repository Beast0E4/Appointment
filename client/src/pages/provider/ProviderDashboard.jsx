import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviderBookings } from '../../redux/slices/appointment.slice';
import { fetchMyServices } from '../../redux/slices/service.slice';
import { format } from 'date-fns';

function ProviderDashboard() {
  const dispatch = useDispatch();
  const { providerBookings } = useSelector((state) => state.appointments);
  const { services } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchProviderBookings());
    dispatch(fetchMyServices());
  }, [dispatch]);

  const todayBookings = providerBookings.filter(
    (booking) =>
      format(new Date(booking.dateTime), 'yyyy-MM-dd') ===
      format(new Date(), 'yyyy-MM-dd')
  );

  const pendingBookings = providerBookings.filter(
    (booking) => booking.status === 'PENDING'
  );

  const stats = [
    {
      label: 'Total Services',
      value: services.length,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
      gradient: 'from-primary-500 to-primary-600',
      link: '/provider/services',
    },
    {
      label: "Today's Bookings",
      value: todayBookings.length,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      gradient: 'from-accent-500 to-accent-600',
      link: '/provider/bookings',
    },
    {
      label: 'Pending Requests',
      value: pendingBookings.length,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      gradient: 'from-amber-500 to-amber-600',
      link: '/provider/bookings',
    },
    {
      label: 'Total Bookings',
      value: providerBookings.length,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      link: '/provider/bookings',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="text-gradient">Provider Dashboard</span>
          </h1>
          <p className="text-lg text-slate-600">
            Manage your services and appointments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="card group hover:-translate-y-2 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {stat.icon}
                </svg>
              </div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-slate-800">
                {stat.value}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-display font-semibold mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/provider/services"
              className="card group hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Add Service</h3>
                  <p className="text-sm text-slate-500">Create new service</p>
                </div>
              </div>
            </Link>

            <Link
              to="/provider/availability"
              className="card group hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                  <h3 className="font-semibold text-slate-800">Set Availability</h3>
                  <p className="text-sm text-slate-500">Manage time slots</p>
                </div>
              </div>
            </Link>

            <Link
              to="/provider/bookings"
              className="card group hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">View Bookings</h3>
                  <p className="text-sm text-slate-500">Manage appointments</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        {todayBookings.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-display font-semibold mb-6">
              Today's Appointments
            </h2>
            <div className="space-y-4">
              {todayBookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {booking.userId?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {booking.userId?.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {booking.serviceId?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {format(new Date(booking.dateTime), 'h:mm a')}
                      </p>
                      <span className="badge badge-confirmed text-xs">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;