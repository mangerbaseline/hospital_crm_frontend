"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

export function DealCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-sm p-0 rounded-xl animate-pulse">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 bg-muted rounded-lg" />
          <div className="flex flex-col flex-1 gap-2">
            <div className="h-5 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4">
        <div className="h-24 w-full bg-muted/50 rounded-xl mb-4" />
        <div className="h-24 w-full bg-muted rounded-xl" />
      </CardContent>

      <CardFooter className="px-5 py-4 bg-muted/30 border-t border-border mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-muted" />
            <div className="flex flex-col gap-1">
              <div className="h-2 w-10 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          </div>
          <div className="h-3 w-12 bg-muted rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}
