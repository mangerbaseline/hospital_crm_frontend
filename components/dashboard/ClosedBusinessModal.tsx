"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2 } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export function ClosedBusinessModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { dashboardStats } = useAppSelector((state) => state.dashboard);

  const closedWon = dashboardStats?.closedWon || {
    amount: 0,
    productsCount: 0,
    hospitals: [],
  };
  const implemented = dashboardStats?.implemented || {
    amount: 0,
    productsCount: 0,
    hospitals: [],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden max-h-[85vh] flex flex-col">
        <div className="p-6 pb-4 shrink-0">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">
              Closed Business
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              View all closed won and implemented deals.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
          <div className="mt-2">
            <div className="flex items-end justify-between border-b border-border pb-2">
              <h3 className="text-lg font-bold">Closed Won</h3>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ${closedWon.amount.toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {closedWon.productsCount}{" "}
                  {closedWon.productsCount === 1 ? "product" : "products"}
                </div>
              </div>
            </div>

            {closedWon.hospitals.length === 0 ? (
              <div className="py-8 flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium tracking-tight">
                  No Closed Won deals yet
                </span>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {closedWon.hospitals.map((hospital, hIdx) =>
                  hospital.products.map((prod: any, pIdx: number) => (
                    <Link
                      href={`/hospitals/${hospital._id}`}
                      key={`${hIdx}-${pIdx}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-green-200 shadow-sm transition-all hover:bg-green-50/50 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 stroke-green-500" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold leading-tight">
                            {hospital.hospitalName}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {typeof prod.product === "object"
                              ? prod.product?.name
                              : "Product Tracked"}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-700 tracking-tight">
                        ${prod.dealAmount?.toLocaleString()}
                      </div>
                    </Link>
                  )),
                )}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between border-b border-border pb-2">
              <h3 className="text-lg font-bold">Implemented</h3>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-700">
                  ${implemented.amount.toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {implemented.productsCount}{" "}
                  {implemented.productsCount === 1 ? "product" : "products"}
                </div>
              </div>
            </div>

            {implemented.hospitals.length === 0 ? (
              <div className="py-8 flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium tracking-tight">
                  No Implemented deals yet
                </span>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {implemented.hospitals.map((hospital, hIdx) =>
                  hospital.products.map((prod: any, pIdx: number) => (
                    <Link
                      href={`/hospitals/${hospital._id}`}
                      key={`${hIdx}-${pIdx}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-blue-200 shadow-sm transition-all hover:bg-blue-50/50 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 stroke-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold leading-tight">
                            {hospital.hospitalName}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {typeof prod.product === "object"
                              ? prod.product?.name
                              : "Product Tracked"}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-blue-700 tracking-tight">
                        ${prod.dealAmount?.toLocaleString()}
                      </div>
                    </Link>
                  )),
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
