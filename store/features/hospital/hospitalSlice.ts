import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  Hospital,
  HospitalState,
  CreateHospitalPayload,
  FetchHospitalsParams,
  PaginatedApiResponse,
  ApiResponse,
} from "@/store/types";

const initialState: HospitalState = {
  hospitals: [],
  selectedHospital: null,
  isFetchingHospitals: false,
  isGetSingleHospitalLoading: false,
  isCreateHospitalLoading: false,
  fetchHospitalsError: null,
  getSingleHospitalError: null,
  createHospitalError: null,
  page: 1,
  limit: 10,
  totalHospitals: 0,
  totalPages: 1,
};

export const fetchHospitals = createAsyncThunk(
  "hospital/fetchHospitals",
  async (params: FetchHospitalsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", idn } = params;
      let url = `/api/hospital/all-hospitals?page=${page}&limit=${limit}&search=${search}`;
      if (idn) url += `&idn=${idn}`;
      const response =
        await axiosInstance.get<PaginatedApiResponse<Hospital[]>>(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hospitals",
      );
    }
  },
);

export const createHospital = createAsyncThunk(
  "hospital/createHospital",
  async (payload: CreateHospitalPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<Hospital>>(
        "/api/hospital/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create hospital",
      );
    }
  },
);

export const getSingleHospital = createAsyncThunk(
  "hospital/getSingleHospital",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<Hospital>>(
        `/api/hospital/${id}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hospital details",
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
      state.isCreateHospitalLoading = false;
      state.fetchHospitalsError = null;
      state.getSingleHospitalError = null;
      state.createHospitalError = null;
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
      })
      .addCase(createHospital.pending, (state) => {
        state.isCreateHospitalLoading = true;
        state.createHospitalError = null;
      })
      .addCase(
        createHospital.fulfilled,
        (state, action: PayloadAction<Hospital>) => {
          state.isCreateHospitalLoading = false;
          state.hospitals.unshift(action.payload);
          state.totalHospitals += 1;
        },
      )
      .addCase(createHospital.rejected, (state, action) => {
        state.isCreateHospitalLoading = false;
        state.createHospitalError = action.payload as string;
      })
      .addCase(getSingleHospital.pending, (state) => {
        state.isGetSingleHospitalLoading = true;
        state.getSingleHospitalError = null;
      })
      .addCase(
        getSingleHospital.fulfilled,
        (state, action: PayloadAction<Hospital>) => {
          state.isGetSingleHospitalLoading = false;
          state.selectedHospital = action.payload;
        },
      )
      .addCase(getSingleHospital.rejected, (state, action) => {
        state.isGetSingleHospitalLoading = false;
        state.getSingleHospitalError = action.payload as string;
      });
  },
});

export const { clearSelectedHospital, resetHospitalStatus } =
  hospitalSlice.actions;
export default hospitalSlice.reducer;
