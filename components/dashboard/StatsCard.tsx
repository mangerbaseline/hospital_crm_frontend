import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface StatsCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  subtitle: React.ReactNode;
  buttonText: string;
  href?: string;
  iconClassName?: string;
  trigger?: React.ReactNode;
}

export function StatsCard({
  title,
  icon: Icon,
  value,
  subtitle,
  buttonText,
  href,
  iconClassName,
  trigger,
}: StatsCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-sm shadow-black/5 border-border rounded-[16px] transition-all hover:shadow-md py-0">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-6 space-y-0">
        <CardTitle className="text-[15px] font-semibold tracking-tight">
          {title}
        </CardTitle>
        <div className="flex h-5 w-5 items-center justify-center">
          <Icon
            strokeWidth={2}
            className={cn("h-4 w-4 text-muted-foreground", iconClassName)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 px-6">
        <div className="text-2xl leading-[1.2] font-bold tracking-tight">
          {value}
        </div>
        <div className="text-xs mt-0.5 text-muted-foreground">{subtitle}</div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 border-none bg-transparent">
        {trigger ? (
          trigger
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full h-9 rounded-lg border-border font-medium hover:bg-muted cursor-pointer transition-colors"
          >
            <Link href={href || "/"}>{buttonText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
