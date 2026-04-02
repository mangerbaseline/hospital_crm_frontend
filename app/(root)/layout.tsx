import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="h-svh! max-h-svh! overflow-hidden">
      <AppSidebar />
      <SidebarInset className="h-svh! max-h-svh! overflow-hidden">
        <div className="flex flex-col h-full min-h-0 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
