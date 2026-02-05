import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

const initialState = {
  services: [],
  loading: false,
  error: null,
};

export const fetchMyServices = createAsyncThunk(
  'services/fetchMyServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/services');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/services', serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchMyServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchMyServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;