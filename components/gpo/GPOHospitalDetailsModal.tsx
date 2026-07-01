"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GPOWithDeals } from "@/store/types";
import {
  Building2,
  MapPin,
  Building,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchGPOHospitals } from "@/store/features/gpo/gpoSlice";

interface GPOHospitalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpo: GPOWithDeals | null;
  selectedUser?: string;
}

export function GPOHospitalDetailsModal({
  isOpen,
  onClose,
  gpo,
  selectedUser,
}: GPOHospitalDetailsModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    gpoHospitals,
    isFetchingGPOHospitals,
    gpoHospitalsPage,
    gpoHospitalsTotalPages,
    gpoHospitalsTotal,
  } = useAppSelector((state) => state.gpo);

  useEffect(() => {
    if (isOpen && gpo?._id) {
      dispatch(
        fetchGPOHospitals({
          gpoId: gpo._id,
          page: currentPage,
          limit: 5,
          userId: selectedUser && selectedUser !== "all" ? selectedUser : undefined,
        }),
      );
    }
  }, [isOpen, gpo?._id, currentPage, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  if (!gpo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-150 p-0 flex flex-col overflow-hidden bg-muted gap-0 border-none shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-blue-100 rounded-md">
              <Building2 className="h-5 w-5 text-blue-600" />
            </span>
            <DialogTitle className="text-xl font-bold">
              {gpo?.name} - Hospitals
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-500 mt-0.5">
            View details of hospitals associated with {gpo?.name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-6 py-4">
          <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-5 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">
                  Total Hospitals
                </p>
                <p className="text-2xl font-black">{gpo.totalHospitals}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">
                  Total Expected ARR
                </p>
                <p className="text-2xl font-black text-blue-600">
                  ${gpo.gpoTotalExpectedARR?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-slate-700 font-medium mb-3">
                Expected ARR by Product:
              </p>
              <div className="flex flex-wrap gap-3">
                {gpo.gpoARRByProduct?.map((prod, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg px-4 py-2 bg-white flex flex-col items-center justify-center min-w-25 shadow-sm"
                  >
                    <span className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase">
                      {prod?.name}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      ${prod.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isFetchingGPOHospitals ? (
            <div className="py-12 flex items-center justify-center bg-white border border-border rounded-xl shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : gpoHospitals.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground bg-white border border-border rounded-xl shadow-sm">
              No hospitals associated with this GPO.
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {gpoHospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  onClick={() => {
                    onClose();
                    router.push(`/hospitals/${hospital._id}`);
                  }}
                  className="bg-white text-card-foreground border border-border shadow-sm rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-200 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-blue-700 transition-colors">
                        {hospital.hospitalName}
                      </h4>
                      <div className="flex flex-col items-start gap-1 text-sm text-muted-foreground mt-0.5">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate w-full">
                            {hospital?.city || hospital?.state ? (
                              <>
                                {hospital?.city}
                                {hospital?.city && hospital?.state && ", "}
                                {hospital?.state}
                              </>
                            ) : (
                              "No Location"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 uppercase tracking-wide text-[11px] font-medium">
                          <Building className="h-3 w-3" />
                          {hospital?.idn?.name
                            ? `IDN: ${hospital.idn.name}`
                            : "No IDN"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">
                        Total Expected ARR
                      </p>
                      <p className="text-xl font-black text-blue-600">
                        ${hospital.totalExpectedARR?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex flex-wrap gap-2">
                      {hospital.expectedARRByProduct?.map((prod, idx) => (
                        <div
                          key={idx}
                          className="border border-border/60 rounded-md px-3 py-1.5 bg-slate-50 flex flex-col min-w-20"
                        >
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {prod?.name}
                          </span>
                          <span className="text-sm font-bold text-blue-600 leading-tight">
                            ${prod.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isFetchingGPOHospitals && gpoHospitalsTotalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-border bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs text-muted-foreground font-medium">
                Page {gpoHospitalsPage} of {gpoHospitalsTotalPages} (
                {gpoHospitalsTotal} hospitals)
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md cursor-pointer disabled:opacity-50"
                  disabled={gpoHospitalsPage === 1 || isFetchingGPOHospitals}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md cursor-pointer disabled:opacity-50"
                  disabled={
                    gpoHospitalsPage === gpoHospitalsTotalPages ||
                    isFetchingGPOHospitals
                  }
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
