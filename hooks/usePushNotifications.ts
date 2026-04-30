"use client";

import { useState, useEffect } from "react";
import { registerServiceWorker, subscribeUser } from "@/lib/push-notifications";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<
    NotificationPermission | "loading"
  >("loading");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSupported =
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window;
      setSupported(isSupported);
      if (isSupported) {
        setPermission(Notification.permission);
      } else {
        setPermission("default");
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) return;

    try {
      console.log("Push Notifications: Requesting permission via banner...");
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
    supported,
    requestPermission: handleRequestPermission,
  };
};
