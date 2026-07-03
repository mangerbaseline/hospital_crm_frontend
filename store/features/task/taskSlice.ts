import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  Task,
  TaskState,
  CreateTaskPayload,
  UpdateTaskPayload,
  ApiResponse,
  PaginatedApiResponse,
  FetchTasksParams,
} from "@/store/types";

const initialState: TaskState = {
  tasks: [],
  isFetchingTasks: false,
  isCreateTaskLoading: false,
  isUpdateTaskLoading: false,
  isDeleteTaskLoading: false,
  fetchTasksError: null,
  createTaskError: null,
  updateTaskError: null,
  deleteTaskError: null,
  page: 1,
  limit: 10,
  totalTasks: 0,
  totalPages: 1,
  upcomingCount: 0,
};

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (params: FetchTasksParams | undefined, { rejectWithValue }) => {
    try {
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const search = params?.search || "";
      const userId = params?.userId || "";
      const hospitalId = params?.hospitalId || "";
      const productId = params?.productId || "";
      const dueOnly = params?.dueOnly || false;

      let url = `/api/task/all-tasks?page=${page}&limit=${limit}&search=${search}`;
      if (userId) url += `&userId=${userId}`;
      if (hospitalId) url += `&hospitalId=${hospitalId}`;
      if (productId) url += `&productId=${productId}`;
      if (dueOnly) url += `&dueOnly=true`;

      const response = await axiosInstance.get<PaginatedApiResponse<Task[]>>(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<Task>>(
        "/api/task/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task",
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (
    { id, payload }: { id: string; payload: UpdateTaskPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put<ApiResponse<Task>>(
        `/api/task/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task",
      );
    }
  },
);

export const toggleTaskStatus = createAsyncThunk(
  "task/toggleTaskStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<ApiResponse<Task>>(
        `/api/task/${id}/status`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle task status",
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/task/${id}`,
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    resetTaskStatus: (state) => {
      state.isFetchingTasks = false;
      state.isCreateTaskLoading = false;
      state.isUpdateTaskLoading = false;
      state.isDeleteTaskLoading = false;
      state.fetchTasksError = null;
      state.createTaskError = null;
      state.updateTaskError = null;
      state.deleteTaskError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.isFetchingTasks = true;
        state.fetchTasksError = null;
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<Task[]>>) => {
          state.isFetchingTasks = false;
          state.tasks = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalTasks = action.payload.totalTasks || 0;
          state.totalPages = action.payload.totalPages;
          state.upcomingCount = action.payload.upcomingCount || 0;
        },
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isFetchingTasks = false;
        state.fetchTasksError = action.payload as string;
      })
      // createTask
      .addCase(createTask.pending, (state) => {
        state.isCreateTaskLoading = true;
        state.createTaskError = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isCreateTaskLoading = false;
        state.tasks.unshift(action.payload);
        state.totalTasks += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isCreateTaskLoading = false;
        state.createTaskError = action.payload as string;
      })
      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.isUpdateTaskLoading = true;
        state.updateTaskError = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isUpdateTaskLoading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isUpdateTaskLoading = false;
        state.updateTaskError = action.payload as string;
      })
      // deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.isDeleteTaskLoading = true;
        state.deleteTaskError = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isDeleteTaskLoading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload.id);
        state.totalTasks -= 1;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isDeleteTaskLoading = false;
        state.deleteTaskError = action.payload as string;
      })
      // toggleTaskStatus
      .addCase(toggleTaskStatus.pending, (state) => {
        state.isUpdateTaskLoading = true;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isUpdateTaskLoading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.isUpdateTaskLoading = false;
        state.updateTaskError = action.payload as string;
      });
  },
});

export const { resetTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
