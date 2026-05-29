import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HospitalDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white">
        <div className="flex justify-end w-full">
          <Skeleton className="h-8 w-27.5 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 w-full">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 w-full">
            <Skeleton className="h-3 w-36 mb-3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "bg-muted border-border",
            "bg-orange-50/30 border-orange-100",
            "bg-blue-50/30 border-blue-100",
            "bg-emerald-50/30 border-emerald-100",
          ].map((cls, i) => (
            <div
              key={i}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${cls} border rounded-xl p-4`}
            >
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 border border-border rounded-xl p-5"
            >
              <Skeleton className="h-9 w-9 rounded-lg shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-2.5 w-20 mb-1" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border/50 rounded-xl p-4 flex items-center gap-4 mt-2">
          <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white mt-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border border-border rounded-xl p-4 flex flex-col gap-3"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 border border-border/50 rounded-xl p-4"
              >
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white">
          <Skeleton className="h-5 w-36" />
          <div className="flex flex-col gap-3 mt-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-border/50 rounded-xl p-4"
              >
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div />
        <Card className="flex flex-col gap-4 p-6 shadow-md border border-border rounded-xl bg-white">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-border/50 rounded-xl p-4"
              >
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
