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
import { MoreHorizontal, Edit, Trash2, Network } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { IDNTableProps } from "@/types";

export function IDNTable({ idns, isLoading, onEdit, onDelete }: IDNTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">#</TableHead>
              <TableHead>IDN Name</TableHead>
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
                  <Skeleton className="h-4 w-50" />
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
            <TableHead className="w-20 pl-6">#</TableHead>
            <TableHead>IDN Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {idns.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-32 text-center text-muted-foreground font-medium"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Network className="h-8 w-8 opacity-20" />
                  <span>No IDNs found.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            idns.map((idn) => (
              <TableRow
                key={idn._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <Avatar className="h-10 w-10 rounded-lg border-2 border-background shadow-sm hover:scale-105 transition-transform duration-200 cursor-default">
                    <AvatarFallback className="bg-primary/5 text-primary rounded-lg font-bold">
                      {idn.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <span
                    className="font-semibold text-foreground tracking-tight"
                    title={idn.name}
                  >
                    {idn.name.length > 40
                      ? `${idn.name.slice(0, 40)}...`
                      : idn.name}
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
                      className="w-45 animate-in fade-in-0 zoom-in-95"
                    >
                      <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onEdit(idn._id)}
                        className="cursor-pointer gap-2 focus:bg-primary/5 focus:text-primary"
                      >
                        <Edit className="h-4 w-4" /> Edit IDN
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="opacity-50" />

                      <ConfirmDialog
                        title="Delete IDN"
                        description={`Are you sure you want to delete ${idn.name}? This action cannot be undone.`}
                        confirmText="Delete"
                        onConfirm={() => onDelete(idn._id)}
                        variant="destructive"
                      >
                        <div
                          className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 text-destructive font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" /> Delete IDN
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
