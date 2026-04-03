"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react";
import { UserRole } from "@/store/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UserTableProps } from "@/types";

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-red-100 text-red-700 border-red-200",
  [UserRole.EXECUTIVE]: "bg-purple-100 text-purple-700 border-purple-200",
  [UserRole.SALES]: "bg-blue-100 text-blue-700 border-blue-200",
  [UserRole.CUSTOMER_SUCCESS]: "bg-green-100 text-green-700 border-green-200",
};

export function UserTable({
  users,
  isLoading,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>User Details</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 ml-auto rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px] pl-6">#</TableHead>
            <TableHead>User Details</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground font-medium"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm hover:scale-105 transition-transform duration-200 cursor-default">
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground tracking-tight">
                      {user.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground group cursor-default">
                      <Mail className="h-3 w-3 opacity-70" />
                      <span className="group-hover:text-primary transition-colors">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${roleColors[user.role]} font-medium py-0.5 px-2.5 rounded-lg border shadow-sm`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-muted focus-visible:ring-0 cursor-pointer"
                      >
                        <MoreHorizontal className="h-4.5 w-4.5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[180px] animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                    >
                      <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onEdit(user._id)}
                        className="cursor-pointer gap-2 focus:bg-primary/5 focus:text-primary"
                      >
                        <Edit className="h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="opacity-50" />

                      <ConfirmDialog
                        title="Delete User"
                        description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
                        confirmText="Delete"
                        onConfirm={() => onDelete(user._id)}
                        variant="destructive"
                      >
                        <div
                          className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 text-destructive font-medium focus:bg-destructive/10 focus:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" /> Delete User
                        </div>
                      </ConfirmDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
