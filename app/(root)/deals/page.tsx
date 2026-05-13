"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllDeals } from "@/store/features/deal/dealSlice";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { GPOSelect } from "@/components/gpo/GPOSelect";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DealCard } from "@/components/deals/DealCard";
import { DealCardSkeleton } from "@/components/deals/DealCardSkeleton";

export default function DealsPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { deals, isFetchingDeals, page, limit, totalDeals, totalPages } =
    useAppSelector((state) => state.deal);

  const dispatch = useAppDispatch();

  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentUser?._id || "all",
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedGpoId, setSelectedGpoId] = useState<string>("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

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
      fetchAllDeals({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery,
        ...(selectedUserId !== "all" && { userId: selectedUserId }),
        ...(selectedProductIds.length > 0 && {
          productIds: selectedProductIds.join(","),
        }),
        ...(selectedGpoId !== "all" && { gpoId: selectedGpoId }),
      }),
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearchQuery,
    selectedUserId,
    selectedProductIds,
    selectedGpoId,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedUserId, selectedProductIds, selectedGpoId]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };

  const refetchDeals = () => {
    dispatch(
      fetchAllDeals({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery,
        ...(selectedUserId !== "all" && { userId: selectedUserId }),
        ...(selectedProductIds.length > 0 && {
          productIds: selectedProductIds.join(","),
        }),
        ...(selectedGpoId !== "all" && { gpoId: selectedGpoId }),
      }),
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-10">
      <DashboardHeader
        title="All Deals"
        subTitle="View and manage all your deals"
      >
        <div className="hidden gap-2 w-full sm:w-auto lg:flex">
          <UserSelect
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            className="w-full sm:w-[150px] bg-muted border-border shadow-sm cursor-pointer"
          />
          <GPOSelect
            value={selectedGpoId}
            onValueChange={setSelectedGpoId}
            className="w-full sm:w-[150px] bg-muted border-border shadow-sm cursor-pointer"
          />
          <MultiProductSelect
            value={selectedProductIds}
            onValueChange={setSelectedProductIds}
            className="w-full sm:w-[200px] bg-muted border-border shadow-sm cursor-pointer"
          />
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-2 w-full sm:w-auto lg:hidden -mt-4 mb-4">
        <UserSelect
          value={selectedUserId}
          onValueChange={setSelectedUserId}
          className="w-full bg-muted border-border shadow-sm cursor-pointer"
        />
        <GPOSelect
          value={selectedGpoId}
          onValueChange={setSelectedGpoId}
          className="w-full bg-muted border-border shadow-sm cursor-pointer"
        />
        <MultiProductSelect
          value={selectedProductIds}
          onValueChange={setSelectedProductIds}
          className="w-full bg-muted border-border shadow-sm cursor-pointer"
        />
      </div>

      <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center justify-between mt-8 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by hospital name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border h-12"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex w-full md:w-auto items-center gap-2 text-sm font-medium text-muted-foreground border px-3 py-2 rounded-lg shadow-sm bg-background">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Rows:</span>
            <Select value={String(pageSize)} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-full sm:w-[70px] h-7 border-none p-0 shadow-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isFetchingDeals ? (
          Array.from({ length: 6 }).map((_, i) => <DealCardSkeleton key={i} />)
        ) : deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard key={deal._id} deal={deal} onDealUpdated={refetchDeals} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
            <h3 className="text-lg font-semibold text-muted-foreground">
              No deals found
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {totalDeals === 0 ? 0 : (page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(page * limit, totalDeals)}
            </span>{" "}
            of <span className="text-foreground font-bold">{totalDeals}</span>{" "}
            deals
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isFetchingDeals}
              className="h-9 w-9 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5 px-1">
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
                      disabled={isFetchingDeals}
                      className={`h-8 w-8 rounded-md font-bold shadow-sm transition-all cursor-pointer ${
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
              disabled={page === totalPages || isFetchingDeals}
              className="h-9 w-9 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
