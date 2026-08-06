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
import { getSingleHospital } from "@/store/features/hospital/hospitalSlice";
import {
  createContact,
  resetContactStatus,
} from "@/store/features/contact/contactSlice";
import {
  createContactSchema,
  CreateContactValues,
} from "@/validations/contact.validations";
import { toast } from "sonner";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { MultiHospitalSelect } from "@/components/hospitals/MultiHospitalSelect";
import { Hospital } from "@/store/types";

export function AddContactModal({
  children,
  hospital: defaultHospital,
  onSuccess,
}: {
  children: React.ReactNode;
  hospital?: Hospital | any;
  onSuccess?: () => void;
}) {
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
  } = useForm<CreateContactValues>({
    resolver: zodResolver(createContactSchema),
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
    if (open) {
      if (defaultHospital) {
        setValue("hospitals", [defaultHospital._id], { shouldValidate: true });
      }
    } else {
      reset();
      setSelectedProductIds([]);
    }
  }, [open, defaultHospital, setValue, reset]);

  const onSubmit = async (data: CreateContactValues) => {
    const payload = {
      ...data,
      product: selectedProductIds.length > 0 ? selectedProductIds : undefined,
    } as any;

    const resultAction = await dispatch(createContact(payload));
    if (createContact.fulfilled.match(resultAction)) {
      toast.success("Contact created successfully");
      reset();
      setOpen(false);
      dispatch(resetContactStatus());
      if (defaultHospital) {
        dispatch(getSingleHospital(defaultHospital._id));
      }
      if (onSuccess) onSuccess();
    } else {
      toast.error(
        (resultAction.payload as string) || "Failed to create contact",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25 max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-5 bg-card">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-foreground">Add Contact</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            {defaultHospital
              ? `Add a new contact for ${defaultHospital.hospitalName}.`
              : "Add a new contact to a hospital in your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {defaultHospital ? (
            <div className="rounded-xl border border-border bg-muted p-4 flex flex-col gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  IDN Name
                </Label>
                <h4 className="text-sm font-bold -mt-0.5 text-foreground">
                  {defaultHospital.idn &&
                  typeof defaultHospital.idn === "object"
                    ? defaultHospital.idn?.name
                    : defaultHospital.idn || "Unknown"}
                </h4>
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Hospital Name
                </Label>
                <h4 className="text-sm font-bold -mt-0.5 text-foreground">
                  {defaultHospital.hospitalName}
                </h4>
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-xs font-semibold text-foreground">Select Hospitals</Label>
              <Controller
                name="hospitals"
                control={control}
                render={({ field }) => {
                  const initialHospitals = defaultHospital
                    ? [
                        {
                          _id: defaultHospital._id,
                          hospitalName: defaultHospital.hospitalName,
                        },
                      ]
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
          )}

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
                  id="primary_contact_add"
                  className="h-4 w-4 rounded-lg border-foreground/50"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="primary_contact_add"
              className="text-xs ml-1 font-medium leading-none cursor-pointer text-foreground"
            >
              Set as Primary Contact for selected hospital(s)
            </Label>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 rounded-md font-semibold text-sm cursor-pointer disabled:opacity-70"
              disabled={isCreateContactLoading}
            >
              {isCreateContactLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Contact"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
