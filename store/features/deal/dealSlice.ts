import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import { Deal, DealState, CreateDealPayload, ApiResponse } from "@/store/types";

const initialState: DealState = {
  isCreateDealLoading: false,
  createDealError: null,
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

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    resetDealStatus: (state) => {
      state.isCreateDealLoading = false;
      state.createDealError = null;
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
      });
  },
});

export const { resetDealStatus } = dealSlice.actions;
export default dealSlice.reducer;
