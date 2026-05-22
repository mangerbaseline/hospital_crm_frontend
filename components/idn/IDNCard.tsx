"use client";

import { Building2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IDNWithDeals } from "@/store/types";

interface IDNCardProps {
  idn: IDNWithDeals;
  onViewClick: (idn: IDNWithDeals) => void;
}

export function IDNCard({ idn, onViewClick }: IDNCardProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm hover:drop-shadow-lg transition-shadow p-0 rounded-xl hover:bg-muted/30">
      <CardHeader className="p-4 pb-2">
        <div className="bg-slate-700 w-max px-3 py-2 rounded-md mb-2">
          <h3
            className="font-bold text-sm text-white leading-tight"
            title={idn.name}
          >
            {idn.name.length > 40 ? `${idn.name.slice(0, 40)}...` : idn.name}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="px-5">
        <div className="bg-muted border border-border rounded-xl p-4 flex flex-col items-center justify-center mb-4 mt-2">
          <span className="text-3xl font-extrabold text-slate-800">
            ${idn.idnTotalExpectedARR?.toLocaleString() || 0}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
            Total Expected ARR
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-600 font-semibold text-sm">
          <Building2 className="h-4 w-4" />
          <span>
            {idn.totalHospitals}{" "}
            {idn.totalHospitals === 1 ? "Hospital" : "Hospitals"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          variant="secondary"
          onClick={() => onViewClick(idn)}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white border-none h-9 text-xs font-semibold rounded-lg flex gap-2 items-center justify-center cursor-pointer shadow-md"
        >
          <Eye className="h-3.5 w-3.5" />
          View Hospitals
        </Button>
      </CardFooter>
    </Card>
  );
}
