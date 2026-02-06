import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  appointments: [],
  availableSlots: [],
  providerBookings: [],
  loading: false,
  error: null,
};

const getAuthHeaders = () => ({
  headers: {
    "x-access-token": localStorage.getItem("token"),
  },
});

export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchAvailableSlots',
  async ({ serviceId, date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/appointments/slots', {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
          params: {
            serviceId,
            date,
          },
        });
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to fetch slots")
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slots');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/appointments', appointmentData, getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to book appointment")
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMyAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/appointments/me', getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to fetch appointments")
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchProviderBookings = createAsyncThunk(
  'appointments/fetchProviderBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/appointments/provider', getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to fetch bookings")
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, { status }, getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to update status")
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/cancel`, null, getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to cancel appointment")
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/reschedule',
  async ({ appointmentId, date, startTime, endTime }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${appointmentId}/reschedule`, {
        date, startTime, endTime,
      }, getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to reschedule appointment")
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

      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.providerBookings.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.providerBookings[index] = action.payload;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const userIndex = state.appointments.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (userIndex !== -1) {
          state.appointments[userIndex] = action.payload;
        }
        const providerIndex = state.providerBookings.findIndex(
            (apt) => apt._id === action.payload._id
        );
        if (providerIndex !== -1) {
            state.providerBookings[providerIndex] = action.payload;
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAvailableSlots } = appointmentSlice.actions;
export default appointmentSlice.reducer;