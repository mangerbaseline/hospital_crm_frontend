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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { HospitalWithDeals } from "@/store/types";
import { useRouter } from "next/navigation";

interface HospitalTableProps {
  hospitals: HospitalWithDeals[];
  isLoading: boolean;
}

export function HospitalTable({ hospitals, isLoading }: HospitalTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">#</TableHead>
              <TableHead>Hospital Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>IDN</TableHead>
              <TableHead>Expected ARR</TableHead>
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
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-30" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
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
            <TableHead>Hospital Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>IDN</TableHead>
            <TableHead>Expected ARR</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground font-medium"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Building2 className="h-8 w-8 opacity-20" />
                  <span>No Hospitals found.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            hospitals.map((hospital) => {
              const totalArr =
                hospital.deals?.reduce((acc, deal) => {
                  return (
                    acc +
                    (deal.products?.reduce(
                      (dAcc, p) => dAcc + (p.dealAmount || 0),
                      0,
                    ) || 0)
                  );
                }, 0) || 0;

              return (
                <TableRow
                  key={hospital._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <Avatar className="h-10 w-10 rounded-lg border-2 border-background shadow-sm hover:scale-105 transition-transform duration-200 cursor-default">
                      <AvatarFallback className="bg-primary/5 text-primary rounded-lg font-bold">
                        {hospital?.hospitalName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground tracking-tight line-clamp-1">
                      {hospital?.hospitalName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {hospital.city || hospital.state
                        ? `${hospital.city || ""}${
                            hospital.city && hospital.state ? ", " : ""
                          }${hospital.state || ""}`
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {hospital.idn?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-emerald-600 font-bold">
                      ${totalArr.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-muted cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-45">
                        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/hospitals/${hospital._id}`)
                          }
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
