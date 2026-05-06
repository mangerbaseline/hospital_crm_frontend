// "use client";

// import { useState, useEffect } from "react";
// import { Bell, X } from "lucide-react";
// import { usePushNotifications } from "@/hooks/usePushNotifications";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { useAppSelector } from "@/lib/hooks";

// export const NotificationBanner = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const { permission, supported, requestPermission } = usePushNotifications();
//   const [isVisible, setIsVisible] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   useEffect(() => {
//     if (permission === "default" && user) {
//       const timer = setTimeout(() => {
//         setIsVisible(true);
//         setTimeout(() => setIsAnimating(true), 100);
//       }, 1500);
//       return () => clearTimeout(timer);
//     } else if (!user) {
//       setIsVisible(false);
//       setIsAnimating(false);
//     }
//   }, [permission, user]);

//   const handleEnable = async () => {
//     if (!supported) {
//       handleDismiss();
//       return;
//     }
//     const result = await requestPermission();
//     if (result !== "default") {
//       setIsAnimating(false);
//       setTimeout(() => setIsVisible(false), 500);
//     }
//   };

//   const handleDismiss = () => {
//     setIsAnimating(false);
//     setTimeout(() => setIsVisible(false), 500);
//   };

//   if (permission === "granted" || permission === "denied" || !isVisible) {
//     return null;
//   }

//   return (
//     <div
//       className={cn(
//         "fixed top-0 left-0 right-0 z-100 p-2 sm:p-4 transition-all duration-500 ease-out transform",
//         isAnimating
//           ? "translate-y-0 opacity-100"
//           : "-translate-y-full opacity-0",
//       )}
//     >
//       <div className="max-w-4xl mx-auto bg-blue-600/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
//         <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 md:p-6 gap-3 sm:gap-4">
//           <div className="flex items-center gap-3 sm:gap-4">
//             <div className="bg-white/20 p-2 sm:p-3 rounded-xl shrink-0">
//               <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-bounce" />
//             </div>
//             <div className="min-w-0">
//               <h3 className="font-bold text-base sm:text-lg leading-tight">
//                 Stay Updated!
//               </h3>
//               <p className="text-blue-100 text-xs sm:text-sm">
//                 Enable push notifications to receive real-time updates on
//                 hospital activities and CRM alerts.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
//             <Button
//               onClick={handleEnable}
//               className="flex-1 sm:flex-none bg-white text-blue-600 hover:bg-blue-50 font-bold px-4 sm:px-8 py-2 rounded-xl transition-all active:scale-95 cursor-pointer text-sm"
//             >
//               Enable Now
//             </Button>
//             <button
//               onClick={handleDismiss}
//               className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
//               aria-label="Dismiss"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
//       </div>
//     </div>
//   );
// };

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

  // ✅ Fetch subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/push/user-subscription`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      } catch (err) {
        console.error("Subscription check failed:", err);
      }
    };

    checkSubscription();
  }, [user]);

  // ✅ Control banner visibility
  useEffect(() => {
    if (!user) {
      setIsVisible(false);
      return;
    }

    // wait until API response comes
    if (isSubscribed === null) return;

    if (!isSubscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 100);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [user, permission, isSubscribed]);

  const handleEnable = async () => {
    if (!supported) {
      handleDismiss();
      return;
    }

    const result = await requestPermission();

    // After permission, you should also create subscription in backend
    if (result === "granted") {
      setIsSubscribed(true); // optimistic update
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
              className="flex-1 sm:flex-none bg-white text-blue-600 hover:bg-blue-50 font-bold px-4 sm:px-8 py-2 rounded-xl"
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
