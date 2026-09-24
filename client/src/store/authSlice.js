import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import { getToken, getStoredUser, saveAuth, clearAuth } from '../utils/storage';

export const login = createAsyncThunk('auth/login', async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const data = await authService.loginUser({ email, password, rememberMe });
    saveAuth(data.token, data.user, rememberMe);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.registerUser(payload);
    saveAuth(data.token, data.user, false);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// used on app start to make sure the stored token is still valid
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await authService.getCurrentUser();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const initialState = {
  token: getToken(),
  user: getStoredUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearAuth();
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state, { payload }) => {
      state.loading = false;
      state.token = payload.token;
      state.user = payload.user;
    };
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilled)
      .addCase(login.rejected, rejected)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, fulfilled)
      .addCase(register.rejected, rejected)
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
