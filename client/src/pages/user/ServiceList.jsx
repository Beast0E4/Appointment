import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllServices } from '../../redux/slices/service.slice';

// --- Reusable Icons ---
const Icons = {
  Search: () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Briefcase: () => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ArrowRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
  Empty: () => <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
};

function ServiceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  const filteredServices = services.filter((service) => {
    const name = service?.name?.toLowerCase() || "";
    const description = service?.description?.toLowerCase() || "";
    const term = searchTerm?.toLowerCase() || "";

    return (
      name.includes(term) ||
      description.includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 font-medium">Loading services...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header & Search */}
        <div className="flex flex-col items-center text-center mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Services</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Discover professional services and book appointments with just a few clicks.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
            />
            {/* Search Decoration Glow */}
            <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200 -z-10"></div>
          </div>
        </div>

        {/* Services List (Full Width Stack) */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <Icons.Empty />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {services.length === 0 ? "No Services Available" : "No Matches Found"}
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {services.length === 0 
                ? "There are currently no services listed. Please check back later."
                : `We couldn't find any services matching "${searchTerm}". Try a different keyword.`
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredServices.map((service, index) => (
              <div
                key={service._id}
                onClick={() => navigate(`/book/${service._id}`)}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-indigo-900/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  
                  {/* Left: Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Icons.Briefcase />
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {service.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ${service.price}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2 md:line-clamp-1">
                      {service.description}
                    </p>

                    <div className="flex items-center space-x-6">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {service.providerId?.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {service.providerId?.name || 'Unknown Provider'}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center text-sm text-slate-400">
                        <Icons.Clock />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                    <span className="md:hidden text-sm font-medium text-indigo-600">
                      Book Now
                    </span>
                    <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Icons.ArrowRight />
                    </button>
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

export default ServiceList;