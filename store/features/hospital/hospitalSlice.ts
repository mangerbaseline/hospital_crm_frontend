import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  HospitalWithDeals,
  HospitalState,
  Hospital,
  CreateHospitalPayload,
  UpdateHospitalPayload,
  FetchHospitalsParams,
  FetchHospitalsDealsParams,
  HospitalForSelection,
  PaginatedApiResponse,
  ApiResponse,
} from "@/store/types";

const initialState: HospitalState = {
  hospitals: [],
  hospitalsWithDeals: [],
  selectedHospital: null,
  isFetchingHospitals: false,
  isFetchingHospitalsWithDeals: false,
  isGetSingleHospitalLoading: false,
  isCreateHospitalLoading: false,
  isUpdateHospitalLoading: false,
  fetchHospitalsError: null,
  fetchHospitalsWithDealsError: null,
  getSingleHospitalError: null,
  createHospitalError: null,
  updateHospitalError: null,
  page: 1,
  limit: 10,
  totalHospitals: 0,
  totalPages: 1,
};

export const fetchHospitalsForSelection = createAsyncThunk(
  "hospital/fetchHospitalsForSelection",
  async (params: FetchHospitalsParams, { rejectWithValue }) => {
    try {
      const { idn } = params;
      let url = "/api/hospital/all-hospitals";
      if (idn) url += `?idn=${idn}`;
      const response =
        await axiosInstance.get<ApiResponse<HospitalForSelection[]>>(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch hospitals for selection",
      );
    }
  },
);

export const fetchHospitalsWithDeals = createAsyncThunk(
  "hospital/fetchHospitalsWithDeals",
  async (params: FetchHospitalsDealsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", userId = "" } = params;
      let url = `/api/hospital/all-hospitals-deals?page=${page}&limit=${limit}&search=${search}`;
      if (userId) url += `&userId=${userId}`;
      const response =
        await axiosInstance.get<PaginatedApiResponse<HospitalWithDeals[]>>(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hospitals with deals",
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

export const updateHospital = createAsyncThunk(
  "hospital/updateHospital",
  async ({ id, ...payload }: UpdateHospitalPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<ApiResponse<Hospital>>(
        `/api/hospital/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update hospital",
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
      state.isFetchingHospitalsWithDeals = false;
      state.isGetSingleHospitalLoading = false;
      state.isCreateHospitalLoading = false;
      state.isUpdateHospitalLoading = false;
      state.fetchHospitalsError = null;
      state.fetchHospitalsWithDealsError = null;
      state.getSingleHospitalError = null;
      state.createHospitalError = null;
      state.updateHospitalError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalsForSelection.pending, (state) => {
        state.isFetchingHospitals = true;
        state.fetchHospitalsError = null;
      })
      .addCase(
        fetchHospitalsForSelection.fulfilled,
        (state, action: PayloadAction<HospitalForSelection[]>) => {
          state.isFetchingHospitals = false;
          state.hospitals = action.payload;
        },
      )
      .addCase(fetchHospitalsForSelection.rejected, (state, action) => {
        state.isFetchingHospitals = false;
        state.fetchHospitalsError = action.payload as string;
      })
      .addCase(fetchHospitalsWithDeals.pending, (state) => {
        state.isFetchingHospitalsWithDeals = true;
        state.fetchHospitalsWithDealsError = null;
      })
      .addCase(
        fetchHospitalsWithDeals.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedApiResponse<HospitalWithDeals[]>>,
        ) => {
          state.isFetchingHospitalsWithDeals = false;
          state.hospitalsWithDeals = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalHospitals = action.payload.totalHospitals || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchHospitalsWithDeals.rejected, (state, action) => {
        state.isFetchingHospitalsWithDeals = false;
        state.fetchHospitalsWithDealsError = action.payload as string;
      })
      .addCase(createHospital.pending, (state) => {
        state.isCreateHospitalLoading = true;
        state.createHospitalError = null;
      })
      .addCase(
        createHospital.fulfilled,
        (state, action: PayloadAction<Hospital>) => {
          state.isCreateHospitalLoading = false;
          state.totalHospitals += 1;
        },
      )
      .addCase(createHospital.rejected, (state, action) => {
        state.isCreateHospitalLoading = false;
        state.createHospitalError = action.payload as string;
      })
      .addCase(updateHospital.pending, (state) => {
        state.isUpdateHospitalLoading = true;
        state.updateHospitalError = null;
      })
      .addCase(
        updateHospital.fulfilled,
        (state, action: PayloadAction<Hospital>) => {
          state.isUpdateHospitalLoading = false;
          state.selectedHospital = action.payload;
        },
      )
      .addCase(updateHospital.rejected, (state, action) => {
        state.isUpdateHospitalLoading = false;
        state.updateHospitalError = action.payload as string;
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
