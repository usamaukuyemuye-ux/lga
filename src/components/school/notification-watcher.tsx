import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { registerDeviceNotification, dispatchLocalNotification } from "@/lib/device-notifications";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function GlobalNotificationWatcher() {
  const { role, user } = useAuth();

  useEffect(() => {
    // Register device ID in cookie & Firestore on startup
    void registerDeviceNotification(role || (user ? "authenticated" : "guest"));

    // Subscribe to real-time announcements broadcast
    if (typeof (supabase as any)?.channel !== "function") return;

    try {
      const channel = (supabase as any)
        .channel("global-school-broadcasts")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "announcements" },
          (payload: any) => {
            const item = payload?.new as any;
            if (!item?.title) return;

            // Trigger browser notification even if not logged in
            dispatchLocalNotification(
              item.title,
              item.body || "New announcement from Little Gems Academy",
              "/announcements",
            );

            // Trigger toast
            toast.info(`💎 Little Gems Academy: ${item.title}`, {
              description: item.body?.slice(0, 100),
              duration: 8000,
            });
          },
        )
        .subscribe();

      return () => {
        if (typeof (supabase as any)?.removeChannel === "function") {
          void (supabase as any).removeChannel(channel);
        }
      };
    } catch (e) {
      console.warn("Global broadcast watcher subscription issue:", e);
    }
  }, [role, user]);

  return null;
}
