"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchHospitalsForSelection } from "@/store/features/hospital/hospitalSlice";
import { useEffect, useRef, useState } from "react";

interface MultiHospitalSelectProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiHospitalSelect({
  value = [],
  onValueChange,
  className,
  placeholder = "Select hospitals...",
}: MultiHospitalSelectProps) {
  const dispatch = useAppDispatch();
  const { hospitals, isFetchingHospitals, selectionPage, hasMoreSelection } =
    useAppSelector((state) => state.hospital);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      dispatch(fetchHospitalsForSelection({ page: 1, limit: 10, search: "" }));
    } else {
      setSearch("");
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      dispatch(fetchHospitalsForSelection({ page: 1, limit: 10, search }));
    }, 500);
    return () => clearTimeout(timer);
  }, [search, dispatch, open]);

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

  const handleSelect = (currentValue: string) => {
    if (!onValueChange) return;
    const newValue = value.includes(currentValue)
      ? value.filter((item) => item !== currentValue)
      : [...value, currentValue];
    onValueChange(newValue);
  };

  const selectedHospitals = hospitals.filter((h) => value.includes(h._id));
  const displayText =
    selectedHospitals.length > 0
      ? selectedHospitals.length === 1
        ? selectedHospitals[0].hospitalName
        : `${selectedHospitals.length} Hospitals selected`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between mt-1.5 text-xs h-9 bg-muted font-normal border-border text-left",
            value.length === 0 && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0 z-100"
        align="start"
      >
        <Command shouldFilter={false} onWheel={(e) => e.stopPropagation()}>
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
                  onSelect={() => handleSelect(hospital._id)}
                  className="text-xs cursor-pointer"
                >
                  {hospital.hospitalName}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value.includes(hospital._id) ? "opacity-100" : "opacity-0"
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
  );
}
