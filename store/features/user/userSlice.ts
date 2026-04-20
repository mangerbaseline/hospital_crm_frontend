import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  User,
  UserState,
  CreateUserPayload,
  UpdateUserPayload,
  ApiResponse,
  FetchUsersParams,
  PaginatedApiResponse,
  UpdateUserStatusPayload,
} from "@/store/types";

const initialState: UserState = {
  users: [],
  adminUsers: [],
  selectedUser: null,
  isFetchingUsers: false,
  isGetSingleUserLoading: false,
  isCreateUserLoading: false,
  isUpdateUserLoading: false,
  isDeleteUserLoading: false,
  fetchUsersError: null,
  getSingleUserError: null,
  createUserError: null,
  updateUserError: null,
  deleteUserError: null,
  isUpdatingUserStatus: false,
  updateUserStatusError: null,
  page: 1,
  limit: 10,
  totalUsers: 0,
  totalPages: 1,
  totalAdminUsers: 0,
  totalAdminPages: 1,
};

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (params: FetchUsersParams, { rejectWithValue }) => {
    try {
      const { page, limit, search = "" } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const response = await axiosInstance.get<PaginatedApiResponse<User[]>>(
        `/api/user/all-users?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

export const fetchUsersAdmin = createAsyncThunk(
  "user/fetchUsersAdmin",
  async (params: FetchUsersParams, { rejectWithValue }) => {
    try {
      const { page, limit, search = "" } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const response = await axiosInstance.get<PaginatedApiResponse<User[]>>(
        `/api/user/all-users-admin?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users (admin)",
      );
    }
  },
);

export const getSingleUser = createAsyncThunk(
  "user/getSingleUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<User>>(
        `/api/user/${id}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user details",
      );
    }
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<User>>(
        "/api/user/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, ...payload }: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<ApiResponse<User>>(
        `/api/user/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/user/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user",
      );
    }
  },
);

export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async ({ id, active }: UpdateUserStatusPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<ApiResponse<User>>(
        `/api/user/status?id=${id}&active=${active}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    resetUserStatus: (state) => {
      state.isFetchingUsers = false;
      state.isGetSingleUserLoading = false;
      state.isCreateUserLoading = false;
      state.isUpdateUserLoading = false;
      state.isDeleteUserLoading = false;
      state.fetchUsersError = null;
      state.getSingleUserError = null;
      state.createUserError = null;
      state.updateUserError = null;
      state.deleteUserError = null;
      state.isUpdatingUserStatus = false;
      state.updateUserStatusError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isFetchingUsers = true;
        state.fetchUsersError = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<User[]>>) => {
          state.isFetchingUsers = false;
          state.users = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalUsers = action.payload.totalUsers || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isFetchingUsers = false;
        state.fetchUsersError = action.payload as string;
      })
      .addCase(fetchUsersAdmin.pending, (state) => {
        state.isFetchingUsers = true;
        state.fetchUsersError = null;
      })
      .addCase(
        fetchUsersAdmin.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<User[]>>) => {
          state.isFetchingUsers = false;
          state.adminUsers = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalAdminUsers = action.payload.totalUsers || 0;
          state.totalAdminPages = action.payload.totalPages;
        },
      )
      .addCase(fetchUsersAdmin.rejected, (state, action) => {
        state.isFetchingUsers = false;
        state.fetchUsersError = action.payload as string;
      })
      .addCase(getSingleUser.pending, (state) => {
        state.isGetSingleUserLoading = true;
        state.getSingleUserError = null;
      })
      .addCase(
        getSingleUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isGetSingleUserLoading = false;
          state.selectedUser = action.payload;
        },
      )
      .addCase(getSingleUser.rejected, (state, action) => {
        state.isGetSingleUserLoading = false;
        state.getSingleUserError = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.isCreateUserLoading = true;
        state.createUserError = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isCreateUserLoading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreateUserLoading = false;
        state.createUserError = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isUpdateUserLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isUpdateUserLoading = false;
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }

        const adminIndex = state.adminUsers.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (adminIndex !== -1) {
          state.adminUsers[adminIndex] = action.payload;
        }

        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdateUserLoading = false;
        state.updateUserError = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isDeleteUserLoading = true;
        state.deleteUserError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isDeleteUserLoading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.adminUsers = state.adminUsers.filter(
          (u) => u._id !== action.payload,
        );
        if (state.selectedUser?._id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleteUserLoading = false;
        state.deleteUserError = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isUpdatingUserStatus = true;
        state.updateUserStatusError = null;
      })
      .addCase(
        updateUserStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isUpdatingUserStatus = false;
          const index = state.users.findIndex(
            (u) => u._id === action.payload._id,
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }

          const adminIndex = state.adminUsers.findIndex(
            (u) => u._id === action.payload._id,
          );
          if (adminIndex !== -1) {
            state.adminUsers[adminIndex] = action.payload;
          }

          if (state.selectedUser?._id === action.payload._id) {
            state.selectedUser = action.payload;
          }
        },
      )
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isUpdatingUserStatus = false;
        state.updateUserStatusError = action.payload as string;
      });
  },
});

export const { clearSelectedUser, resetUserStatus } = userSlice.actions;
export default userSlice.reducer;
