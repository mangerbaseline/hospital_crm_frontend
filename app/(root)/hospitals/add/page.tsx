"use client";

import AddHospitalForm from "@/components/AddHospitalForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function AddHospital() {
  const { user } = useAppSelector((state) => state.auth);
  const isMobile = useIsMobile();

  return (
    <section className="max-w-7xl mx-auto w-full">
      {/* header */}
      <Card className="mb-5">
        <div className="flex gap-2 items-center">
          {isMobile && <SidebarTrigger className="h-2 w-2 ml-3 p-2" />}
          <CardHeader>
            <CardTitle className="text-sm">Sales Rep</CardTitle>
            <CardDescription className="text-lg text-primary font-semibold">
              {user?.name}
            </CardDescription>
          </CardHeader>
        </div>
      </Card>

      <AddHospitalForm />
    </section>
  );
}

export default AddHospital;
