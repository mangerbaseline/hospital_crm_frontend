import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  Hospital,
  HospitalState,
  FetchHospitalsParams,
  PaginatedApiResponse,
} from "@/store/types";

const initialState: HospitalState = {
  hospitals: [],
  selectedHospital: null,
  isFetchingHospitals: false,
  isGetSingleHospitalLoading: false,
  fetchHospitalsError: null,
  getSingleHospitalError: null,
  page: 1,
  limit: 10,
  totalHospitals: 0,
  totalPages: 1,
};

export const fetchHospitals = createAsyncThunk(
  "hospital/fetchHospitals",
  async (params: FetchHospitalsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "" } = params;
      const response = await axiosInstance.get<
        PaginatedApiResponse<Hospital[]>
      >(
        `/api/hospital/all-hospitals?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hospitals",
      );
    }
  },
);

const hospitalSlice = createSlice({
  name: "hospital",
  initialState,
  reducers: {
    clearSelectedHospital: (state) => {
      state.selectedHospital = null;
    },
    resetHospitalStatus: (state) => {
      state.isFetchingHospitals = false;
      state.isGetSingleHospitalLoading = false;
      state.fetchHospitalsError = null;
      state.getSingleHospitalError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.isFetchingHospitals = true;
        state.fetchHospitalsError = null;
      })
      .addCase(
        fetchHospitals.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<Hospital[]>>) => {
          state.isFetchingHospitals = false;
          state.hospitals = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalHospitals = action.payload.totalHospitals || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.isFetchingHospitals = false;
        state.fetchHospitalsError = action.payload as string;
      });
  },
});

export const { clearSelectedHospital, resetHospitalStatus } =
  hospitalSlice.actions;
export default hospitalSlice.reducer;
