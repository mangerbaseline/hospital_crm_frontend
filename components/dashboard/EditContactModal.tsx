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
import {
  updateContact,
  resetContactStatus,
} from "@/store/features/contact/contactSlice";
import { getSingleHospital } from "@/store/features/hospital/hospitalSlice";
import {
  updateContactSchema,
  UpdateContactValues,
} from "@/validations/contact.validations";
import { toast } from "sonner";

export function EditContactModal({
  children,
  contact,
  hospital,
}: {
  children: React.ReactNode;
  contact: any;
  hospital?: any;
}) {
  const dispatch = useAppDispatch();
  const { isCreateContactLoading } = useAppSelector((state) => state.contact);

  const [open, setOpen] = useState(false);

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
      hospital: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      email: "",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (open && contact) {
      setValue("firstName", contact.firstName || "");
      setValue("lastName", contact.lastName || "");
      setValue("designation", contact.designation || "");
      setValue("hospital", typeof contact.hospital === "object" ? contact.hospital?._id : contact.hospital || "");
      setValue("phoneNumber", contact.phoneNumber || "");
      setValue("secondaryPhoneNumber", contact.secondaryPhoneNumber || "");
      setValue("email", contact.email || "");
      setValue("isPrimary", !!contact.isPrimary);
    } else if (!open) {
      reset();
    }
  }, [open, contact, reset, setValue]);

  const onSubmit = async (data: UpdateContactValues) => {
    const resultAction = await dispatch(
      updateContact({ id: contact._id, payload: data as any }),
    );

    if (updateContact.fulfilled.match(resultAction)) {
      toast.success("Contact updated successfully");
      setOpen(false);
      dispatch(resetContactStatus());
      if (hospital) {
        dispatch(getSingleHospital(hospital._id));
      }
    } else {
      toast.error(
        (resultAction.payload as string) || "Failed to update contact",
      );
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

      <DialogContent className="sm:max-w-106.25 max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold">Edit Contact</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            Update contact details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <Label className="text-xs font-semibold">First Name</Label>
            <Input
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Last Name</Label>
            <Input
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Title</Label>
            <Input
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("designation")}
            />
            {errors.designation && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Email</Label>
            <Input
              type="email"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Phone</Label>
            <Input
              type="tel"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Secondary Phone</Label>
            <Input
              type="tel"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("secondaryPhoneNumber")}
            />
            {errors.secondaryPhoneNumber && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.secondaryPhoneNumber.message}
              </p>
            )}
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
              className="text-xs ml-1 font-medium leading-none cursor-pointer"
            >
              Primary Contact
            </Label>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-[#09090b] text-white hover:bg-[#27272a] h-10 px-8 rounded-md font-semibold text-sm cursor-pointer disabled:opacity-70"
              disabled={isCreateContactLoading}
            >
              {isCreateContactLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Contact"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
