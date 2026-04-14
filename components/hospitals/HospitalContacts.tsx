"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, User, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HospitalContactsProps {
  contacts: {
    _id: string;
    firstName: string;
    lastName: string;
    designation: string;
    phoneNumber: string;
    email: string;
    isPrimary?: boolean;
  }[];
}

export function HospitalContacts({ contacts }: HospitalContactsProps) {
  return (
    <Card className="flex flex-col h-full min-h-0 p-6 shadow-md border border-border rounded-xl bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Contacts</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 border-border text-foreground font-bold tracking-tight rounded-lg flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" /> Add
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 max-h-[400px]">
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
                    </div>
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
