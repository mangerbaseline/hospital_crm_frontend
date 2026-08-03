"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/hooks";
import { createIDNNote } from "@/store/features/idn/idnSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddIDNNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  idnId: string;
  idnName: string;
  onSuccess?: () => void;
}

export function AddIDNNoteModal({
  isOpen,
  onClose,
  idnId,
  idnName,
  onSuccess,
}: AddIDNNoteModalProps) {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(createIDNNote({ idnId, content })).unwrap();
      toast.success("Note added successfully");
      setContent("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to add note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold">Add Note</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Add a new note for <span className="font-semibold text-foreground">{idnName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="note" className="text-xs font-semibold text-foreground">
              Note Content
            </Label>
            <Textarea
              id="note"
              placeholder="Type your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-muted border-border resize-none text-sm placeholder:text-muted-foreground/50"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-border text-foreground hover:bg-muted cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="bg-slate-700 hover:bg-slate-800 text-white font-semibold cursor-pointer flex gap-1.5 items-center"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
