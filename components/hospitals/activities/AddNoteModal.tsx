"use client";

import { useForm, Controller } from "react-hook-form";
import { MentionTextarea } from "./MentionTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createActivity,
  updateActivity,
  fetchAllActivities,
} from "@/store/features/activity/activitySlice";
import { ActivityType } from "@/store/types";
import { toast } from "sonner";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { Loader2 } from "lucide-react";

const noteSchema = z.object({
  notes: z.string().min(1, "Note cannot be empty"),
  products: z.array(z.string()).min(1, "At least one product category is required"),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  noteId?: string;
  initialNotes?: string;
  initialProducts?: string[];
}

export function AddNoteModal({
  isOpen,
  onClose,
  hospitalId,
  noteId,
  initialNotes,
  initialProducts,
}: AddNoteModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateActivityLoading, isUpdateActivityLoading } = useAppSelector(
    (state) => state.activity,
  );
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      notes: "",
      products: [],
    },
  });

  const isEditing = !!noteId;

  useEffect(() => {
    if (isOpen) {
      reset({
        notes: initialNotes || "",
        products: initialProducts || [],
      });
    }
  }, [isOpen, initialNotes, initialProducts, reset]);

  const onSubmit = async (data: NoteFormValues) => {
    try {
      if (isEditing && noteId) {
        await dispatch(
          updateActivity({
            id: noteId,
            type: ActivityType.NOTE,
            data: {
              notes: data.notes,
              hospital: hospitalId,
              products: data.products,
            },
          }),
        ).unwrap();
        toast.success("Note updated successfully");
      } else {
        await dispatch(
          createActivity({
            type: ActivityType.NOTE,
            data: {
              ...data,
              hospital: hospitalId,
            },
          }),
        ).unwrap();
        toast.success("Note added successfully");
      }
      dispatch(fetchAllActivities({ hospitalId: hospitalId }));
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || `Failed to ${isEditing ? "update" : "add"} note`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Note" : "Add Note"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Update details of this note. Use @ to mention coworkers."
              : "Add a note for this hospital. Use @ to mention coworkers."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="notes" className="text-sm font-bold">
              Note
            </Label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <MentionTextarea
                  id="notes"
                  placeholder="Enter your note here..."
                  className="min-h-[80px] bg-muted border-border rounded-xl resize-none "
                  {...field}
                />
              )}
            />
            {errors.notes && (
              <p className="text-xs text-destructive font-medium">
                {errors.notes.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Product Categories</Label>
            <Controller
              control={control}
              name="products"
              render={({ field }) => (
                <MultiProductSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select Product Categories"
                />
              )}
            />
            {errors.products && (
              <p className="text-xs text-destructive font-medium">
                {errors.products.message}
              </p>
            )}
          </div>

          <DialogFooter className="p-2">
            <Button
              type="submit"
              disabled={isCreateActivityLoading || isUpdateActivityLoading}
              className="bg-black text-white hover:bg-black/90 rounded-lg p-4 cursor-pointer"
            >
              {isCreateActivityLoading || isUpdateActivityLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Note"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
