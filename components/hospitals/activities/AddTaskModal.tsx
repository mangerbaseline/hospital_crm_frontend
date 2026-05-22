"use client";

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
import { Textarea } from "@/components/ui/textarea";
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
import {
  createActivity,
  fetchAllActivities,
} from "@/store/features/activity/activitySlice";
import { ActivityType } from "@/store/types";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  reminders: z.array(z.enum(["email", "push"])),
});

interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: Date;
  reminders: ("email" | "push")[];
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  hospitalName: string;
}

export function AddTaskModal({
  isOpen,
  onClose,
  hospitalId,
  hospitalName,
}: AddTaskModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateActivityLoading } = useAppSelector((state) => state.activity);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      reminders: [],
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      await dispatch(
        createActivity({
          type: ActivityType.TASK,
          data: {
            title: data.title,
            description: data.description || "",
            dueDate: data.dueDate
              ? data.dueDate.toISOString()
              : new Date().toISOString(),
            hospital: hospitalId,
            reminders: data.reminders,
          },
        }),
      ).unwrap();

      toast.success("Task added successfully");
      dispatch(fetchAllActivities({ hospitalId: hospitalId }));
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to add task");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Task</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new task with reminders for {hospitalName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="title" className="text-sm font-bold">
              Task Title
            </Label>
            <Input
              id="title"
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
            <Label htmlFor="description" className="text-sm font-bold">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add details about this task..."
              className="min-h-20 bg-muted border-border rounded-xl resize-none"
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Due Date (Optional)</Label>
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
                        format(field.value, "dd-mm-yyyy")
                      ) : (
                        <span>dd-mm-yyyy</span>
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
                      id="email-reminder"
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
                      htmlFor="email-reminder"
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
                      id="push-notification"
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
                      htmlFor="push-notification"
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
              disabled={isCreateActivityLoading}
              className="bg-black text-white hover:bg-black/90 rounded-lg p-4 cursor-pointer"
            >
              {isCreateActivityLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
