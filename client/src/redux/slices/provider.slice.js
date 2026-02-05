import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const getAuthHeaders = () => ({
  headers: {
    "x-access-token": localStorage.getItem("token"),
  },
});

export const createProviderProfile = createAsyncThunk(
  'provider/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/profile', profileData, getAuthHeaders ());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create provider profile');
    }
  }
);

export const fetchProviderProfile = createAsyncThunk(
  'provider/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/provider/profile', getAuthHeaders ());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch provider profile');
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
  },
});

export const { clearError } = providerSlice.actions;
export default providerSlice.reducer;