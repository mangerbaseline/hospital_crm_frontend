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
import { HospitalWithDeals } from "@/store/types";
import Link from "next/link";
import { format } from "date-fns";

interface HospitalCardProps {
  hospital: HospitalWithDeals;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const totalArr =
    hospital.deals?.reduce((acc, deal) => {
      return (
        acc +
        (deal.products?.reduce((dAcc, p) => dAcc + (p.dealAmount || 0), 0) || 0)
      );
    }, 0) || 0;

  const allProducts =
    hospital.deals?.flatMap((deal) => deal.products || []) || [];

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:drop-shadow-lg transition-shadow p-0 rounded-xl hover:bg-muted">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded-lg border border-border mt-1">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">
              {hospital.hospitalName}
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {hospital.idn?.name || "No IDN"}
            </p>

            <p className="text-[11px] text-muted-foreground/80 mt-0.5">
              {hospital.city && hospital.state
                ? `${hospital.city}, ${hospital.state}`
                : hospital.city || hospital.state || "N/A"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5">
        {/* <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            Total Expected ARR
          </span>
          <span className="text-2xl font-bold text-emerald-600">
            ${Number(totalArr).toLocaleString()}
          </span>
        </div> */}

        {allProducts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Expected ARR By Product
            </h4>

            <div className="flex flex-col gap-2 mt-3">
              {allProducts.map((product, index) => (
                <ProductBlock key={product._id || index} product={product} />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 mt-auto">
        <Link href={`/hospitals/${hospital._id}`} className="w-full">
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

type DealProduct = HospitalWithDeals["deals"][0]["products"][0];

function ProductBlock({ product }: { product: DealProduct }) {
  const productName = product.product || "Unknown Product";
  const isMacSystem = productName.toLowerCase().includes("mac");

  return (
    <div
      className={`rounded-xl p-3.5 text-white flex flex-col gap-2 shadow-sm ${
        isMacSystem ? "bg-blue-600" : "bg-orange-500"
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-sm tracking-tight">{productName}</span>
        <span className="font-bold text-lg">
          ${Number(product.dealAmount || 0).toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 opacity-90">
          <Calendar className="h-3 w-3" />
          <span className="text-[10px] font-medium">
            Close:{" "}
            {product.expectedCloseDate
              ? format(new Date(product.expectedCloseDate), "MMM d, yyyy")
              : "No date set"}
          </span>
        </div>

        <div>
          <Badge
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-none px-2 py-0 h-5 text-[9px] font-bold tracking-wide uppercase rounded-md shadow-none"
          >
            {product.stage}
          </Badge>
        </div>
      </div>
    </div>
  );
}
