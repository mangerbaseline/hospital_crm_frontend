"use client";

import { useEffect } from "react";
import { DashboardHeader } from "@/components/Header";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getSingleHospital,
  clearSelectedHospital,
} from "@/store/features/hospital/hospitalSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  CheckCircle2,
  Check,
  MapPin,
  Briefcase,
  AlertTriangle,
  Edit3,
} from "lucide-react";

function HospitalDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedHospital,
    isGetSingleHospitalLoading,
    getSingleHospitalError,
  } = useAppSelector((state) => state.hospital);

  useEffect(() => {
    if (id) {
      dispatch(getSingleHospital(id as string));
    }

    return () => {
      dispatch(clearSelectedHospital());
    };
  }, [dispatch, id]);

  return (
    <section className="max-w-7xl mx-auto w-full">
      <DashboardHeader title="Hospital Details" />

      {selectedHospital &&
        !isGetSingleHospitalLoading &&
        !getSingleHospitalError && (
          <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white">
            <div className="flex justify-end w-full">
              <Button
                variant="outline"
                size="sm"
                className="h-8 shadow-sm text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Details
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 w-full">
                <p className="text-[10px] font-bold text-muted-foreground tracking-wider mb-2 uppercase">
                  Hospital Name
                </p>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {selectedHospital.hospitalName || "N/A"}
                </h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 w-full">
                <p className="text-[10px] font-bold text-blue-500 tracking-wider mb-2 uppercase">
                  Integrated Delivery Network
                </p>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {selectedHospital.idn?.name || "N/A"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted border border-border rounded-xl p-4">
                <div className="bg-white p-2.5 rounded-lg border border-border shrink-0">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide">
                    Total Beds
                  </p>
                  <h4 className="text-xl font-extrabold">
                    {selectedHospital.ICUBeds &&
                      selectedHospital.bedsWithMac &&
                      selectedHospital.ICUBeds + selectedHospital?.bedsWithMac}
                  </h4>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-orange-50/50 border border-orange-200 rounded-xl p-4">
                <div className="bg-white p-2.5 rounded-lg border border-orange-200 shrink-0">
                  <FileText className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wide">
                    ICU Beds
                  </p>
                  <h4 className="text-xl font-extrabold text-orange-600">
                    {selectedHospital.ICUBeds || "N/A"}
                  </h4>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="bg-white p-2.5 rounded-lg border border-blue-200 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wide">
                    Beds with MAC
                  </p>
                  <h4 className="text-xl font-extrabold text-blue-700">
                    {selectedHospital.bedsWithMac || "N/A"}
                  </h4>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shrink-0">
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wide">
                    TEAM Hospital
                  </p>
                  <h4 className="text-xl font-extrabold text-emerald-700">
                    {selectedHospital.teamHospital ? "Yes" : "No"}
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-4 border border-border rounded-xl p-5">
                <div className="bg-muted p-2.5 rounded-lg border border-border shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1">
                    Location
                  </p>
                  {selectedHospital.address && (
                    <p className="text-sm font-semibold text-slate-700 leading-snug">
                      {selectedHospital.address}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    {selectedHospital.city}, {selectedHospital.state}{" "}
                    {selectedHospital.zip}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border border-border rounded-xl p-5">
                <div className="bg-muted p-2.5 rounded-lg border border-border shrink-0 mt-0.5">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1">
                    Group Purchasing Organization
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {typeof selectedHospital.gpo === "object"
                      ? selectedHospital.gpo?.name
                      : selectedHospital.gpo || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {selectedHospital.competitiveProduct && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4 mt-2">
                <div className="bg-white p-2.5 rounded-lg border border-red-100 shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider mb-1">
                    Competitive Product
                  </p>
                  <p className="text-sm font-semibold text-red-700">
                    {selectedHospital.competitiveProduct}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
    </section>
  );
}

export default HospitalDetails;
