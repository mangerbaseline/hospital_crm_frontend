import { Card, CardContent } from "@/components/ui/card";

interface PipelineStatsCardProps {
  value: string | number;
  label: string;
}

export function PipelineStatsCard({ value, label }: PipelineStatsCardProps) {
  return (
    <Card className="shadow-sm shadow-black/5 border-border rounded-xl transition-all hover:shadow-md py-0">
      <CardContent className="flex flex-col items-center justify-center p-5 md:p-6 text-center h-full">
        <div className="text-lg md:text-xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        <div className="text-[11px] md:text-xs mt-1 text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
