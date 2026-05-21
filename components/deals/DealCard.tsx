"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  User,
  Target,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PipelineDeal, UserRole } from "@/store/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { EditDealModal } from "./EditDealModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { removeDealProduct } from "@/store/features/deal/dealSlice";
import { toast } from "sonner";

interface DealCardProps {
  deal: PipelineDeal;
  onDealUpdated?: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export function DealCard({ deal, onDealUpdated }: DealCardProps) {
  const dispatch = useAppDispatch();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(removeDealProduct({ dealId: deal.dealId })).unwrap();
      toast.success("Deal deleted successfully");
      if (onDealUpdated) {
        onDealUpdated();
      }
    } catch (error: any) {
      toast.error(error || "Failed to delete deal");
    }
  };

  const productName = deal.product?.name || "Unknown Product";
  const isMacSystem = productName.toLowerCase().includes("mac");

  return (
    <>
      <Card className="overflow-hidden border-none shadow-sm hover:drop-shadow-lg transition-all p-0 rounded-xl hover:bg-muted group relative">
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border border-border hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <ConfirmDialog
            title="Delete Deal"
            description="Are you sure you want to delete this deal? This action cannot be undone."
            onConfirm={handleDelete}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-white text-muted-foreground shadow-sm transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </ConfirmDialog>
        </div>

        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg border border-border mt-1 group-hover:bg-background transition-colors">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col flex-1">
              <h3
                className="font-bold text-lg leading-tight line-clamp-1 w-full pr-8"
                title={deal.hospital?.hospitalName}
              >
                {deal.hospital?.hospitalName}
              </h3>

              <div className="flex flex-col items-start gap-1 text-[11px] text-muted-foreground/80 mt-1 font-medium w-full">
                {/* <span className="truncate w-full">
                  <span className="truncate w-full">
                    {deal.hospital?.city || deal.hospital?.state ? (
                      <>
                        {deal.hospital?.city}
                        {deal.hospital?.city && deal.hospital?.state && ", "}
                        {deal.hospital?.state}
                      </>
                    ) : (
                      "No Location"
                    )}
                  </span>
                </span> */}

                <span
                  className="truncate w-full font-semibold text-muted-foreground"
                  title={deal.hospital?.idn?.name}
                >
                  {deal.hospital?.idn?.name || "No IDN"}
                </span>

                <span
                  className="truncate w-full font-semibold text-muted-foreground"
                  title={deal.hospital?.gpo?.name}
                >
                  {deal.hospital?.gpo?.name || "No GPO"}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-4">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Deal Amount
            </span>
            <span className="text-3xl font-extrabold text-emerald-600">
              {formatCurrency(deal.dealAmount || 0)}
            </span>
            {(deal.quantity ?? 1) > 1 && (
              <span className="text-[10px] font-bold text-emerald-700 mt-1">
                Qty: {deal.quantity}
              </span>
            )}
          </div>

          <div
            className={cn(
              "rounded-xl p-4 text-white flex flex-col gap-3 shadow-sm",
              isMacSystem ? "bg-blue-600" : "bg-orange-500",
            )}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 opacity-80" />
                <span className="font-bold text-sm tracking-tight">
                  {productName}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-between mt-1">
              <div className="flex items-center gap-1.5 opacity-90">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold">
                  {deal.expectedCloseDate
                    ? format(new Date(deal.expectedCloseDate), "MMM d, yyyy")
                    : "No date set"}
                </span>
              </div>

              <Badge
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-none px-2.5 py-0.5 h-6 text-[10px] font-bold tracking-wide uppercase rounded-lg shadow-none"
              >
                {deal.stage}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 py-4 bg-muted/30 border-t border-border mt-auto group-hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-0.5">
                  Sales Rep
                </span>
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {deal.user?.name}
                </span>
              </div>
            </div>

            <div className="text-[10px] font-bold text-muted-foreground">
              {deal.hospital?.gpo?.name}
            </div>
          </div>
        </CardFooter>
      </Card>

      <EditDealModal
        deal={deal}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onDealUpdated}
      />
    </>
  );
}
