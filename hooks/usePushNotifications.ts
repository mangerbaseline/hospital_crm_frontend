"use client";

import { useState, useEffect } from "react";
import { registerServiceWorker, subscribeUser } from "@/lib/push-notifications";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<
    NotificationPermission | "loading"
  >("loading");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        await registerServiceWorker();
        await subscribeUser();
      }
      return result;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  };

  return {
    permission,
    requestPermission: handleRequestPermission,
  };
};
