import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  services: [],
  loading: false,
  error: null,
};

const getAuthHeaders = () => ({
  headers: {
    "x-access-token": localStorage.getItem("token"),
  },
});

export const fetchMyServices = createAsyncThunk(
  'services/fetchMyServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/services', getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to fetch services")
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/services', serviceData, getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to create service")
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

export const fetchAllServices = createAsyncThunk(
  'services/fetchAllServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/services/all', getAuthHeaders ());
      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to fetch all services")
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all services'
      );
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/services/${serviceId}`,
        getAuthHeaders()
      );

      return serviceId;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to delete service")
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete service'
      );
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ serviceId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/services/${serviceId}`,
        data,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      toast.error (error.response?.data?.error || "Failed to update service")
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update service'
      );
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
      .addCase(fetchMyServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(
          (service) => service._id !== action.payload
        );
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.services.findIndex(
          (service) => service._id === action.payload._id
        );

        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
  },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;