import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const createProviderProfile = createAsyncThunk(
  'provider/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/profile', profileData);
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
      const response = await axiosInstance.get('/provider/profile');
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
      // Create provider profile
      .addCase(createProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch provider profile
      .addCase(fetchProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = providerSlice.actions;
export default providerSlice.reducer;