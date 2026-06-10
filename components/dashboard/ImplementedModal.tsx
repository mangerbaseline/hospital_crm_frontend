"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchImplemented } from "@/store/features/dashboard/dashboardSlice";
import Link from "next/link";

export function ImplementedModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [implementedPage, setImplementedPage] = useState(1);
  const dispatch = useAppDispatch();
  const { implementedData, isFetchingImplemented } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchImplemented({ page: implementedPage, limit: 5 }));
    }
  }, [open, implementedPage, dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-120 p-0 overflow-hidden max-h-[85vh] flex flex-col">
        <div className="p-6 pb-4 shrink-0">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">Implemented</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              View all implemented deals.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
          <div className="mt-2">
            <div className="flex items-end justify-between border-b border-border pb-2">
              <h3 className="text-lg font-bold">Implemented Deals</h3>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-700">
                  ${(implementedData?.amount || 0).toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {implementedData?.productsCount || 0}{" "}
                  {implementedData?.productsCount === 1
                    ? "product"
                    : "products"}
                </div>
              </div>
            </div>

            {!implementedData || implementedData.data.length === 0 ? (
              <div className="py-8 flex items-center justify-center">
                {isFetchingImplemented ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-muted-foreground text-sm font-medium tracking-tight">
                    No Implemented deals yet
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {implementedData.data.map((hospital: any, hIdx: number) =>
                  hospital.products.map((prod: any, pIdx: number) => (
                    <Link
                      href={`/hospitals/${hospital.hospitalId}`}
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

                {implementedData && implementedData.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground font-medium">
                      Page {implementedData.page} of{" "}
                      {implementedData.totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-md cursor-pointer disabled:opacity-50"
                        disabled={
                          implementedData.page === 1 || isFetchingImplemented
                        }
                        onClick={() =>
                          setImplementedPage((prev) => Math.max(1, prev - 1))
                        }
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-md cursor-pointer disabled:opacity-50"
                        disabled={
                          !implementedData.hasMore || isFetchingImplemented
                        }
                        onClick={() => setImplementedPage((prev) => prev + 1)}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
