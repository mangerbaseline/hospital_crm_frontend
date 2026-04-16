"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotebookPen, Phone, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";

interface ActivityItemProps {
  type: "call" | "note" | "task";
  title: string;
  date: string;
  description: string;
  hospitalId?: string;
  user?: string | string[];
  isLast?: boolean;
}

function ActivityItem({
  type,
  title,
  date,
  description,
  hospitalId,
  user,
  isLast,
}: ActivityItemProps) {
  const Icon =
    type === "call" ? Phone : type === "task" ? CalendarCheck : NotebookPen;
  const iconBg =
    type === "call"
      ? "bg-green-50"
      : type === "task"
        ? "bg-purple-50"
        : "bg-blue-50";
  const iconColor =
    type === "call"
      ? "text-black fill-red-500"
      : type === "task"
        ? "text-purple-600"
        : "text-blue-600";

  const userArray = Array.isArray(user) ? user : user ? [user] : [];

  const content = (
    <div
      className={cn(
        "flex gap-2 sm:gap-4 rounded-xl mb-2 p-3 border border-border hover:bg-muted cursor-pointer transition-colors",
        !isLast && "mb-2",
      )}
    >
      <div
        className={cn(
          "h-7 w-7 shrink-0 rounded-full flex items-center justify-center border border-border",
          iconBg,
        )}
      >
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <h3 className="text-sm font-semibold truncate leading-none">
            {title}
          </h3>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap">
            {date}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-tight">
          {description}
        </p>
        {userArray.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {userArray.map((userName, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-muted border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {userName.startsWith("@") ? userName : `@${userName}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (hospitalId) {
    return <Link href={`/hospitals/${hospitalId}`}>{content}</Link>;
  }

  return content;
}

function ActivitySkeleton() {
  return (
    <div className="flex gap-2 sm:gap-4 rounded-xl mb-2 p-3 border border-border">
      <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function RecentActivity() {
  const { dashboardStats, isFetchingDashboardStats } = useAppSelector(
    (state) => state.dashboard,
  );

  const activities = dashboardStats?.recentActivity || [];

  const mapActivityToRepo = (activity: any): ActivityItemProps => {
    let type: ActivityItemProps["type"] = "note";
    let title = "";
    let description = "";
    let user: string[] | undefined = undefined;

    const data = activity.data || {};
    const hospitalId =
      typeof data.hospital === "string" ? data.hospital : data.hospital?._id;
    const hospitalName = data.hospital?.hospitalName
      ? ` - ${data.hospital.hospitalName}`
      : "";

    if (activity.type === "callLog") {
      type = "call";
      title = `Call logged${hospitalName}`;
      description = data.notes || "";
      if (data.contact?.firstName) {
        user = [
          data.contact.firstName +
            (data.contact.lastName ? ` ${data.contact.lastName}` : ""),
        ];
      }
    } else if (activity.type === "note") {
      type = "note";
      title = `Note added${hospitalName}`;
      description = data.notes || "";
    } else if (activity.type === "task") {
      type = "task";
      title = `Task: ${data.title || "Unknown"}`;
      description =
        data.description ||
        (data.dueDate ? `Due: ${format(new Date(data.dueDate), "MMM d")}` : "");
    }

    return {
      type,
      title,
      date: format(new Date(activity.createdAt), "MMM d, h:mm a"),
      description,
      hospitalId,
      user,
      isLast: false,
    };
  };

  return (
    <Card className="flex py-0 flex-col h-full shadow-sm shadow-black/5 border-border rounded-xl transition-all hover:shadow-md w-full min-w-0 max-h-[400px] overflow-hidden">
      <CardHeader className="pb-2 pt-5 px-4 sm:px-6">
        <CardTitle className="text-[16px] font-medium tracking-tight truncate">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 w-full overflow-hidden">
        <ScrollArea className="h-full w-full max-w-full">
          <div className="flex flex-col px-2 md:px-4 pb-4">
            {isFetchingDashboardStats ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <ActivitySkeleton key={idx} />
              ))
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No recent activity found.</p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const props = mapActivityToRepo(activity);
                return (
                  <ActivityItem
                    key={activity.data?._id || index}
                    {...props}
                    isLast={index === activities.length - 1}
                  />
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
