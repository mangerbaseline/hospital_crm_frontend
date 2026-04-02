import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    href: "/pipeline?stage=demo",
  },
  {
    label: "CPA",
    amount: "$225",
    count: 1,
    colorClass: "bg-blue-800 hover:bg-blue-900",
    widthClass: "w-[90%] max-w-[750px]",
    href: "/pipeline?stage=cpa",
  },
  {
    label: "Committee",
    amount: "$89",
    count: 1,
    colorClass: "bg-blue-700 hover:bg-blue-800",
    widthClass: "w-[80%] max-w-[700px]",
    href: "/pipeline?stage=committee",
  },
  {
    label: "Trial",
    amount: "$330",
    count: 2,
    colorClass: "bg-blue-600 hover:bg-blue-700",
    widthClass: "w-[70%] max-w-[650px]",
    href: "/pipeline?stage=trial",
  },
  {
    label: "Pending Decision",
    amount: "$95",
    count: 1,
    colorClass: "bg-blue-500 hover:bg-blue-600",
    widthClass: "w-[60%] max-w-[600px]",
    href: "/pipeline?stage=pending_decision",
  },
  {
    label: "Closed Won",
    amount: "$0",
    count: 0,
    colorClass: "bg-blue-400 hover:bg-blue-500",
    widthClass: "w-[50%] max-w-[550px]",
    href: "/pipeline?stage=closed_won",
  },
  {
    label: "Implemented",
    amount: "$283",
    count: 1,
    colorClass: "bg-blue-300 hover:bg-blue-400",
    widthClass: "w-[40%] max-w-[500px]",
    href: "/pipeline?stage=implemented",
  },
];

export function SalesPipelineFunnel() {
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
        <div className="flex flex-col items-center gap-2 w-full max-w-[800px]">
          {stages.map((stage, index) => (
            <FunnelStage key={index} {...stage} />
          ))}
        </div>
        <p className="mt-8 text-[11px] font-medium text-muted-foreground">
          Click any stage to view hospitals in that stage
        </p>
      </CardContent>
    </Card>
  );
}
