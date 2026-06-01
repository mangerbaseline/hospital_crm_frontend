import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HospitalCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-sm p-0 rounded-xl flex flex-col h-full">
      <CardHeader className="p-5 pb-3 shrink-0">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1 flex flex-col">
        {/* <Skeleton className="h-20 w-full rounded-xl mb-4" /> */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto shrink-0">
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
