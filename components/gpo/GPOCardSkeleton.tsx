import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GPOCardSkeleton() {
  return (
    <Card className="p-6 border-border shadow-sm bg-white flex flex-col gap-6 rounded-xl">
      <div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-6 flex flex-col items-center justify-center gap-1.5 h-[112px]">
        <Skeleton className="h-8 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </Card>
  );
}
