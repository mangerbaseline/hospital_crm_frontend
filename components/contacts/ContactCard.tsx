import Link from "next/link";
import {
  Mail,
  Phone,
  Building2,
  Users,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ContactCardProps } from "@/types";
import { useAppDispatch } from "@/lib/hooks";
import { deleteContact } from "@/store/features/contact/contactSlice";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditContactModal } from "./EditContactModal";

export function ContactCard({
  contact,
  className,
  onViewClick,
}: ContactCardProps) {
  const dispatch = useAppDispatch();
  const fullName = `${contact.firstName} ${contact.lastName}`;

  const hospital =
    typeof contact.hospital === "object" ? contact.hospital : null;
  const hospitalName = hospital?.hospitalName || "Unknown Hospital";
  const hospitalId = hospital?._id || "#";
  const hospitalIdn = hospital?.idn?.name?.trim() || "No IDN";

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteContact(contact._id)).unwrap();
      toast.success("Contact deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete contact");
    }
  };

  return (
    <div
      className={cn(
        "group flex flex-col w-full bg-white border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden relative",
        className,
      )}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewClick?.(contact);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 bg-white border border-border/40 shadow-sm transition-all cursor-pointer"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>

        <EditContactModal contact={contact as any}>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 bg-white border border-border/40 shadow-sm transition-all cursor-pointer"
            title="Edit Contact"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </EditContactModal>

        <ConfirmDialog
          title="Delete Contact"
          description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 bg-white border border-border/40 shadow-sm transition-all cursor-pointer"
            title="Delete Contact"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </ConfirmDialog>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        <div className="flex items-start justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Avatar className="h-12 w-12 bg-muted border-none shrink-0">
              <AvatarFallback className="bg-transparent">
                <Users className="h-6 w-6 text-black/80" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-md font-bold text-foreground leading-tight truncate">
                {fullName}
              </h3>
              <p className="text-sm text-muted-foreground font-medium truncate">
                {contact.designation}
              </p>
              {contact.product && contact.product.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {contact.product.map((prod) => (
                    <Badge key={prod._id} className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-none">
                      {prod.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {contact.isPrimary && (
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-0.5 rounded-full text-xs font-semibold shrink-0 mr-26.25">
              Primary
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-3 text-foreground font-normal group/item hover:text-primary transition-colors min-w-0">
            <Mail className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0" />
            <span className="text-sm truncate">{contact.email}</span>
          </div>
          {contact.phoneNumber && (
            <div className="flex items-center gap-3 text-foreground font-normal group/item hover:text-primary transition-colors min-w-0 ">
              <Phone className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0" />
              <span className="text-sm truncate">{contact.phoneNumber}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-border w-full mt-auto" />

        <Link
          href={`/hospitals/${hospitalId}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-start gap-3 min-w-0 hover:bg-muted/40 p-2 -mx-2 rounded-xl transition-all group/hosp"
        >
          <div className="mt-1 p-1 rounded-md bg-muted/30 group-hover/hosp:bg-muted/65 shrink-0 transition-all">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="text-sm font-bold text-foreground leading-tight truncate group-hover/hosp:text-primary transition-all">
              {hospitalName}
            </h4>
            <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
              {hospitalIdn}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function ContactCardSkeleton() {
  return (
    <div className="w-full bg-white border border-border rounded-2xl p-6 ring-offset-background">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <div className="h-px bg-border w-full" />

        <div className="flex items-start gap-3">
          <Skeleton className="mt-1 h-6 w-6 rounded-md" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
