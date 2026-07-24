import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  IDN,
  IDNWithDeals,
  IDNState,
  CreateIDNPayload,
  UpdateIDNPayload,
  ApiResponse,
  PaginatedApiResponse,
  FetchIDNsParams,
  FetchIDNsDealsParams,
  IDNHospitalWithARR,
} from "@/store/types";

const initialState: IDNState = {
  idns: [],
  idnsWithDeals: [],
  selectedIDN: null,
  isFetchingIDNs: false,
  isFetchingIDNsWithDeals: false,
  isGetSingleIDNLoading: false,
  isCreateIDNLoading: false,
  isUpdateIDNLoading: false,
  isDeleteIDNLoading: false,
  fetchIDNsError: null,
  fetchIDNsWithDealsError: null,
  getSingleIDNError: null,
  createIDNError: null,
  updateIDNError: null,
  deleteIDNError: null,
  page: 1,
  limit: 10,
  totalIDNs: 0,
  totalPages: 1,
  selectionPage: 1,
  selectionTotalPages: 1,
  hasMoreSelection: true,

  idnHospitals: [],
  isFetchingIDNHospitals: false,
  fetchIDNHospitalsError: null,
  idnHospitalsPage: 1,
  idnHospitalsLimit: 10,
  idnHospitalsTotal: 0,
  idnHospitalsTotalPages: 1,
};

export const fetchIDNs = createAsyncThunk(
  "idn/fetchIDNs",
  async (params: FetchIDNsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "" } = params;
      const response = await axiosInstance.get<PaginatedApiResponse<IDN[]>>(
        `/api/idn/all-idns?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IDNs",
      );
    }
  },
);

export const fetchIDNsWithDeals = createAsyncThunk(
  "idn/fetchIDNsWithDeals",
  async (params: FetchIDNsDealsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", userId = "" } = params;
      let url = `/api/idn/all-idns-deals?page=${page}&limit=${limit}&search=${search}`;
      if (userId) url += `&userId=${userId}`;
      const response =
        await axiosInstance.get<PaginatedApiResponse<IDNWithDeals[]>>(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IDNs with deals",
      );
    }
  },
);

export const fetchIDNHospitals = createAsyncThunk(
  "idn/fetchIDNHospitals",
  async (
    params: { idnId: string; page?: number; limit?: number; userId?: string },
    { rejectWithValue },
  ) => {
    try {
      const { idnId, page = 1, limit = 10, userId } = params;
      let url = `/api/idn/deals-by-idn?idnId=${idnId}&page=${page}&limit=${limit}`;
      if (userId) {
        url += `&userId=${userId}`;
      }
      const response = await axiosInstance.get<
        PaginatedApiResponse<IDNHospitalWithARR[]>
      >(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IDN hospitals",
      );
    }
  },
);

export const getSingleIDN = createAsyncThunk(
  "idn/getSingleIDN",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<IDN>>(
        `/api/idn/${id}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IDN details",
      );
    }
  },
);

export const createIDN = createAsyncThunk(
  "idn/createIDN",
  async (payload: CreateIDNPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<IDN>>(
        "/api/idn/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create IDN",
      );
    }
  },
);

export const updateIDN = createAsyncThunk(
  "idn/updateIDN",
  async ({ id, ...payload }: UpdateIDNPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<ApiResponse<IDN>>(
        `/api/idn/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update IDN",
      );
    }
  },
);

export const deleteIDN = createAsyncThunk(
  "idn/deleteIDN",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/idn/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete IDN",
      );
    }
  },
);

const idnSlice = createSlice({
  name: "idn",
  initialState,
  reducers: {
    clearSelectedIDN: (state) => {
      state.selectedIDN = null;
    },
    resetIDNStatus: (state) => {
      state.isFetchingIDNs = false;
      state.isFetchingIDNsWithDeals = false;
      state.isGetSingleIDNLoading = false;
      state.isCreateIDNLoading = false;
      state.isUpdateIDNLoading = false;
      state.isDeleteIDNLoading = false;
      state.fetchIDNsError = null;
      state.fetchIDNsWithDealsError = null;
      state.getSingleIDNError = null;
      state.createIDNError = null;
      state.updateIDNError = null;
      state.deleteIDNError = null;
      state.isFetchingIDNHospitals = false;
      state.fetchIDNHospitalsError = null;
    },
    resetIDNsForSelection: (state) => {
      state.idns = [];
      state.selectionPage = 1;
      state.selectionTotalPages = 1;
      state.hasMoreSelection = true;
    },
    setIDNsForSelection: (state, action: PayloadAction<IDN[]>) => {
      state.idns = action.payload;
      state.selectionPage = 1;
      state.selectionTotalPages = 1;
      state.hasMoreSelection = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIDNs.pending, (state, action) => {
        state.isFetchingIDNs = true;
        state.fetchIDNsError = null;
        if (action.meta.arg.page === 1 || !action.meta.arg.page) {
          state.idns = [];
        }
      })
      .addCase(
        fetchIDNs.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<IDN[]>>) => {
          state.isFetchingIDNs = false;
          const { data, page, limit, totalIDNs, totalPages } = action.payload;

          if (page === 1) {
            state.idns = data;
          } else {
            state.idns = [...state.idns, ...data];
          }

          state.selectionPage = page;
          state.selectionTotalPages = totalPages;
          state.hasMoreSelection = page < totalPages;

          state.page = page;
          state.limit = limit || state.limit;
          state.totalIDNs = totalIDNs || 0;
          state.totalPages = totalPages;
        },
      )
      .addCase(fetchIDNs.rejected, (state, action) => {
        state.isFetchingIDNs = false;
        state.fetchIDNsError = action.payload as string;
      })
      .addCase(fetchIDNsWithDeals.pending, (state, action) => {
        state.isFetchingIDNsWithDeals = true;
        state.fetchIDNsWithDealsError = null;
        state.idnsWithDeals = [];
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(
        fetchIDNsWithDeals.fulfilled,
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.isFetchingIDNsWithDeals = false;
            state.idnsWithDeals = action.payload.data;
            const pagination =
              (action.payload as any).pagination || action.payload;
            state.page = pagination.page || 1;
            state.limit = pagination.limit || 10;
            state.totalIDNs = pagination.total || pagination.totalIDNs || 0;
            state.totalPages = pagination.totalPages || 1;
          }
        },
      )
      .addCase(fetchIDNsWithDeals.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.isFetchingIDNsWithDeals = false;
          state.fetchIDNsWithDealsError = action.payload as string;
        }
      })
      .addCase(getSingleIDN.pending, (state) => {
        state.isGetSingleIDNLoading = true;
        state.getSingleIDNError = null;
      })
      .addCase(getSingleIDN.fulfilled, (state, action: PayloadAction<IDN>) => {
        state.isGetSingleIDNLoading = false;
        state.selectedIDN = action.payload;
        if (
          action.payload &&
          !state.idns.some((idn) => idn._id === action.payload._id)
        ) {
          state.idns.push(action.payload);
        }
      })
      .addCase(getSingleIDN.rejected, (state, action) => {
        state.isGetSingleIDNLoading = false;
        state.getSingleIDNError = action.payload as string;
      })
      .addCase(createIDN.pending, (state) => {
        state.isCreateIDNLoading = true;
        state.createIDNError = null;
      })
      .addCase(createIDN.fulfilled, (state, action: PayloadAction<IDN>) => {
        state.isCreateIDNLoading = false;
        state.idns.unshift(action.payload);
        state.totalIDNs += 1;
      })
      .addCase(createIDN.rejected, (state, action) => {
        state.isCreateIDNLoading = false;
        state.createIDNError = action.payload as string;
      })
      .addCase(updateIDN.pending, (state) => {
        state.isUpdateIDNLoading = true;
        state.updateIDNError = null;
      })
      .addCase(updateIDN.fulfilled, (state, action: PayloadAction<IDN>) => {
        state.isUpdateIDNLoading = false;
        const index = state.idns.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.idns[index] = action.payload;
        }
        if (state.selectedIDN?._id === action.payload._id) {
          state.selectedIDN = action.payload;
        }
      })
      .addCase(updateIDN.rejected, (state, action) => {
        state.isUpdateIDNLoading = false;
        state.updateIDNError = action.payload as string;
      })
      .addCase(deleteIDN.pending, (state) => {
        state.isDeleteIDNLoading = true;
        state.deleteIDNError = null;
      })
      .addCase(deleteIDN.fulfilled, (state, action: PayloadAction<string>) => {
        state.isDeleteIDNLoading = false;
        state.idns = state.idns.filter((i) => i._id !== action.payload);
        state.totalIDNs = Math.max(0, state.totalIDNs - 1);
        if (state.selectedIDN?._id === action.payload) {
          state.selectedIDN = null;
        }
      })
      .addCase(deleteIDN.rejected, (state, action) => {
        state.isDeleteIDNLoading = false;
        state.deleteIDNError = action.payload as string;
      })
      .addCase(fetchIDNHospitals.pending, (state) => {
        state.isFetchingIDNHospitals = true;
        state.fetchIDNHospitalsError = null;
        state.idnHospitals = [];
      })
      .addCase(
        fetchIDNHospitals.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedApiResponse<IDNHospitalWithARR[]>>,
        ) => {
          state.isFetchingIDNHospitals = false;
          state.idnHospitals = action.payload.data;
          const pagination =
            (action.payload as any).pagination || action.payload;
          state.idnHospitalsPage = pagination.page || 1;
          state.idnHospitalsLimit = pagination.limit || 10;
          state.idnHospitalsTotal =
            pagination.total || pagination.totalHospitals || 0;
          state.idnHospitalsTotalPages = pagination.totalPages || 1;
        },
      )
      .addCase(fetchIDNHospitals.rejected, (state, action) => {
        state.isFetchingIDNHospitals = false;
        state.fetchIDNHospitalsError = action.payload as string;
      });
  },
});

export const {
  clearSelectedIDN,
  resetIDNStatus,
  resetIDNsForSelection,
  setIDNsForSelection,
} = idnSlice.actions;
export default idnSlice.reducer;
