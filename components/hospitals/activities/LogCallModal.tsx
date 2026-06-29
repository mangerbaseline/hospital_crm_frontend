"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createActivity,
  updateActivity,
  fetchAllActivities,
} from "@/store/features/activity/activitySlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import { ActivityType } from "@/store/types";
import { toast } from "sonner";

const logCallSchema = z.object({
  Date: z.date(),
  contact: z.string().optional(),
  notes: z.string().min(1, "Call notes cannot be empty"),
  product: z.string().min(1, "Product category is required"),
});

type LogCallFormValues = z.infer<typeof logCallSchema>;

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  contacts: { _id: string; firstName: string; lastName: string }[];
  callLogId?: string;
  initialData?: {
    Date: string;
    contact?: string;
    notes: string;
    product?: string;
  };
}

export function LogCallModal({
  isOpen,
  onClose,
  hospitalId,
  contacts,
  callLogId,
  initialData,
}: LogCallModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateActivityLoading, isUpdateActivityLoading } = useAppSelector(
    (state) => state.activity,
  );

  const { products } = useAppSelector((state) => state.product);
  const { selectedHospital } = useAppSelector((state) => state.hospital);

  const hospitalProducts = selectedHospital?.deals?.flatMap((deal) => 
    deal.products.map((p) => p.product)
  ).filter((prod): prod is { _id: string; name: string } => !!prod && typeof prod === "object" && !!prod._id) || [];

  const uniqueHospitalProducts = Array.from(
    new Map(hospitalProducts.map((p) => [p._id, p])).values()
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LogCallFormValues>({
    resolver: zodResolver(logCallSchema),
    defaultValues: {
      Date: new Date(),
      contact: "",
      notes: "",
      product: "",
    },
  });

  const isEditing = !!callLogId;

  useEffect(() => {
    if (isOpen) {
      if (products.length === 0) dispatch(fetchProducts({ limit: 1000 }));
      reset({
        Date: initialData?.Date ? new Date(initialData.Date) : new Date(),
        contact: initialData?.contact || "",
        notes: initialData?.notes || "",
        product: initialData?.product || "",
      });
    }
  }, [isOpen, initialData, reset, products.length, dispatch]);

  const onSubmit = async (data: LogCallFormValues) => {
    try {
      if (isEditing && callLogId) {
        await dispatch(
          updateActivity({
            id: callLogId,
            type: ActivityType.CALL_LOG,
            data: {
              Date: data.Date.toISOString(),
              contact: data.contact || "",
              notes: data.notes,
              hospital: hospitalId,
              product: data.product,
            },
          }),
        ).unwrap();
        toast.success("Call updated successfully");
      } else {
        await dispatch(
          createActivity({
            type: ActivityType.CALL_LOG,
            data: {
              Date: data.Date.toISOString(),
              contact: data.contact || "",
              notes: data.notes,
              hospital: hospitalId,
              product: data.product,
            },
          }),
        ).unwrap();
        toast.success("Call logged successfully");
      }
      dispatch(fetchAllActivities({ hospitalId: hospitalId }));
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || `Failed to ${isEditing ? "update" : "log"} call`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Call Log" : "Log Call"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Update details about this call log."
              : "Record details about a call with this hospital."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-4">
            <Label className="text-sm font-bold">Date</Label>
            <Controller
              control={control}
              name="Date"
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
                        <span>Pick a date</span>
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
            {errors.Date && (
              <p className="text-xs text-destructive font-medium">
                {errors.Date.message}
              </p>
            )}
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
                  <SelectTrigger className="w-full h-10 bg-muted border-border rounded-xl px-3 text-xs">
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
            <Label className="text-sm font-bold">Contact (Optional)</Label>
            <Controller
              control={control}
              name="contact"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full h-10 bg-muted border-border rounded-xl px-3">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact._id} value={contact._id}>
                        {contact.firstName} {contact.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="call-notes" className="text-sm font-bold">
              Call Notes
            </Label>
            <Textarea
              id="call-notes"
              placeholder="Enter details about the call..."
              className="min-h-[80px] bg-muted border-border rounded-xl resize-none"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-destructive font-medium">
                {errors.notes.message}
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
                  {isEditing ? "Saving..." : "Logging..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Log Call"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
