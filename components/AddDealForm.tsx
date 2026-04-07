"use client";

import { useEffect, useState } from "react";
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
import {
  fetchHospitals,
  getSingleHospital,
  clearSelectedHospital,
} from "@/store/features/hospital/hospitalSlice";

function AddDealForm() {
  const dispatch = useAppDispatch();
  const { idns } = useAppSelector((state) => state.idn);
  const { hospitals, isFetchingHospitals, selectedHospital } = useAppSelector(
    (state) => state.hospital,
  );

  const [idnOpen, setIdnOpen] = useState(false);
  const [idnValue, setIdnValue] = useState("");
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [hospitalValue, setHospitalValue] = useState("");

  const [heelpChecked, setHeelpChecked] = useState<boolean | "indeterminate">(
    false,
  );
  const [macChecked, setMacChecked] = useState<boolean | "indeterminate">(
    false,
  );
  const [elevateChecked, setElevateChecked] = useState<
    boolean | "indeterminate"
  >(false);

  useEffect(() => {
    if (idns.length === 0) {
      dispatch(fetchIDNs({ limit: 1000 }));
    }
  }, [dispatch, idns.length]);

  useEffect(() => {
    if (idnValue) {
      dispatch(fetchHospitals({ idn: idnValue, limit: 1000 }));
      setHospitalValue("");
      dispatch(clearSelectedHospital());
    }
  }, [dispatch, idnValue]);

  const handleHospitalSelect = (hospitalId: string) => {
    if (hospitalId === hospitalValue) {
      setHospitalValue("");
      dispatch(clearSelectedHospital());
    } else {
      setHospitalValue(hospitalId);
      dispatch(getSingleHospital(hospitalId));
    }
    setHospitalOpen(false);
  };

  return (
    <div className="rounded-xl border border-border p-5 flex flex-col gap-4">
      <h3 className="text-sm font-bold mb-2">Add New Deal</h3>

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
                          setIdnValue(idn._id === idnValue ? "" : idn._id);
                          setIdnOpen(false);
                        }}
                        className="text-xs"
                      >
                        {idn.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            idnValue === idn._id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
                  hospitals.find((h) => h._id === hospitalValue)?.hospitalName
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
          <Label className="text-xs font-semibold">Competitive Product</Label>
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
        <Label className="text-xs font-semibold block">Select Products</Label>
        <div className="flex flex-col gap-3 mt-2">
          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="heelp"
                className="h-[14px] w-[14px] rounded-[3px] border-foreground/50"
                checked={heelpChecked}
                onCheckedChange={setHeelpChecked}
              />
              <label
                htmlFor="heelp"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                HeelPOD
              </label>
            </div>
            {heelpChecked === true && <ProductFields />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="mac"
                className="h-[14px] w-[14px] rounded-[3px] border-foreground/50"
                checked={macChecked}
                onCheckedChange={setMacChecked}
              />
              <label
                htmlFor="mac"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                MAC System
              </label>
            </div>
            {macChecked === true && <ProductFields />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="elevate"
                className="h-[14px] w-[14px] rounded-[3px] border-foreground/50"
                checked={elevateChecked}
                onCheckedChange={setElevateChecked}
              />
              <label
                htmlFor="elevate"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ELEVATE
              </label>
            </div>
            {elevateChecked === true && <ProductFields />}
          </div>
        </div>
      </div>

      <div className="mt-1">
        <Label className="text-xs font-semibold block">Notes</Label>
        <Textarea
          placeholder="Enter any additional notes"
          className="bg-muted mt-1.5 text-xs min-h-[70px] resize-none"
        />
      </div>

      <Button className="w-full mt-2 bg-[#09090b] text-white hover:bg-[#27272a] h-10 rounded-lg cursor-pointer">
        <Plus className="mr-1 h-4 w-4" />
        Add Deal
      </Button>
    </div>
  );
}

export default AddDealForm;
