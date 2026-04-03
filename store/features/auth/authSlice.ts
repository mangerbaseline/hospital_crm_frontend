import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  User,
  AuthState,
  LoginCredentials,
  ApiResponse,
  AuthResponseData,
} from "@/store/types";

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthResponseData>>(
        "/api/auth/login",
        credentials,
      );
      const { token, ...user } = response.data.data;
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await axiosInstance.get<ApiResponse<User>>("/api/auth/me");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
