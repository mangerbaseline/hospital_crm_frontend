"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Building2,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "@/store/types";
import { useAppDispatch } from "@/lib/hooks";
import { deleteContact } from "@/store/features/contact/contactSlice";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditContactModal } from "./EditContactModal";

interface ContactTableProps {
  contacts: Contact[];
  onViewClick?: (contact: Contact) => void;
  onContactUpdated?: () => void;
}

type SortKey = "name" | "designation" | "hospital" | "email";

export function ContactTable({
  contacts,
  onViewClick,
  onContactUpdated,
}: ContactTableProps) {
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleDeleteConfirm = async (id: string) => {
    try {
      await dispatch(deleteContact(id)).unwrap();
      toast.success("Contact deleted successfully");
      if (onContactUpdated) onContactUpdated();
    } catch (error: any) {
      toast.error(error || "Failed to delete contact");
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    let aVal = "";
    let bVal = "";

    if (sortBy === "name") {
      aVal = `${a.firstName} ${a.lastName || ""}`.toLowerCase();
      bVal = `${b.firstName} ${b.lastName || ""}`.toLowerCase();
    } else if (sortBy === "designation") {
      aVal = (a.designation || "").toLowerCase();
      bVal = (b.designation || "").toLowerCase();
    } else if (sortBy === "hospital") {
      aVal = (typeof a.hospital === "object" ? a.hospital?.hospitalName : "").toLowerCase();
      bVal = (typeof b.hospital === "object" ? b.hospital?.hospitalName : "").toLowerCase();
    } else if (sortBy === "email") {
      aVal = (a.email || "").toLowerCase();
      bVal = (b.email || "").toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 shrink-0" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-primary shrink-0" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary shrink-0" />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm mt-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-foreground">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th
                scope="col"
                className="py-3.5 px-5 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-5 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("designation")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Title</span>
                  <SortIcon columnKey="designation" />
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-5 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("hospital")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Hospital</span>
                  <SortIcon columnKey="hospital" />
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-5 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Email Address</span>
                  <SortIcon columnKey="email" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-5 whitespace-nowrap">
                Phone Numbers
              </th>
              <th
                scope="col"
                className="py-3.5 px-5 w-28 text-right whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium text-xs">
            {sortedContacts.map((contact) => {
              const fullName = contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName;
              const hospital = typeof contact.hospital === "object" ? contact.hospital : null;
              const hospitalName = hospital?.hospitalName || "Unknown Hospital";

              return (
                <tr
                  key={contact._id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Name with Avatar */}
                  <td className="py-3 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-muted shrink-0 border-none">
                        <AvatarFallback className="bg-transparent">
                          <Users className="h-4 w-4 text-black/85" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {fullName}
                        </span>
                        {contact.product && contact.product.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contact.product.map((prod) => (
                              <span key={prod._id} className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0 rounded-full text-[9px] font-bold leading-normal">
                                {prod.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Title / Designation */}
                  <td className="py-3 px-5 whitespace-nowrap text-muted-foreground font-semibold">
                    {contact.designation || "—"}
                  </td>

                  {/* Hospital */}
                  <td className="py-3 px-5 min-w-[160px]">
                    {hospital ? (
                      <Link
                        href={`/hospitals/${hospital._id}`}
                        className="inline-flex items-center gap-1.5 font-bold text-foreground hover:text-primary transition-colors"
                      >
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {hospitalName}
                        </span>
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-5 whitespace-nowrap">
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-semibold"
                    >
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{contact.email}</span>
                    </a>
                  </td>

                  {/* Phone Numbers stacked */}
                  <td className="py-3 px-5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {contact.phoneNumber && (
                        <a
                          href={`tel:${contact.phoneNumber}`}
                          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-semibold"
                        >
                          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>{contact.phoneNumber}</span>
                        </a>
                      )}
                      {contact.secondaryPhoneNumber && (
                        <a
                          href={`tel:${contact.secondaryPhoneNumber}`}
                          className="inline-flex items-center gap-1.5 text-muted-foreground/60 hover:text-primary transition-colors font-medium text-[11px]"
                        >
                          <Phone className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                          <span>{contact.secondaryPhoneNumber} (Sec)</span>
                        </a>
                      )}
                      {!contact.phoneNumber && !contact.secondaryPhoneNumber && "—"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewClick?.(contact)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 bg-white border border-border/40 shadow-sm transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <EditContactModal contact={contact}>
                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 bg-white border border-border/40 shadow-sm transition-all cursor-pointer"
                          title="Edit Contact"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </EditContactModal>

                      <ConfirmDialog
                        title="Delete Contact"
                        description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
                        onConfirm={() => handleDeleteConfirm(contact._id)}
                      >
                        <button
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 bg-white border border-border/40 shadow-sm transition-all cursor-pointer"
                          title="Delete Contact"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </ConfirmDialog>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
