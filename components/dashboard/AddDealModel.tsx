"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/lib/hooks";
import AddDealForm from "../AddDealForm";

export function AddDealModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] h-auto max-h-[75vh] overflow-y-auto p-6 flex flex-col gap-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold">
            Add New Hospital
          </DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            Add a new hospital to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border p-4">
          <Label className="text-xs font-semibold">Sales Rep</Label>
          <div className="mt-1 text-sm font-medium">{user?.name}</div>
        </div>
        <AddDealForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
