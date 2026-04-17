"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
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
import { fetchIDNs } from "@/store/features/idn/idnSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import {
  fetchHospitalsForSelection,
  getSingleHospital,
  clearSelectedHospital,
} from "@/store/features/hospital/hospitalSlice";
import { createDeal } from "@/store/features/deal/dealSlice";
import { dealSchema, DealFormValues } from "@/validations/deal.validations";
import { toast } from "sonner";
import { DealProductStage } from "@/store/types";

interface AddDealFormProps {
  onSuccess?: () => void;
}

function AddDealForm({ onSuccess }: AddDealFormProps = {}) {
  const dispatch = useAppDispatch();
  const { idns } = useAppSelector((state) => state.idn);
  const { hospitals, isFetchingHospitals, selectedHospital } = useAppSelector(
    (state) => state.hospital,
  );
  const { products } = useAppSelector((state) => state.product);
  const { isCreateDealLoading } = useAppSelector((state) => state.deal);

  const [idnOpen, setIdnOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);

  const methods = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      hospital: "",
      idn: "",
      gpo: "",
      products: [],
      notes: "",
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

  useEffect(() => {
    dispatch(fetchIDNs({ limit: 1000 }));
    dispatch(fetchProducts({ limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (idnValue) {
      dispatch(fetchHospitalsForSelection({ idn: idnValue }));
      setValue("hospital", "");
      dispatch(clearSelectedHospital());
    }
  }, [dispatch, idnValue, setValue]);

  useEffect(() => {
    if (selectedHospital) {
      setValue(
        "gpo",
        typeof selectedHospital.gpo === "string"
          ? selectedHospital.gpo
          : selectedHospital.gpo._id,
      );
    }
  }, [selectedHospital, setValue]);

  const handleHospitalSelect = (hospitalId: string) => {
    if (hospitalId === hospitalValue) {
      setValue("hospital", "");
      dispatch(clearSelectedHospital());
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
        stage: DealProductStage.DEMO,
        expectedCloseDate: undefined,
      });
    }
  };

  const onSubmit = async (data: DealFormValues) => {
    try {
      await dispatch(createDeal(data)).unwrap();
      toast.success("Deal created successfully");
      reset();
      dispatch(clearSelectedHospital());
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error || "Failed to create deal");
    }
  };

  return (
    <div className="rounded-xl border border-border p-5 flex flex-col gap-4">
      <h3 className="text-sm font-bold mb-2">Add New Deal</h3>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">IDN Name</Label>
              <Popover open={idnOpen} onOpenChange={setIdnOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={idnOpen}
                    className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted"
                  >
                    {idnValue
                      ? idns.find((idn) => idn._id === idnValue)?.name
                      : "Select IDN"}
                    <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) p-0 z-100"
                  align="start"
                >
                  <Command>
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
                <p className="text-[10px] text-destructive mt-1">
                  {errors.idn.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold">Hospital Name</Label>
              <Popover open={hospitalOpen} onOpenChange={setHospitalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={hospitalOpen}
                    disabled={!idnValue}
                    className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted disabled:opacity-50"
                  >
                    {isFetchingHospitals ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading...
                      </span>
                    ) : hospitalValue ? (
                      hospitals.find((h) => h._id === hospitalValue)
                        ?.hospitalName
                    ) : idnValue ? (
                      "Select Hospital"
                    ) : (
                      "Select IDN first"
                    )}
                    <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) p-0 z-100"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search hospital..."
                      className="h-9 text-xs"
                    />
                    <CommandList>
                      <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                        No hospitals found in this IDN.
                      </CommandEmpty>
                      <CommandGroup>
                        {hospitals.map((hospital) => (
                          <CommandItem
                            key={hospital._id}
                            value={hospital.hospitalName}
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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label className="text-xs font-semibold">
                Competitive Product
              </Label>
              <Input
                placeholder="Enter competitive product"
                className="text-xs mt-1.5 h-9 bg-muted"
                value={selectedHospital?.competitiveProduct || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

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
                        className="h-[14px] w-[14px] rounded-[3px] border-foreground/50"
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
              className="bg-muted mt-1.5 text-xs min-h-[70px] resize-none"
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
