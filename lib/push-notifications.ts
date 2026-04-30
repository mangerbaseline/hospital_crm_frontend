const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

export const subscribeUser = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications are not supported in this browser");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
      console.error("VAPID public key is missing");
      return;
    }

    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log("Push Notifications: Refreshing existing subscription...");
      await subscription.unsubscribe();
    }

    console.log("Push Notifications: Creating new subscription...");
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    console.log("Push Notifications: Generated subscription:", subscription);

    console.log("Push Notifications: Sending subscription to backend...");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/push/subscribe`,
      {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();
    console.log("Push Notifications: Backend response:", result);

    console.log("User subscribed successfully");
    return subscription;
  } catch (error) {
    console.error("Failed to subscribe user:", error);
  }
};
