import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  ActivityState,
  CreateActivityPayload,
  DeleteActivityPayload,
  ApiResponse,
  FetchAllActivitiesResponse,
  FetchActivitiesParams,
} from "@/store/types";

const initialState: ActivityState = {
  activities: [],
  totalActivities: 0,
  isFetchingActivities: false,
  fetchActivitiesError: null,
  isCreateActivityLoading: false,
  createActivityError: null,
  isDeleteActivityLoading: false,
  deleteActivityError: null,
};

export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async (payload: CreateActivityPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>(
        "/api/activity/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create activity",
      );
    }
  },
);

export const deleteActivity = createAsyncThunk(
  "activity/deleteActivity",
  async (payload: DeleteActivityPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<ApiResponse<any>>(
        "/api/activity/delete",
        { data: payload },
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete activity",
      );
    }
  },
);
export const fetchAllActivities = createAsyncThunk(
  "activity/fetchAllActivities",
  async (params: FetchActivitiesParams | undefined, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.hospitalId)
        queryParams.append("hospitalId", params.hospitalId);
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await axiosInstance.get<FetchAllActivitiesResponse>(
        `/api/activity/all-activities?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activities",
      );
    }
  },
);

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    resetActivityStatus: (state) => {
      state.isFetchingActivities = false;
      state.fetchActivitiesError = null;
      state.isCreateActivityLoading = false;
      state.createActivityError = null;
      state.isDeleteActivityLoading = false;
      state.deleteActivityError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createActivity.pending, (state) => {
        state.isCreateActivityLoading = true;
        state.createActivityError = null;
      })
      .addCase(createActivity.fulfilled, (state) => {
        state.isCreateActivityLoading = false;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.isCreateActivityLoading = false;
        state.createActivityError = action.payload as string;
      })
      .addCase(deleteActivity.pending, (state) => {
        state.isDeleteActivityLoading = true;
        state.deleteActivityError = null;
      })
      .addCase(deleteActivity.fulfilled, (state) => {
        state.isDeleteActivityLoading = false;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.isDeleteActivityLoading = false;
        state.deleteActivityError = action.payload as string;
      })
      .addCase(fetchAllActivities.pending, (state) => {
        state.isFetchingActivities = true;
        state.fetchActivitiesError = null;
      })
      .addCase(fetchAllActivities.fulfilled, (state, action) => {
        state.isFetchingActivities = false;
        state.activities = action.payload.data;
        state.totalActivities = action.payload.total;
      })
      .addCase(fetchAllActivities.rejected, (state, action) => {
        state.isFetchingActivities = false;
        state.fetchActivitiesError = action.payload as string;
      });
  },
});

export const { resetActivityStatus } = activitySlice.actions;
export default activitySlice.reducer;
