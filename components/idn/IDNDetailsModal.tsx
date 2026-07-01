"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IDNWithDeals } from "@/store/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchIDNHospitals } from "@/store/features/idn/idnSlice";

interface IDNDetailsModalProps {
  idn: IDNWithDeals | null;
  isOpen: boolean;
  onClose: () => void;
  selectedUser?: string;
}

export function IDNDetailsModal({
  idn,
  isOpen,
  onClose,
  selectedUser,
}: IDNDetailsModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    idnHospitals,
    isFetchingIDNHospitals,
    idnHospitalsPage,
    idnHospitalsTotalPages,
    idnHospitalsTotal,
  } = useAppSelector((state) => state.idn);

  useEffect(() => {
    if (isOpen && idn?._id) {
      dispatch(
        fetchIDNHospitals({
          idnId: idn._id,
          page: currentPage,
          limit: 5,
          userId: selectedUser && selectedUser !== "all" ? selectedUser : undefined,
        }),
      );
    }
  }, [isOpen, idn?._id, currentPage, selectedUser, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  if (!idn) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 h-full sm:h-auto sm:max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50 gap-0">
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
                    className="border border-border/80 rounded-lg px-4 py-2 bg-white flex flex-col items-center justify-center min-w-25 shadow-sm"
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

          {isFetchingIDNHospitals ? (
            <div className="py-12 flex items-center justify-center bg-white border border-border rounded-xl shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : idnHospitals.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground bg-white border border-border rounded-xl shadow-sm">
              No hospitals associated with this IDN.
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {idnHospitals.map((hospital) => (
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
                      <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {hospital.city || hospital.state ? (
                            <>
                              {hospital.city}
                              {hospital.city && hospital.state && ", "}
                              {hospital.state}
                            </>
                          ) : (
                            "No Location"
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-1 uppercase tracking-wide font-medium">
                        GPO:{" "}
                        {typeof hospital.gpo === "object"
                          ? hospital.gpo?.name
                          : hospital.gpo || "N/A"}
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
                          className="border border-border/60 rounded-md px-3 py-1.5 bg-slate-50 flex flex-col min-w-20"
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
          )}

          {!isFetchingIDNHospitals && idnHospitalsTotalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-border bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs text-muted-foreground font-medium">
                Page {idnHospitalsPage} of {idnHospitalsTotalPages} (
                {idnHospitalsTotal} hospitals)
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md cursor-pointer disabled:opacity-50"
                  disabled={idnHospitalsPage === 1 || isFetchingIDNHospitals}
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
                    idnHospitalsPage === idnHospitalsTotalPages ||
                    isFetchingIDNHospitals
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
