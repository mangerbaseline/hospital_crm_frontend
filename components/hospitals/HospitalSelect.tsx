"use client";

import { useEffect, useState, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchHospitalsForSelection } from "@/store/features/hospital/hospitalSlice";

interface HospitalSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  showAll?: boolean;
}

export function HospitalSelect({
  value,
  onValueChange,
  className,
  placeholder = "Select Hospital",
  showAll = true,
}: HospitalSelectProps) {
  const dispatch = useAppDispatch();
  const { hospitals, isFetchingHospitals, selectionPage, hasMoreSelection } =
    useAppSelector((state) => state.hospital);

  const [open, setOpen] = useState(false);
  const [selectedVal, setSelectedVal] = useState(value || (showAll ? "all" : ""));
  const [search, setSearch] = useState("");


  useEffect(() => {
    if (!open) return;

    if (search === "") {
      dispatch(fetchHospitalsForSelection({ page: 1, limit: 10, search: "" }));
      return;
    }

    const timer = setTimeout(() => {
      dispatch(fetchHospitalsForSelection({ page: 1, limit: 10, search }));
    }, 400);

    return () => clearTimeout(timer);
  }, [search, dispatch, open]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedVal(value);
    }
  }, [value]);

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
        if (entries[0].isIntersecting && hasMoreSelection && !isFetchingHospitals) {
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

  const uniqueHospitals = Array.from(
    new Map(hospitals.map((h) => [h._id, h])).values()
  );

  const selectedName =
    selectedVal === "all"
      ? "All Hospitals"
      : uniqueHospitals.find((h) => h._id === selectedVal)?.hospitalName || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-xs h-9 font-semibold border-border shadow-none hover:bg-muted bg-muted/70 text-foreground rounded-xl px-3",
            className,
          )}
        >
          <span className="truncate text-left flex-1">{selectedName}</span>
          <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0 z-100"
        align="start"
      >
        <Command shouldFilter={false} onWheel={(e) => e.stopPropagation()}>
          <CommandInput
            placeholder="Search hospital..."
            className="h-9 text-xs"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {hospitals.length === 0 && !isFetchingHospitals && (
              <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                No hospital found.
              </CommandEmpty>
            )}
            <CommandGroup>
              {showAll && (
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onValueChange?.("all");
                    if (value === undefined) setSelectedVal("all");
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  All Hospitals
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedVal === "all" ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              )}
              {uniqueHospitals.map((h) => (
                <CommandItem
                  key={h._id}
                  value={h._id}
                  onSelect={() => {
                    onValueChange?.(h._id);
                    if (value === undefined) setSelectedVal(h._id);
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  {h.hospitalName}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedVal === h._id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {hasMoreSelection && (
              <div
                ref={sentinelRef}
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
  );
}
