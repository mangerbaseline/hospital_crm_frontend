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
import { ExpectedARRCard } from "@/components/hospitals/ExpectedARRCard";
import { RecentActivity } from "@/components/hospitals/activities/RecentActivity";
import { HospitalContacts } from "@/components/hospitals/HospitalContacts";
import { HospitalDocuments } from "@/components/hospitals/HospitalDocuments";
import { HospitalDetailsSkeleton } from "@/components/hospitals/HospitalDetailsSkeleton";
import { EditHospitalModal } from "@/components/hospitals/EditHospitalModal";
import { HospitalEmails } from "@/components/hospitals/HospitalEmails";
import {
  Building2,
  MapPin,
  Briefcase,
  Edit3,
  FileText,
  CheckCircle2,
  Check,
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

      {isGetSingleHospitalLoading && <HospitalDetailsSkeleton />}

      {selectedHospital &&
        !isGetSingleHospitalLoading &&
        !getSingleHospitalError && (
          <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white">
            <div className="flex justify-end w-full">
              <EditHospitalModal hospital={selectedHospital}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shadow-sm text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Details
                </Button>
              </EditHospitalModal>
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
                      {selectedHospital?.address}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    {[
                      selectedHospital.city,
                      selectedHospital.state,
                      selectedHospital.zip,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
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
                    {selectedHospital.gpo
                      ? typeof selectedHospital.gpo === "object"
                        ? selectedHospital.gpo?.name || "N/A"
                        : selectedHospital.gpo
                      : "N/A"}
                  </p>
                </div>
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
                  <h4 className="font-semibold text-slate-700 text-xl">
                    {selectedHospital?.beds || "N/A"}
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="bg-white p-2.5 rounded-lg border border-purple-200 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wide">
                    MAGNET Hospital
                  </p>
                  <h4 className="text-xl font-extrabold text-purple-700">
                    {selectedHospital.magnetHospital ? "Yes" : "No"}
                  </h4>
                </div>
              </div>
            </div>
          </Card>
        )}

      {selectedHospital && !isGetSingleHospitalLoading && (
        <ExpectedARRCard hospital={selectedHospital} />
      )}

      {selectedHospital && !isGetSingleHospitalLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentActivity
            hospitalId={selectedHospital._id}
            hospitalName={selectedHospital.hospitalName}
          />
          <HospitalContacts
            contacts={selectedHospital.contacts || []}
            hospital={selectedHospital}
          />
        </div>
      )}

      {selectedHospital && !isGetSingleHospitalLoading && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HospitalEmails hospitalId={selectedHospital._id} />
          <HospitalDocuments hospitalId={selectedHospital._id} />
        </div>
      )}
    </section>
  );
}

export default HospitalDetails;
