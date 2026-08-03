"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getSingleIDN,
  createIDNNote,
  deleteIDNNote,
  updateIDNNote,
} from "@/store/features/idn/idnSlice";
import { format } from "date-fns";
import { Trash2, Plus, Loader2, MessageSquare, User, Clock, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface ViewIDNNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  idnId: string;
  idnName: string;
}

export function ViewIDNNotesModal({
  isOpen,
  onClose,
  idnId,
  idnName,
}: ViewIDNNotesModalProps) {
  const dispatch = useAppDispatch();
  const { selectedIDN, isGetSingleIDNLoading } = useAppSelector((state) => state.idn);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && idnId) {
      dispatch(getSingleIDN(idnId));
    }
  }, [dispatch, isOpen, idnId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsAdding(true);
    try {
      await dispatch(
        createIDNNote({ idnId, content: newNoteContent.trim() })
      ).unwrap();
      toast.success("Note added successfully");
      setNewNoteContent("");
      dispatch(getSingleIDN(idnId));
    } catch (error: any) {
      toast.error(error || "Failed to add note");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        updateIDNNote({ idnId, noteId, content: editingContent.trim() })
      ).unwrap();
      toast.success("Note updated successfully");
      setEditingNoteId(null);
      setEditingContent("");
      dispatch(getSingleIDN(idnId));
    } catch (error: any) {
      toast.error(error || "Failed to update note");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await dispatch(deleteIDNNote({ idnId, noteId })).unwrap();
      toast.success("Note deleted successfully");
      dispatch(getSingleIDN(idnId));
    } catch (error: any) {
      toast.error(error || "Failed to delete note");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg border-border bg-background flex flex-col max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-card shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <span className="p-1.5 bg-primary/10 rounded-md">
              <MessageSquare className="h-5 w-5 text-primary" />
            </span>
            {idnName} - Notes
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            View and manage notes associated with this IDN.
          </DialogDescription>
        </DialogHeader>

        {/* Notes List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          {isGetSingleIDNLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                Loading notes...
              </p>
            </div>
          ) : !selectedIDN?.notes || selectedIDN.notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-dashed border-border rounded-2xl p-6">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h4 className="text-sm font-semibold text-muted-foreground">No notes yet</h4>
              <p className="text-xs text-muted-foreground/60 mt-1 max-w-[240px]">
                Create the first note below to document discussions or updates for this IDN.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...selectedIDN.notes].reverse().map((note) => {
                const isAuthor =
                  typeof note.user === "object" &&
                  note.user !== null &&
                  note.user._id === currentUser?._id;
                const authorName = isAuthor ? "You" : (note.user as any)?.name || "User";
                const isEditing = note._id === editingNoteId;

                return (
                  <div
                    key={note._id}
                    className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="min-h-[60px] text-sm bg-muted border-border resize-none"
                          disabled={isUpdating}
                        />
                        <div className="flex justify-end gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingContent("");
                            }}
                            disabled={isUpdating}
                            className="h-7 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleUpdateNote(note._id!)}
                            disabled={isUpdating || !editingContent.trim()}
                            className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer flex gap-1 items-center"
                          >
                            {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pr-8">
                          {note.content}
                        </div>

                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100 text-[10px] font-semibold text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {authorName}
                            </span>
                            {note.createdAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
                              </span>
                            )}
                          </div>

                          {/* Edit & Delete Buttons */}
                          {(isAuthor || currentUser?.role === "Admin") && note._id && (
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(note._id!);
                                  setEditingContent(note.content);
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded"
                                title="Edit Note"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <ConfirmDialog
                                title="Delete Note"
                                description="Are you sure you want to delete this note? This action cannot be undone."
                                onConfirm={() => handleDeleteNote(note._id!)}
                                confirmText="Delete"
                              >
                                <button
                                  type="button"
                                  className="p-1 text-muted-foreground hover:text-destructive cursor-pointer rounded"
                                  title="Delete Note"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </ConfirmDialog>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Note Form */}
        <div className="border-t border-border bg-card px-6 py-4 shrink-0">
          <form onSubmit={handleAddNote} className="space-y-3">
            <Textarea
              placeholder="Write a new note..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[70px] bg-muted border-border resize-none text-sm placeholder:text-muted-foreground/50 rounded-lg"
              disabled={isAdding}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isAdding || !newNoteContent.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer h-9 px-4 rounded-lg flex gap-1.5 items-center text-xs shadow-sm"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Note
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
