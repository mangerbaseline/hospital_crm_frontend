"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { format } from "date-fns";
import { Hospital } from "@/store/types";
import { EditExpectedARRModal } from "@/components/hospitals/EditExpectedARRModal";

interface ExpectedARRCardProps {
  hospital: Hospital;
}

export function ExpectedARRCard({ hospital }: ExpectedARRCardProps) {
  const deals = hospital.deals || [];
  const allProducts = deals.flatMap((deal) => deal.products || []);

  const totalArr = allProducts.reduce((acc, p) => acc + (p.dealAmount || 0), 0);

  if (allProducts.length === 0) {
    return (
      <Card className="p-10 shadow-sm border border-dashed border-border rounded-xl bg-white mt-4 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="bg-muted p-4 rounded-full mb-4 border border-border">
          <Edit3 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold mb-1">No Products Added Yet</h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-sm">
          Add products to see Expected ARR breakdown and track your deal stages
          accurately.
        </p>
        <EditExpectedARRModal hospital={hospital}>
          <Button className="flex items-center gap-2 cursor-pointer bg-[#09090b] text-white hover:bg-[#27272a] rounded-lg shadow-sm font-semibold">
            <Edit3 className="h-4 w-4" /> Add Product
          </Button>
        </EditExpectedARRModal>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-sm border border-border rounded-xl bg-white mt-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-md font-bold">Expected ARR</h3>
          <p className="text-xs font-medium text-muted-foreground">
            Product revenue breakdown
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-emerald-600">
            ${totalArr.toLocaleString()}
          </span>
          <EditExpectedARRModal hospital={hospital}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-8 px-2 rounded-lg shadow-sm font-semibold border-border hover:bg-muted transition-colors cursor-pointer"
            >
              <Edit3 className="h-4 w-4" /> Edit Products
            </Button>
          </EditExpectedARRModal>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allProducts.map((p, idx) => {
          const productName =
            typeof p.product === "object" && p.product !== null
              ? p.product.name
              : "Unknown Product";
          const isMacSystem = productName.toLowerCase().includes("mac");

          const themeStyle = isMacSystem
            ? {
                bg: "bg-blue-50",
                border: "border-blue-200",
                title: "text-blue-900",
                amount: "text-blue-700",
                label: "text-blue-800",
              }
            : {
                bg: "bg-orange-50",
                border: "border-orange-200",
                title: "text-orange-900",
                amount: "text-orange-600",
                label: "text-orange-800",
              };

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border ${themeStyle.bg} ${themeStyle.border} flex flex-col gap-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
            >
              <div>
                <h4
                  className={`text-lg font-bold tracking-tight mb-1 ${themeStyle.title}`}
                >
                  {productName}
                </h4>
                <div className="flex items-baseline gap-2">
                  <p className={`text-xl font-extrabold ${themeStyle.amount}`}>
                    ${p.dealAmount?.toLocaleString()}
                  </p>
                  {p.quantity && p.quantity > 1 && (
                    <span className={`text-xs font-bold ${themeStyle.label}`}>
                      x{p.quantity}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest text-muted-foreground`}
                  >
                    Deal Stage
                  </span>
                  <span className={`text-sm font-semibold ${themeStyle.label}`}>
                    {p.stage || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest text-muted-foreground`}
                  >
                    Expected Close
                  </span>
                  <span className={`text-sm font-bold ${themeStyle.label}`}>
                    {p.expectedCloseDate
                      ? format(new Date(p.expectedCloseDate), "MMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
