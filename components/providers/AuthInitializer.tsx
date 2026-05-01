"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { fetchMe } from "@/store/features/auth/authSlice";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/auth/")
    ) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return <>{children}</>;
}
