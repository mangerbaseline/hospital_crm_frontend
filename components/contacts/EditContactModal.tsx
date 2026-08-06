"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateContact } from "@/store/features/contact/contactSlice";
import {
  updateContactSchema,
  UpdateContactValues,
} from "@/validations/contact.validations";
import { toast } from "sonner";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { MultiHospitalSelect } from "@/components/hospitals/MultiHospitalSelect";
import { Contact } from "@/store/types";

interface EditContactModalProps {
  contact: Contact;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function EditContactModal({
  contact,
  children,
  onSuccess,
}: EditContactModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateContactLoading } = useAppSelector((state) => state.contact);

  const [open, setOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateContactValues>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      designation: "",
      hospitals: [],
      phoneNumber: "",
      secondaryPhoneNumber: "",
      email: "",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (open && contact) {
      const prodIds = contact.product ? contact.product.map((p) => p._id) : [];
      const hospIds = contact.hospitals
        ? contact.hospitals.map((h: any) => (typeof h === "object" ? h._id : h))
        : [];

      reset({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        designation: contact.designation || "",
        hospitals: hospIds,
        phoneNumber: contact.phoneNumber || "",
        secondaryPhoneNumber: contact.secondaryPhoneNumber || "",
        email: contact.email || "",
        isPrimary: contact.isPrimary || false,
      });

      setSelectedProductIds(prodIds);
    }
  }, [open, contact, reset]);

  const onSubmit = async (data: UpdateContactValues) => {
    const payload = {
      ...data,
      product: selectedProductIds,
    } as any;

    try {
      await dispatch(
        updateContact({
          id: contact._id,
          payload,
        }),
      ).unwrap();
      toast.success("Contact details updated successfully");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "Failed to update contact information");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25 max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-5 border border-border rounded-2xl shadow-2xl bg-card">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-foreground">Edit Contact</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            Update dynamic variables for this contact profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <Label className="text-xs font-semibold text-foreground">Select Hospitals</Label>
            <Controller
              name="hospitals"
              control={control}
              render={({ field }) => {
                const initialHospitals = contact?.hospitals
                  ? contact.hospitals.map((h: any) =>
                      typeof h === "object"
                        ? { _id: h._id, hospitalName: h.hospitalName }
                        : { _id: h, hospitalName: "Hospital" }
                    )
                  : [];
                return (
                  <MultiHospitalSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    initialHospitals={initialHospitals}
                  />
                );
              }}
            />
            {errors.hospitals && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.hospitals.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">First Name</Label>
            <Input
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">Last Name</Label>
            <Input
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">Title</Label>
            <Input
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("designation")}
            />
            {errors.designation && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">Email</Label>
            <Input
              type="email"
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">Phone</Label>
            <Input
              type="tel"
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">Secondary Phone</Label>
            <Input
              type="tel"
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("secondaryPhoneNumber")}
            />
            {errors.secondaryPhoneNumber && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.secondaryPhoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-foreground">Product (optional)</Label>
            <div className="mt-1.5">
              <MultiProductSelect
                value={selectedProductIds}
                onValueChange={setSelectedProductIds}
                placeholder="Select product (optional)"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Controller
              name="isPrimary"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="primary_contact_edit"
                  className="h-4 w-4 rounded-lg border-foreground/50"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="primary_contact_edit"
              className="text-xs ml-1 font-medium leading-none cursor-pointer text-foreground"
            >
              Set as Primary Contact for selected hospital(s)
            </Label>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 rounded-md font-semibold text-sm cursor-pointer disabled:opacity-70 flex items-center justify-center"
              disabled={isCreateContactLoading}
            >
              {isCreateContactLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
