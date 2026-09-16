import { supabase } from "@/integrations/supabase/client";

const COOKIE_NAME = "lga_device_id";
const STORAGE_KEY = "lga_device_id";

// Cookie helper
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Generate or retrieve persistent device ID
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";

  // Check cookie first
  let deviceId = getCookie(COOKIE_NAME);
  if (deviceId) {
    try {
      localStorage.setItem(STORAGE_KEY, deviceId);
    } catch (e) {
      void e;
    }
    return deviceId;
  }

  // Check localStorage second
  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) {
      setCookie(COOKIE_NAME, fromStorage);
      return fromStorage;
    }
  } catch (e) {
    void e;
  }

  // Generate new device identifier
  deviceId = "dev_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
  setCookie(COOKIE_NAME, deviceId);
  try {
    localStorage.setItem(STORAGE_KEY, deviceId);
  } catch (e) {
    void e;
  }

  return deviceId;
}

// Register device with school system (even if not logged in)
export async function registerDeviceNotification(role?: string) {
  if (typeof window === "undefined") return;
  const deviceId = getOrCreateDeviceId();
  const pushGranted = "Notification" in window && Notification.permission === "granted";

  try {
    await supabase.from("device_registrations").upsert(
      {
        id: deviceId,
        device_id: deviceId,
        user_agent: navigator.userAgent,
        platform: navigator.platform || "Web",
        push_enabled: pushGranted,
        role: role || "guest",
        last_seen: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (e) {
    // If table doesn't exist yet, it's non-blocking
    console.debug("Device notification registration noted:", e);
  }
}

// Global bulk notification dispatcher (Web Push API)
export function dispatchLocalNotification(title: string, body: string, actionUrl?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      const notif = new Notification(`💎 Little Gems Academy: ${title}`, {
        body: body.slice(0, 160),
        icon: "/little-gems-logo.png",
        badge: "/little-gems-logo.png",
      });
      if (actionUrl) {
        notif.onclick = () => {
          window.focus();
          window.location.href = actionUrl;
        };
      }
    } catch (e) {
      console.warn("Notification dispatch failed:", e);
    }
  }
}

// Unread announcement tracker
export function getReadAnnouncementIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("read_announcements");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    void e;
    return new Set();
  }
}

export function markAnnouncementAsRead(id: string) {
  if (typeof window === "undefined") return;
  try {
    const read = getReadAnnouncementIds();
    read.add(id);
    localStorage.setItem("read_announcements", JSON.stringify(Array.from(read)));
    window.dispatchEvent(new CustomEvent("announcements-read-changed"));
  } catch (e) {
    void e;
  }
}

export function markAllAnnouncementsAsRead(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    const read = getReadAnnouncementIds();
    ids.forEach((id) => read.add(id));
    localStorage.setItem("read_announcements", JSON.stringify(Array.from(read)));
    window.dispatchEvent(new CustomEvent("announcements-read-changed"));
  } catch (e) {
    void e;
  }
}

export function markAnnouncementAsUnread(id: string) {
  if (typeof window === "undefined") return;
  try {
    const read = getReadAnnouncementIds();
    read.delete(id);
    localStorage.setItem("read_announcements", JSON.stringify(Array.from(read)));
    window.dispatchEvent(new CustomEvent("announcements-read-changed"));
  } catch (e) {
    void e;
  }
}
