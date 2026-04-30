import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  MailboxState,
  EmailMessage,
  PaginatedApiResponse,
  ReplyEmailPayload,
  SendEmailPayload,
} from "@/store/types";

const initialState: MailboxState = {
  receivedEmails: [],
  sentEmails: [],
  isFetchingReceived: false,
  isFetchingSent: false,
  fetchReceivedError: null,
  fetchSentError: null,
  pageReceived: 1,
  pageSent: 1,
  totalReceived: 0,
  totalSent: 0,
  isSyncing: false,
  syncError: null,
  isReplying: false,
  replyError: null,
  isSending: false,
  sendError: null,
};

export const fetchReceivedEmails = createAsyncThunk(
  "mailbox/fetchReceived",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
    }: { page?: number; limit?: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.get<
        PaginatedApiResponse<EmailMessage[]>
      >(
        `/api/graph-app/received-emails?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch received emails",
      );
    }
  },
);

export const fetchSentEmails = createAsyncThunk(
  "mailbox/fetchSent",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
    }: { page?: number; limit?: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.get<
        PaginatedApiResponse<EmailMessage[]>
      >(
        `/api/graph-app/sent-emails?page=${page}&limit=${limit}&search=${search}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sent emails",
      );
    }
  },
);

export const syncEmails = createAsyncThunk(
  "mailbox/sync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/graph-app/sync");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to sync emails",
      );
    }
  },
);

export const replyToEmail = createAsyncThunk(
  "mailbox/reply",
  async (payload: ReplyEmailPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/graph-app/reply",
        payload,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reply to email",
      );
    }
  },
);

export const sendEmail = createAsyncThunk(
  "mailbox/send",
  async (payload: SendEmailPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/graph-app/send",
        payload,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send email",
      );
    }
  },
);

const mailboxSlice = createSlice({
  name: "mailbox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedEmails.pending, (state) => {
        state.isFetchingReceived = true;
        state.fetchReceivedError = null;
      })
      .addCase(fetchReceivedEmails.fulfilled, (state, action) => {
        state.isFetchingReceived = false;
        state.receivedEmails = action.payload.data;
        state.pageReceived =
          action.payload.pagination?.page || action.payload.page || 1;
        state.totalReceived = action.payload.pagination?.total || 0;
      })
      .addCase(fetchReceivedEmails.rejected, (state, action) => {
        state.isFetchingReceived = false;
        state.fetchReceivedError = action.payload as string;
      })
      .addCase(fetchSentEmails.pending, (state) => {
        state.isFetchingSent = true;
        state.fetchSentError = null;
      })
      .addCase(fetchSentEmails.fulfilled, (state, action) => {
        state.isFetchingSent = false;
        state.sentEmails = action.payload.data;
        state.pageSent =
          action.payload.pagination?.page || action.payload.page || 1;
        state.totalSent = action.payload.pagination?.total || 0;
      })
      .addCase(fetchSentEmails.rejected, (state, action) => {
        state.isFetchingSent = false;
        state.fetchSentError = action.payload as string;
      })
      .addCase(syncEmails.pending, (state) => {
        state.isSyncing = true;
        state.syncError = null;
      })
      .addCase(syncEmails.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncEmails.rejected, (state, action) => {
        state.isFetchingSent = false;
        state.isSyncing = false;
        state.syncError = action.payload as string;
      })
      .addCase(replyToEmail.pending, (state) => {
        state.isReplying = true;
        state.replyError = null;
      })
      .addCase(replyToEmail.fulfilled, (state) => {
        state.isReplying = false;
      })
      .addCase(replyToEmail.rejected, (state, action) => {
        state.isReplying = false;
        state.replyError = action.payload as string;
      })
      .addCase(sendEmail.pending, (state) => {
        state.isSending = true;
        state.sendError = null;
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.isSending = false;
        state.sendError = action.payload as string;
      });
  },
});

export default mailboxSlice.reducer;
