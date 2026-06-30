"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchIDNsWithDeals } from "@/store/features/idn/idnSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDNCard } from "@/components/idn/IDNCard";
import { IDNCardSkeleton } from "@/components/idn/IDNCardSkeleton";
import { IDNDetailsModal } from "@/components/idn/IDNDetailsModal";
import { SearchBar } from "@/components/SearchBar";
import { IDNWithDeals, UserRole } from "@/store/types";

function IDNs() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    idnsWithDeals,
    isFetchingIDNsWithDeals,
    page,
    limit,
    totalIDNs,
    totalPages,
  } = useAppSelector((state) => state.idn);
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isAdminOrExecutive =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.EXECUTIVE ||
    currentUser?.role === UserRole.CUSTOMER_SUCCESS;

  const [selectedUser, setSelectedUser] = useState<string>(
    isAdminOrExecutive ? "all" : currentUser?._id || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [selectedIDN, setSelectedIDN] = useState<IDNWithDeals | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchIDNsWithDeals({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery,
        userId: selectedUser === "all" ? "" : selectedUser,
      }),
    );
  }, [dispatch, currentPage, pageSize, selectedUser, debouncedSearchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedUser, debouncedSearchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };

  const handleViewHospitals = (idn: IDNWithDeals) => {
    setSelectedIDN(idn);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full max-w-7xl mx-auto">
      <DashboardHeader
        title="All IDNs"
        subTitle="Integrated Delivery Networks and their expected revenue"
      >
        {isAdminOrExecutive && (
          <UserSelect
            value={selectedUser}
            onValueChange={setSelectedUser}
            className="w-full sm:w-45 bg-muted border-border shadow-sm cursor-pointer"
          />
        )}
      </DashboardHeader>

      <div className="mt-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search IDNs by name..."
          className="mb-6"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetchingIDNsWithDeals ? (
          Array.from({ length: 6 }).map((_, i) => <IDNCardSkeleton key={i} />)
        ) : idnsWithDeals.length > 0 ? (
          idnsWithDeals.map((idn) => (
            <IDNCard
              key={idn._id}
              idn={idn}
              onViewClick={handleViewHospitals}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
            <h3 className="text-lg font-semibold text-muted-foreground">
              No IDNs found
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {totalIDNs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {totalIDNs === 0 ? 0 : (page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(page * limit, totalIDNs)}
            </span>{" "}
            of <span className="text-foreground font-bold">{totalIDNs}</span>{" "}
            IDNs
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
              <span>Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-16 h-8 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
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

      <IDNDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idn={selectedIDN}
      />
    </section>
  );
}

export default IDNs;
