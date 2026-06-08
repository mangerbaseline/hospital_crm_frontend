import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { useAppSelector } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";

interface FunnelStageProps {
  label: string;
  amount: string;
  count: number;
  colorClass: string;
  widthClass: string;
  href: string;
}

function FunnelStage({
  label,
  amount,
  count,
  colorClass,
  widthClass,
  href,
}: FunnelStageProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center w-full group cursor-pointer transition-transform hover:scale-[1.02]"
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center py-3 rounded-xl text-white shadow-sm transition-all group-hover:shadow-md",
          colorClass,
          widthClass,
        )}
      >
        <span className="text-[11px] font-semibold opacity-90 uppercase tracking-wider mb-0.5">
          {label}
        </span>
        <span className="text-lg font-bold leading-none">{amount}</span>
        <span className="text-[10px] opacity-80 font-medium mt-1">
          {count} {count === 1 ? "hospital" : "hospitals"}
        </span>
      </div>
    </Link>
  );
}

const stages: FunnelStageProps[] = [
  {
    label: "Demo",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-900 hover:bg-blue-950",
    widthClass: "w-full max-w-[800px]",
    href: "/deals?dealStage=Demo",
  },
  {
    label: "CPA",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-800 hover:bg-blue-900",
    widthClass: "w-[90%] max-w-[750px]",
    href: "/deals?dealStage=CPA",
  },
  {
    label: "Committee",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-700 hover:bg-blue-800",
    widthClass: "w-[80%] max-w-[700px]",
    href: "/deals?dealStage=Committee",
  },
  {
    label: "Trial",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-600 hover:bg-blue-700",
    widthClass: "w-[70%] max-w-[650px]",
    href: "/deals?dealStage=Trial",
  },
  {
    label: "Pending Decision",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-500 hover:bg-blue-600",
    widthClass: "w-[60%] max-w-[600px]",
    href: "/deals?dealStage=Pending%20Decision",
  },
  {
    label: "Closed Won",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-400 hover:bg-blue-500",
    widthClass: "w-[50%] max-w-[550px]",
    href: "/deals?dealStage=Closed%20Won",
  },
  {
    label: "Closed Lost",
    amount: "$0",
    count: 0,
    colorClass: "bg-[#7cb9fc] hover:bg-[#60a5fa]",
    widthClass: "w-[45%] max-w-[525px]",
    href: "/deals?dealStage=Closed%20Lost",
  },
  {
    label: "Implemented",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-300 hover:bg-blue-400",
    widthClass: "w-[40%] max-w-[500px]",
    href: "/deals?dealStage=Implemented",
  },
  {
    label: "No Longer Buying",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-300 hover:bg-blue-400",
    widthClass: "w-[35%] max-w-[450px]",
    href: "/deals?dealStage=No%20Longer%20Buying",
  },
];

export function SalesPipelineFunnel() {
  const { dashboardStats, isFetchingDashboardStats } = useAppSelector(
    (state) => state.dashboard,
  );

  const mergedStages = stages.map((defaultStage) => {
    const statMatch = dashboardStats?.pipeline?.find(
      (p) => p.stage.toLowerCase() === defaultStage.label.toLowerCase(),
    );
    return {
      ...defaultStage,
      amount: statMatch ? `$${statMatch.amount.toLocaleString()}` : "$0",
      count: statMatch ? statMatch.hospitalCount : 0,
    };
  });

  return (
    <Card className="shadow-sm shadow-black/5 border-border rounded-xl transition-all hover:shadow-md mt-8 py-0">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-6 pt-5 px-4 sm:px-6">
        <CardTitle className="text-[16px] font-semibold tracking-tight border-none">
          Sales Pipeline Funnel
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 rounded-lg text-xs border-border hover:bg-muted font-bold transition-colors"
        >
          <Link href="/pipeline">View Pipeline</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-8 pt-0 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 w-full max-w-200">
          {isFetchingDashboardStats
            ? Array.from({ length: 9 }).map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="h-15 rounded-xl mb-1 mt-1"
                  style={{ width: `${100 - idx * 8}%` }}
                />
              ))
            : mergedStages.map((stage, index) => (
                <FunnelStage key={index} {...stage} />
              ))}
        </div>
        <p className="mt-8 text-[11px] font-medium text-muted-foreground">
          Click any stage to view deals in that stage
        </p>
      </CardContent>
    </Card>
  );
}
