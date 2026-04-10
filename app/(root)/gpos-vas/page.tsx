"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchGPOsWithDeals } from "@/store/features/gpo/gpoSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GPOWithDealsList } from "@/components/gpo/GPOWithDealsList";
import { GPOHospitalDetailsModal } from "@/components/gpo/GPOHospitalDetailsModal";
import { GPOWithDeals } from "@/store/types";

function GposVasPage() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    gposWithDeals,
    isFetchingGPOsWithDeals,
    page,
    limit,
    totalGPOs,
    totalPages,
  } = useAppSelector((state) => state.gpo);

  const [selectedUser, setSelectedUser] = useState<string>(
    currentUser?._id || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedGPO, setSelectedGPO] = useState<GPOWithDeals | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchGPOsWithDeals({
        page: currentPage,
        limit: pageSize,
        search: "",
        userId: selectedUser === "all" ? "" : selectedUser,
      }),
    );
  }, [dispatch, currentPage, pageSize, selectedUser]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedUser]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };

  const handleViewHospitals = (gpo: GPOWithDeals) => {
    setSelectedGPO(gpo);
    setIsModalOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto w-full">
      <DashboardHeader
        title="GPOs & VAs"
        subTitle="Group Purchasing Organizations, Veteran Affairs Hospitals and their expected revenue"
      >
        <UserSelect
          value={selectedUser}
          onValueChange={setSelectedUser}
          className="w-full sm:w-[180px] bg-muted border-border shadow-sm cursor-pointer"
        />
      </DashboardHeader>

      <div className="flex flex-col md:flex-row gap-4 justify-end mb-6"></div>

      <GPOWithDealsList
        gposWithDeals={gposWithDeals}
        isFetchingGPOsWithDeals={isFetchingGPOsWithDeals}
        onViewHospitals={handleViewHospitals}
      />

      {totalGPOs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {totalGPOs === 0 ? 0 : (page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(page * limit, totalGPOs)}
            </span>{" "}
            of <span className="text-foreground font-bold">{totalGPOs}</span>{" "}
            GPOs
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
              <span>Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-16 h-8 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-md font-bold shadow-sm transition-all cursor-pointer ${
                        page === pageNum ? "shadow-primary/20 scale-110" : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 2 && page > 3)
                  return (
                    <span
                      key="ellipsis-start"
                      className="w-4 text-center text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                if (pageNum === totalPages - 1 && page < totalPages - 2)
                  return (
                    <span
                      key="ellipsis-end"
                      className="w-4 text-center text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <GPOHospitalDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gpo={selectedGPO}
      />
    </section>
  );
}

export default GposVasPage;
