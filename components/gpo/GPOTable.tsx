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
import { MoreHorizontal, Edit, Trash2, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { GPOTableProps } from "@/types";

export function GPOTable({ gpos, isLoading, onEdit, onDelete }: GPOTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>GPO Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
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
    <div className="rounded-md border overflow-hidden shadow-sm bg-white">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px] pl-6">#</TableHead>
            <TableHead>GPO Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gpos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-32 text-center text-muted-foreground font-medium"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <ShoppingCart className="h-8 w-8 opacity-20" />
                  <span>No GPOs found.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            gpos.map((gpo) => (
              <TableRow
                key={gpo._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <Avatar className="h-10 w-10 rounded-lg border-2 border-background shadow-sm hover:scale-105 transition-transform duration-200 cursor-default">
                    <AvatarFallback className="bg-primary/5 text-primary rounded-lg font-bold">
                      {gpo.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-foreground tracking-tight">
                    {gpo.name}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-muted focus-visible:ring-0 cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[180px] animate-in fade-in-0 zoom-in-95"
                    >
                      <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onEdit(gpo._id)}
                        className="cursor-pointer gap-2 focus:bg-primary/5 focus:text-primary"
                      >
                        <Edit className="h-4 w-4" /> Edit GPO
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="opacity-50" />

                      <ConfirmDialog
                        title="Delete GPO"
                        description={`Are you sure you want to delete ${gpo.name}? This action cannot be undone.`}
                        confirmText="Delete"
                        onConfirm={() => onDelete(gpo._id)}
                        variant="destructive"
                      >
                        <div
                          className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 text-destructive font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" /> Delete GPO
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
