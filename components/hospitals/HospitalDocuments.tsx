"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  Trash2,
  ChevronRight,
  Package,
  Eye,
  Download,
  Printer,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchHospitalDocuments,
  uploadDocument,
  deleteDocument,
} from "@/store/features/document/documentSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import { DocumentCategory, HospitalDocument } from "@/store/types";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HospitalDocumentsProps {
  hospitalId: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-xl">
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-7 w-7 rounded-md shrink-0" />
    </div>
  );
}

export function HospitalDocuments({ hospitalId }: HospitalDocumentsProps) {
  const dispatch = useAppDispatch();
  const { documents, isFetchingDocuments, isUploadingDocument } =
    useAppSelector((state) => state.document);
  const { products } = useAppSelector((state) => state.product);

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(
    DocumentCategory.OTHER,
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [previewDoc, setPreviewDoc] = useState<HospitalDocument | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hospitalId) {
      dispatch(fetchHospitalDocuments(hospitalId));
    }
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 100 }));
    }
  }, [dispatch, hospitalId, products.length]);

  const handleUpload = useCallback(
    (file: File) => {
      const name = file.name.replace(/\.[^/.]+$/, "");
      dispatch(
        uploadDocument({
          file,
          name,
          category: selectedCategory,
          hospitalId,
          product: selectedProductId || undefined,
        }),
      );
    },
    [dispatch, selectedCategory, selectedProductId, hospitalId],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDelete = (docId: string) => {
    dispatch(deleteDocument(docId));
  };

  const getFileUrl = (fileUrl: string) => {
    if (fileUrl.startsWith("http")) return fileUrl;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    return `${baseUrl}${fileUrl}`;
  };

  const handleDownload = async (doc: HospitalDocument) => {
    try {
      const res = await fetch(getFileUrl(doc.fileUrl));
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(getFileUrl(doc.fileUrl), "_blank");
    }
  };

  const handlePrint = async (doc: HospitalDocument) => {
    try {
      const res = await fetch(getFileUrl(doc.fileUrl));
      if (!res.ok) throw new Error("Print failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.print();
          } catch { /* browser may block */ }
        }, 500);
      };
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }, 30000);
    } catch {
      window.open(getFileUrl(doc.fileUrl), "_blank");
    }
  };

  // Group documents by product name
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      const productName = doc.product?.name || "Uncategorized";
      if (!acc[productName]) acc[productName] = [];
      acc[productName].push(doc);
      return acc;
    },
    {} as Record<string, HospitalDocument[]>,
  );

  const productEntries = Object.entries(groupedDocuments).sort(([a], [b]) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  return (
    <Card className="flex flex-col h-full min-h-0 p-6 shadow-md border border-border rounded-xl bg-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Documents</h3>

        {/* Product + Category Upload Section */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Product
            </p>
            <Select
              value={selectedProductId || "none"}
              onValueChange={(val) => setSelectedProductId(val === "none" ? "" : val)}
            >
              <SelectTrigger className="w-full h-9 text-sm font-medium">
                <SelectValue placeholder="No product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No product</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Category
            </p>
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val as DocumentCategory)}
            >
              <SelectTrigger className="w-full h-9 text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DocumentCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 p-6 mb-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/40 hover:bg-muted/50",
            isUploadingDocument && "pointer-events-none opacity-60",
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div
            className={cn(
              "p-2.5 rounded-full transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted",
            )}
          >
            <Upload
              className={cn(
                "h-5 w-5 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground",
              )}
            />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {isUploadingDocument
              ? "Uploading..."
              : "Drop files or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            Will be saved as:{" "}
            <span className="text-primary font-semibold">{selectedCategory}</span>
            {selectedProductId && (
              <>
                {" · "}
                <span className="text-primary font-semibold">
                  {products.find((p) => p._id === selectedProductId)?.name}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Documents List - Grouped by Product */}
        <ScrollArea className="flex-1 max-h-75">
          {isFetchingDocuments ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <DocumentSkeleton key={idx} />
              ))}
            </div>
          ) : productEntries.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground font-medium">
              No documents uploaded yet
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {productEntries.map(([productName, docs]) => {
                const isExpanded = expandedProduct === productName;

                return (
                  <div key={productName}>
                    {/* Product Header */}
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border border-border transition-all duration-200 cursor-pointer hover:shadow-sm bg-card",
                      )}
                      onClick={() =>
                        setExpandedProduct(isExpanded ? null : productName)
                      }
                    >
                      <div className="p-2 rounded-lg bg-muted border border-border">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-bold text-foreground">
                          {productName}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {docs.length} {docs.length === 1 ? "file" : "files"}
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-90",
                        )}
                      />
                    </button>

                    {/* Expanded File List */}
                    {isExpanded && (
                      <div className="flex flex-col gap-1.5 mt-1.5 ml-4 pl-3 border-l-2 border-border">
                        {docs.map((doc) => (
                          <div
                            key={doc._id}
                            className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-semibold text-foreground truncate">
                                {doc.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {doc.category} · {formatFileSize(doc.fileSize)} ·{" "}
                                {format(new Date(doc.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                title="View"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewDoc(doc);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                                title="Download"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(doc);
                                }}
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                                title="Print"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrint(doc);
                                }}
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </Button>
                              <div className="w-px h-5 bg-border mx-0.5" />
                              <ConfirmDialog
                                title="Delete Document"
                                description={`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`}
                                confirmText="Delete"
                                onConfirm={() => handleDelete(doc._id)}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                  title="Delete"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </ConfirmDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DocumentPreviewModal
          document={previewDoc}
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      </Card>
    );
  }
