"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import LoadingScreen from "@/components/LoadingScreen";

const MIN_LOADING_MS = 3000;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - mountTimeRef.current;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized || !minTimeElapsed) return;

    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }

    setIsExiting(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isInitialized, minTimeElapsed, user, router]);

  if (!isInitialized || !minTimeElapsed || (!showContent && user)) {
    return <LoadingScreen isExiting={isExiting} />;
  }

  if (!user) {
    return <LoadingScreen isExiting={false} />;
  }

  return <>{children}</>;
}
