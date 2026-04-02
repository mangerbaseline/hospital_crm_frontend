import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function UpcomingTasks() {
  return (
    <Card className="flex py-0 flex-col h-full shadow-sm shadow-black/5 border-border rounded-xl transition-all hover:shadow-md w-full min-w-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2 pb-4 pt-5 px-4 sm:px-6 space-y-0">
        <Clock className="h-5 w-5 shrink-0" />
        <CardTitle className="text-[16px] font-medium tracking-tight truncate">
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 min-h-[200px] w-full min-w-0">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
          No upcoming tasks in the next 7 days
        </p>
      </CardContent>
    </Card>
  );
}
