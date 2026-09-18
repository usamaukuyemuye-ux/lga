import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { registerDeviceNotification, dispatchLocalNotification } from "@/lib/device-notifications";
import { playChimeSound, SoundType } from "@/lib/notification-sound";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function GlobalNotificationWatcher() {
  const { role, user } = useAuth();
  const seenAnnouncementIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Register device ID in cookie & Firestore on startup
    void registerDeviceNotification(role || (user ? "authenticated" : "guest"));

    // Global audio trigger listener
    const handleSoundEvent = (e: any) => {
      const type: SoundType = e?.detail?.type || "announcement";
      playChimeSound(type);
    };
    window.addEventListener("lga-trigger-sound", handleSoundEvent);

    // Initial fetch to mark existing announcements so we only sound for NEW ones
    supabase
      .from("announcements")
      .select("id")
      .limit(20)
      .then(({ data }) => {
        if (data) {
          data.forEach((item: any) => seenAnnouncementIds.current.add(item.id));
        }
      })
      .catch(() => {});

    // Polling fallback to ensure notifications & chimes fire even without websockets
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (data && data.length > 0) {
          const newest = data[0];
          if (newest && !seenAnnouncementIds.current.has(newest.id)) {
            seenAnnouncementIds.current.add(newest.id);

            // Ring the school notification chime
            playChimeSound("announcement");

            // Native push/browser notification
            dispatchLocalNotification(
              newest.title,
              newest.body || "New announcement from Little Gems Academy",
              "/announcements",
            );

            // In-app alert
            toast.info(`🔔 Announcement: ${newest.title}`, {
              description: newest.body?.slice(0, 100),
              duration: 8000,
            });
          }
        }
      } catch (err) {
        // quiet fallback
      }
    }, 30000);

    // Subscribe to real-time announcements broadcast if available
    let channel: any = null;
    if (typeof (supabase as any)?.channel === "function") {
      try {
        channel = (supabase as any)
          .channel("global-school-broadcasts")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "announcements" },
            (payload: any) => {
              const item = payload?.new as any;
              if (!item?.title || seenAnnouncementIds.current.has(item.id)) return;
              seenAnnouncementIds.current.add(item.id);

              // Play announcement chime
              playChimeSound("announcement");

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
      } catch (e) {
        console.warn("Global broadcast watcher subscription issue:", e);
      }
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("lga-trigger-sound", handleSoundEvent);
      if (channel && typeof (supabase as any)?.removeChannel === "function") {
        void (supabase as any).removeChannel(channel);
      }
    };
  }, [role, user]);

  return null;
}
