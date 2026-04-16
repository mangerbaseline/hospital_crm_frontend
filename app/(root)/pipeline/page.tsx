"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllDeals } from "@/store/features/deal/dealSlice";
import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";
import { PipelineStatsCard } from "@/components/pipeline/PipelineStatsCard";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";

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
  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentUser?._id || "all",
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchAllDeals(selectedUserId === "all" ? {} : { userId: selectedUserId }),
    );
  }, [selectedUserId, dispatch]);

  return (
    <div>
      <section className="w-full max-w-7xl mx-auto">
        {/* header */}
        <DashboardHeader
          title="Pipeline"
          subTitle="Track deals across all stages"
        >
          <UserSelect
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            className="w-full sm:w-[180px] bg-muted border-border shadow-sm cursor-pointer"
          />
        </DashboardHeader>

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 w-full">
          <PipelineStatsCard
            value={stats ? String(stats.totalHospitals) : "-"}
            label="My Hospitals"
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
          <PipelineStatsCard
            value={stats ? stats.closedBusiness : "-"}
            label="Closed Business"
          />
        </div>
      </section>

      {/* kanban */}
      <PipelineBoard />
    </div>
  );
}

export default Pipeline;
