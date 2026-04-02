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
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown } from "lucide-react";
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

export function AddContactModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPrimary, setIsPrimary] = useState<boolean | "indeterminate">(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [hospitalValue, setHospitalValue] = useState("");

  const hospitals = [
    { value: "St. Joseph Medical Center", label: "St. Joseph Medical Center" },
    { value: "Clever Clinic Main Campus", label: "Clever Clinic Main Campus" },
    { value: "AdventHealth Orlando", label: "AdventHealth Orlando" },
    {
      value: "North Shore University Hospital",
      label: "North Shore University Hospital",
    },
    {
      value: "NYU Langone Tisch Hospital",
      label: "NYU Langone Tisch Hospital",
    },
    {
      value: "VA Palo Alto Health Care System",
      label: "VA Palo Alto Health Care System",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="flex flex-col gap-2">
          <div>
            <Label className="text-xs font-semibold">Select Hospital</Label>
            <Popover open={hospitalOpen} onOpenChange={setHospitalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={hospitalOpen}
                  className="w-full justify-between mt-1.5 text-xs h-9 bg-muted font-normal border-border"
                >
                  {hospitalValue
                    ? hospitals.find((h) => h.value === hospitalValue)?.label
                    : "Select a hospital..."}
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
                    className="h-9 text-xs w-full"
                  />
                  <CommandList>
                    <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                      No hospital found.
                    </CommandEmpty>
                    <CommandGroup>
                      {hospitals.map((hospital) => (
                        <CommandItem
                          key={hospital.value}
                          value={hospital.value}
                          onSelect={(currentValue) => {
                            setHospitalValue(
                              currentValue === hospitalValue
                                ? ""
                                : currentValue,
                            );
                            setHospitalOpen(false);
                          }}
                          className="text-xs"
                        >
                          {hospital.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              hospitalValue === hospital.value
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
            <Label className="text-xs font-semibold">First Name</Label>
            <Input className="text-xs h-9 mt-1.5 bg-muted" />
          </div>

          <div>
            <Label className="text-xs font-semibold">Last Name</Label>
            <Input className="text-xs h-9 mt-1.5 bg-muted" />
          </div>

          <div>
            <Label className="text-xs font-semibold">Title</Label>
            <Input className="text-xs h-9 mt-1.5 bg-muted" />
          </div>

          <div>
            <Label className="text-xs font-semibold">Email</Label>
            <Input type="email" className="text-xs h-9 mt-1.5 bg-muted" />
          </div>

          <div>
            <Label className="text-xs font-semibold">Phone</Label>
            <Input type="tel" className="text-xs h-9 mt-1.5 bg-muted" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Checkbox
              id="primary_contact"
              className="h-4 w-4 rounded-[4px] border-foreground/50"
              checked={isPrimary}
              onCheckedChange={setIsPrimary}
            />
            <label
              htmlFor="primary_contact"
              className="text-[13px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Primary Contact
            </label>
          </div>

          <Button className="w-full mt-2 bg-[#09090b] text-white hover:bg-[#27272a] h-10 rounded-[8px] font-semibold text-sm cursor-pointer">
            Add Contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
