"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllDeals, clearDeals } from "@/store/features/deal/dealSlice";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { GPOSelect } from "@/components/gpo/GPOSelect";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Building2,
  LayoutGrid,
  List,
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
import { DealsListView } from "@/components/deals/DealsListView";
import { DealsListSkeleton } from "@/components/deals/DealsListSkeleton";
import { UserRole } from "@/store/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AddDealModal } from "@/components/dashboard/AddDealModel";

export default function DealsPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { deals, isFetchingDeals, page, limit, totalDeals, totalPages } =
    useAppSelector((state) => state.deal);

  const isAdminOrExecutive =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.EXECUTIVE ||
    currentUser?.role === UserRole.CUSTOMER_SUCCESS;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const dealStage = searchParams.get("dealStage") || "";
  const viewParam = searchParams.get("view");

  const dispatch = useAppDispatch();

  const [viewMode, setViewMode] = useState<"card" | "list">(
    viewParam === "list" ? "list" : "card",
  );

  const [selectedUserId, setSelectedUserId] = useState<string>(
    isAdminOrExecutive ? "all" : currentUser?._id || "all",
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedGpoId, setSelectedGpoId] = useState<string>("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [sortBy, setSortBy] = useState("dealAmount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(clearDeals());
  }, [dispatch]);

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
        ...(dealStage && { dealStage }),
        sortBy,
        sortOrder,
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
    dealStage,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchQuery,
    selectedUserId,
    selectedProductIds,
    selectedGpoId,
    dealStage,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleViewToggle = (mode: "card" | "list") => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
        ...(dealStage && { dealStage }),
        sortBy,
        sortOrder,
      }),
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-10">
      <DashboardHeader
        title="All Deals"
        subTitle="View and manage all your deals"
      >
        <div
          className={`hidden xl:grid-cols-4 gap-2 w-full sm:w-auto lg:grid grid-cols-2 items-center`}
        >
          <UserSelect
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            className="w-full sm:w-45 bg-muted border-border shadow-sm cursor-pointer"
          />
          <GPOSelect
            value={selectedGpoId}
            onValueChange={setSelectedGpoId}
            className="w-full sm:w-45 bg-muted border-border shadow-sm cursor-pointer"
          />
          <MultiProductSelect
            value={selectedProductIds}
            onValueChange={setSelectedProductIds}
            className="w-full sm:w-45 bg-muted border-border shadow-sm cursor-pointer"
          />
          <AddDealModal>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-3 p-3 md:p-4 text-sm cursor-pointer">
              <Building2 className="h-2 w-2 md:h-4 md:w-4" />{" "}
              <span className="md:block hidden">Add Deal</span>
            </Button>
          </AddDealModal>
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
        <AddDealModal>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-3 p-3 md:p-4 text-sm cursor-pointer">
            <Building2 className="h-2 w-2 md:h-4 md:w-4" />{" "}
            <span>Add Deal</span>
          </Button>
        </AddDealModal>
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
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg overflow-hidden shadow-sm bg-background">
            <button
              onClick={() => handleViewToggle("card")}
              className={`p-2.5 transition-colors cursor-pointer ${viewMode === "card"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
                }`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewToggle("list")}
              className={`p-2.5 transition-colors cursor-pointer ${viewMode === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
                }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="flex w-full md:w-auto items-center gap-2 text-sm font-medium text-muted-foreground border px-3 py-2 rounded-lg shadow-sm bg-background">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Rows:</span>
            <Select value={String(pageSize)} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-full sm:w-17.5 h-7 border-none p-0 shadow-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="96">96</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {dealStage && (
        <div className="mt-4 mb-2">
          <span className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 shadow-sm">
            Filtering by stage: {dealStage}
            <button
              onClick={() => router.push(pathname)}
              className="hover:bg-blue-200/50 rounded-full p-0.5 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Content Area */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {isFetchingDeals ? (
            Array.from({ length: 6 }).map((_, i) => (
              <DealCardSkeleton key={i} />
            ))
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
      ) : (
        <div className="mt-6">
          {isFetchingDeals ? (
            <DealsListSkeleton />
          ) : deals.length > 0 ? (
            <DealsListView
              deals={deals}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onDealUpdated={refetchDeals}
            />
          ) : (
            <div className="py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
              <h3 className="text-lg font-semibold text-muted-foreground">
                No deals found
              </h3>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      )}

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
                      className={`h-8 w-8 rounded-md font-bold shadow-sm transition-all cursor-pointer ${page === pageNum ? "shadow-primary/20 scale-110" : ""
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
