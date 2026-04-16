import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import { DashboardState, DashboardStatsResponse } from "@/store/types";

const initialState: DashboardState = {
  dashboardStats: null,
  isFetchingDashboardStats: false,
  fetchDashboardError: null,
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
      });
  },
});

export const { clearDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
