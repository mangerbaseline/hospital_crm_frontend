import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  IDN,
  IDNState,
  CreateIDNPayload,
  UpdateIDNPayload,
  ApiResponse,
  PaginatedApiResponse,
  FetchIDNsParams,
} from "@/store/types";

const initialState: IDNState = {
  idns: [],
  selectedIDN: null,
  isFetchingIDNs: false,
  isGetSingleIDNLoading: false,
  isCreateIDNLoading: false,
  isUpdateIDNLoading: false,
  isDeleteIDNLoading: false,
  fetchIDNsError: null,
  getSingleIDNError: null,
  createIDNError: null,
  updateIDNError: null,
  deleteIDNError: null,
  page: 1,
  limit: 10,
  totalIDNs: 0,
  totalPages: 1,
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
      state.isGetSingleIDNLoading = false;
      state.isCreateIDNLoading = false;
      state.isUpdateIDNLoading = false;
      state.isDeleteIDNLoading = false;
      state.fetchIDNsError = null;
      state.getSingleIDNError = null;
      state.createIDNError = null;
      state.updateIDNError = null;
      state.deleteIDNError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIDNs.pending, (state) => {
        state.isFetchingIDNs = true;
        state.fetchIDNsError = null;
      })
      .addCase(
        fetchIDNs.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<IDN[]>>) => {
          state.isFetchingIDNs = false;
          state.idns = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalIDNs = action.payload.totalIDNs || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchIDNs.rejected, (state, action) => {
        state.isFetchingIDNs = false;
        state.fetchIDNsError = action.payload as string;
      })
      .addCase(getSingleIDN.pending, (state) => {
        state.isGetSingleIDNLoading = true;
        state.getSingleIDNError = null;
      })
      .addCase(getSingleIDN.fulfilled, (state, action: PayloadAction<IDN>) => {
        state.isGetSingleIDNLoading = false;
        state.selectedIDN = action.payload;
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
      });
  },
});

export const { clearSelectedIDN, resetIDNStatus } = idnSlice.actions;
export default idnSlice.reducer;
