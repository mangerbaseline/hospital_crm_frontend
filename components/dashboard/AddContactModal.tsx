"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  fetchHospitalsForSelection,
  getSingleHospital,
} from "@/store/features/hospital/hospitalSlice";
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
import { Hospital } from "@/store/types";

export function AddContactModal({
  children,
  hospital: defaultHospital,
}: {
  children: React.ReactNode;
  hospital?: Hospital | any;
}) {
  const dispatch = useAppDispatch();
  const { hospitals, isFetchingHospitals, selectionPage, hasMoreSelection } =
    useAppSelector((state) => state.hospital);
  const { isCreateContactLoading } = useAppSelector((state) => state.contact);

  const [open, setOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [search, setSearch] = useState("");
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
      hospital: "",
      phoneNumber: "",
      email: "",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (defaultHospital) {
        setValue("hospital", defaultHospital._id, { shouldValidate: true });
      } else {
        dispatch(
          fetchHospitalsForSelection({ page: 1, limit: 10, search: "" }),
        );
      }
    } else {
      setSearch("");
    }
    setSelectedProductIds([]);
  }, [open, dispatch, defaultHospital, setValue]);

  useEffect(() => {
    if (!open || defaultHospital) return;

    const timer = setTimeout(() => {
      dispatch(fetchHospitalsForSelection({ page: 1, limit: 10, search }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search, dispatch, open, defaultHospital]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = () => {
    if (hasMoreSelection && !isFetchingHospitals) {
      dispatch(
        fetchHospitalsForSelection({
          page: selectionPage + 1,
          limit: 10,
          search,
        }),
      );
    }
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreSelection &&
          !isFetchingHospitals
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hospitals, isFetchingHospitals, hasMoreSelection]);

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

      <DialogContent className="sm:max-w-106.25 max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold">Add Contact</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            {defaultHospital
              ? `Add a new contact for ${defaultHospital.hospitalName}.`
              : "Add a new contact to a hospital in your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {defaultHospital ? (
            <div className="rounded-xl border border-border bg-slate-50/50 p-4 flex flex-col gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  IDN Name
                </Label>
                <h4 className="text-sm font-bold -mt-0.5">
                  {typeof defaultHospital.idn === "object"
                    ? defaultHospital.idn.name
                    : defaultHospital.idn || "Unknown"}
                </h4>
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Hospital Name
                </Label>
                <h4 className="text-sm font-bold -mt-0.5">
                  {defaultHospital.hospitalName}
                </h4>
              </div>
            </div>
          ) : (
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
                      >
                        {field.value
                          ? hospitals.find((h) => h._id === field.value)
                              ?.hospitalName
                          : "Select a hospital..."}
                        <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0 z-100"
                      align="start"
                    >
                      <Command
                        shouldFilter={false}
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <CommandInput
                          placeholder="Search hospital..."
                          className="h-9 text-xs w-full"
                          value={search}
                          onValueChange={setSearch}
                        />
                        <CommandList>
                          {hospitals.length === 0 && !isFetchingHospitals ? (
                            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                              No hospital found.
                            </CommandEmpty>
                          ) : null}
                          <CommandGroup>
                            {hospitals.map((hospital) => (
                              <CommandItem
                                key={hospital._id}
                                value={hospital._id}
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
                          {hasMoreSelection && (
                            <div
                              ref={sentinelRef}
                              className="h-4 flex items-center justify-center py-2"
                            >
                              {isFetchingHospitals && (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              )}
                            </div>
                          )}
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
          )}

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
            <Label className="text-xs font-semibold">Product (optional)</Label>
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
                  id="primary_contact"
                  className="h-4 w-4 rounded-lg border-foreground/50"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="primary_contact"
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
