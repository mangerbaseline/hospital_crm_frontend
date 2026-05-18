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
import { Plus, Search, Users, Filter, Funnel } from "lucide-react";
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
  const { contacts, isFetchingContacts } = useAppSelector(
    (state) => state.contact,
  );
  const { products } = useAppSelector((state) => state.product);
  const isAdmin = user?.role === UserRole.ADMIN;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"my" | "all">("my");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchContacts({
        page: 1,
        limit: 50,
        search: searchQuery,
        userId: activeFilter === "my" ? user?._id : "",
        productId: selectedProductId === "all" ? "" : selectedProductId,
      }),
    );
  }, [dispatch, searchQuery, activeFilter, user?._id, selectedProductId]);

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
        <div className="hidden sm:flex w-full sm:w-[180px]">
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
          <Button className="flex gap-3 p-3 md:p-[18px] text-sm bg-black text-white border border-border cursor-pointer hover:bg-black/80 shadow-xl shadow-muted transition-all duration-200">
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
          {isAdmin && (
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
    </section>
  );
}

export default Contacts;
