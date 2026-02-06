import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  availability: [],
  loading: false,
  error: null,
};

const getAuthHeaders = () => ({
  headers: {
    "x-access-token": localStorage.getItem("token"),
  },
});

export const fetchMyAvailability = createAsyncThunk(
  'availability/fetchMyAvailability',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/availability/${serviceId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch availability");
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
    }
  }
);

export const createAvailability = createAsyncThunk(
  'availability/createAvailability',
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/availability', availabilityData, getAuthHeaders());
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create availability");
      return rejectWithValue(error.response?.data?.message || 'Failed to create availability');
    }
  }
);

export const updateAvailability = createAsyncThunk(
  'availability/updateAvailability',
  async ({ _id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/availability/${_id}`, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update availability");
      return rejectWithValue(error.response?.data?.message || 'Failed to update availability');
    }
  }
);

export const deleteAvailability = createAsyncThunk(
  'availability/deleteAvailability',
  async (availabilityId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/availability/${availabilityId}`, getAuthHeaders());
      return availabilityId;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete availability");
      return rejectWithValue(error.response?.data?.message || 'Failed to delete availability');
    }
  }
);

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(fetchMyAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability.push(action.payload);
      })
      .addCase(createAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.availability.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.availability[index] = action.payload;
        }
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = state.availability.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = availabilitySlice.actions;
export default availabilitySlice.reducer;