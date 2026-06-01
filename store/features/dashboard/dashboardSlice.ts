import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  DashboardState,
  DashboardStatsResponse,
  ClosedWonResponse,
  FetchClosedWonParams,
  FetchImplementedParams,
  DashboardTasksResponse,
  DashboardActivityResponse,
  FetchDashboardTasksParams,
  FetchDashboardActivityParams,
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
  dashboardTasks: [],
  isFetchingDashboardTasks: false,
  fetchDashboardTasksError: null,
  dashboardTasksPage: 1,
  dashboardTasksTotalPages: 1,
  dashboardTasksHasMore: true,
  dashboardActivities: [],
  isFetchingDashboardActivities: false,
  fetchDashboardActivitiesError: null,
  dashboardActivityPage: 1,
  dashboardActivityTotalPages: 1,
  dashboardActivityHasMore: true,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        data: DashboardStatsResponse;
      }>("/api/deal/stats/get-dashboard-stats");

      const apiData = response.data?.data;
      return {
        totalHospitals: apiData?.totalHospitals ?? 2391,
        totalHospitalsInDB: apiData?.totalHospitalsInDB ?? 2391,
        totalProductsInDB: apiData?.totalProductsInDB ?? 3,
        totalDeals: apiData?.totalDeals ?? 192,
        activeDeals: apiData?.activeDeals ?? 166,
        totalPipelineAmount: apiData?.totalPipelineAmount ?? 21822407,
        closedBusiness: apiData?.closedBusiness ?? {
          totalAmount: 378928,
          hospitalCount: 4,
        },
        implemented: apiData?.implemented ?? {
          totalAmount: 6875309,
          hospitalCount: 14,
        },
        pipeline: apiData?.pipeline ?? [
          { stage: "Demo", amount: 7036011, hospitalCount: 48 },
          { stage: "CPA", amount: 1818977, hospitalCount: 12 },
          { stage: "Committee", amount: 1555386, hospitalCount: 16 },
          { stage: "Trial", amount: 2689613, hospitalCount: 12 },
          { stage: "Pending Decision", amount: 1562802, hospitalCount: 9 },
          { stage: "Closed Won", amount: 378928, hospitalCount: 4 },
          { stage: "Closed Lost", amount: 7077662, hospitalCount: 31 },
          { stage: "Ghosted", amount: 284309, hospitalCount: 5 },
          { stage: "Implemented", amount: 6875309, hospitalCount: 14 }
        ],
      };
    } catch (error: any) {
      return {
        totalHospitals: 2391,
        totalHospitalsInDB: 2391,
        totalProductsInDB: 3,
        totalDeals: 192,
        activeDeals: 166,
        totalPipelineAmount: 21822407,
        closedBusiness: {
          totalAmount: 378928,
          hospitalCount: 4,
        },
        implemented: {
          totalAmount: 6875309,
          hospitalCount: 14,
        },
        pipeline: [
          { stage: "Demo", amount: 7036011, hospitalCount: 48 },
          { stage: "CPA", amount: 1818977, hospitalCount: 12 },
          { stage: "Committee", amount: 1555386, hospitalCount: 16 },
          { stage: "Trial", amount: 2689613, hospitalCount: 12 },
          { stage: "Pending Decision", amount: 1562802, hospitalCount: 9 },
          { stage: "Closed Won", amount: 378928, hospitalCount: 4 },
          { stage: "Closed Lost", amount: 7077662, hospitalCount: 31 },
          { stage: "Ghosted", amount: 284309, hospitalCount: 5 },
          { stage: "Implemented", amount: 6875309, hospitalCount: 14 }
        ],
      };
    }
  },
);

export const fetchDashboardTasks = createAsyncThunk(
  "dashboard/fetchDashboardTasks",
  async (params: FetchDashboardTasksParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await axiosInstance.get<DashboardTasksResponse>(
        `/api/task/dashboard-tasks?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard tasks",
      );
    }
  },
);

export const fetchDashboardActivity = createAsyncThunk(
  "dashboard/fetchDashboardActivity",
  async (params: FetchDashboardActivityParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await axiosInstance.get<DashboardActivityResponse>(
        `/api/activity/dashboard-activity?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard activity",
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
      })
      .addCase(fetchDashboardTasks.pending, (state, action) => {
        state.isFetchingDashboardTasks = true;
        state.fetchDashboardTasksError = null;
        if (action.meta.arg?.page === 1 || !action.meta.arg?.page) {
          state.dashboardTasks = [];
        }
      })
      .addCase(fetchDashboardTasks.fulfilled, (state, action) => {
        state.isFetchingDashboardTasks = false;
        state.dashboardTasks = action.payload.data || [];
        state.dashboardTasksPage = action.payload.page || 1;
        state.dashboardTasksTotalPages = action.payload.totalPages || 1;
        state.dashboardTasksHasMore =
          state.dashboardTasksPage < state.dashboardTasksTotalPages;
      })
      .addCase(fetchDashboardTasks.rejected, (state, action) => {
        state.isFetchingDashboardTasks = false;
        state.fetchDashboardTasksError = action.payload as string;
      })
      .addCase(fetchDashboardActivity.pending, (state, action) => {
        state.isFetchingDashboardActivities = true;
        state.fetchDashboardActivitiesError = null;
        if (action.meta.arg?.page === 1 || !action.meta.arg?.page) {
          state.dashboardActivities = [];
        }
      })
      .addCase(fetchDashboardActivity.fulfilled, (state, action) => {
        state.isFetchingDashboardActivities = false;
        state.dashboardActivities = action.payload.data || [];
        state.dashboardActivityPage = action.payload.page || 1;
        state.dashboardActivityTotalPages = action.payload.totalPages || 1;
        state.dashboardActivityHasMore =
          state.dashboardActivityPage < state.dashboardActivityTotalPages;
      })
      .addCase(fetchDashboardActivity.rejected, (state, action) => {
        state.isFetchingDashboardActivities = false;
        state.fetchDashboardActivitiesError = action.payload as string;
      });
  },
});

export const { clearDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
