import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Volume2, Check, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCookiePreferences,
  saveCookiePreferences,
  allowAllCookies,
  allowEssentialOnlyCookies,
  CookiePreferences,
} from "@/lib/cookie-consent";
import { setNotificationSoundEnabled } from "@/lib/notification-sound";

export function CookieBanner() {
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal draft preferences
  const [draftFunctional, setDraftFunctional] = useState(true);
  const [draftAnalytics, setDraftAnalytics] = useState(true);

  useEffect(() => {
    const prefs = getCookiePreferences();
    setPreferences(prefs);
    if (!prefs.answered) {
      // Small timeout for smooth appearance
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const current = getCookiePreferences();
      setDraftFunctional(current.functional);
      setDraftAnalytics(current.analytics);
      setShowModal(true);
    };

    const handleConsentUpdated = (e: any) => {
      if (e?.detail) setPreferences(e.detail);
    };

    window.addEventListener("lga-open-cookie-preferences", handleOpen);
    window.addEventListener("lga-cookie-consent-updated", handleConsentUpdated);
    return () => {
      window.removeEventListener("lga-open-cookie-preferences", handleOpen);
      window.removeEventListener("lga-cookie-consent-updated", handleConsentUpdated);
    };
  }, []);

  const handleAllowAll = () => {
    const updated = allowAllCookies();
    setPreferences(updated);
    setShowBanner(false);
    setNotificationSoundEnabled(true);
  };

  const handleEssentialOnly = () => {
    const updated = allowEssentialOnlyCookies();
    setPreferences(updated);
    setShowBanner(false);
  };

  const handleOpenCustomize = () => {
    setDraftFunctional(preferences.functional);
    setDraftAnalytics(preferences.analytics);
    setShowModal(true);
  };

  const handleSaveCustom = () => {
    const updated = saveCookiePreferences({
      functional: draftFunctional,
      analytics: draftAnalytics,
    });
    setPreferences(updated);
    setNotificationSoundEnabled(draftFunctional);
    setShowModal(false);
    setShowBanner(false);
  };

  return (
    <>
      {/* Floating Cookie Consent Banner */}
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="rounded-xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-md dark:bg-card/90 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cookie className="size-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Cookie & Security Preferences
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="mr-1 size-3" /> Secure
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Little Gems Academy uses cookies to safeguard your session, prevent
                    unauthorized portal access, maintain real-time announcements, and remember your audio chime
                    preferences.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-medium"
                  onClick={handleOpenCustomize}
                >
                  <Settings2 className="mr-1.5 size-3.5" />
                  Customize
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={handleEssentialOnly}
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleAllowAll}
                >
                  <Check className="mr-1.5 size-3.5" />
                  Allow All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Granular Cookie Customization Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Cookie className="size-5" />
              <DialogTitle className="text-base font-semibold">Cookie & Privacy Settings</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Manage how cookies and browser storage are used within the Little Gems Academy portal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* 1. Essential */}
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 p-3 bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Strictly Essential Cookies</span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    Required
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Necessary for user login authentication, CSRF cross-site forgery mitigation,
                  tamper-proof QR gate check-ins, and session security.
                </p>
              </div>
              <Switch checked={true} disabled className="shrink-0" />
            </div>

            {/* 2. Functional & Sound Notifications */}
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Volume2 className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">Functional & Sound Notifications</span>
                </div>
                <p className="text-muted-foreground">
                  Enables audio chime alerts for school announcements, theme preferences, and saved
                  filter selections across dashboard tabs.
                </p>
              </div>
              <Switch
                checked={draftFunctional}
                onCheckedChange={setDraftFunctional}
                className="shrink-0"
              />
            </div>

            {/* 3. Performance & Diagnostics */}
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">Performance & Security Diagnostics</span>
                </div>
                <p className="text-muted-foreground">
                  Assists in detecting connectivity failures, monitoring attendance sync latency, and
                  preventing unauthorized login attempts.
                </p>
              </div>
              <Switch
                checked={draftAnalytics}
                onCheckedChange={setDraftAnalytics}
                className="shrink-0"
              />
            </div>
          </div>

          <DialogFooter className="flex-row items-center justify-between sm:justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleEssentialOnly}
            >
              Reject Non-Essential
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="text-xs font-semibold"
                onClick={handleSaveCustom}
              >
                Save Preferences
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Trigger helper to open cookie preferences dialog from anywhere.
 */
export function openCookiePreferencesModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lga-open-cookie-preferences"));
  }
}
