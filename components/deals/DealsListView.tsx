"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PipelineDeal } from "@/store/types";
import { format, differenceInDays, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/hooks";
import { EditDealModal } from "./EditDealModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { removeDealProduct } from "@/store/features/deal/dealSlice";
import { toast } from "sonner";
import Link from "next/link";

interface DealsListViewProps {
  deals: PipelineDeal[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (column: string) => void;
  onDealUpdated?: () => void;
}

type ColumnDef = {
  key: string;
  label: string;
  sortable: boolean;
  sortKey?: string;
  className?: string;
};

const columns: ColumnDef[] = [
  { key: "hospital.hospitalName", label: "Deal Name", sortable: true },
  { key: "product.name", label: "Product", sortable: true },
  { key: "stage", label: "Deal Stage", sortable: true },
  { key: "expectedCloseDate", label: "Expected Close", sortable: true },
  { key: "dealAmount", label: "Deal Amount", sortable: true },
  {
    key: "updatedAt",
    label: "Days Since Last Activity",
    sortable: true,
  },
  {
    key: "daysUntilNext",
    label: "Days Until Next Activity",
    sortable: true,
    sortKey: "expectedCloseDate",
  },
  { key: "user.name", label: "Deal Owner", sortable: true },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const stageColorMap: Record<string, string> = {
  Demo: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  CPA: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
  Committee:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  Trial:
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  "Pending Decision":
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800",
  "Closed Won":
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  "Closed Lost":
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  // Ghosted:
  //   "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-700",
  // "No Longer Buying":
  //   "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-700",
  Implemented:
    "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
};

export function DealsListView({
  deals,
  sortBy,
  sortOrder,
  onSortChange,
  onDealUpdated,
}: DealsListViewProps) {
  const dispatch = useAppDispatch();
  const [editDeal, setEditDeal] = useState<PipelineDeal | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async (deal: PipelineDeal) => {
    try {
      await dispatch(removeDealProduct({ dealId: deal.dealId })).unwrap();
      toast.success("Deal deleted successfully");
      if (onDealUpdated) onDealUpdated();
    } catch (error: any) {
      toast.error(error || "Failed to delete deal");
    }
  };

  const getDaysSince = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return differenceInDays(new Date(), d);
  };

  const getDaysUntil = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return differenceInDays(d, new Date());
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "py-3.5 px-5 whitespace-nowrap",
                      col.sortable && "cursor-pointer select-none",
                      col.className,
                    )}
                    onClick={() => col.sortable && onSortChange(col.sortKey || col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable && <SortIcon columnKey={col.sortKey || col.key} />}
                    </div>
                  </th>
                ))}
                <th
                  scope="col"
                  className="py-3.5 px-5 w-24 text-right whitespace-nowrap"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {deals.map((deal) => {
                const daysSince = getDaysSince(deal.updatedAt);
                const daysUntil = getDaysUntil(deal.expectedCloseDate);
                const stageColor =
                  stageColorMap[deal.stage as string] ||
                  "bg-muted text-muted-foreground border-border";

                return (
                  <tr
                    key={deal._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Deal Name (Hospital) */}
                    <td className="py-3.5 px-5 min-w-[180px]">
                      <Link
                        href={`/hospitals/${deal.hospital?._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors"
                      >
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {deal.hospital?.hospitalName || "—"}
                        </span>
                      </Link>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-foreground">
                        {deal.product?.name || "—"}
                      </span>
                    </td>

                    {/* Deal Stage */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide shadow-none border",
                          stageColor,
                        )}
                      >
                        {deal.stage}
                      </Badge>
                    </td>

                    {/* Expected Close Date */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {deal.expectedCloseDate ? (
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg",
                            isPast(new Date(deal.expectedCloseDate))
                              ? "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400"
                              : "bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-900/30 dark:text-slate-400",
                          )}
                        >
                          <Calendar className="h-3 w-3" />
                          {format(
                            new Date(deal.expectedCloseDate),
                            "MMM d, yyyy",
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Deal Amount */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(deal.dealAmount || 0)}
                      </span>
                    </td>

                    {/* Days Since Last Activity */}
                    <td className="py-3.5 px-5 whitespace-nowrap text-center">
                      {daysSince !== null ? (
                        <span
                          className={cn(
                            "text-sm font-bold tabular-nums",
                            daysSince > 30
                              ? "text-rose-500"
                              : daysSince > 14
                                ? "text-amber-500"
                                : "text-muted-foreground",
                          )}
                        >
                          {daysSince}d
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Days Until Next Activity */}
                    <td className="py-3.5 px-5 whitespace-nowrap text-center">
                      {daysUntil !== null ? (
                        <span
                          className={cn(
                            "text-sm font-bold tabular-nums",
                            daysUntil < 0
                              ? "text-rose-500"
                              : daysUntil <= 3
                                ? "text-amber-500"
                                : "text-muted-foreground",
                          )}
                        >
                          {daysUntil < 0
                            ? `${Math.abs(daysUntil)}d overdue`
                            : `${daysUntil}d`}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Deal Owner */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                          <User className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground">
                            {deal.user?.name || "—"}
                          </span>
                          {deal.leadSource && (
                            <span
                              className="text-[10px] text-muted-foreground font-medium truncate max-w-[160px]"
                              title={deal.leadSourceDetails || "No details provided"}
                            >
                              Source: {deal.leadSource}
                              {deal.leadSourceDetails ? ` - ${deal.leadSourceDetails}` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditDeal(deal);
                            setEditOpen(true);
                          }}
                          className="h-8 w-8 border-border bg-card hover:bg-muted rounded-lg cursor-pointer"
                          title="Edit Deal"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <ConfirmDialog
                          title="Delete Deal"
                          description="Are you sure you want to delete this deal? This action cannot be undone."
                          onConfirm={() => handleDelete(deal)}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-border bg-card text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg cursor-pointer"
                            title="Delete Deal"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editDeal && (
        <EditDealModal
          deal={editDeal}
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setEditDeal(null);
          }}
          onSuccess={onDealUpdated}
        />
      )}
    </>
  );
}
