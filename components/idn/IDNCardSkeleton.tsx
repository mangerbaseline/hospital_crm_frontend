import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function IDNCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border shadow-sm p-0 rounded-xl">
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
      </CardHeader>

      <CardContent className="px-5">
        <div className="bg-muted border border-border rounded-xl p-4 flex flex-col items-center justify-center mb-4 mt-2">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 mt-4">
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
