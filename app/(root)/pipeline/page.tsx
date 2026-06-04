"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllDeals } from "@/store/features/deal/dealSlice";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { MultiProductSelect } from "@/components/products/MultiProductSelect";
import { GPOSelect } from "@/components/gpo/GPOSelect";
import { PipelineStatsCard } from "@/components/pipeline/PipelineStatsCard";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { UserRole } from "@/store/types";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

function Pipeline() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { stats } = useAppSelector((state) => state.deal);
  const isAdminOrExecutive =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.EXECUTIVE ||
    currentUser?.role === UserRole.CUSTOMER_SUCCESS;
  const [selectedUserId, setSelectedUserId] = useState<string>(
    isAdminOrExecutive ? "all" : currentUser?._id || "all",
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedGpoId, setSelectedGpoId] = useState<string>("all");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchAllDeals({
        ...(selectedUserId !== "all" && { userId: selectedUserId }),
        ...(selectedProductIds.length > 0 && {
          productIds: selectedProductIds.join(","),
        }),
        ...(selectedGpoId !== "all" && { gpoId: selectedGpoId }),
      }),
    );
  }, [selectedUserId, selectedProductIds, selectedGpoId, dispatch]);

  return (
    <div>
      <section className="w-full max-w-7xl mx-auto">
        {/* header */}
        <DashboardHeader
          title="Pipeline"
          subTitle="Track deals across all stages"
        >
          <div className="hidden gap-2 w-full sm:w-auto lg:flex">
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

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 w-full">
          <PipelineStatsCard
            value={stats ? Number(stats.totalDeals) : "-"}
            label="Total Deals"
          />
          {stats?.productRevenue ? (
            stats.productRevenue.map((prod) => (
              <PipelineStatsCard
                key={prod.productId}
                value={formatCurrency(prod.ARR)}
                label={`${prod.productName} ARR`}
              />
            ))
          ) : (
            <>
              <PipelineStatsCard value="-" label="Loading ARR..." />
              <PipelineStatsCard value="-" label="Loading ARR..." />
              <PipelineStatsCard value="-" label="Loading ARR..." />
            </>
          )}

          {stats ? (
            <PipelineStatsCard
              value={formatCurrency(Number(stats.closedBusiness || 0))}
              label="Closed Won"
            />
          ) : (
            <PipelineStatsCard value="-" label="Loading Closed Business..." />
          )}
        </div>
      </section>

      {/* kanban */}
      <PipelineBoard />
    </div>
  );
}

export default Pipeline;
