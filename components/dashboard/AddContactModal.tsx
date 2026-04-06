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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchHospitals } from "@/store/features/hospital/hospitalSlice";
import {
  createContact,
  resetContactStatus,
} from "@/store/features/contact/contactSlice";
import {
  createContactSchema,
  CreateContactValues,
} from "@/validations/contact.validations";
import { toast } from "sonner";

export function AddContactModal({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { hospitals, isFetchingHospitals } = useAppSelector(
    (state) => state.hospital,
  );
  const { isCreateContactLoading } = useAppSelector((state) => state.contact);

  const [open, setOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);

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
      hospital: "",
      phoneNumber: "",
      email: "",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchHospitals({ limit: 100 }));
    }
  }, [open, dispatch]);

  const onSubmit = async (data: CreateContactValues) => {
    const resultAction = await dispatch(createContact(data));
    if (createContact.fulfilled.match(resultAction)) {
      toast.success("Contact created successfully");
      reset();
      setOpen(false);
      dispatch(resetContactStatus());
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

      <DialogContent className="sm:max-w-[425px] overflow-y-auto p-6 flex flex-col gap-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold">
            Add New Contact
          </DialogTitle>
          <DialogDescription className="text-[13px] mt-1 text-muted-foreground">
            Add a new contact to a hospital in your pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <Label className="text-xs font-semibold">Select Hospital</Label>
            <Controller
              name="hospital"
              control={control}
              render={({ field }) => (
                <Popover open={hospitalOpen} onOpenChange={setHospitalOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={hospitalOpen}
                      className={cn(
                        "w-full justify-between mt-1.5 text-xs h-9 bg-muted font-normal border-border",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={isFetchingHospitals}
                    >
                      {field.value
                        ? hospitals.find((h) => h._id === field.value)
                            ?.hospitalName
                        : isFetchingHospitals
                          ? "Loading hospitals..."
                          : "Select a hospital..."}
                      {isFetchingHospitals ? (
                        <Loader2 className="opacity-50 h-4 w-4 animate-spin ml-auto" />
                      ) : (
                        <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0 z-100"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search hospital..."
                        className="h-9 text-xs w-full"
                      />
                      <CommandList>
                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                          No hospital found.
                        </CommandEmpty>
                        <CommandGroup>
                          {hospitals.map((hospital) => (
                            <CommandItem
                              key={hospital._id}
                              value={hospital.hospitalName}
                              onSelect={() => {
                                setValue("hospital", hospital._id, {
                                  shouldValidate: true,
                                });
                                setHospitalOpen(false);
                              }}
                              className="text-xs"
                            >
                              {hospital.hospitalName}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value === hospital._id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.hospital && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.hospital.message}
              </p>
            )}
          </div>

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

          <div className="flex items-center gap-2 mt-1">
            <Controller
              name="isPrimary"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="primary_contact"
                  className="h-4 w-4 rounded-[4px] border-foreground/50"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="primary_contact"
              className="text-[13px] font-medium leading-none cursor-pointer"
            >
              Primary Contact
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-[#09090b] text-white hover:bg-[#27272a] h-10 rounded-[8px] font-semibold text-sm cursor-pointer disabled:opacity-70"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
