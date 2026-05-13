import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  Deal,
  DealState,
  CreateDealPayload,
  ApiResponse,
  FetchAllDealsParams,
  FetchAllDealsResponse,
  UpdateDealStagePayload,
  AddDealProductPayload,
  UpdateDealProductPayload,
  RemoveDealProductPayload,
} from "@/store/types";

const initialState: DealState = {
  isCreateDealLoading: false,
  createDealError: null,
  deals: [],
  isFetchingDeals: false,
  fetchDealsError: null,
  isUpdateDealStageLoading: false,
  updateDealStageError: null,
  isDealProductLoading: false,
  dealProductError: null,
  stats: null,
  page: 1,
  limit: 10,
  totalDeals: 0,
  totalPages: 1,
};

export const createDeal = createAsyncThunk(
  "deal/createDeal",
  async (payload: CreateDealPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<Deal>>(
        "/api/deal/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create deal",
      );
    }
  },
);

export const fetchAllDeals = createAsyncThunk(
  "deal/fetchAllDeals",
  async (params: FetchAllDealsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<FetchAllDealsResponse>(
        "/api/deal/all-deals",
        { params },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deals",
      );
    }
  },
);

export const updateDealStage = createAsyncThunk(
  "deal/updateDealStage",
  async (payload: UpdateDealStagePayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/api/deal/stage/update-deal-stage",
        payload,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update deal stage",
      );
    }
  },
);

export const addDealProduct = createAsyncThunk(
  "deal/addDealProduct",
  async (
    { hospitalId, ...payload }: AddDealProductPayload,
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post(
        `/api/deal/add/product?hospitalId=${hospitalId}`,
        payload,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

export const updateDealProduct = createAsyncThunk(
  "deal/updateDealProduct",
  async (
    { dealId, ...payload }: UpdateDealProductPayload,
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(`/api/deal/update`, {
        ...payload,
        dealId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const removeDealProduct = createAsyncThunk(
  "deal/removeDealProduct",
  async ({ dealId }: RemoveDealProductPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/deal/delete/product?dealId=${dealId}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove product",
      );
    }
  },
);

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    resetDealStatus: (state) => {
      state.isCreateDealLoading = false;
      state.createDealError = null;
      state.fetchDealsError = null;
      state.updateDealStageError = null;
      state.isDealProductLoading = false;
      state.dealProductError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDeal.pending, (state) => {
        state.isCreateDealLoading = true;
        state.createDealError = null;
      })
      .addCase(createDeal.fulfilled, (state) => {
        state.isCreateDealLoading = false;
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.isCreateDealLoading = false;
        state.createDealError = action.payload as string;
      })
      .addCase(fetchAllDeals.pending, (state) => {
        state.isFetchingDeals = true;
        state.fetchDealsError = null;
      })
      .addCase(fetchAllDeals.fulfilled, (state, action) => {
        state.isFetchingDeals = false;
        state.deals = action.payload.data;
        state.stats = {
          totalHospitals: action.payload.totalHospitals,
          closedBusiness: action.payload.closedBusiness,
          productRevenue: action.payload.productRevenue,
        };
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalDeals = action.payload.totalDeals || 0;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllDeals.rejected, (state, action) => {
        state.isFetchingDeals = false;
        state.fetchDealsError = action.payload as string;
      })
      .addCase(updateDealStage.pending, (state) => {
        state.isUpdateDealStageLoading = true;
        state.updateDealStageError = null;
      })
      .addCase(updateDealStage.fulfilled, (state) => {
        state.isUpdateDealStageLoading = false;
      })
      .addCase(updateDealStage.rejected, (state, action) => {
        state.isUpdateDealStageLoading = false;
        state.updateDealStageError = action.payload as string;
      })
      .addCase(addDealProduct.pending, (state) => {
        state.isDealProductLoading = true;
        state.dealProductError = null;
      })
      .addCase(addDealProduct.fulfilled, (state) => {
        state.isDealProductLoading = false;
      })
      .addCase(addDealProduct.rejected, (state, action) => {
        state.isDealProductLoading = false;
        state.dealProductError = action.payload as string;
      })
      .addCase(updateDealProduct.pending, (state) => {
        state.isDealProductLoading = true;
        state.dealProductError = null;
      })
      .addCase(updateDealProduct.fulfilled, (state) => {
        state.isDealProductLoading = false;
      })
      .addCase(updateDealProduct.rejected, (state, action) => {
        state.isDealProductLoading = false;
        state.dealProductError = action.payload as string;
      })
      .addCase(removeDealProduct.pending, (state) => {
        state.isDealProductLoading = true;
        state.dealProductError = null;
      })
      .addCase(removeDealProduct.fulfilled, (state) => {
        state.isDealProductLoading = false;
      })
      .addCase(removeDealProduct.rejected, (state, action) => {
        state.isDealProductLoading = false;
        state.dealProductError = action.payload as string;
      });
  },
});

export const { resetDealStatus } = dealSlice.actions;
export default dealSlice.reducer;
