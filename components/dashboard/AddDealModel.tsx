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
import AddDealForm from "../AddDealForm";

export function AddDealModal({
  children,
  onSuccess,
}: {
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25 md:max-w-125 h-auto max-h-[75vh] overflow-y-auto p-6 flex flex-col gap-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold">Add New Deal</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground">
            Add a new deal to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <AddDealForm onSuccess={() => { setOpen(false); onSuccess?.(); }} />
      </DialogContent>
    </Dialog>
  );
}
