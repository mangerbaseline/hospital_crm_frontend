import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { fetchDashboardTasks } from "@/store/features/dashboard/dashboardSlice";

export function UpcomingTasks() {
  const {
    dashboardTasks,
    isFetchingDashboardTasks,
    dashboardTasksHasMore,
    dashboardTasksPage,
    dashboardTasksTotalPages,
  } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDashboardTasks({ page: 1, limit: 5 }));
  }, [dispatch]);

  const handleNextPage = () => {
    if (dashboardTasksHasMore) {
      dispatch(fetchDashboardTasks({ page: dashboardTasksPage + 1, limit: 5 }));
    }
  };

  const handlePrevPage = () => {
    if (dashboardTasksPage > 1) {
      dispatch(fetchDashboardTasks({ page: dashboardTasksPage - 1, limit: 5 }));
    }
  };

  return (
    <Card className="flex py-0 flex-col h-full shadow-none border-none sm:shadow-sm sm:border-border sm:border rounded-xl transition-all w-full min-w-0 max-h-[400px] overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-5 px-1 sm:px-6 space-y-0">
        <Clock className="h-5 w-5 shrink-0" />
        <CardTitle className="text-[16px] font-medium tracking-tight truncate">
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        <ScrollArea className="h-full w-full max-w-full">
          <div className="flex flex-col px-1 sm:px-4 pb-6">
            {isFetchingDashboardTasks ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="mb-3 border border-border rounded-xl p-4"
                >
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-1" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            ) : dashboardTasks && dashboardTasks.length > 0 ? (
              dashboardTasks.map((task) => {
                const hospitalName =
                  task.hospital && typeof task.hospital === "object"
                    ? task.hospital.hospitalName || "Unknown Hospital"
                    : "";

                return (
                  <div
                    key={task._id}
                    className="mb-3 last:mb-0 border border-border/60 hover:border-border rounded-xl p-3 sm:p-4 shadow-sm transition-all bg-muted"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-[13px] sm:text-sm font-bold truncate leading-tight text-foreground flex-1">
                        {task.title}
                      </h4>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 whitespace-nowrap bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full shrink-0 tracking-wide">
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    </div>

                    {hospitalName && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-1 truncate">
                        {hospitalName}
                      </p>
                    )}

                    {task.description && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground/80 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center min-h-[100px]">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
                  No upcoming tasks in the next 7 days
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        {dashboardTasksTotalPages > 0 && dashboardTasks.length > 0 && (
          <div className="flex items-center justify-between mt-auto border-t border-border pt-3 pb-4 px-4 bg-card z-10 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={dashboardTasksPage === 1 || isFetchingDashboardTasks}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground font-medium">
              Page {dashboardTasksPage} of {dashboardTasksTotalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!dashboardTasksHasMore || isFetchingDashboardTasks}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
