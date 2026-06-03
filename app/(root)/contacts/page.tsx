"use client";

import { useState, useEffect } from "react";
import { AddContactModal } from "@/components/dashboard/AddContactModal";
import { DashboardHeader } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Plus, Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import {
  ContactCard,
  ContactCardSkeleton,
} from "@/components/contacts/ContactCard";
import { ContactDetailsModal } from "@/components/contacts/ContactDetailsModal";
import { UserSelect } from "@/components/UserSelect";
import { fetchContacts } from "@/store/features/contact/contactSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole, Contact } from "@/store/types";

function Contacts() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { contacts, isFetchingContacts, totalPages, totalContacts } =
    useAppSelector((state) => state.contact);
  const { products } = useAppSelector((state) => state.product);

  const isAdminOrExecutive =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.EXECUTIVE ||
    user?.role === UserRole.CUSTOMER_SUCCESS;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>(
    isAdminOrExecutive ? "all" : user?._id || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedUserId]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchContacts({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        userId: selectedUserId === "all" ? "" : selectedUserId,
      }),
    );
  }, [dispatch, searchQuery, selectedUserId, currentPage, pageSize]);

  return (
    <section className="max-w-7xl mx-auto w-full">
      {/* header */}
      <DashboardHeader
        title="Contacts"
        subTitle={
          !isAdminOrExecutive
            ? `Your contacts (${user?.name || "User"})`
            : selectedUserId === "all"
              ? "All contacts across the organization"
              : "Contacts filtered by assigned sales rep"
        }
      >
        {isAdminOrExecutive && (
          <div className="hidden sm:flex w-full sm:w-45">
            <UserSelect
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              className="w-full bg-muted border-border shadow-sm cursor-pointer"
            />
          </div>
        )}
        <AddContactModal>
          <Button className="flex gap-3 p-3 md:p-4.5 text-sm bg-black text-white border border-border cursor-pointer hover:bg-black/80 shadow-xl shadow-muted transition-all duration-200">
            <Plus className="h-4 w-4" /> Add Contact
          </Button>
        </AddContactModal>
      </DashboardHeader>

      <div className="flex flex-col gap-2 w-full sm:hidden -mt-4 mb-4 px-2">
        {isAdminOrExecutive && (
          <UserSelect
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            className="w-full bg-muted border-border shadow-sm cursor-pointer"
          />
        )}
      </div>

      {/* search and filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full px-2 md:px-0">
        <InputGroup className="flex-1 bg-muted h-11 px-3 duration-300">
          <InputGroupAddon
            align="inline-start"
            className="text-muted-foreground/60"
          >
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search contacts by name, title, email, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm placeholder:text-muted-foreground/50 transition-all border-none focus-visible:ring-0"
          />
        </InputGroup>

        {/* Commented out My Contacts / All Contacts tabs as they are replaced by the users dropdown for non-sales users
        <div className="flex items-center gap-2 w-full md:w-auto">
          {isAdminOrExecutive ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border border-border/60 bg-white hover:bg-muted text-foreground"
              >
                <Users className="h-4 w-4" /> My Contacts
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border border-border/60 bg-white hover:bg-muted text-foreground"
              >
                <Funnel className="h-4 w-4" /> All Contacts
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border border-border/60 bg-white hover:bg-muted text-foreground"
            >
              <Users className="h-4 w-4" /> My Contacts
            </Button>
          )}
        </div>
        */}
      </div>

      {/* contact list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0 mt-10">
        {isFetchingContacts ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ContactCardSkeleton key={i} />
          ))
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactCard
              key={contact.email}
              contact={contact}
              onViewClick={handleViewContact}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border gap-4">
            <div className="p-4 rounded-full bg-muted/50">
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                No contacts found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                No contacts match your current search or filters.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalContacts > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2 pb-8">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {totalContacts === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(currentPage * pageSize, totalContacts)}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-bold">{totalContacts}</span>{" "}
            contacts
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
              <span>Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-16 h-8 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-md font-bold shadow-sm transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "shadow-primary/20 scale-110"
                          : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 2 && currentPage > 3)
                  return (
                    <span
                      key="ellipsis-start"
                      className="w-4 text-center text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                if (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  return (
                    <span
                      key="ellipsis-end"
                      className="w-4 text-center text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <ContactDetailsModal
        contact={selectedContact}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedContact(null);
        }}
      />
    </section>
  );
}

export default Contacts;
