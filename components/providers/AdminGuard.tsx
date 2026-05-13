"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const [authorized, setAuthorized] = useState(false);

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (isInitialized) {
      if (!user || user.role !== "Admin") {
        if (!toastShownRef.current) {
          toast.error("Unauthorized Access", {
            id: "unauthorized-access-toast",
            description: "You do not have permission to access this page.",
          });
          toastShownRef.current = true;
          router.replace("/");
        }
      } else {
        setAuthorized(true);
      }
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !authorized) {
    return <LoadingScreen isExiting={false} />;
  }

  return <>{children}</>;
}
