"use client";

import AddDealForm from "@/components/AddDealForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";

function AddDealPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isMobile = useIsMobile();

  return (
    <section className="max-w-7xl mx-auto w-full">
      {/* header */}
      <Card className="mb-5">
        <div className="flex gap-2 items-center">
          {isMobile && <SidebarTrigger className="h-2 w-2 ml-3 p-2" />}
          <CardHeader className="w-full">
            <CardTitle className="text-sm">Sales Rep</CardTitle>
            <CardDescription className="text-lg text-primary font-semibold">
              {user?.name}
            </CardDescription>
          </CardHeader>
        </div>
      </Card>

      <AddDealForm />
    </section>
  );
}

export default AddDealPage;
