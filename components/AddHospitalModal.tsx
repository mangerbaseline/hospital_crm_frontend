"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks";
import AddHospitalForm from "@/components/AddHospitalForm";

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddHospitalModal({
  isOpen,
  onClose,
  onSuccess,
}: AddHospitalModalProps) {
  const { isCreateHospitalLoading } = useAppSelector((state) => state.hospital);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={isCreateHospitalLoading ? undefined : onClose}
    >
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto p-0 shadow-none">
        <AddHospitalForm onSuccess={onSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
