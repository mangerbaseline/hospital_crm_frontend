"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NotificationBanner = () => {
  const { permission, requestPermission } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (permission === "default") {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 100);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const handleEnable = async () => {
    const result = await requestPermission();
    if (result !== "default") {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 500);
    }
  };

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (permission === "granted" || permission === "denied" || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-100 p-4 transition-all duration-500 ease-out transform",
        isAnimating
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0",
      )}
    >
      <div className="max-w-4xl mx-auto bg-blue-600/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Bell className="h-6 w-6 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Stay Updated!</h3>
              <p className="text-blue-100 text-sm">
                Enable push notifications to receive real-time updates on
                hospital activities and CRM alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={handleEnable}
              className="flex-1 md:flex-none bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              Enable Now
            </Button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      </div>
    </div>
  );
};
