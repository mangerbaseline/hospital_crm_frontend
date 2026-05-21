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
import {
  Plus,
  Search,
  Users,
  Filter,
  Funnel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContactCard,
  ContactCardSkeleton,
} from "@/components/contacts/ContactCard";
import { fetchContacts } from "@/store/features/contact/contactSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/store/types";

function Contacts() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { contacts, isFetchingContacts, totalPages, totalContacts } =
    useAppSelector((state) => state.contact);
  const { products } = useAppSelector((state) => state.product);

  // const isAdmin = user?.role === UserRole.ADMIN;
  const isAdminOrExecutive =
    user?.role === UserRole.ADMIN || user?.role === UserRole.EXECUTIVE;

  const [searchQuery, setSearchQuery] = useState("");
  // const [activeFilter, setActiveFilter] = useState<"my" | "all">("my");
  const [activeFilter, setActiveFilter] = useState<"my" | "all">(
    isAdminOrExecutive ? "all" : "my",
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, selectedProductId]);

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
        userId: activeFilter === "my" ? user?._id : "",
        productId: selectedProductId === "all" ? "" : selectedProductId,
      }),
    );
  }, [
    dispatch,
    searchQuery,
    activeFilter,
    user?._id,
    selectedProductId,
    currentPage,
    pageSize,
  ]);

  return (
    <section className="max-w-7xl mx-auto w-full">
      {/* header */}
      <DashboardHeader
        title="Contacts"
        subTitle={
          activeFilter === "my"
            ? `Your contacts (${user?.name || "User"})`
            : "All contacts across the organization"
        }
      >
        <div className="hidden sm:flex w-full sm:w-45">
          <Select
            value={selectedProductId}
            onValueChange={setSelectedProductId}
          >
            <SelectTrigger className="w-full bg-muted border-border shadow-sm cursor-pointer">
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent className="z-110">
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddContactModal>
          <Button className="flex gap-3 p-3 md:p-4.5 text-sm bg-black text-white border border-border cursor-pointer hover:bg-black/80 shadow-xl shadow-muted transition-all duration-200">
            <Plus className="h-4 w-4" /> Add Contact
          </Button>
        </AddContactModal>
      </DashboardHeader>

      <div className="flex flex-col gap-2 w-full sm:hidden -mt-4 mb-4 px-2">
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger className="w-full bg-muted border-border shadow-sm cursor-pointer">
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent className="z-110">
            <SelectItem value="all">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product._id} value={product._id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* {isAdminOrExecutive && (
            <>
              <Button
                variant={activeFilter === "my" ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter("my")}
                className={cn(
                  "flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border",
                  activeFilter === "my"
                    ? "bg-black text-white hover:bg-black/80 scale-[1.02] border-transparent"
                    : "border-border/60 bg-white hover:bg-muted text-foreground",
                )}
              >
                <Users className="h-4 w-4" /> My Contacts
              </Button>
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border",
                  activeFilter === "all"
                    ? "bg-black text-white hover:bg-black/80 scale-[1.02] border-transparent"
                    : "border-border/60 bg-white hover:bg-muted text-foreground",
                )}
              >
                <Funnel className="h-4 w-4" /> All Contacts
              </Button>
            </>
          )} */}

          {isAdminOrExecutive ? (
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveFilter("all")}
              className={cn(
                "flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border",
                activeFilter === "all"
                  ? "bg-black text-white hover:bg-black/80 scale-[1.02] border-transparent"
                  : "border-border/60 bg-white hover:bg-muted text-foreground",
              )}
            >
              <Funnel className="h-4 w-4" /> All Contacts
            </Button>
          ) : (
            <>
              <Button
                variant={activeFilter === "my" ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter("my")}
                className={cn(
                  "flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border",
                  activeFilter === "my"
                    ? "bg-black text-white hover:bg-black/80 scale-[1.02] border-transparent"
                    : "border-border/60 bg-white hover:bg-muted text-foreground",
                )}
              >
                <Users className="h-4 w-4" /> My Contacts
              </Button>

              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "flex-1 md:flex-none h-10 gap-2 px-5 font-medium transition-all duration-300 shadow-sm cursor-pointer border",
                  activeFilter === "all"
                    ? "bg-black text-white hover:bg-black/80 scale-[1.02] border-transparent"
                    : "border-border/60 bg-white hover:bg-muted text-foreground",
                )}
              >
                <Funnel className="h-4 w-4" /> All Contacts
              </Button>
            </>
          )}
        </div>
      </div>

      {/* contact list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0 mt-10">
        {isFetchingContacts ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ContactCardSkeleton key={i} />
          ))
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactCard key={contact._id} contact={contact} />
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
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
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
    </section>
  );
}

export default Contacts;
