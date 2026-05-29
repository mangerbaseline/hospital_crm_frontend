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
  FileSpreadsheet,
  FileCheck,
  Presentation,
  File,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchHospitalDocuments,
  uploadDocument,
  deleteDocument,
} from "@/store/features/document/documentSlice";
import { DocumentCategory, HospitalDocument } from "@/store/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HospitalDocumentsProps {
  hospitalId: string;
}

const categoryConfig: Record<
  DocumentCategory,
  { icon: typeof FileText; color: string; bg: string; border: string }
> = {
  [DocumentCategory.CONTRACT]: {
    icon: FileCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  [DocumentCategory.REPORT]: {
    icon: FileSpreadsheet,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  [DocumentCategory.QUOTE]: {
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  [DocumentCategory.PRESENTATION]: {
    icon: Presentation,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  [DocumentCategory.OTHER]: {
    icon: File,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

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

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(
    DocumentCategory.OTHER,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hospitalId) {
      dispatch(fetchHospitalDocuments(hospitalId));
    }
  }, [dispatch, hospitalId]);

  const handleUpload = useCallback(
    (file: File) => {
      const name = file.name.replace(/\.[^/.]+$/, "");
      dispatch(
        uploadDocument({
          file,
          name,
          category: selectedCategory,
          hospitalId,
        }),
      );
    },
    [dispatch, selectedCategory, hospitalId],
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

  // Group documents by category
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      const cat = doc.category || DocumentCategory.OTHER;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {} as Record<string, HospitalDocument[]>,
  );

  const categoryEntries = Object.entries(groupedDocuments);

  return (
    <Card className="flex flex-col h-full min-h-0 p-6 shadow-md border border-border rounded-xl bg-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Documents</h3>

      {/* Category Selector */}
      <div className="mb-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
          Document Category
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
        </p>
      </div>

      {/* Documents List - Grouped by Category */}
      <ScrollArea className="flex-1 max-h-75">
        {isFetchingDocuments ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <DocumentSkeleton key={idx} />
            ))}
          </div>
        ) : categoryEntries.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground font-medium">
            No documents uploaded yet
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {categoryEntries.map(([category, docs]) => {
              const config =
                categoryConfig[category as DocumentCategory] ||
                categoryConfig[DocumentCategory.OTHER];
              const CategoryIcon = config.icon;
              const isExpanded = expandedCategory === category;

              return (
                <div key={category}>
                  {/* Category Header */}
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                      config.bg,
                      config.border,
                      "hover:shadow-sm",
                    )}
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : category)
                    }
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg bg-white border",
                        config.border,
                      )}
                    >
                      <CategoryIcon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-sm font-bold text-foreground">
                        {category}
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
                              {formatFileSize(doc.fileSize)} ·{" "}
                              {format(new Date(doc.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc._id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
    </Card>
  );
}
