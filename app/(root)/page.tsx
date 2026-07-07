"use client";

import { Button } from "@/components/ui/button";
import {
  Building2,
  DollarSign,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClosedBusinessModal } from "@/components/dashboard/ClosedBusinessModal";
import { ImplementedModal } from "@/components/dashboard/ImplementedModal";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SalesPipelineFunnel } from "@/components/dashboard/SalesPipelineFunnel";
import { DashboardHeader } from "@/components/Header";
import { AddDealModal } from "@/components/dashboard/AddDealModel";
// import { AddContactModal } from "@/components/dashboard/AddContactModal";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchDashboardStats } from "@/store/features/dashboard/dashboardSlice";

function Home() {
  const dispatch = useAppDispatch();
  const { dashboardStats, isFetchingDashboardStats } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <section className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <DashboardHeader>
        <AddDealModal>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-3 p-3 md:p-4.5 text-sm cursor-pointer">
            <Building2 className="h-2 w-2 md:h-4 md:w-4" />{" "}
            <span className="md:block hidden">Add Deal</span>
          </Button>
        </AddDealModal>
        {/* <AddContactModal>
          <Button className="flex gap-3 p-3 md:p-4.5 text-sm bg-sidebar border border-border text-foreground cursor-pointer hover:bg-muted shadow-xl shadow-muted">
            <UserPlus className="h-2 w-2 md:h-4 md:w-4" />{" "}
            <span className="md:block hidden">Add Contact</span>
          </Button>
        </AddContactModal> */}
      </DashboardHeader>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* Loading skeletons for stats */}
        {isFetchingDashboardStats ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="flex flex-col h-full shadow-sm shadow-black/5 border-border rounded-[16px] transition-all hover:shadow-md py-0"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-6 space-y-0">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 px-6">
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
                <CardFooter className="px-5 pb-5 pt-0 border-none bg-transparent">
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Active Deals"
              icon={Building2}
              iconClassName="text-muted-foreground"
              value={dashboardStats?.activeDeals || 0}
              // subtitle={}
              buttonText="View All"
              href="/deals"
            />
            <StatsCard
              title="Total in Pipeline"
              icon={DollarSign}
              iconClassName="text-muted-foreground"
              value={`$${(dashboardStats?.totalPipelineAmount || 0).toLocaleString()}`}
              subtitle={<> {dashboardStats?.activeDeals || 0} active deals</>}
              buttonText="View Pipeline"
              href="/pipeline"
            />
            <StatsCard
              title="Closed Won"
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
            <StatsCard
              title="Implemented"
              icon={ShieldCheck}
              iconClassName="text-muted-foreground"
              value={`$${(dashboardStats?.implemented?.totalAmount || 0).toLocaleString()}`}
              subtitle={
                <>
                  {dashboardStats?.implemented?.hospitalCount || 0} hospitals
                  <br />
                  Total Expected ARR
                </>
              }
              buttonText="View All"
              trigger={
                <ImplementedModal>
                  <Button
                    variant="outline"
                    className="w-full h-9 rounded-lg border-border font-medium hover:bg-muted cursor-pointer transition-colors"
                  >
                    View All
                  </Button>
                </ImplementedModal>
              }
            />
          </>
        )}
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
