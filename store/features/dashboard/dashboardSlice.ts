import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  DashboardState,
  DashboardStatsResponse,
  ClosedWonResponse,
  FetchClosedWonParams,
  FetchImplementedParams,
} from "@/store/types";

const initialState: DashboardState = {
  dashboardStats: null,
  isFetchingDashboardStats: false,
  fetchDashboardError: null,
  closedWonData: null,
  isFetchingClosedWon: false,
  fetchClosedWonError: null,
  implementedData: null,
  isFetchingImplemented: false,
  fetchImplementedError: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        data: DashboardStatsResponse;
      }>("/api/deal/stats/get-dashboard-stats");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats",
      );
    }
  },
);

export const fetchClosedWon = createAsyncThunk(
  "dashboard/fetchClosedWon",
  async (params: FetchClosedWonParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 5, search = "" } = params;
      const response = await axiosInstance.get<ClosedWonResponse>(
        `/api/deal/stats/closed-won?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch closed won stats",
      );
    }
  },
);

export const fetchImplemented = createAsyncThunk(
  "dashboard/fetchImplemented",
  async (params: FetchImplementedParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 5, search = "" } = params;
      const response = await axiosInstance.get<ClosedWonResponse>(
        `/api/deal/stats/implemented?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch implemented stats",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardStats: (state) => {
      state.dashboardStats = null;
      state.fetchDashboardError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isFetchingDashboardStats = true;
        state.fetchDashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isFetchingDashboardStats = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isFetchingDashboardStats = false;
        state.fetchDashboardError = action.payload as string;
      })
      .addCase(fetchClosedWon.pending, (state) => {
        state.isFetchingClosedWon = true;
        state.fetchClosedWonError = null;
      })
      .addCase(fetchClosedWon.fulfilled, (state, action) => {
        state.isFetchingClosedWon = false;
        state.closedWonData = action.payload;
      })
      .addCase(fetchClosedWon.rejected, (state, action) => {
        state.isFetchingClosedWon = false;
        state.fetchClosedWonError = action.payload as string;
      })
      .addCase(fetchImplemented.pending, (state) => {
        state.isFetchingImplemented = true;
        state.fetchImplementedError = null;
      })
      .addCase(fetchImplemented.fulfilled, (state, action) => {
        state.isFetchingImplemented = false;
        state.implementedData = action.payload;
      })
      .addCase(fetchImplemented.rejected, (state, action) => {
        state.isFetchingImplemented = false;
        state.fetchImplementedError = action.payload as string;
      });
  },
});

export const { clearDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
