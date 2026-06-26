"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Mail, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateTask, fetchTasks } from "@/store/features/task/taskSlice";
import { Task } from "@/store/types";
import { toast } from "sonner";
import { MentionTextarea } from "../hospitals/activities/MentionTextarea";

const editTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.date({ message: "Due date is required" }),
  reminders: z.array(z.enum(["email", "push"])),
});

type EditTaskFormValues = z.infer<typeof editTaskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSuccess?: () => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  onSuccess,
}: EditTaskModalProps) {
  const dispatch = useAppDispatch();
  const { isUpdateTaskLoading } = useAppSelector((state) => state.task);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      reminders: [],
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        dueDate: new Date(task.dueDate),
        reminders: task.reminders || [],
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: EditTaskFormValues) => {
    if (!task) return;
    try {
      await dispatch(
        updateTask({
          id: task._id,
          payload: {
            id: task._id,
            title: data.title,
            description: data.description || "",
            dueDate: data.dueDate.toISOString(),
            reminders: data.reminders,
          },
        }),
      ).unwrap();

      toast.success("Task updated successfully");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to update task");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Task</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update task details and reminders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="edit-title" className="text-sm font-bold">
              Task Title
            </Label>
            <Input
              id="edit-title"
              placeholder="e.g. Follow up with procurement"
              className="h-10 bg-muted border-border rounded-xl px-3"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="edit-description" className="text-sm font-bold">
              Description (Optional)
            </Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <MentionTextarea
                  id="edit-description"
                  placeholder="Add details about this task... Use @ to mention coworkers."
                  className="min-h-20 bg-muted border-border rounded-xl resize-none"
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Due Date</Label>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 bg-muted border-border rounded-xl px-3",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "dd-MM-yyyy")
                      ) : (
                        <span>Select Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dueDate && (
              <p className="text-xs text-destructive font-medium">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <Label className="text-sm font-bold">Reminders</Label>
            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="reminders"
                render={({ field }) => (
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="edit-email-reminder"
                      checked={field.value.includes("email")}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, "email"]
                          : field.value.filter((v) => v !== "email");
                        field.onChange(newValue);
                      }}
                      className="rounded"
                    />
                    <Label
                      htmlFor="edit-email-reminder"
                      className="text-sm flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" /> Email
                      Reminder
                    </Label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="reminders"
                render={({ field }) => (
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="edit-push-notification"
                      checked={field.value.includes("push")}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, "push"]
                          : field.value.filter((v) => v !== "push");
                        field.onChange(newValue);
                      }}
                      className="rounded"
                    />
                    <Label
                      htmlFor="edit-push-notification"
                      className="text-sm flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Bell className="h-4 w-4 text-muted-foreground" /> Push
                      Notification
                    </Label>
                  </div>
                )}
              />
            </div>
          </div>

          <DialogFooter className="p-2">
            <Button
              type="submit"
              disabled={isUpdateTaskLoading}
              className="bg-black text-white hover:bg-black/90 rounded-lg p-4 cursor-pointer"
            >
              {isUpdateTaskLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
