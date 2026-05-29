"use client";
import { GPOWithDeals } from "@/store/types";
import { Card } from "@/components/ui/card";
import { Building2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GPOCardProps {
  gpo: GPOWithDeals;
  onViewHospitals: (gpo: GPOWithDeals) => void;
}

const getGPOColor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("premier")) return "bg-[#1e293b]";
  if (normalized.includes("va")) return "bg-[#166534]";
  if (normalized.includes("healthtrust")) return "bg-[#2563eb]";
  if (normalized.includes("vizient")) return "bg-[#ea580c]";
  return "bg-slate-500";
};

const getGPOBackground = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("premier")) return "bg-slate-50 border-slate-100";
  if (normalized.includes("va")) return "bg-green-50/50 border-green-100";
  if (normalized.includes("healthtrust"))
    return "bg-blue-50/50 border-blue-100";
  if (normalized.includes("vizient"))
    return "bg-orange-50/50 border-orange-100";
  return "bg-slate-50 border-slate-100";
};

const getGPOTextColor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("premier")) return "text-slate-900";
  if (normalized.includes("va")) return "text-green-700";
  if (normalized.includes("healthtrust")) return "text-blue-700";
  if (normalized.includes("vizient")) return "text-orange-700";
  return "text-slate-900";
};

export function GPOCard({ gpo, onViewHospitals }: GPOCardProps) {
  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const gpoColor = getGPOColor(gpo.name);
  const bgColor = getGPOBackground(gpo.name);
  const textColor = getGPOTextColor(gpo.name);

  return (
    <Card className="p-6 border-border shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col gap-6">
      <div>
        <span
          className={cn(
            "px-4 py-1.5 rounded-lg text-white font-bold text-lg inline-block shadow-sm",
            gpoColor,
          )}
        >
          {gpo.name}
        </span>
      </div>

      <div
        className={cn(
          "rounded-xl border p-6 flex flex-col items-center justify-center gap-1.5",
          bgColor,
        )}
      >
        <div className={cn("text-3xl font-extrabold", textColor)}>
          {formatCurrency(gpo.gpoTotalExpectedARR)}
        </div>
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Total Expected ARR
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold">
          <Building2 className="h-4 w-4" />
          <span className="text-sm">{gpo.totalHospitals || 0} Hospitals</span>
        </div>

        <Button
          onClick={() => onViewHospitals(gpo)}
          className={cn(
            "w-full text-white font-bold h-11 rounded-lg cursor-pointer flex items-center gap-2",
            gpoColor,
          )}
        >
          <Eye className="h-4 w-4" />
          View Hospitals
        </Button>
      </div>
    </Card>
  );
}
