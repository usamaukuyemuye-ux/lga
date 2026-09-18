import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_SCHOOL_LOGO = "/logo.jpeg";
const STORAGE_KEY = "school_custom_logo";
const EVENT_NAME = "school_logo_updated";

/**
 * Get the currently cached logo URL synchronously
 */
export function getStoredSchoolLogo(): string {
  if (typeof window === "undefined") return DEFAULT_SCHOOL_LOGO;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) return saved;
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_SCHOOL_LOGO;
}

/**
 * Hook to reactively get the active school logo anywhere in the application.
 */
export function useSchoolLogo(): {
  logoUrl: string;
  isCustom: boolean;
  isLoading: boolean;
} {
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_SCHOOL_LOGO);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sync with localStorage on client after initial hydration to prevent SSR mismatch
    const cached = getStoredSchoolLogo();
    if (cached && cached !== DEFAULT_SCHOOL_LOGO) {
      setLogoUrl(cached);
    }

    // 1. Listen for local storage / custom event changes across components
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setLogoUrl(customEvent.detail);
      } else {
        setLogoUrl(getStoredSchoolLogo());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setLogoUrl(e.newValue || DEFAULT_SCHOOL_LOGO);
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleStorage);

    // 2. Fetch latest from database
    let active = true;
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.from("school_settings").select("logo_url").maybeSingle();

        if (active && data?.logo_url) {
          setLogoUrl(data.logo_url);
          try {
            localStorage.setItem(STORAGE_KEY, data.logo_url);
          } catch {
            // storage may be full or disabled
          }
        }
      } catch (err) {
        console.warn("Could not load school logo from settings:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    logoUrl: logoUrl || DEFAULT_SCHOOL_LOGO,
    isCustom: Boolean(logoUrl && logoUrl !== DEFAULT_SCHOOL_LOGO),
    isLoading,
  };
}

/**
 * Resize and compress an image file to a data URL (max 512x512) for fast persistence
 */
export async function processImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image format"));
      img.onload = () => {
        const maxDimension = 512;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or PNG data URL
        const dataUrl = canvas.toDataURL("image/png", 0.9);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Save new logo to database and local cache, broadcasting to all UI components.
 */
export async function saveSchoolLogo(logoDataUrl: string): Promise<void> {
  // 1. Update local cache immediately
  try {
    localStorage.setItem(STORAGE_KEY, logoDataUrl);
  } catch (err) {
    console.warn("Local storage full, saving to database only", err);
  }

  // 2. Broadcast event to all active mounted components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<string>(EVENT_NAME, { detail: logoDataUrl }));
  }

  // 3. Persist to Firestore school_settings
  try {
    const { data: existing } = await supabase.from("school_settings").select("id").maybeSingle();

    const targetId = existing?.id || "default";
    await supabase.from("school_settings").upsert({
      id: targetId,
      logo_url: logoDataUrl,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to update school logo in database:", err);
    throw err;
  }
}

/**
 * Reset logo back to the school default
 */
export async function resetSchoolLogoToDefault(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<string>(EVENT_NAME, { detail: DEFAULT_SCHOOL_LOGO }));
  }

  try {
    const { data: existing } = await supabase.from("school_settings").select("id").maybeSingle();

    const targetId = existing?.id || "default";
    await supabase.from("school_settings").upsert({
      id: targetId,
      logo_url: null,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Could not reset logo in database:", err);
  }
}
