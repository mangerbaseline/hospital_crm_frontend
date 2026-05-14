"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Header";
import { HospitalSearchBar } from "@/components/hospitals/HospitalSearchBar";
import { HospitalTable } from "@/components/hospitals/HospitalTable";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchHospitalsWithDeals } from "@/store/features/hospital/hospitalSlice";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AddHospitalModal } from "@/components/AddHospitalModal";
import AdminGuard from "@/components/providers/AdminGuard";

function AddHospitalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const productStage = searchParams.get("productStage") || "";

  const dispatch = useAppDispatch();
  const {
    hospitalsWithDeals,
    isFetchingHospitalsWithDeals,
    page,
    limit,
    totalHospitals,
    totalPages,
  } = useAppSelector((state) => state.hospital);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchHospitalsWithDeals({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery,
        userId: "",
        productStage,
      }),
    );
  }, [dispatch, currentPage, pageSize, debouncedSearchQuery, productStage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, productStage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };

  return (
    <AdminGuard>
      <section className="w-full max-w-7xl mx-auto">
        <DashboardHeader
          title="Hospital Management"
          subTitle="Manage and add new hospitals"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 h-10 w-full sm:w-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Hospital</span>
            </Button>
          </div>
        </DashboardHeader>

        <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center justify-between mt-6">
          <div className="flex-1 w-full">
            <HospitalSearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto md:mb-6">
            <div className="flex w-full md:w-auto items-center gap-2 text-sm font-medium text-muted-foreground border px-3 py-2 rounded-lg shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-full sm:w-[70px] h-7 border-none p-0 shadow-none cursor-pointer">
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
          </div>
        </div>

        {productStage && (
          <div className="mt-4 mb-2">
            <span className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200">
              Filtering by stage: {productStage}
              <button
                onClick={() => router.push(pathname)}
                className="hover:bg-blue-200/50 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        )}

        <div className="mt-6">
          <HospitalTable
            hospitals={hospitalsWithDeals}
            isLoading={isFetchingHospitalsWithDeals}
          />
        </div>

        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2">
            <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
              Displaying{" "}
              <span className="text-foreground font-bold">
                {totalHospitals === 0 ? 0 : (page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="text-foreground font-bold">
                {Math.min(page * limit, totalHospitals)}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-bold">
                {totalHospitals}
              </span>{" "}
              hospitals
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
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

        <AddHospitalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            dispatch(
              fetchHospitalsWithDeals({
                page: currentPage,
                limit: pageSize,
                search: debouncedSearchQuery,
                userId: "",
                productStage,
              }),
            );
          }}
        />
      </section>
    </AdminGuard>
  );
}

export default AddHospitalPage;
