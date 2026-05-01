"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { fetchMe } from "@/store/features/auth/authSlice";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/auth/")
    ) {
      const hasToken = document.cookie
        .split("; ")
        .some((c) => c.startsWith("token="));
      if (hasToken) {
        dispatch(fetchMe());
      } else {
        router.replace("/auth/sign-in");
      }
    }
  }, [dispatch, router]);

  return <>{children}</>;
}
