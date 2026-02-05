import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

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
      const response = await axiosInstance.get(`/availability/${serviceId}`, getAuthHeaders ());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
    }
  }
);

export const createAvailability = createAsyncThunk(
  'availability/createAvailability',
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/availability', availabilityData, getAuthHeaders ());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create availability');
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
      .addCase(fetchMyAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(createAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability.push(action.payload);
      })
  },
});

export const { clearError } = availabilitySlice.actions;
export default availabilitySlice.reducer;