"use client";

import {
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Contact } from "@/store/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch } from "@/lib/hooks";
import {
  deleteContact,
  getSingleContact,
} from "@/store/features/contact/contactSlice";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditContactModal } from "./EditContactModal";

interface ContactDetailsModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function ContactDetailsModal({
  contact,
  isOpen,
  onClose,
  isLoading = false,
}: ContactDetailsModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fullName = contact ? (contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName) : "";

  const handleHospitalNavigate = (hospitalId: string) => {
    onClose();
    router.push(`/hospitals/${hospitalId}`);
  };

  const handleDeleteConfirm = async () => {
    if (!contact) return;
    try {
      await dispatch(deleteContact(contact._id)).unwrap();
      toast.success("Contact deleted successfully");
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to delete contact");
    }
  };

  const handleEditSuccess = () => {
    if (contact) {
      dispatch(getSingleContact(contact._id));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-6 py-6 px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      );
    }

    if (!contact) return null;

    const fullName = contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName;
    const hospital =
      typeof contact.hospital === "object" ? contact.hospital : null;
    const hospitalName = hospital?.hospitalName || "Unknown Hospital";
    const hospitalId = hospital?._id;
    const hospitalIdn = hospital?.idn?.name?.trim() || "No IDN";
    const hospitalGpo =
      typeof hospital?.gpo === "object" ? hospital?.gpo?.name : "No GPO";

    return (
      <ScrollArea className="flex-1 overflow-y-auto px-6 py-5">
        <div className="py-5 border-b border-border/60 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Contact Channels
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-border/80 hover:border-primary/20 hover:shadow-sm transition-all group/item">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-slate-100 group-hover/item:text-primary transition-all">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground font-medium">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {contact.email}
                </span>
              </div>
            </div>

            {contact.phoneNumber && (
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-border/80 hover:border-primary/20 hover:shadow-sm transition-all group/item">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover/item:bg-slate-100 group-hover/item:text-primary transition-all">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Phone Number
                  </span>
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {contact.phoneNumber}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {hospitalId && (
          <div className="py-5 border-b border-border/60 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Associated Hospital
            </h4>
            <div
              onClick={() => handleHospitalNavigate(hospitalId)}
              className="flex items-start gap-4 p-4.5 rounded-xl bg-white border border-border/85 hover:border-emerald-200 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 shrink-0 transition-colors mt-0.5">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-md font-bold text-foreground truncate group-hover:text-emerald-700 transition-colors leading-tight">
                  {hospitalName}
                </h5>
                <p className="text-xs text-muted-foreground mt-1">
                  IDN:{" "}
                  <span className="font-semibold text-slate-700">
                    {hospitalIdn}
                  </span>
                </p>
                {hospitalGpo && hospitalGpo !== "No GPO" && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    GPO:{" "}
                    <span className="font-semibold text-slate-700">
                      {hospitalGpo}
                    </span>
                  </p>
                )}
                <span className="text-[10px] text-emerald-600 font-bold block mt-3 group-hover:underline">
                  Visit Hospital Dashboard →
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="py-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Assigned Products
          </h4>
          {contact.product && contact.product.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 pb-4">
              {contact.product.map((prod, idx) => (
                <div
                  key={prod._id || idx}
                  className="flex items-center gap-3 p-3 bg-white border border-border/60 rounded-xl shadow-xs"
                >
                  <div className="p-1.5 rounded-md bg-slate-50 text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 leading-tight">
                      {prod?.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed rounded-xl bg-slate-50/50">
              <p className="text-xs text-muted-foreground">
                No product interest mapped to this node.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-137.5 h-full sm:h-auto sm:max-h-[85vh] flex flex-col p-0 overflow-hidden bg-slate-50 gap-0 border border-border rounded-2xl shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center px-6 py-6 border-b border-border/60 bg-white shrink-0">
          {isLoading || !contact ? (
            <div className="flex flex-col items-center gap-2">
              <DialogTitle className="sr-only">
                Loading Contact Dossier
              </DialogTitle>
              <DialogDescription className="sr-only">
                Please wait while the contact profile is being loaded.
              </DialogDescription>
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full">
              <DialogTitle className="text-xl font-extrabold text-foreground leading-snug flex items-center justify-center gap-2 w-full">
                {fullName}
                {contact.isPrimary && (
                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200/60 rounded-full font-semibold text-[10px] px-2 py-0.5 shadow-sm">
                    <ShieldCheck className="h-3 w-3 mr-1 inline-block shrink-0" />
                    Primary Node
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 font-medium mt-1">
                {contact.designation}
              </DialogDescription>
            </div>
          )}
        </DialogHeader>

        {renderContent()}

        <div className="px-6 py-3.5 border-t border-border/60 bg-white flex justify-between items-center shrink-0">
          {contact ? (
            <div className="flex gap-2">
              <ConfirmDialog
                title="Delete Contact"
                description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
              >
                <Button
                  variant="destructive"
                  className="bg-red-50 hover:bg-red-100/90 text-red-600 border border-red-200 h-9 text-xs px-4 rounded-lg shadow-sm font-semibold cursor-pointer transition-all"
                >
                  Delete
                </Button>
              </ConfirmDialog>

              <EditContactModal contact={contact} onSuccess={handleEditSuccess}>
                <Button
                  variant="outline"
                  className="border-border hover:bg-slate-50 text-slate-700 h-9 text-xs px-4 rounded-lg shadow-sm font-semibold cursor-pointer transition-all"
                >
                  Edit
                </Button>
              </EditContactModal>
            </div>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={onClose}
            className="bg-[#09090b] text-white hover:bg-[#27272a] h-9 text-xs px-5 rounded-lg shadow-sm font-semibold cursor-pointer transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
