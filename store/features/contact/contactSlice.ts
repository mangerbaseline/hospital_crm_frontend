import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  Contact,
  ContactState,
  CreateContactPayload,
  ApiResponse,
  PaginatedApiResponse,
  FetchContactsParams,
} from "@/store/types";

const initialState: ContactState = {
  contacts: [],
  selectedContact: null,
  isFetchingContacts: false,
  isCreateContactLoading: false,
  isDeleteContactLoading: false,
  fetchContactsError: null,
  createContactError: null,
  deleteContactError: null,
  page: 1,
  limit: 10,
  totalContacts: 0,
  totalPages: 1,
};

export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async (params: FetchContactsParams, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        userId = "",
        productId = "",
      } = params;
      const response = await axiosInstance.get<PaginatedApiResponse<Contact[]>>(
        `/api/contact/all-contacts?page=${page}&limit=${limit}&search=${search}${userId ? `&userId=${userId}` : ""}${productId ? `&productId=${productId}` : ""}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contacts",
      );
    }
  },
);

export const createContact = createAsyncThunk(
  "contact/createContact",
  async (payload: CreateContactPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<Contact>>(
        "/api/contact/create",
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create contact",
      );
    }
  },
);

export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async (
    { id, payload }: { id: string; payload: Partial<CreateContactPayload> },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put<ApiResponse<Contact>>(
        `/api/contact/${id}`,
        payload,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update contact",
      );
    }
  },
);

export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/contact/${id}`,
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete contact",
      );
    }
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    resetContactStatus: (state) => {
      state.isFetchingContacts = false;
      state.isCreateContactLoading = false;
      state.fetchContactsError = null;
      state.createContactError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isFetchingContacts = true;
        state.fetchContactsError = null;
      })
      .addCase(
        fetchContacts.fulfilled,
        (state, action: PayloadAction<PaginatedApiResponse<Contact[]>>) => {
          state.isFetchingContacts = false;
          state.contacts = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalContacts = action.payload.totalContacts || 0;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isFetchingContacts = false;
        state.fetchContactsError = action.payload as string;
      })
      .addCase(createContact.pending, (state) => {
        state.isCreateContactLoading = true;
        state.createContactError = null;
      })
      .addCase(
        createContact.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.isCreateContactLoading = false;
          state.contacts.unshift(action.payload);
          state.totalContacts += 1;
        },
      )
      .addCase(createContact.rejected, (state, action) => {
        state.isCreateContactLoading = false;
        state.createContactError = action.payload as string;
      });
    builder
      .addCase(updateContact.pending, (state) => {
        state.isCreateContactLoading = true;
        state.createContactError = null;
      })
      .addCase(
        updateContact.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.isCreateContactLoading = false;
          const idx = state.contacts.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (idx !== -1) {
            state.contacts[idx] = action.payload;
          }
        },
      )
      .addCase(updateContact.rejected, (state, action) => {
        state.isCreateContactLoading = false;
        state.createContactError = action.payload as string;
      });
    builder
      .addCase(deleteContact.pending, (state) => {
        state.isDeleteContactLoading = true;
        state.deleteContactError = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isDeleteContactLoading = false;
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload.id,
        );
        state.totalContacts -= 1;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.isDeleteContactLoading = false;
        state.deleteContactError = action.payload as string;
      });
  },
});

export const { clearSelectedContact, resetContactStatus } =
  contactSlice.actions;
export default contactSlice.reducer;
