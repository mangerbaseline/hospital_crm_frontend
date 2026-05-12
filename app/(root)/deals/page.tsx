"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllDeals } from "@/store/features/deal/dealSlice";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { GPOSelect } from "@/components/gpo/GPOSelect";
import { PipelineStatsCard } from "@/components/pipeline/PipelineStatsCard";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DealsPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { deals, stats, isFetchingDeals, page, limit, totalDeals, totalPages } =
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

  console.log("deals", deals);

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

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[250px] font-semibold">
                  Hospital
                </TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold text-right">
                  Amount
                </TableHead>
                <TableHead className="font-semibold">Stage</TableHead>
                <TableHead className="font-semibold">Expected Close</TableHead>
                <TableHead className="font-semibold">Rep</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetchingDeals ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Loading deals...
                  </TableCell>
                </TableRow>
              ) : deals.length > 0 ? (
                deals.map((deal) => (
                  <TableRow
                    key={deal._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {deal.hospital?.hospitalName}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {deal.hospital?.city}, {deal.hospital?.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{deal.product?.name}</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(deal.dealAmount || 0)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {deal.stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {deal.expectedCloseDate
                        ? format(
                            new Date(deal.expectedCloseDate),
                            "MMM dd, yyyy",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {deal.user?.name}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">No deals found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
