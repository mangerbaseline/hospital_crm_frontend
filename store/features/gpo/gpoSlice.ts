import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  GPO,
  GPOState,
  CreateGPOPayload,
  UpdateGPOPayload,
  ApiResponse,
  PaginatedApiResponse,
  FetchGPOsParams,
} from "@/store/types";

const initialState: GPOState = {
  gpos: [],
  selectedGPO: null,
  isFetchingGPOs: false,
  isGetSingleGPOLoading: false,
  isCreateGPOLoading: false,
  isUpdateGPOLoading: false,
  isDeleteGPOLoading: false,
  fetchGPOsError: null,
  getSingleGPOError: null,
  createGPOError: null,
  updateGPOError: null,
  deleteGPOError: null,
  page: 1,
  limit: 10,
  totalGPOs: 0,
  totalPages: 1,
};

export const fetchGPOs = createAsyncThunk(
  "gpo/fetchGPOs",
  async (params: FetchGPOsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "" } = params;
      const response = await axiosInstance.get<PaginatedApiResponse<GPO[]>>(
        `/api/gpo/all-gpos?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch GPOs",
      );
    }
  },
);

export const getSingleGPO = createAsyncThunk(
  "gpo/getSingleGPO",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<GPO>>(
        `/api/gpo/${id}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch GPO details",
      );
    }
  },
);

export const createGPO = createAsyncThunk(
  "gpo/createGPO",
  async (payload: CreateGPOPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<GPO>>(
        "/api/gpo/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create GPO",
      );
    }
  },
);

export const updateGPO = createAsyncThunk(
  "gpo/updateGPO",
  async ({ id, ...payload }: UpdateGPOPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<ApiResponse<GPO>>(
        `/api/gpo/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update GPO",
      );
    }
  },
);

export const deleteGPO = createAsyncThunk(
  "gpo/deleteGPO",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/gpo/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete GPO",
      );
    }
  },
);

const gpoSlice = createSlice({
  name: "gpo",
  initialState,
  reducers: {
    clearSelectedGPO: (state) => {
      state.selectedGPO = null;
    },
    resetGPOStatus: (state) => {
      state.isFetchingGPOs = false;
      state.isGetSingleGPOLoading = false;
      state.isCreateGPOLoading = false;
      state.isUpdateGPOLoading = false;
      state.isDeleteGPOLoading = false;
      state.fetchGPOsError = null;
      state.getSingleGPOError = null;
      state.createGPOError = null;
      state.updateGPOError = null;
      state.deleteGPOError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGPOs.pending, (state) => {
        state.isFetchingGPOs = true;
        state.fetchGPOsError = null;
      })
      .addCase(
        fetchGPOs.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<GPO[]>>) => {
          state.isFetchingGPOs = false;
          state.gpos = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalGPOs = action.payload.totalGPOs || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchGPOs.rejected, (state, action) => {
        state.isFetchingGPOs = false;
        state.fetchGPOsError = action.payload as string;
      })
      .addCase(getSingleGPO.pending, (state) => {
        state.isGetSingleGPOLoading = true;
        state.getSingleGPOError = null;
      })
      .addCase(getSingleGPO.fulfilled, (state, action: PayloadAction<GPO>) => {
        state.isGetSingleGPOLoading = false;
        state.selectedGPO = action.payload;
      })
      .addCase(getSingleGPO.rejected, (state, action) => {
        state.isGetSingleGPOLoading = false;
        state.getSingleGPOError = action.payload as string;
      })
      .addCase(createGPO.pending, (state) => {
        state.isCreateGPOLoading = true;
        state.createGPOError = null;
      })
      .addCase(createGPO.fulfilled, (state, action: PayloadAction<GPO>) => {
        state.isCreateGPOLoading = false;
        state.gpos.unshift(action.payload);
        state.totalGPOs += 1;
      })
      .addCase(createGPO.rejected, (state, action) => {
        state.isCreateGPOLoading = false;
        state.createGPOError = action.payload as string;
      })
      .addCase(updateGPO.pending, (state) => {
        state.isUpdateGPOLoading = true;
        state.updateGPOError = null;
      })
      .addCase(updateGPO.fulfilled, (state, action: PayloadAction<GPO>) => {
        state.isUpdateGPOLoading = false;
        const index = state.gpos.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) {
          state.gpos[index] = action.payload;
        }
        if (state.selectedGPO?._id === action.payload._id) {
          state.selectedGPO = action.payload;
        }
      })
      .addCase(updateGPO.rejected, (state, action) => {
        state.isUpdateGPOLoading = false;
        state.updateGPOError = action.payload as string;
      })
      .addCase(deleteGPO.pending, (state) => {
        state.isDeleteGPOLoading = true;
        state.deleteGPOError = null;
      })
      .addCase(deleteGPO.fulfilled, (state, action: PayloadAction<string>) => {
        state.isDeleteGPOLoading = false;
        state.gpos = state.gpos.filter((g) => g._id !== action.payload);
        state.totalGPOs = Math.max(0, state.totalGPOs - 1);
        if (state.selectedGPO?._id === action.payload) {
          state.selectedGPO = null;
        }
      })
      .addCase(deleteGPO.rejected, (state, action) => {
        state.isDeleteGPOLoading = false;
        state.deleteGPOError = action.payload as string;
      });
  },
});

export const { clearSelectedGPO, resetGPOStatus } = gpoSlice.actions;
export default gpoSlice.reducer;
