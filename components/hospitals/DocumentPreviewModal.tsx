"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  X,
  FileText,
  FileImage,
  File,
} from "lucide-react";
import { HospitalDocument } from "@/store/types";
import { format } from "date-fns";

interface DocumentPreviewModalProps {
  document: HospitalDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

function getFullUrl(fileUrl: string): string {
  if (fileUrl.startsWith("http")) return fileUrl;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return `${baseUrl}${fileUrl}`;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage;
  if (fileType === "application/pdf") return FileText;
  return File;
}

function isPreviewable(fileType: string): boolean {
  if (fileType.startsWith("image/")) return true;
  if (fileType === "application/pdf") return true;
  return false;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentPreviewModal({
  document: doc,
  isOpen,
  onClose,
}: DocumentPreviewModalProps) {
  if (!doc) return null;

  const fullUrl = getFullUrl(doc.fileUrl);
  const Icon = getFileIcon(doc.fileType);
  const previewable = isPreviewable(doc.fileType);

  const handleDownload = async () => {
    try {
      const res = await fetch(fullUrl);
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
      window.open(fullUrl, "_blank");
    }
  };

  const handlePrint = async () => {
    try {
      const res = await fetch(fullUrl);
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
      window.open(fullUrl, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-4xl w-full h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-muted border border-border shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col min-w-0">
              <DialogTitle className="text-sm font-bold truncate">
                {doc.name}
              </DialogTitle>
              <span className="text-[11px] text-muted-foreground font-medium">
                {doc.category} · {formatFileSize(doc.fileSize)} ·{" "}
                {format(new Date(doc.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            {previewable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePrint}
                title="Print"
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 bg-muted/30">
          {previewable ? (
            doc.fileType === "application/pdf" ? (
              <iframe
                src={fullUrl}
                className="w-full h-full border-0"
                title={doc.name}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full p-4">
                <img
                  src={fullUrl}
                  alt={doc.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 h-full text-muted-foreground">
              <File className="h-16 w-16" />
              <p className="text-sm font-medium">Preview not available</p>
              <p className="text-xs">{doc.fileType}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="mt-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download file
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
