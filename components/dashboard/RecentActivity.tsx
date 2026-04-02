import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotebookPen, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  type: "call" | "note";
  title: string;
  date: string;
  description: string;
  user?: string | string[];
  isLast?: boolean;
}

function ActivityItem({
  type,
  title,
  date,
  description,
  user,
  isLast,
}: ActivityItemProps) {
  const Icon = type === "call" ? Phone : NotebookPen;
  const iconBg = type === "call" ? "bg-green-50" : "bg-blue-50";
  const iconColor =
    type === "call" ? "text-foreground fill-destructive" : "text-blue-600";

  const userArray = Array.isArray(user) ? user : user ? [user] : [];

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-4 rounded-xl mb-2 p-2 border border-border hover:bg-muted cursor-pointer transition-colors",
        !isLast && "mb-2",
      )}
    >
      <div
        className={cn(
          "h-6 w-6 sm:h-10 sm:w-10 shrink-0 rounded-full flex items-center justify-center",
          iconBg,
        )}
      >
        <Icon className={cn("h-3 w-3 sm:h-4 sm:w-4", iconColor)} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <h3 className="text-sm font-semibold truncate w-full max-w-[250px] sm:max-w-[150px] xl:max-w-[300px] leading-none">
            {title}
          </h3>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
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
                className="inline-flex items-center rounded-full bg-muted border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {userName}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const activities: ActivityItemProps[] = [
  {
    type: "call",
    title: "Call logged - AdventHealth Orlando",
    date: "Feb 4, 1:30 PM",
    description:
      "Great update call with Linda. HeelPOD is moving to final approval stage. Should have decision by end of month. MA...",
    user: ["@Jason Bobay"],
  },
  {
    type: "note",
    title: "Note added - North Shore University Hospital",
    date: "Feb 4, 8:00 AM",
    description:
      "New contact made through referral from NYU Langone. Gregory is interested in both ELEVATE and MAC System for...",
  },
  {
    type: "call",
    title: "Call logged - VA Palo Alto Health Care System",
    date: "Feb 3, 2:00 PM",
    description:
      "Great progress call with Colonel Chang. GSA negotiations are entering the final stage. We expects to have the...",
  },
  {
    type: "call",
    title: "Call logged - NYU Langone Tisch Hospital",
    date: "Feb 3, 9:00 AM",
    description:
      "Excellent post-implementation call with Dr. Patel. Both products performing exceptionally well ....",
    user: ["@Jason Bobay", "@Katie Zerbe"],
  },
  {
    type: "call",
    title: "North Shore University Hospital",
    date: "Feb 2, 3:30 PM",
    description:
      "Brief intro call with Gregory. He's exploring options for wound care solutions. Interested in ...",
    user: ["@Katie Zerbe"],
  },
];

export function RecentActivity() {
  return (
    <Card className="flex py-0 flex-col h-full shadow-sm shadow-black/5 border-border rounded-xl transition-all hover:shadow-md w-full min-w-0 overflow-hidden">
      <CardHeader className="pb-2 pt-5 px-4 sm:px-6">
        <CardTitle className="text-[16px] font-medium tracking-tight truncate">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 w-full overflow-hidden">
        <ScrollArea className="h-[300px] w-full max-w-full">
          <div className="flex flex-col px-2 md:px-4">
            {activities.map((activity, index) => (
              <ActivityItem
                key={index}
                {...activity}
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
