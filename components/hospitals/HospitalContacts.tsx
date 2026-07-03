"use client";

import { AddContactModal } from "@/components/dashboard/AddContactModal";
import { EditContactModal } from "@/components/dashboard/EditContactModal";
import { SendEmailToContactModal } from "./SendEmailToContactModal";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UserPlus, User, Mail, Phone, Edit3, Send, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/hooks";
import { deleteContact } from "@/store/features/contact/contactSlice";
import { getSingleHospital } from "@/store/features/hospital/hospitalSlice";

interface HospitalContactsProps {
  contacts: {
    _id: string;
    firstName: string;
    lastName: string;
    designation: string;
    phoneNumber: string;
    email: string;
    isPrimary?: boolean;
    product?: { _id: string; name: string }[];
  }[];
  hospital?: any;
}

export function HospitalContacts({
  contacts,
  hospital,
}: HospitalContactsProps) {
  const dispatch = useAppDispatch();

  const handleDeleteContact = async (contactId: string) => {
    try {
      const result = await dispatch(deleteContact(contactId)).unwrap();
      toast.success(result?.message || "Contact deleted successfully");
      if (hospital?._id) {
        dispatch(getSingleHospital(hospital._id));
      }
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to delete contact";
      toast.error(message);
      console.error("Failed to delete contact", error);
    }
  };

  return (
    <Card className="flex flex-col h-full min-h-0 p-6 shadow-md border border-border rounded-xl bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Contacts</h3>
        <AddContactModal hospital={hospital}>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 border-border text-foreground font-bold tracking-tight rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Add
          </Button>
        </AddContactModal>
      </div>

      <ScrollArea className="flex-1 px-2 max-h-100">
        <div className="flex flex-col gap-4 py-1 pr-1">
          {contacts.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground font-medium">
              No contacts found
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                className="group flex flex-col gap-3 p-4 bg-card border border-border rounded-2xl transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 bg-muted border-none shrink-0">
                      <AvatarFallback>
                        <User className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        {contact.isPrimary && (
                          <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-2 py-0 h-4.5 rounded-full text-[10px] font-bold shadow-none shrink-0">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground truncate">
                        {contact.designation}
                      </p>
                      {contact.product && contact.product.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contact.product.map((prod) => (
                            <Badge key={prod._id} className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-0 h-4.5 rounded-full text-[10px] font-bold shadow-none">
                              {prod.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SendEmailToContactModal contact={contact}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs rounded-md cursor-pointer"
                        title="Send email to this contact"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </SendEmailToContactModal>
                    <EditContactModal contact={contact} hospital={hospital}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs rounded-md cursor-pointer"
                        title="Edit this contact"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                    </EditContactModal>
                    <ConfirmDialog
                      title="Delete Contact"
                      description={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`}
                      confirmText="Delete"
                      onConfirm={() => handleDeleteContact(contact._id)}
                      variant="destructive"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs rounded-md cursor-pointer"
                        title="Delete this contact"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[12px] font-medium truncate">
                      {contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[12px] font-medium truncate">
                      {contact.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
