"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function AddHospitalModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [heelpChecked, setHeelpChecked] = useState<boolean | "indeterminate">(
    false,
  );
  const [macChecked, setMacChecked] = useState<boolean | "indeterminate">(
    false,
  );
  const [elevateChecked, setElevateChecked] = useState<
    boolean | "indeterminate"
  >(false);
  const [idnOpen, setIdnOpen] = useState(false);
  const [idnValue, setIdnValue] = useState("");

  const idns = [
    { value: "Mayo Clinic Health System", label: "Mayo Clinic Health System" },
    {
      value: "Cleveland Clinic Health System",
      label: "Cleveland Clinic Health System",
    },
    {
      value: "Johns Hopkins Health System",
      label: "Johns Hopkins Health System",
    },
    {
      value: "Kaiser Permanente",
      label: "Kaiser Permanente",
    },
    {
      value: "HCA Healthcare",
      label: "HCA Healthcare",
    },
    {
      value: "Veterans Affairs (VA)",
      label: "Veterans Affairs (VA)",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] h-auto max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold">
            Add New Hospital
          </DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            Add a new hospital to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border p-4">
          <Label className="text-xs font-semibold">Sales Rep</Label>
          <div className="mt-1 text-sm font-medium">Karlee Mason</div>
        </div>

        <div className="rounded-xl border border-border p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold mb-2">Add New Hospital</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">IDN Name</Label>
              <Popover open={idnOpen} onOpenChange={setIdnOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={idnOpen}
                    className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted"
                  >
                    {idnValue
                      ? idns.find((idn) => idn.value === idnValue)?.label
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
                            key={idn.value}
                            value={idn.value}
                            onSelect={(currentValue) => {
                              setIdnValue(
                                currentValue === idnValue ? "" : currentValue,
                              );
                              setIdnOpen(false);
                            }}
                            className="text-xs"
                          >
                            {idn.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                idnValue === idn.value
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

            <div>
              <Label className="text-xs font-semibold">Hospital Name</Label>
              <Select>
                <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                  <SelectValue placeholder="Select Hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Hospital 1</SelectItem>
                  <SelectItem value="h2">Hospital 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Address</Label>
            <Input
              placeholder="Enter address"
              className="text-xs h-9 mt-1.5 bg-muted"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold">City</Label>
              <Input
                placeholder="Enter city"
                className="text-xs h-9 mt-1.5 bg-muted"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">State</Label>
              <Input
                placeholder="Enter state"
                className="text-xs h-9 mt-1.5 bg-muted"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Zip</Label>
              <Input
                placeholder="Enter zip co"
                className="text-xs mt-1.5 h-9 bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">GPO</Label>
              <Select>
                <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                  <SelectValue placeholder="Select GPO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpo1">Vizient</SelectItem>
                  <SelectItem value="gpo1">Premier</SelectItem>
                  <SelectItem value="gpo1">HealthTrust</SelectItem>
                  <SelectItem value="gpo1">VA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">
                Competitive Product
              </Label>
              <Input
                placeholder="Enter competitive pr"
                className="text-xs mt-1.5 h-9 bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">TEAM Hospital</Label>
              <Select>
                <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                  <SelectValue placeholder="Select Yes or No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">MAGNET Hospital</Label>
              <Select>
                <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                  <SelectValue placeholder="Select Yes or No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-1">
            <Label className="text-xs font-semibold block">
              Select Products
            </Label>
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
      </DialogContent>
    </Dialog>
  );
}

function ProductFields() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="pl-6 space-y-3 mt-3 mb-2">
      <div>
        <Label className="text-[11px] font-semibold">Deal Amount</Label>
        <div className="relative mt-1.5 flex items-center">
          <span className="absolute left-3 text-xs text-muted-foreground font-medium">
            $
          </span>
          <Input
            placeholder="0.00"
            className="pl-7 text-xs h-9 bg-muted border-border"
          />
        </div>
      </div>
      <div>
        <Label className="text-[11px] font-semibold">Deal Stage</Label>
        <Select>
          <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted border-border text-muted-foreground">
            <SelectValue placeholder="Select deal stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s1">Stage 1</SelectItem>
            <SelectItem value="s2">Stage 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-[11px] font-semibold">Expected Close Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "mt-1.5 flex h-9 w-full justify-start items-center rounded-md border border-border bg-muted/70 px-3 py-1 text-xs shadow-sm transition-colors cursor-pointer hover:bg-muted",
                !date ? "text-muted-foreground" : "text-zinc-900",
              )}
            >
              <CalendarIcon className="-ml-1 mr-2 h-[14px] w-[14px]" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-100" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
