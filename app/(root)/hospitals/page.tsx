"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/Header";
import { HospitalSearchBar } from "@/components/hospitals/HospitalSearchBar";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { HospitalCardSkeleton } from "@/components/hospitals/HospitalCardSkeleton";
import { UserSelect } from "@/components/UserSelect";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchHospitalsWithDeals } from "@/store/features/hospital/hospitalSlice";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { UserRole } from "@/store/types";

function Hospitals() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const productStage = searchParams.get("productStage") || "";

  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isAdminOrExecutive =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.EXECUTIVE ||
    currentUser?.role === UserRole.CUSTOMER_SUCCESS;
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

  const [selectedUser, setSelectedUser] = useState<string>(
    isAdminOrExecutive ? "all" : currentUser?._id || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        userId: selectedUser === "all" ? "" : selectedUser,
        productStage,
      }),
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearchQuery,
    selectedUser,
    productStage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedUser, productStage]);

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
    <section className="w-full max-w-7xl mx-auto">
      <DashboardHeader
        title="All Hospitals"
        subTitle="Hospitals organized by expected close date"
      >
        {isAdminOrExecutive && (
          <UserSelect
            value={selectedUser}
            onValueChange={setSelectedUser}
            className="w-full sm:w-45 bg-muted border-border shadow-sm cursor-pointer"
          />
        )}
      </DashboardHeader>

      <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center justify-between mt-6">
        <div className="flex-1 w-full">
          <HospitalSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto md:mb-6">
          <div className="flex w-full md:w-auto items-center gap-2 text-sm font-medium text-muted-foreground border px-3 py-2 rounded-lg shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Rows:</span>
            <Select value={String(pageSize)} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-full sm:w-17.5 h-7 border-none p-0 shadow-none cursor-pointer">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isFetchingHospitalsWithDeals ? (
          Array.from({ length: 6 }).map((_, i) => (
            <HospitalCardSkeleton key={i} />
          ))
        ) : hospitalsWithDeals.length > 0 ? (
          hospitalsWithDeals.map((hospital) => (
            <HospitalCard key={hospital._id} hospital={hospital} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
            <h3 className="text-lg font-semibold text-muted-foreground">
              No hospitals found
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {(page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(page * limit, totalHospitals)}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-bold">{totalHospitals}</span>{" "}
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
    </section>
  );
}

export default Hospitals;
