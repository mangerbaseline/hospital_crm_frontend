"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";

export const NotificationBanner = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { permission, supported, requestPermission } = usePushNotifications();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  const checkBrowserSubscription = async () => {
    if (typeof window === "undefined") return false;
    if (!("serviceWorker" in navigator) || !("PushManager" in window))
      return false;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return false;
      const subscription = await registration.pushManager.getSubscription();
      return Boolean(subscription);
    } catch (error) {
      console.error("Failed to check browser push subscription:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      const browserSubscribed = await checkBrowserSubscription();
      setIsSubscribed(browserSubscribed);
    };

    checkSubscription();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setIsVisible(false);
      return;
    }

    if (isSubscribed === null) return;

    if (!isSubscribed && permission !== "denied") {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 100);
      }, 1500);
      return () => clearTimeout(timer);
    }

    setIsVisible(false);
  }, [user, permission, isSubscribed]);

  const handleEnable = async () => {
    if (!supported) {
      handleDismiss();
      return;
    }

    const result = await requestPermission();

    if (result === "granted") {
      const browserSubscribed = await checkBrowserSubscription();
      setIsSubscribed(browserSubscribed);
    }

    if (result !== "default") {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 500);
    }
  };

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-100 p-2 sm:p-4 transition-all duration-500 ease-out transform",
        isAnimating
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0",
      )}
    >
      <div className="max-w-4xl mx-auto bg-blue-600/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 md:p-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-xl shrink-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Stay Updated!</h3>
              <p className="text-blue-100 text-xs sm:text-sm">
                Enable push notifications to receive real-time updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={handleEnable}
              className="flex-1 sm:flex-none bg-white text-blue-600 hover:bg-blue-50 font-bold px-4 sm:px-8 py-2 rounded-xl cursor-pointer"
            >
              Enable Now
            </Button>

            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
