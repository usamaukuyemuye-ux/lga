// Little Gems Academy Cookie & Privacy Management

export interface CookiePreferences {
  essential: boolean; // Authentication, security, session integrity (always true)
  functional: boolean; // Sound notifications, theme preference, filter state
  analytics: boolean;  // Anonymous portal usage, performance diagnostics
  answered: boolean;   // Has the user accepted or customized preferences
  updatedAt: string;
}

const STORAGE_KEY = "lga_cookie_preferences";
const COOKIE_NAME = "lga_cookie_consent";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: true,
  answered: false,
  updatedAt: new Date().toISOString(),
};

export function getCookiePreferences(): CookiePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    void e;
  }
  return DEFAULT_PREFERENCES;
}

export function saveCookiePreferences(prefs: Partial<CookiePreferences>): CookiePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  const current = getCookiePreferences();
  const updated: CookiePreferences = {
    ...current,
    ...prefs,
    essential: true, // strictly required
    answered: true,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Also save in cookie with Secure & SameSite=Lax
    const isHttps = window.location.protocol === "https:";
    const secureFlag = isHttps ? "; Secure" : "";
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(updated))}; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;

    window.dispatchEvent(new CustomEvent("lga-cookie-consent-updated", { detail: updated }));
  } catch (e) {
    console.warn("Failed to persist cookie consent:", e);
  }

  return updated;
}

export function allowAllCookies(): CookiePreferences {
  return saveCookiePreferences({
    essential: true,
    functional: true,
    analytics: true,
  });
}

export function allowEssentialOnlyCookies(): CookiePreferences {
  return saveCookiePreferences({
    essential: true,
    functional: false,
    analytics: false,
  });
}

/**
 * Sets a browser cookie with enhanced security flags:
 * - SameSite=Lax (mitigates CSRF)
 * - Secure (only over HTTPS in production)
 * - Path=/ (scoped to site)
 */
export function setPortalCookie(
  name: string,
  value: string,
  category: "essential" | "functional" | "analytics" = "essential",
  days = 180,
): boolean {
  if (typeof document === "undefined") return false;

  const prefs = getCookiePreferences();
  // Check if permission allowed for this category
  if (category === "functional" && !prefs.functional) return false;
  if (category === "analytics" && !prefs.analytics) return false;

  const isHttps = window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;
  return true;
}

export function getPortalCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + encodeURIComponent(name) + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function removePortalCookie(name: string): void {
  if (typeof document === "undefined") return;
  const isHttps = window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${secureFlag}`;
}
