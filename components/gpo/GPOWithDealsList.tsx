"use client";

import { GPOWithDeals } from "@/store/types";
import { GPOCard } from "./GPOCard";
import { ShoppingCart } from "lucide-react";
import { GPOCardSkeleton } from "./GPOCardSkeleton";

interface GPOWithDealsListProps {
  gposWithDeals: GPOWithDeals[];
  isFetchingGPOsWithDeals: boolean;
  onViewHospitals: (gpo: GPOWithDeals) => void;
}

export function GPOWithDealsList({
  gposWithDeals,
  isFetchingGPOsWithDeals,
  onViewHospitals,
}: GPOWithDealsListProps) {
  if (isFetchingGPOsWithDeals && gposWithDeals.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GPOCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isFetchingGPOsWithDeals && gposWithDeals.length === 0) {
    return (
      <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
        <div className="flex flex-col items-center justify-center gap-2">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No GPOs found
          </h3>
          <p className="text-sm text-muted-foreground/60">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gposWithDeals.map((gpo) => (
        <GPOCard key={gpo._id} gpo={gpo} onViewHospitals={onViewHospitals} />
      ))}
    </div>
  );
}
