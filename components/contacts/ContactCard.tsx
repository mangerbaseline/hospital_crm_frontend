import Link from "next/link";
import { Mail, Phone, Building2, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ContactCardProps } from "@/types";

export function ContactCard({ contact, className }: ContactCardProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`;

  const hospital =
    typeof contact.hospital === "object" ? contact.hospital : null;
  const hospitalName = hospital?.hospitalName || "Unknown Hospital";
  const hospitalId = hospital?._id || "#";
  const hospitalIdn = hospital?.idn?.name || "";

  return (
    <Link
      href={`/hospitals/${hospitalId}`}
      className={cn(
        "group block w-full bg-white border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col gap-5">
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
            </div>
          </div>
          {contact.isPrimary && (
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-0.5 rounded-full text-xs font-semibold shrink-0">
              Primary
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-3 text-foreground font-normal group/item hover:text-primary transition-colors min-w-0">
            <Mail className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0" />
            <span className="text-sm truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground font-normal group/item hover:text-primary transition-colors min-w-0">
            <Phone className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0" />
            <span className="text-sm truncate">{contact.phoneNumber}</span>
          </div>
        </div>

        <div className="h-px bg-border w-full" />

        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-1 p-1 rounded-md bg-muted/30 shrink-0">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="text-sm font-bold text-foreground leading-tight truncate">
              {hospitalName}
            </h4>
            {hospitalIdn && (
              <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
                {hospitalIdn}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
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
