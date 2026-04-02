"use client";

import { Building2, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Hospital, Product } from "@/lib/hospital-data";
import Link from "next/link";

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:drop-shadow-lg transition-shadow p-0 rounded-xl hover:bg-muted">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded-lg border border-border mt-1">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">
              {hospital.name}
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {hospital.idn}
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-0.5">
              {hospital.location}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            Total Expected ARR
          </span>
          <span className="text-2xl font-bold text-emerald-600">
            ${hospital.totalArr}
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Expected ARR By Product
          </h4>

          <div className="flex flex-col gap-2 mt-3">
            {hospital.products.map((product, index) => (
              <ProductBlock key={index} product={product} />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Link href={`/hospitals/${hospital.id}`} className="w-full">
          <Button
            variant="secondary"
            className="w-full bg-slate-800 hover:bg-slate-700 text-white border-none h-10 text-xs font-semibold rounded-lg flex gap-2 items-center justify-center cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            View More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function ProductBlock({ product }: { product: Product }) {
  const isMacSystem = product.name === "MAC System";

  return (
    <div
      className={`rounded-xl p-3.5 text-white flex flex-col gap-2 shadow-sm ${
        isMacSystem ? "bg-blue-600" : "bg-orange-500"
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-sm tracking-tight">{product.name}</span>
        <span className="font-bold text-lg">${product.arr}</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 opacity-90">
          <Calendar className="h-3 w-3" />
          <span className="text-[10px] font-medium">
            Close: {product.closeDate}
          </span>
        </div>

        <div>
          <Badge
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-none px-2 py-0 h-5 text-[9px] font-bold tracking-wide uppercase rounded-md shadow-none"
          >
            {product.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
