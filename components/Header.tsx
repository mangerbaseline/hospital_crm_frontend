"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/hooks";

interface DashboardHeaderProps {
  title?: string;
  subTitle?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subTitle,
  children,
}: DashboardHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { isMobile } = useSidebar();

  const displayTitle =
    title ?? `${user?.name.split(" ")[0] || "User"}'s Dashboard`;

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-start gap-1">
          <div className="flex gap-4 items-center justify-center">
            {isMobile && <SidebarTrigger className="h-2 w-2" />}
            <h1 className="text-2xl md:text-3xl font-bold">{displayTitle}</h1>
          </div>
          {subTitle && (
            <p className="text-muted-foreground text-sm">{subTitle}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </header>
    </>
  );
}
