"use client";

import { Button } from "@/components/ui/button";
import { Building2, DollarSign, CheckCircle2, UserPlus } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClosedBusinessModal } from "@/components/dashboard/ClosedBusinessModal";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SalesPipelineFunnel } from "@/components/dashboard/SalesPipelineFunnel";
import { DashboardHeader } from "@/components/Header";
import { AddDealModal } from "@/components/dashboard/AddDealModel";
import { AddContactModal } from "@/components/dashboard/AddContactModal";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchDashboardStats,
  fetchDashboardTasks,
  fetchDashboardActivity,
} from "@/store/features/dashboard/dashboardSlice";

function Home() {
  const dispatch = useAppDispatch();
  const { dashboardStats } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <section className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <DashboardHeader>
        <AddDealModal>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-3 p-3 md:p-[18px] text-sm cursor-pointer">
            <Building2 className="h-2 w-2 md:h-4 md:w-4" />{" "}
            <span className="md:block hidden">Add Deal</span>
          </Button>
        </AddDealModal>
        <AddContactModal>
          <Button className="flex gap-3 p-3 md:p-[18px] text-sm bg-sidebar border border-border text-foreground cursor-pointer hover:bg-muted shadow-xl shadow-muted">
            <UserPlus className="h-2 w-2 md:h-4 md:w-4" />{" "}
            <span className="md:block hidden">Add Contact</span>
          </Button>
        </AddContactModal>
      </DashboardHeader>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard
          title="My Hospitals"
          icon={Building2}
          iconClassName="text-muted-foreground"
          value={dashboardStats?.totalHospitals || 0}
          subtitle={<>Total hospitals</>}
          buttonText="View All"
          href="/hospitals"
        />
        <StatsCard
          title="My Pipeline"
          icon={DollarSign}
          iconClassName="text-muted-foreground"
          value={`$${(dashboardStats?.totalPipelineAmount || 0).toLocaleString()}`}
          subtitle={<>{dashboardStats?.activeDeals || 0} active deals</>}
          buttonText="View Pipeline"
          href="/pipeline"
        />
        <StatsCard
          title="Closed Business"
          icon={CheckCircle2}
          iconClassName="text-muted-foreground"
          value={`$${(dashboardStats?.closedBusiness?.totalAmount || 0).toLocaleString()}`}
          subtitle={
            <>
              {dashboardStats?.closedBusiness?.hospitalCount || 0} hospitals
              <br />
              Total Expected ARR
            </>
          }
          buttonText="View All"
          trigger={
            <ClosedBusinessModal>
              <Button
                variant="outline"
                className="w-full h-9 rounded-lg border-border font-medium hover:bg-muted cursor-pointer transition-colors"
              >
                View All
              </Button>
            </ClosedBusinessModal>
          }
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8 w-full min-w-0">
        <UpcomingTasks />
        <RecentActivity />
      </div>
      <SalesPipelineFunnel />
    </section>
  );
}

export default Home;
