import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

const initialState = {
  appointments: [],
  availableSlots: [],
  providerBookings: [],
  loading: false,
  error: null,
};

export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchAvailableSlots',
  async ({ providerId, serviceId, date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/appointments/slots', {
        params: { providerId, serviceId, date },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slots');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMyAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/appointments/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchProviderBookings = createAsyncThunk(
  'appointments/fetchProviderBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/appointments/provider');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/reschedule',
  async ({ appointmentId, newDateTime }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/reschedule`, {
        newDateTime,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my appointments
      .addCase(fetchMyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch provider bookings
      .addCase(fetchProviderBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.providerBookings = action.payload;
      })
      .addCase(fetchProviderBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update appointment status
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.providerBookings.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.providerBookings[index] = action.payload;
        }
      })
      // Cancel appointment
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      // Reschedule appointment
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearAvailableSlots } = appointmentSlice.actions;
export default appointmentSlice.reducer;