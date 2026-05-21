"use client";

import AddDealForm from "@/components/AddDealForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function AddDealPage() {
  const isMobile = useIsMobile();

  return (
    <section className="max-w-7xl mx-auto w-full">
      {isMobile && (
        <div className="flex gap-2 items-center mb-5">
          <SidebarTrigger className="h-8 w-8 ml-3 p-2 border rounded-md" />
        </div>
      )}
      <AddDealForm />
    </section>
  );
}

export default AddDealPage;
