import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import serviceReducer from './slices/service.slice';
import appointmentReducer from './slices/appointment.slice';
import availabilityReducer from './slices/availability.slice';
import providerReducer from './slices/provider.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    appointments: appointmentReducer,
    availability: availabilityReducer,
    provider: providerReducer,
  },
});

export default store;