import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api/axiosInstance";
import {
  DocumentState,
  UploadDocumentPayload,
  HospitalDocument,
  ApiResponse,
} from "@/store/types";

const initialState: DocumentState = {
  documents: [],
  isFetchingDocuments: false,
  fetchDocumentsError: null,
  isUploadingDocument: false,
  uploadDocumentError: null,
  isDeletingDocument: false,
  deleteDocumentError: null,
};

export const fetchHospitalDocuments = createAsyncThunk(
  "document/fetchHospitalDocuments",
  async (hospitalId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<HospitalDocument[]>>(
        `/api/document/hospital/${hospitalId}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch documents",
      );
    }
  },
);

export const uploadDocument = createAsyncThunk(
  "document/uploadDocument",
  async (payload: UploadDocumentPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("name", payload.name);
      formData.append("category", payload.category);
      formData.append("hospitalId", payload.hospitalId);
      if (payload.product) formData.append("product", payload.product);

      const response = await axiosInstance.post<ApiResponse<HospitalDocument>>(
        "/api/document/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload document",
      );
    }
  },
);

export const deleteDocument = createAsyncThunk(
  "document/deleteDocument",
  async (documentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete<ApiResponse<any>>(
        `/api/document/${documentId}`,
      );
      return documentId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete document",
      );
    }
  },
);

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    resetDocumentStatus: (state) => {
      state.isFetchingDocuments = false;
      state.fetchDocumentsError = null;
      state.isUploadingDocument = false;
      state.uploadDocumentError = null;
      state.isDeletingDocument = false;
      state.deleteDocumentError = null;
    },
    clearDocuments: (state) => {
      state.documents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalDocuments.pending, (state) => {
        state.isFetchingDocuments = true;
        state.fetchDocumentsError = null;
      })
      .addCase(fetchHospitalDocuments.fulfilled, (state, action) => {
        state.isFetchingDocuments = false;
        state.documents = action.payload;
      })
      .addCase(fetchHospitalDocuments.rejected, (state, action) => {
        state.isFetchingDocuments = false;
        state.fetchDocumentsError = action.payload as string;
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isUploadingDocument = true;
        state.uploadDocumentError = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploadingDocument = false;
        state.documents.unshift(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploadingDocument = false;
        state.uploadDocumentError = action.payload as string;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.isDeletingDocument = true;
        state.deleteDocumentError = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isDeletingDocument = false;
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload,
        );
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isDeletingDocument = false;
        state.deleteDocumentError = action.payload as string;
      });
  },
});

export const { resetDocumentStatus, clearDocuments } = documentSlice.actions;
export default documentSlice.reducer;
