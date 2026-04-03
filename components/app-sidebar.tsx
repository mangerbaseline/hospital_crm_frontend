"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  Network,
  ShoppingCart,
  Users,
  Plus,
  LayoutDashboard,
  Kanban,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/store/features/auth/authSlice";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Pipeline",
      url: "/pipeline",
      icon: Kanban,
    },
    {
      title: "Hospitals",
      url: "/hospitals",
      icon: Building2,
    },
    {
      title: "IDNs",
      url: "/idns",
      icon: Network,
    },
    {
      title: "GPOs & VAs",
      url: "/gpos-vas",
      icon: ShoppingCart,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Users,
    },
    {
      title: "Add Hospital",
      url: "/hospitals/add",
      icon: Plus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/auth/sign-in");
  };

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="py-2">
            <Link href="/" className="flex items-center gap-1 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                <LayoutDashboard className="h-8 w-8 text-foreground" />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <span className="text-xl font-bold leading-none tracking-tight">
                  Hospital CRM
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {data.navMain.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.title === "Dashboard" && pathname === "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        h-9 w-full justify-start gap-4 rounded-lg px-3 text-base font-medium transition-colors
                        ${
                          isActive
                            ? "bg-[#050510]! text-white! hover:bg-[#050510]! hover:text-white!"
                            : "text-[#1e293b]! hover:bg-[#f1f5f9]! hover:text-[#1e293b]!"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-4">
                        <item.icon
                          className={`h-3 w-3 ${isActive ? "text-white" : "text-[#1e293b]"}`}
                        />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl bg-muted border border-border shadow-lg p-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">Quick Stats</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Hospitals:
              </span>
              <span className="text-sm font-semibold ">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Products:
              </span>
              <span className="text-sm font-semibold ">35</span>
            </div>
          </div>
        </div>

        <SidebarMenu className="px-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-9 w-full cursor-pointer justify-start gap-4 rounded-lg px-3 text-base font-medium transition-colors text-destructive hover:bg-destructive/10 hover:text-destructive!"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
