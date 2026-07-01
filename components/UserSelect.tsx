"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { fetchUsers } from "@/store/features/user/userSlice";
import { UserRole } from "@/store/types";

interface UserSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  showAll?: boolean;
}

export function UserSelect({
  value,
  onValueChange,
  className,
  placeholder = "Select Sales Rep",
  showAll = true,
}: UserSelectProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const isAdminOrExecutive =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.EXECUTIVE ||
    currentUser?.role === UserRole.CUSTOMER_SUCCESS;

  const [open, setOpen] = useState(false);
  const [selectedVal, setSelectedVal] = useState(
    value ||
      (isAdminOrExecutive && showAll
        ? "all"
        : currentUser?._id || (showAll ? "all" : "")),
  );

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers({ limit: 1000 }));
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedVal(value);
    }
  }, [value]);

  const selectedName =
    selectedVal === "all"
      ? "All Sales Reps"
      : selectedVal === ""
        ? placeholder
        : users.find((u) => u._id === selectedVal)?.name ||
          (currentUser?._id === selectedVal ? currentUser?.name : placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-xs h-9 font-normal border-border shadow-none hover:bg-muted bg-muted/70",
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
        <Command onWheel={(e) => e.stopPropagation()} shouldFilter={true}>
          <CommandInput
            placeholder="Search sales rep..."
            className="h-9 text-xs"
          />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              No sales rep found.
            </CommandEmpty>
            <CommandGroup>
              {!showAll && (
                <CommandItem
                  value="none"
                  onSelect={() => {
                    onValueChange?.("");
                    if (value === undefined) setSelectedVal("");
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  None
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedVal === "" ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              )}
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
                  All Sales Reps
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedVal === "all" ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              )}
              {users.map((u) => (
                <CommandItem
                  key={u._id}
                  value={u.name}
                  onSelect={() => {
                    onValueChange?.(u._id);
                    if (value === undefined) setSelectedVal(u._id);
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  {u.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedVal === u._id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
