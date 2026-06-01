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
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  Network,
  ShoppingCart,
  Users,
  LayoutDashboard,
  Kanban,
  LogOut,
  Package,
  Handshake,
  Briefcase,
} from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutUser } from "@/store/features/auth/authSlice";
import { fetchHospitalProductCount } from "@/store/features/deal/dealSlice";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      title: "Deals",
      url: "/deals",
      icon: Briefcase,
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
      title: "GPOs & Gov",
      url: "/gpos-gov",
      icon: ShoppingCart,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Users,
    },
    {
      title: "Add Deal",
      url: "/hospitals/add-deal",
      icon: Handshake,
    },
  ],
  navAdmin: [
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Package,
    },
  ],
  create: [
    {
      title: "Create GPOs",
      url: "/admin/create-gpos",
      icon: ShoppingCart,
    },
    {
      title: "Create IDNs",
      url: "/admin/create-idns",
      icon: Network,
    },
    {
      title: "Add Hospital",
      url: "/hospitals/add",
      icon: Building2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { setOpenMobile } = useSidebar();

  const { quickStats } = useAppSelector((state) => state.deal);

  useEffect(() => {
    if (user) {
      dispatch(fetchHospitalProductCount());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth/sign-in");
  };

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="py-2">
            <Link
              href="/"
              className="flex items-center gap-1 px-2"
              onClick={() => setOpenMobile(false)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                <LayoutDashboard className="h-8 w-8 text-foreground" />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <span className="text-xl font-bold leading-none tracking-tight">
                  RF Health CRM
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
                      <Link
                        href={item.url}
                        className="flex items-center gap-4"
                        onClick={() => setOpenMobile(false)}
                      >
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

        {(user?.role === "Admin" || user?.role === "Customer Success") && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Create</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {data.create.map((item) => {
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
                          <Link
                            href={item.url}
                            className="flex items-center gap-4"
                            onClick={() => setOpenMobile(false)}
                          >
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

            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {data.navAdmin.map((item) => {
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
                          <Link
                            href={item.url}
                            className="flex items-center gap-4"
                            onClick={() => setOpenMobile(false)}
                          >
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
          </>
        )}
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
              <span className="text-sm font-semibold ">
                {quickStats?.hospitalCount ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Deals:
              </span>
              <span className="text-sm font-semibold ">
                {quickStats?.productCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        <SidebarMenu className="px-0">
          <SidebarMenuItem>
            <ConfirmDialog
              title="Confirm Logout"
              description="Are you sure you want to log out of your account? Any unsaved changes may be lost."
              onConfirm={handleLogout}
              confirmText="Logout"
            >
              <SidebarMenuButton className="h-12 w-full cursor-pointer justify-between rounded-xl px-3 bg-muted border border-border drop-shadow-lg transition-all hover:bg-muted/80 group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold truncate w-32 text-left">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-32 text-left">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </div>
                <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </SidebarMenuButton>
            </ConfirmDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
