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

export function ClosedBusinessModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">
              Closed Business
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              View all closed won and implemented deals.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex items-end justify-between border-b border-border pb-2">
              <h3 className="text-lg font-bold">Closed Won</h3>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$0</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  0 products
                </div>
              </div>
            </div>
            <div className="py-12 flex items-center justify-center">
              <span className="text-muted-foreground font-medium tracking-tight">
                No Closed Won deals yet
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-end justify-between border-b border-border pb-2">
              <h3 className="text-lg font-bold">Implemented</h3>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-700">$283</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  2 products
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-200 shadow-sm transition-all hover:bg-blue-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 stroke-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">
                      NYU Langone Tisch Hospital
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      MAC System
                    </span>
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-700 tracking-tight">
                  $195
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-200 shadow-sm transition-all hover:bg-blue-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 stroke-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">
                      NYU Langone Tisch Hospital
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      HeelPOD
                    </span>
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-700 tracking-tight">
                  $88
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
