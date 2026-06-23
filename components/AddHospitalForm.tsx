"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";
import { CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchIDNs } from "@/store/features/idn/idnSlice";
import { fetchGPOs } from "@/store/features/gpo/gpoSlice";
import { createHospital } from "@/store/features/hospital/hospitalSlice";
import { toast } from "sonner";
import {
  hospitalSchema,
  HospitalFormValues,
} from "@/validations/hospital.validations";
import { UserRole } from "@/store/types";
import { UserSelect } from "./UserSelect";

interface AddHospitalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function AddHospitalForm({ onSuccess, onCancel }: AddHospitalFormProps) {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { idns } = useAppSelector((state) => state.idn);
  const { gpos } = useAppSelector((state) => state.gpo);
  const { isCreateHospitalLoading } = useAppSelector((state) => state.hospital);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const [idnOpen, setIdnOpen] = useState(false);
  const [gpoOpen, setGpoOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      idn: "",
      hospitalName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      gpo: "",
      userId: currentUser?._id || "",
      teamHospital: null as any,
      magnetHospital: null as any,
      ICUBeds: 0,
    },
  });

  const idnValue = watch("idn");
  const gpoValue = watch("gpo");
  const userIdValue = watch("userId");

  useEffect(() => {
    dispatch(fetchIDNs({ limit: 1000 }));
    dispatch(fetchGPOs({ limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?._id && !userIdValue) {
      setValue("userId", currentUser._id);
    }
  }, [currentUser, setValue, userIdValue]);

  const onSubmit = async (data: HospitalFormValues) => {
    try {
      await dispatch(createHospital(data)).unwrap();
      toast.success("Hospital created successfully");
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "Failed to create hospital");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background p-5 flex flex-col gap-4">
      <DialogTitle asChild>
        <CardHeader className="w-full bg-muted rounded-xl p-4 border border-border mt-2">
          <CardTitle className="text-sm mb-1.5">Sales Rep</CardTitle>
          {isAdmin ? (
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <UserSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  showAll={false}
                  className="w-full bg-background border-border shadow-none cursor-pointer h-9 text-xs"
                />
              )}
            />
          ) : (
            <CardDescription className="text-lg text-primary font-semibold">
              {currentUser?.name}
            </CardDescription>
          )}
          {errors.userId && (
            <p className="text-xs text-destructive mt-1">
              {errors.userId.message}
            </p>
          )}
        </CardHeader>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold">IDN Name</Label>
            <Popover open={idnOpen} onOpenChange={setIdnOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={idnOpen}
                  className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted"
                >
                  <span className="truncate text-left flex-1">
                    {idnValue
                      ? idns.find((idn) => idn._id === idnValue)?.name
                      : "Select IDN"}
                  </span>
                  <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0 z-100"
                align="start"
              >
                <Command onWheel={(e) => e.stopPropagation()}>
                  <CommandInput
                    placeholder="Search IDN..."
                    className="h-9 text-xs"
                  />
                  <CommandList>
                    <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                      No IDN found.
                    </CommandEmpty>
                    <CommandGroup>
                      {idns.map((idn) => (
                        <CommandItem
                          key={idn._id}
                          value={idn.name}
                          onSelect={() => {
                            setValue(
                              "idn",
                              idn._id === idnValue ? "" : idn._id,
                              { shouldValidate: true },
                            );
                            setIdnOpen(false);
                          }}
                          className="text-xs"
                        >
                          {idn.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              idnValue === idn._id
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
            {errors.idn && (
              <p className="text-xs text-destructive mt-1">
                {errors.idn.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Hospital Name</Label>
            <Input
              placeholder="Enter hospital name"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("hospitalName")}
            />
            {errors.hospitalName && (
              <p className="text-xs text-destructive mt-1">
                {errors.hospitalName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold">Address</Label>
          <Input
            placeholder="Enter address"
            className="text-xs h-9 mt-1.5 bg-muted"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-xs text-destructive mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs font-semibold">City</Label>
            <Input
              placeholder="Enter city"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-xs text-destructive mt-1">
                {errors.city.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold">State</Label>
            <Input
              placeholder="Enter state"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("state")}
            />
            {errors.state && (
              <p className="text-xs text-destructive mt-1">
                {errors.state.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold">Zip</Label>
            <Input
              placeholder="Enter zip code"
              className="text-xs mt-1.5 h-9 bg-muted"
              {...register("zip")}
            />
            {errors.zip && (
              <p className="text-xs text-destructive mt-1">
                {errors.zip.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold">GPO</Label>
            <Popover open={gpoOpen} onOpenChange={setGpoOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={gpoOpen}
                  className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted"
                >
                  <span className="truncate text-left flex-1">
                    {gpoValue
                      ? gpos.find((gpo) => gpo._id === gpoValue)?.name
                      : "Select GPO"}
                  </span>
                  <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0 z-100"
                align="start"
              >
                <Command onWheel={(e) => e.stopPropagation()}>
                  <CommandInput
                    placeholder="Search GPO..."
                    className="h-9 text-xs"
                  />
                  <CommandList>
                    <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                      No GPO found.
                    </CommandEmpty>
                    <CommandGroup>
                      {gpos.map((gpo) => (
                        <CommandItem
                          key={gpo._id}
                          value={gpo.name}
                          onSelect={() => {
                            setValue(
                              "gpo",
                              gpo._id === gpoValue ? "" : gpo._id,
                              { shouldValidate: true },
                            );
                            setGpoOpen(false);
                          }}
                          className="text-xs"
                        >
                          {gpo.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              gpoValue === gpo._id
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
            {errors.gpo && (
              <p className="text-xs text-destructive mt-1">
                {errors.gpo.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold">ICU Beds</Label>
            <Input
              type="number"
              placeholder="Enter number"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("ICUBeds", { valueAsNumber: true })}
            />
            {errors.ICUBeds && (
              <p className="text-xs text-destructive mt-1">
                {errors.ICUBeds.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold">Total Beds</Label>
            <Input
              type="number"
              placeholder="Enter number"
              className="text-xs h-9 mt-1.5 bg-muted"
              {...register("totalBeds", { valueAsNumber: true })}
            />
            {errors.totalBeds && (
              <p className="text-xs text-destructive mt-1">
                {errors.totalBeds.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold">TEAM Hospital</Label>
            <Controller
              control={control}
              name="teamHospital"
              render={({ field }) => (
                <Select
                  value={field.value === true ? "yes" : field.value === false ? "no" : ""}
                  onValueChange={(val) => {
                    if (val === "yes") field.onChange(true);
                    else if (val === "no") field.onChange(false);
                    else field.onChange(null);
                  }}
                >
                  <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                    <SelectValue placeholder="Select Yes or No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Option</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="text-xs font-semibold">MAGNET Hospital</Label>
            <Controller
              control={control}
              name="magnetHospital"
              render={({ field }) => (
                <Select
                  value={field.value === true ? "yes" : field.value === false ? "no" : ""}
                  onValueChange={(val) => {
                    if (val === "yes") field.onChange(true);
                    else if (val === "no") field.onChange(false);
                    else field.onChange(null);
                  }}
                >
                  <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                    <SelectValue placeholder="Select Yes or No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Option</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className={`flex ${onCancel ? "gap-2" : "flex-col"} w-full mt-2`}>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isCreateHospitalLoading}
              className="flex-1 h-10 rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isCreateHospitalLoading}
            className={`${onCancel ? "flex-1" : "w-full"} bg-[#09090b] text-white hover:bg-[#27272a] h-10 rounded-lg cursor-pointer`}
          >
            {isCreateHospitalLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-1 h-4 w-4" />
            )}
            {isCreateHospitalLoading ? "Creating..." : "Add Hospital"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddHospitalForm;
