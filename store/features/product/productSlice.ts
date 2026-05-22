import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  Product,
  ProductState,
  CreateProductPayload,
  UpdateProductPayload,
  ApiResponse,
  PaginatedApiResponse,
  FetchProductsParams,
} from "@/store/types";

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isFetchingProducts: false,
  isGetSingleProductLoading: false,
  isCreateProductLoading: false,
  isUpdateProductLoading: false,
  isDeleteProductLoading: false,
  fetchProductsError: null,
  getSingleProductError: null,
  createProductError: null,
  updateProductError: null,
  deleteProductError: null,
  page: 1,
  limit: 10,
  totalProducts: 0,
  totalPages: 1,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params: FetchProductsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "" } = params;
      const response = await axiosInstance.get<PaginatedApiResponse<Product[]>>(
        `/api/product/all-products?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchAdminProducts = createAsyncThunk(
  "product/fetchAdminProducts",
  async (params: FetchProductsParams, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "" } = params;
      const response = await axiosInstance.get<PaginatedApiResponse<Product[]>>(
        `/api/product/all-products-admin?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin products",
      );
    }
  },
);

export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<Product>>(
        `/api/product/${id}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (payload: CreateProductPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<Product>>(
        "/api/product/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, ...payload }: UpdateProductPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<ApiResponse<Product>>(
        `/api/product/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/product/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProductStatus: (state) => {
      state.isFetchingProducts = false;
      state.isGetSingleProductLoading = false;
      state.isCreateProductLoading = false;
      state.isUpdateProductLoading = false;
      state.isDeleteProductLoading = false;
      state.fetchProductsError = null;
      state.getSingleProductError = null;
      state.createProductError = null;
      state.updateProductError = null;
      state.deleteProductError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isFetchingProducts = true;
        state.fetchProductsError = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<Product[]>>) => {
          state.isFetchingProducts = false;
          state.products = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalProducts = action.payload.totalProducts || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isFetchingProducts = false;
        state.fetchProductsError = action.payload as string;
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.isFetchingProducts = true;
        state.fetchProductsError = null;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<Product[]>>) => {
          state.isFetchingProducts = false;
          state.products = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalProducts = action.payload.totalProducts || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.isFetchingProducts = false;
        state.fetchProductsError = action.payload as string;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.isGetSingleProductLoading = true;
        state.getSingleProductError = null;
      })
      .addCase(
        getSingleProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isGetSingleProductLoading = false;
          state.selectedProduct = action.payload;
        },
      )
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.isGetSingleProductLoading = false;
        state.getSingleProductError = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.isCreateProductLoading = true;
        state.createProductError = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isCreateProductLoading = false;
          state.products.unshift(action.payload);
          state.totalProducts += 1;
        },
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreateProductLoading = false;
        state.createProductError = action.payload as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isUpdateProductLoading = true;
        state.updateProductError = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isUpdateProductLoading = false;
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
          if (state.selectedProduct?._id === action.payload._id) {
            state.selectedProduct = action.payload;
          }
        },
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdateProductLoading = false;
        state.updateProductError = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isDeleteProductLoading = true;
        state.deleteProductError = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isDeleteProductLoading = false;
          state.products = state.products.filter(
            (p) => p._id !== action.payload,
          );
          state.totalProducts = Math.max(0, state.totalProducts - 1);
          if (state.selectedProduct?._id === action.payload) {
            state.selectedProduct = null;
          }
        },
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeleteProductLoading = false;
        state.deleteProductError = action.payload as string;
      });
  },
});

export const { clearSelectedProduct, resetProductStatus } =
  productSlice.actions;
export default productSlice.reducer;
