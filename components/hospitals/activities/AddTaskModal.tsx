"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MentionTextarea } from "./MentionTextarea";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Mail, Bell, ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";
import { fetchUsers } from "@/store/features/user/userSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import { UserRole } from "@/store/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  createActivity,
  updateActivity,
  fetchAllActivities,
} from "@/store/features/activity/activitySlice";
import { ActivityType } from "@/store/types";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  reminders: z.array(z.enum(["email", "push"])),
  product: z.string().min(1, "Product category is required"),
  user: z.string().min(1, "Primary assignee is required"),
  secondaryAssignees: z.array(z.string()).optional(),
});

interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: Date;
  reminders: ("email" | "push")[];
  product: string;
  user: string;
  secondaryAssignees?: string[];
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  hospitalName: string;
  taskId?: string;
  initialData?: {
    title: string;
    description?: string;
    dueDate?: string;
    reminders: ("email" | "push")[];
    product?: string;
    user?: string;
    secondaryAssignees?: string[];
  };
}

export function AddTaskModal({
  isOpen,
  onClose,
  hospitalId,
  hospitalName,
  taskId,
  initialData,
}: AddTaskModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateActivityLoading, isUpdateActivityLoading } = useAppSelector(
    (state) => state.activity,
  );

  const { users } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { products } = useAppSelector((state) => state.product);
  const { selectedHospital } = useAppSelector((state) => state.hospital);

  const hospitalProducts = selectedHospital?.deals?.flatMap((deal) =>
    deal.products.map((p) => p.product)
  ).filter((prod): prod is { _id: string; name: string } => !!prod && typeof prod === "object" && !!prod._id) || [];

  const uniqueHospitalProducts = Array.from(
    new Map(hospitalProducts.map((p) => [p._id, p])).values()
  );

  const isSales = currentUser?.role === UserRole.SALES;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      reminders: [],
      product: "",
      user: currentUser?._id || "",
      secondaryAssignees: [],
    },
  });

  const isEditing = !!taskId;

  useEffect(() => {
    if (isOpen) {
      if (products.length === 0) dispatch(fetchProducts({ limit: 1000 }));
      if (users.length === 0) dispatch(fetchUsers({ limit: 1000 }));

      reset({
        title: initialData?.title || "",
        description: initialData?.description || "",
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
        reminders: initialData?.reminders || [],
        product: initialData?.product || "",
        user: initialData?.user || currentUser?._id || "",
        secondaryAssignees: initialData?.secondaryAssignees || [],
      });
    }
  }, [isOpen, initialData, reset, products.length, users.length, dispatch, currentUser]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEditing && taskId) {
        await dispatch(
          updateActivity({
            id: taskId,
            type: ActivityType.TASK,
            data: {
              title: data.title,
              description: data.description || "",
              dueDate: data.dueDate
                ? data.dueDate.toISOString()
                : new Date().toISOString(),
              hospital: hospitalId,
              reminders: data.reminders,
              product: data.product,
              user: data.user,
              secondaryAssignees: data.secondaryAssignees,
            },
          }),
        ).unwrap();
        toast.success("Task updated successfully");
      } else {
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
              product: data.product,
              user: data.user,
              secondaryAssignees: data.secondaryAssignees,
            },
          }),
        ).unwrap();
        toast.success("Task added successfully");
      }

      dispatch(fetchAllActivities({ hospitalId: hospitalId }));
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || `Failed to ${isEditing ? "update" : "add"} task`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing
              ? `Update details about this task for ${hospitalName}.`
              : `Create a new task with reminders for ${hospitalName}.`}
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
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <MentionTextarea
                  id="description"
                  placeholder="Add details about this task... Use @ to mention coworkers."
                  className="min-h-20 bg-muted border-border rounded-xl resize-none"
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Product Category</Label>
            <Controller
              control={control}
              name="product"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-10 bg-muted border-border rounded-xl px-3 text-xs">
                    <SelectValue placeholder="Select Product Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueHospitalProducts.map((prod) => (
                      <SelectItem key={prod._id} value={prod._id}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.product && (
              <p className="text-xs text-destructive font-medium">
                {errors.product.message}
              </p>
            )}
            {uniqueHospitalProducts.length === 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-500 font-semibold mt-1.5 leading-tight">
                ⚠️ This hospital has no deals created yet. Please create a deal (expected ARR) for this hospital first.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Primary Assignee</Label>
            <Controller
              control={control}
              name="user"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSales}
                >
                  <SelectTrigger className="h-10 bg-muted border-border rounded-xl px-3 text-xs">
                    <SelectValue placeholder="Select Primary Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.user && (
              <p className="text-xs text-destructive font-medium">
                {errors.user.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Secondary Assignees (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between text-xs h-10 font-normal border-border bg-muted/70 rounded-xl px-3"
                >
                  <span>
                    {(watch("secondaryAssignees") || []).length > 0
                      ? `${(watch("secondaryAssignees") || []).length} selected`
                      : "Select secondary assignees"}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2 z-100" align="start">
                <div
                  className="flex flex-col gap-2 max-h-60 overflow-y-auto"
                  onWheel={(e) => e.stopPropagation()}
                >
                  {users
                    .filter((u) => u._id !== watch("user")) // Exclude primary assignee
                    .map((u) => {
                      const isChecked = (watch("secondaryAssignees") || []).includes(u._id);
                      return (
                        <div key={u._id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer">
                          <Checkbox
                            id={`sec-${u._id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const current = watch("secondaryAssignees") || [];
                              if (checked) {
                                setValue("secondaryAssignees", [...current, u._id]);
                              } else {
                                setValue("secondaryAssignees", current.filter((id) => id !== u._id));
                              }
                            }}
                          />
                          <Label htmlFor={`sec-${u._id}`} className="text-xs cursor-pointer flex-1">
                            {u.name} ({u.email})
                          </Label>
                        </div>
                      );
                    })}
                </div>
              </PopoverContent>
            </Popover>
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
                        format(field.value, "dd-MM-yyyy")
                      ) : (
                        <span>dd-MM-yyyy</span>
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
                "Add Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
