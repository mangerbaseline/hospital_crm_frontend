"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchGPOs } from "@/store/features/gpo/gpoSlice";

interface GPOSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function GPOSelect({
  value,
  onValueChange,
  className,
  placeholder = "Select GPO",
}: GPOSelectProps) {
  const dispatch = useAppDispatch();
  const { gpos } = useAppSelector((state) => state.gpo);

  useEffect(() => {
    dispatch(fetchGPOs({ limit: 1000 }));
  }, [dispatch, gpos.length]);

  return (
    <Select value={value || "all"} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-border">
        <SelectItem value="all">All GPOs</SelectItem>
        {gpos.map((gpo) => (
          <SelectItem key={gpo?._id} value={gpo?._id}>
            {gpo?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
