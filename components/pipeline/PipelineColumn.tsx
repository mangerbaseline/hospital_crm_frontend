"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PipelineCard, PipelineCardDeal } from "./PipelineCard";
import { cn } from "@/lib/utils";

export interface ColumnData {
  id: string;
  title: string;
  color: string;
  deals: PipelineCardDeal[];
}

interface KanbanColumnProps {
  column: ColumnData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export function PipelineColumn({ column }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const totalArr = column.deals.reduce(
    (sum, deal) => sum + (deal.dealAmount || 0),
    0,
  );

  return (
    <div className="flex flex-col h-full w-70 shrink-0 bg-muted/40 rounded-xl border border-border/50 p-3">
      <div className="flex flex-col mb-3 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="text-sm font-bold">{column.title}</h3>
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span className="text-muted-foreground">
            {column.deals.length} {column.deals.length === 1 ? "deal" : "deals"}
          </span>
          <span className="text-green-600 font-bold">
            {formatCurrency(totalArr)}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-2"
      >
        <div
          className={cn(
            "h-[80vh] rounded-lg transition-colors duration-200 p-1",
            isOver ? "bg-muted/70 border border-dashed border-primary/20" : "",
          )}
        >
          <SortableContext
            items={column.deals.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.deals.length === 0 ? (
              <div
                className={cn(
                  "h-full w-full flex items-center justify-center text-xs text-muted-foreground/60 italic pt-10",
                  isOver && "hidden",
                )}
              >
                No deals in this stage
              </div>
            ) : (
              column.deals.map((deal, index) => (
                <PipelineCard key={deal.id} deal={deal} index={index} />
              ))
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
