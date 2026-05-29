"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
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
import { Checkbox } from "./ui/checkbox";
import { ProductFields } from "./ProductFields";
import { Textarea } from "./ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchIDNs,
  getSingleIDN,
  clearSelectedIDN,
  resetIDNsForSelection,
  setIDNsForSelection,
} from "@/store/features/idn/idnSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import {
  fetchHospitalsForSelection,
  getSingleHospital,
  clearSelectedHospital,
  resetHospitalsForSelection,
} from "@/store/features/hospital/hospitalSlice";
import { createDeal } from "@/store/features/deal/dealSlice";
import { dealSchema, DealFormValues } from "@/validations/deal.validations";
import { toast } from "sonner";
import { DealProductStage, UserRole } from "@/store/types";
import { useRef } from "react";
import { UserSelect } from "./UserSelect";
import { CardHeader, CardTitle, CardDescription } from "./ui/card";

interface AddDealFormProps {
  onSuccess?: () => void;
}

function AddDealForm({ onSuccess }: AddDealFormProps = {}) {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    idns,
    isFetchingIDNs,
    selectionPage: idnSelectionPage,
    hasMoreSelection: idnHasMoreSelection,
    selectedIDN,
  } = useAppSelector((state) => state.idn);
  const {
    hospitals,
    isFetchingHospitals,
    selectedHospital,
    selectionPage: hospitalSelectionPage,
    hasMoreSelection: hospitalHasMoreSelection,
  } = useAppSelector((state) => state.hospital);
  const { products } = useAppSelector((state) => state.product);
  const { isCreateDealLoading } = useAppSelector((state) => state.deal);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const [idnOpen, setIdnOpen] = useState(false);
  const [idnSearch, setIdnSearch] = useState("");
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState("");

  const methods = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      hospital: "",
      idn: "",
      gpo: "",
      products: [],
      notes: "",
      userId: currentUser?._id || "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const { append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const idnValue = watch("idn");
  const hospitalValue = watch("hospital");
  const selectedProducts = watch("products");
  const userIdValue = watch("userId");

  const idnObserverRef = useRef<IntersectionObserver | null>(null);
  const idnSentinelRef = useRef<HTMLDivElement | null>(null);
  const hospitalObserverRef = useRef<IntersectionObserver | null>(null);
  const hospitalSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentUser?._id && !userIdValue) {
      setValue("userId", currentUser._id);
    }
  }, [currentUser, setValue, userIdValue]);

  useEffect(() => {
    dispatch(fetchIDNs({ page: 1, limit: 10, search: "" }));
    dispatch(fetchProducts({ limit: 1000 }));

    return () => {
      dispatch(clearSelectedHospital());
      dispatch(clearSelectedIDN());
      dispatch(resetHospitalsForSelection());
      dispatch(resetIDNsForSelection());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!idnOpen || hospitalValue) return;
    const timer = setTimeout(() => {
      dispatch(fetchIDNs({ page: 1, limit: 10, search: idnSearch }));
    }, 500);
    return () => clearTimeout(timer);
  }, [idnSearch, dispatch, idnOpen, hospitalValue]);

  const loadMoreIDNs = () => {
    if (idnHasMoreSelection && !isFetchingIDNs && !hospitalValue) {
      dispatch(
        fetchIDNs({
          page: idnSelectionPage + 1,
          limit: 10,
          search: idnSearch,
        }),
      );
    }
  };

  useEffect(() => {
    if (idnObserverRef.current) idnObserverRef.current.disconnect();
    idnObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          idnHasMoreSelection &&
          !isFetchingIDNs
        ) {
          loadMoreIDNs();
        }
      },
      { threshold: 0.1 },
    );
    if (idnSentinelRef.current)
      idnObserverRef.current.observe(idnSentinelRef.current);
    return () => idnObserverRef.current?.disconnect();
  }, [idns, isFetchingIDNs, idnHasMoreSelection]);

  useEffect(() => {
    if (!hospitalOpen) return;
    if (hospitals.length > 0 && hospitalSearch === "") return;

    if (hospitalSearch === "") {
      dispatch(
        fetchHospitalsForSelection({
          page: 1,
          limit: 20,
          search: "",
        }),
      );
      return;
    }

    const timer = setTimeout(() => {
      dispatch(
        fetchHospitalsForSelection({
          page: 1,
          limit: 20,
          search: hospitalSearch,
        }),
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [hospitalSearch, dispatch, hospitalOpen, hospitals.length]);

  const loadMoreHospitals = () => {
    if (hospitalHasMoreSelection && !isFetchingHospitals) {
      dispatch(
        fetchHospitalsForSelection({
          page: hospitalSelectionPage + 1,
          limit: 20,
          search: hospitalSearch,
        }),
      );
    }
  };

  useEffect(() => {
    if (hospitalObserverRef.current) hospitalObserverRef.current.disconnect();
    hospitalObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hospitalHasMoreSelection &&
          !isFetchingHospitals
        ) {
          loadMoreHospitals();
        }
      },
      { threshold: 0.1 },
    );
    if (hospitalSentinelRef.current)
      hospitalObserverRef.current.observe(hospitalSentinelRef.current);
    return () => hospitalObserverRef.current?.disconnect();
  }, [hospitals, isFetchingHospitals, hospitalHasMoreSelection]);

  useEffect(() => {
    if (selectedHospital) {
      setValue(
        "gpo",
        selectedHospital.gpo
          ? typeof selectedHospital.gpo === "string"
            ? selectedHospital.gpo
            : selectedHospital.gpo._id
          : ""
      );

      const idnObj = selectedHospital.idn;
      if (idnObj && typeof idnObj !== "string") {
        setValue("idn", idnObj._id, { shouldValidate: true });
        dispatch(setIDNsForSelection([idnObj]));
        dispatch(getSingleIDN(idnObj._id));
      } else if (idnObj) {
        // String IDN
        setValue("idn", idnObj, { shouldValidate: true });
        dispatch(getSingleIDN(idnObj));
      } else {
        setValue("idn", "");
        dispatch(clearSelectedIDN());
        dispatch(resetIDNsForSelection());
      }
    } else {
      // Clear selections
      setValue("idn", "");
      dispatch(clearSelectedIDN());
      dispatch(resetIDNsForSelection());
    }
  }, [selectedHospital, setValue, dispatch]);

  const handleIDNSelect = (idnId: string) => {
    if (idnId === idnValue) {
      setValue("idn", "");
      dispatch(clearSelectedIDN());
    } else {
      setValue("idn", idnId, { shouldValidate: true });
      dispatch(getSingleIDN(idnId));
    }
    setIdnOpen(false);
  };

  const handleHospitalSelect = (hospitalId: string) => {
    if (hospitalId === hospitalValue) {
      setValue("hospital", "");
      dispatch(clearSelectedHospital());
      setValue("idn", "");
      dispatch(clearSelectedIDN());
      setValue("gpo", "");
    } else {
      setValue("hospital", hospitalId, { shouldValidate: true });
      dispatch(getSingleHospital(hospitalId));
    }
    setHospitalOpen(false);
  };

  const handleProductToggle = (productId: string) => {
    const index = selectedProducts.findIndex((p) => p.product === productId);
    if (index > -1) {
      remove(index);
    } else {
      append({
        product: productId,
        dealAmount: 0,
        quantity: 1,
        beds: 0,
        stage: DealProductStage.DEMO,
        expectedCloseDate: undefined,
      });
    }
  };

  const onSubmit: SubmitHandler<DealFormValues> = async (data) => {
    try {
      await dispatch(createDeal(data)).unwrap();
      toast.success("Deal created successfully");
      reset();
      dispatch(clearSelectedHospital());
      dispatch(clearSelectedIDN());
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error || "Failed to create deal");
    }
  };

  return (
    <div className="rounded-xl border border-border p-5 flex flex-col gap-4">
      {/* <h3 className="text-sm font-bold mb-2">Add New Deal</h3> */}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <CardHeader className="w-full bg-muted rounded-xl p-4 border border-border">
            <CardTitle className="text-sm mb-1.5 font-bold">
              Sales Rep
            </CardTitle>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">Hospital Name</Label>
              <Popover
                open={hospitalOpen}
                onOpenChange={setHospitalOpen}
                modal={false}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={hospitalOpen}
                    className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted disabled:opacity-50 cursor-pointer"
                  >
                    <span className="truncate text-left flex-1">
                      {isFetchingHospitals && hospitals.length === 0 ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading...
                        </span>
                      ) : hospitalValue ? (
                        selectedHospital?.hospitalName ||
                        hospitals.find((h) => h._id === hospitalValue)
                          ?.hospitalName
                      ) : (
                        "Select Hospital"
                      )}
                    </span>
                    <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
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
                      className="h-9 text-xs"
                      value={hospitalSearch}
                      onValueChange={setHospitalSearch}
                    />
                    <CommandList>
                      <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                        No hospitals found.
                      </CommandEmpty>
                      <CommandGroup>
                        {hospitals.map((hospital) => (
                          <CommandItem
                            key={hospital._id}
                            value={hospital._id}
                            onSelect={() => handleHospitalSelect(hospital._id)}
                            className="text-xs"
                          >
                            {hospital.hospitalName}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                hospitalValue === hospital._id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {hospitalHasMoreSelection && (
                        <div
                          ref={hospitalSentinelRef}
                          className="h-8 flex items-center justify-center py-2"
                        >
                          {isFetchingHospitals ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Load more</span>
                          )}
                        </div>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.hospital && (
                <p className="text-[10px] text-destructive mt-1">
                  {errors.hospital.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold">IDN Name</Label>
              <Popover open={idnOpen} onOpenChange={setIdnOpen} modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={idnOpen}
                    disabled={!hospitalValue}
                    className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted cursor-pointer"
                  >
                    <span className="truncate text-left flex-1">
                      {idnValue
                        ? selectedIDN?.name ||
                          idns.find((idn) => idn._id === idnValue)?.name
                        : hospitalValue
                        ? "Select IDN"
                        : "Select Hospital first"}
                    </span>
                    <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
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
                      placeholder="Search IDN..."
                      className="h-9 text-xs"
                      value={idnSearch}
                      onValueChange={setIdnSearch}
                    />
                    <CommandList>
                      <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                        No IDN found.
                      </CommandEmpty>
                      <CommandGroup>
                        {idns.map((idn) => (
                          <CommandItem
                            key={idn._id}
                            value={idn._id}
                            onSelect={() => handleIDNSelect(idn._id)}
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
                      {idnHasMoreSelection && (
                        <div
                          ref={idnSentinelRef}
                          className="h-4 flex items-center justify-center py-2"
                        >
                          {isFetchingIDNs && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.idn && (
                <p className="text-[10px] text-destructive mt-1">
                  {errors.idn.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Address</Label>
            <Input
              placeholder="Enter address"
              className="text-xs h-9 mt-1.5 bg-muted"
              value={selectedHospital?.address || ""}
              readOnly
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold">City</Label>
              <Input
                placeholder="Enter city"
                className="text-xs h-9 mt-1.5 bg-muted"
                value={selectedHospital?.city || ""}
                readOnly
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">State</Label>
              <Input
                placeholder="Enter state"
                className="text-xs h-9 mt-1.5 bg-muted"
                value={selectedHospital?.state || ""}
                readOnly
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Zip</Label>
              <Input
                placeholder="Enter zip code"
                className="text-xs mt-1.5 h-9 bg-muted"
                value={selectedHospital?.zip || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-xs font-semibold">GPO</Label>
              <Input
                placeholder="GPO"
                className="text-xs mt-1.5 h-9 bg-muted"
                value={
                  selectedHospital?.gpo
                    ? typeof selectedHospital.gpo === "string"
                      ? selectedHospital.gpo
                      : selectedHospital.gpo.name
                    : ""
                }
                readOnly
              />
            </div>

            {/* <div>
              <Label className="text-xs font-semibold">
                Competitive Product
              </Label>
              <Input
                placeholder="Enter competitive product"
                className="text-xs mt-1.5 h-9 bg-muted"
                value={selectedHospital?.competitiveProduct || ""}
                readOnly
              />
            </div> */}
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">TEAM Hospital</Label>
              <Input
                className="text-xs mt-1.5 h-9 bg-muted"
                value={
                  selectedHospital
                    ? selectedHospital.teamHospital
                      ? "Yes"
                      : "No"
                    : ""
                }
                readOnly
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">MAGNET Hospital</Label>
              <Input
                className="text-xs mt-1.5 h-9 bg-muted"
                value={
                  selectedHospital
                    ? selectedHospital.magnetHospital
                      ? "Yes"
                      : "No"
                    : ""
                }
                readOnly
              />
            </div>
          </div> */}

          <div className="mt-1">
            <Label className="text-xs font-semibold block">
              Select Products
            </Label>
            <div className="flex flex-col gap-3 mt-2">
              {products.map((product) => {
                const isSelected = selectedProducts.some(
                  (p) => p.product === product._id,
                );
                const productIndex = selectedProducts.findIndex(
                  (p) => p.product === product._id,
                );

                return (
                  <div key={product._id}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`product-${product._id}`}
                        className="h-3.5 w-3.5 rounded-[3px] border-foreground/50"
                        checked={isSelected}
                        onCheckedChange={() => handleProductToggle(product._id)}
                      />
                      <label
                        htmlFor={`product-${product._id}`}
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {product.name}
                      </label>
                    </div>
                    {isSelected && <ProductFields index={productIndex} />}
                  </div>
                );
              })}
              {errors.products && (
                <p className="text-[10px] text-destructive mt-1">
                  {errors.products.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-1">
            <Label className="text-xs font-semibold block">Notes</Label>
            <Textarea
              placeholder="Enter any additional notes"
              className="bg-muted mt-1.5 text-xs min-h-17.5 resize-none"
              {...register("notes")}
            />
          </div>

          <Button
            type="submit"
            disabled={isCreateDealLoading}
            className="w-full mt-2 bg-[#09090b] text-white hover:bg-[#27272a] h-10 rounded-lg cursor-pointer"
          >
            {isCreateDealLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-1 h-4 w-4" />
            )}
            {isCreateDealLoading ? "Creating..." : "Add Deal"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddDealForm;
