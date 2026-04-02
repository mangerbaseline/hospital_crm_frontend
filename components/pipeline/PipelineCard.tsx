"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DealProduct = "MAC System" | "ELEVATE" | "HeelPOD";

export interface Deal {
  id: string;
  hospitalName: string;
  location: string;
  product: DealProduct;
  arr: number;
  idn: string;
  gpo: string;
}

interface KanbanCardProps {
  deal: Deal;
  index: number;
}

const getProductColor = (product: DealProduct) => {
  switch (product) {
    case "MAC System":
      return "bg-blue-500";
    case "ELEVATE":
      return "bg-orange-500";
    case "HeelPOD":
      return "bg-[#ff6a00]";
    default:
      return "bg-gray-500";
  }
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
              {deal.hospitalName}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {deal.location}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-bold text-white mb-4",
            getProductColor(deal.product),
          )}
        >
          <span>{deal.product}</span>
          <span>{formatCurrency(deal.arr)}</span>
        </div>

        <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground mb-4">
          <span className="truncate">IDN: {deal.idn}</span>
          <span className="truncate">GPO: {deal.gpo}</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
          <span className="font-semibold">Total ARR:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(deal.arr)}
          </span>
        </div>
      </Card>
    </div>
  );
}
