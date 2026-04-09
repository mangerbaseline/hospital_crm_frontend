"use client";

import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IDNWithDeals } from "@/store/types";
import { useRouter } from "next/navigation";

interface IDNDetailsModalProps {
  idn: IDNWithDeals | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IDNDetailsModal({
  idn,
  isOpen,
  onClose,
}: IDNDetailsModalProps) {
  const router = useRouter();

  if (!idn) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-full sm:h-auto sm:max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-white shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="p-1.5 bg-emerald-100 rounded-md">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </span>
            {idn.name} - Hospitals
          </DialogTitle>
          <DialogDescription>
            View details of hospitals associated with {idn.name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-6 py-4">
          <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-5 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Total Hospitals
                </p>
                <p className="text-2xl font-extrabold">{idn.totalHospitals}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Total Expected ARR
                </p>
                <p className="text-2xl font-extrabold text-emerald-600">
                  ${idn.idnTotalExpectedARR?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-slate-700 font-medium mb-3">
                Expected ARR by Product:
              </p>
              <div className="flex flex-wrap gap-3">
                {idn.idnARRByProduct?.map((prod, idx) => (
                  <div
                    key={idx}
                    className="border border-border/80 rounded-lg px-4 py-2 bg-white flex flex-col items-center justify-center min-w-[100px] shadow-sm"
                  >
                    <span className="text-[10px] text-muted-foreground font-medium mb-0.5">
                      {prod.name}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      ${prod.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-4">
            {idn.hospitals?.map((hospital) => (
              <div
                key={hospital._id}
                onClick={() => {
                  onClose();
                  router.push(`/hospitals/${hospital._id}`);
                }}
                className="bg-white text-card-foreground border shadow-sm rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow hover:border-emerald-200 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-emerald-700 transition-colors">
                      {hospital.hospitalName}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {hospital.city}, {hospital.state}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1 uppercase tracking-wide font-medium">
                      GPO: {hospital.gpo?.name || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">
                      Total Expected ARR
                    </p>
                    <p className="text-xl font-extrabold text-emerald-600">
                      ${hospital.totalExpectedARR?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex flex-wrap gap-2">
                    {hospital.expectedARRByProduct?.map((prod, idx) => (
                      <div
                        key={idx}
                        className="border border-border/60 rounded-md px-3 py-1.5 bg-slate-50 flex flex-col min-w-[80px]"
                      >
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {prod.name}
                        </span>
                        <span className="text-sm font-bold text-emerald-600 leading-tight">
                          ${prod.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
