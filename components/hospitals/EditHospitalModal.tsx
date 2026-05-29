"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchIDNs, resetIDNsForSelection } from "@/store/features/idn/idnSlice";
import { fetchGPOs } from "@/store/features/gpo/gpoSlice";
import { fetchUsers } from "@/store/features/user/userSlice";
import { updateHospital } from "@/store/features/hospital/hospitalSlice";
import { toast } from "sonner";
import {
  hospitalSchema,
  HospitalFormValues,
} from "@/validations/hospital.validations";
import { Hospital, UserRole } from "@/store/types";

interface EditHospitalModalProps {
  hospital: Hospital;
  children: React.ReactNode;
}

export function EditHospitalModal({
  hospital,
  children,
}: EditHospitalModalProps) {
  const dispatch = useAppDispatch();
  const { idns, isFetchingIDNs, hasMoreSelection, selectionPage } = useAppSelector((state) => state.idn);
  const { gpos } = useAppSelector((state) => state.gpo);
  const { users } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === UserRole.ADMIN;

  const { isUpdateHospitalLoading } = useAppSelector((state) => state.hospital);

  const [open, setOpen] = useState(false);
  const [idnOpen, setIdnOpen] = useState(false);
  const [gpoOpen, setGpoOpen] = useState(false);
  const [idnSearch, setIdnSearch] = useState("");
  const idnSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idnListRef = useRef<HTMLDivElement>(null);
  const isLoadingIdnRef = useRef(false);

  const IDN_PAGE_LIMIT = 20;
  const [selectedUser, setSelectedUser] = useState<string>(
    typeof hospital.user === "object"
      ? (hospital.user as any)?._id || ""
      : hospital.user || "",
  );

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
      idn:
        typeof hospital.idn === "object"
          ? (hospital.idn as any)?._id || ""
          : hospital.idn || "",
      hospitalName: hospital.hospitalName || "",
      address: hospital.address || "",
      city: hospital.city || "",
      state: hospital.state || "",
      zip: hospital.zip || "",
      gpo:
        typeof hospital.gpo === "object"
          ? (hospital.gpo as any)?._id || ""
          : hospital.gpo || "",
      userId:
        typeof hospital.user === "object"
          ? (hospital.user as any)?._id || ""
          : hospital.user || "",
    },
  });

  const idnValue = watch("idn");
  const gpoValue = watch("gpo");

  useEffect(() => {
    if (open) {
      if (gpos.length === 0) dispatch(fetchGPOs({ limit: 1000 }));
      if (users.length === 0) dispatch(fetchUsers({ limit: 1000 }));
    }
  }, [open, dispatch, gpos.length, users.length]);

  // Fetch IDNs when dropdown opens or search changes
  useEffect(() => {
    if (idnOpen) {
      isLoadingIdnRef.current = true;
      dispatch(resetIDNsForSelection());
      dispatch(fetchIDNs({ page: 1, limit: IDN_PAGE_LIMIT, search: idnSearch }));
    }
  }, [idnOpen, idnSearch, dispatch]);

  // Keep the ref in sync with Redux loading state
  useEffect(() => {
    if (!isFetchingIDNs) {
      isLoadingIdnRef.current = false;
    }
  }, [isFetchingIDNs]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!idnOpen) {
      setIdnSearch("");
    }
  }, [idnOpen]);

  // Handle IDN search with debounce
  const handleIdnSearchChange = useCallback((value: string) => {
    if (idnSearchTimerRef.current) {
      clearTimeout(idnSearchTimerRef.current);
    }
    idnSearchTimerRef.current = setTimeout(() => {
      setIdnSearch(value);
    }, 300);
  }, []);

  // Handle scroll-to-load-more for IDN list
  const handleIdnScroll = useCallback(() => {
    const el = idnListRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 30 && hasMoreSelection && !isLoadingIdnRef.current) {
      isLoadingIdnRef.current = true;
      dispatch(fetchIDNs({ page: selectionPage + 1, limit: IDN_PAGE_LIMIT, search: idnSearch }));
    }
  }, [hasMoreSelection, selectionPage, idnSearch, dispatch]);

  useEffect(() => {
    if (open) {
      const userIdVal =
        typeof hospital.user === "object"
          ? (hospital.user as any)?._id || ""
          : hospital.user || "";
      reset({
        idn:
          typeof hospital.idn === "object"
            ? (hospital.idn as any)?._id || ""
            : hospital.idn || "",
        hospitalName: hospital.hospitalName || "",
        address: hospital.address || "",
        city: hospital.city || "",
        state: hospital.state || "",
        zip: hospital.zip || "",
        gpo:
          typeof hospital.gpo === "object"
            ? (hospital.gpo as any)?._id || ""
            : hospital.gpo || "",
        userId: userIdVal,
      });
      setSelectedUser(userIdVal);
    }
  }, [open, hospital, reset]);

  const onSubmit = async (data: HospitalFormValues) => {
    try {
      await dispatch(
        updateHospital({
          id: hospital._id,
          ...data,
          user: selectedUser || undefined,
        }),
      ).unwrap();
      toast.success("Hospital updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to update hospital");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Edit Hospital Information
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the details for {hospital.hospitalName}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          {isAdmin && (
            <div>
              <Label className="text-xs font-semibold">Sales Rep</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                  <SelectValue placeholder="Select Sales Rep" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  IDN Name
                </Label>
                <Popover open={idnOpen} onOpenChange={setIdnOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={idnOpen}
                      className="w-full justify-between mt-1.5 text-xs h-9 bg-white font-medium border-border shadow-none hover:bg-muted cursor-pointer"
                    >
                      <span className="truncate text-left flex-1 min-w-0">
                        {idnValue
                          ? idns.find((idn) => idn._id === idnValue)?.name ||
                            (typeof hospital.idn === "object"
                              ? (hospital.idn as any)?.name
                              : "Select IDN")
                          : "Select IDN"}
                      </span>
                      <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0 z-100"
                    align="start"
                  >
                    <Command onWheel={(e) => e.stopPropagation()} shouldFilter={false}>
                      <CommandInput
                        placeholder="Search IDN..."
                        className="h-9 text-xs"
                        onValueChange={handleIdnSearchChange}
                      />
                      <CommandList ref={idnListRef} onScroll={handleIdnScroll}>
                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                          {isFetchingIDNs ? "Loading..." : "No IDN found."}
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
                          {isFetchingIDNs && (
                            <div className="flex justify-center py-2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
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
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Hospital Name
                </Label>
                <Input
                  placeholder="Enter hospital name"
                  className="text-xs h-9 mt-1.5 bg-white"
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
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Address
              </Label>
              <Input
                placeholder="Enter address"
                className="text-xs h-9 mt-1.5 bg-white"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
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
              <Label className="text-xs font-semibold">Zip Code</Label>
              <Input
                placeholder="Enter zip code"
                className="text-xs h-9 mt-1.5 bg-muted"
                {...register("zip")}
              />
              {errors.zip && (
                <p className="text-xs text-destructive mt-1">
                  {errors.zip.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">GPO</Label>
            <Popover open={gpoOpen} onOpenChange={setGpoOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={gpoOpen}
                  className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted"
                >
                  {gpoValue
                    ? gpos.find((gpo) => gpo._id === gpoValue)?.name ||
                      (typeof hospital.gpo === "object"
                        ? (hospital.gpo as any)?.name
                        : "Select GPO")
                    : "Select GPO"}
                  <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
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

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              disabled={isUpdateHospitalLoading}
              className="bg-[#09090b] text-white hover:bg-[#27272a] h-10 px-6 rounded-lg cursor-pointer text-sm font-semibold"
            >
              {isUpdateHospitalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Information"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
