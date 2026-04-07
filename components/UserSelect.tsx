"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUsers } from "@/store/features/user/userSlice";

interface UserSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function UserSelect({
  value,
  onValueChange,
  className,
  placeholder = "Select Sales Rep",
}: UserSelectProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers({ limit: 1000 }));
    }
  }, [dispatch, users.length]);

  return (
    <Select
      key={currentUser?._id || "loading"}
      defaultValue={value || currentUser?._id || "all"}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-border">
        <SelectItem value="all">All Sales Reps</SelectItem>
        {users.map((user) => (
          <SelectItem key={user?._id} value={user?._id}>
            {user?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
