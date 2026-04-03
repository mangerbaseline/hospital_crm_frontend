"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardHeader } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchUsers,
  deleteUser,
  getSingleUser,
  clearSelectedUser,
} from "@/store/features/user/userSlice";
import { UserTable } from "@/components/users/UserTable";
import { UserModal } from "@/components/users/UserModal";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";

function UsersPage() {
  const dispatch = useAppDispatch();
  const {
    users,
    isFetchingUsers,
    selectedUser,
    page,
    limit,
    totalUsers,
    totalPages,
  } = useAppSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  useEffect(() => {
    dispatch(fetchUsers(queryParams));
  }, [dispatch, queryParams]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({ ...prev, search: value, page: 1 }));
      }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setQueryParams((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
  };

  const handleEdit = async (id: string) => {
    try {
      await dispatch(getSingleUser(id)).unwrap();
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error || "Failed to fetch user details");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully");
      dispatch(fetchUsers(queryParams));
    } catch (error: any) {
      toast.error(error || "Failed to delete user");
    }
  };

  const openAddModal = () => {
    dispatch(clearSelectedUser());
    setIsModalOpen(true);
  };

  return (
    <section className="w-full max-w-7xl mx-auto">
      <DashboardHeader
        title="User Management"
        subTitle="Manage roles and monitor system access."
      >
        <Button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white flex gap-3 p-3 md:p-[18px] text-sm cursor-pointer"
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Add User</span>
        </Button>
      </DashboardHeader>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-muted/40 p-4 rounded-xl border shadow-sm mt-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name or email..."
            className="pl-11 h-12 rounded-lg shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground border px-3 py-2.5 rounded-lg shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Rows:</span>
            <Select
              value={String(queryParams.limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-full sm:w-[70px] h-7 border-none p-0 shadow-none cursor-pointer">
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
        </div>
      </div>

      <div className="mt-3">
        <UserTable
          users={users}
          isLoading={isFetchingUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-2">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {(page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(page * limit, totalUsers)}
            </span>{" "}
            of <span className="text-foreground font-bold">{totalUsers}</span>{" "}
            users
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
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
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-md font-bold shadow-sm transition-all cursor-pointer ${
                        page === pageNum ? "shadow-primary/20 scale-110" : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 2 && page > 3)
                  return (
                    <span
                      key="ellipsis-start"
                      className="w-4 text-center text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                if (pageNum === totalPages - 1 && page < totalPages - 2)
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
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(clearSelectedUser());
        }}
        onSuccess={() => dispatch(fetchUsers(queryParams))}
        user={selectedUser}
      />
    </section>
  );
}

export default UsersPage;
