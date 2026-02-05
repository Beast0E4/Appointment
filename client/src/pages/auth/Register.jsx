import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/auth.slice';
import { validateRegisterForm } from '../../utils/validation'; // 1. Import Validation Utils

// --- Reusable Icons ---
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
};

// --- Helper Component for Inputs (Updated to show field-specific errors) ---
const InputField = ({ label, icon: Icon, type = "text", isPassword = false, error, ...props }) => {
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon />
        </div>
        <input
          {...props}
          type={inputType}
          className={`block w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm ${
            error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-slate-300'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            {show ? <Icons.EyeOff /> : <Icons.Eye />}
          </button>
        )}
      </div>
      {/* 2. Display specific error message */}
      {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: serverError, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['USER'], 
  });

  // 3. State for validation errors object
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific field error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleRoleToggle = (roleId) => {
    const currentRoles = formData.roles;
    let newRoles;

    if (currentRoles.includes(roleId)) {
      newRoles = currentRoles.filter(role => role !== roleId);
    } else {
      newRoles = [...currentRoles, roleId];
    }
    
    setFormData({ ...formData, roles: newRoles });
    // Clear generic role error
    if (errors.roles) {
      setErrors({ ...errors, roles: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 4. Run Validation Logic
    const { isValid, errors: validationErrors } = validateRegisterForm(formData);

    // Custom check for roles array (as validateRegisterForm might not handle array)
    if (formData.roles.length === 0) {
        validationErrors.roles = 'Please select at least one account type';
    }

    if (!isValid || validationErrors.roles) {
      setErrors(validationErrors);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Start your journey with us today
            </p>
          </div>

          {/* 5. Display Server Error Banner */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {serverError}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Full Name" 
              name="name" 
              icon={Icons.User} 
              placeholder="John Doe" 
              value={formData.name} 
              onChange={handleChange}
              error={errors.name} // Pass specific error
            />

            <InputField 
              label="Email Address" 
              name="email" 
              type="email" 
              icon={Icons.Mail} 
              placeholder="you@company.com" 
              value={formData.email} 
              onChange={handleChange} 
              error={errors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Password" 
                name="password" 
                isPassword 
                icon={Icons.Lock} 
                placeholder="••••••" 
                value={formData.password} 
                onChange={handleChange} 
                error={errors.password}
              />
              
              <InputField 
                label="Confirm" 
                name="confirmPassword" 
                isPassword 
                icon={Icons.Lock} 
                placeholder="••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                error={errors.confirmPassword}
              />
            </div>

            {/* Role Selection - Multi Select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">
                I want to act as... <span className="text-slate-400 font-normal text-xs">(Select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'USER', label: 'Client', icon: Icons.User, desc: 'Booking services' },
                  { id: 'PROVIDER', label: 'Provider', icon: Icons.Briefcase, desc: 'Offering services' }
                ].map((role) => {
                  const isSelected = formData.roles.includes(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleToggle(role.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                      } ${errors.roles ? 'border-red-300 bg-red-50' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors ${
                         isSelected ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400'
                      }`}>
                        <role.icon />
                      </div>
                      <div className="font-bold text-slate-800 text-sm">{role.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{role.desc}</div>
                      
                      {/* Selection Indicator */}
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border transition-colors flex items-center justify-center ${
                          isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Icons.Check />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Display Role Error */}
              {errors.roles && <p className="mt-2 text-xs text-red-500 ml-1">{errors.roles}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 inline-flex items-center group">
                Sign in
                <span className="transform group-hover:translate-x-1 transition-transform">
                  <Icons.ChevronRight />
                </span>
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Register;