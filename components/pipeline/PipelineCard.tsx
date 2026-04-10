"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { PipelineDeal } from "@/store/types";

export type PipelineCardDeal = PipelineDeal & { id: string };

interface KanbanCardProps {
  deal: PipelineCardDeal;
  index: number;
}

const getProductColor = (productName: string) => {
  const name = productName.toLowerCase();
  if (name.includes("mac")) return "bg-blue-500";
  if (name.includes("elevate")) return "bg-orange-500";
  if (name.includes("heelpod") || name.includes("hellpod"))
    return "bg-[#ff6a00]";
  return "bg-gray-500";
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export function PipelineCard({ deal, index }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: deal,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "mb-3 outline-none select-none",
        isDragging && "opacity-90 scale-[1.02] z-50 duration-0",
      )}
    >
      <Card
        className={cn(
          "p-4 border-border shadow-sm bg-card transition-colors cursor-grab active:cursor-grabbing",
          isDragging ? "shadow-lg border-primary/30" : "hover:border-gray-300",
        )}
      >
        <div className="flex gap-2 items-start mb-4">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold leading-tight line-clamp-2 pointer-events-none">
              {deal.hospital?.hospitalName || "Unknown Hospital"}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {deal.hospital?.city}, {deal.hospital?.state}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-bold text-white mb-4",
            getProductColor(deal.product?.name || ""),
          )}
        >
          <span className="truncate max-w-[120px]">{deal.product?.name}</span>
          <span>{formatCurrency(deal.dealAmount)}</span>
        </div>

        <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground mb-4">
          <span className="truncate">
            IDN: {deal.hospital?.idn?.name || "N/A"}
          </span>
          <span className="truncate">
            GPO: {deal.hospital?.gpo?.name || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
          <span className="font-semibold">Total ARR:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(deal.dealAmount)}
          </span>
        </div>
      </Card>
    </div>
  );
}
