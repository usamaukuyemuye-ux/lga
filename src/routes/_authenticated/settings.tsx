import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Download, ShieldCheck, Cookie, Volume2, VolumeX, BellRing, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/school/ui";
import { fetchAttendance, fetchStudents, logAudit } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolLogoManager } from "@/components/school/school-logo-manager";
import { openCookiePreferencesModal } from "@/components/school/cookie-banner";
import { getCookiePreferences, CookiePreferences } from "@/lib/cookie-consent";
import { playChimeSound, isNotificationSoundEnabled, setNotificationSoundEnabled } from "@/lib/notification-sound";
import { getPortalSecurityStatus } from "@/lib/security";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "School Settings & Logo — Little Gems Academy" },
      {
        name: "description",
        content: "Manage school profile, logo branding, and system backups.",
      },
      { property: "og:title", content: "School Settings & Logo — Little Gems Academy" },
      {
        property: "og:description",
        content: "Manage school profile, logo branding, and system backups.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    school_name: "",
    address: "",
    phone: "",
    email: "",
    notify_email: "",
  });

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("school_settings").select("*").maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        school_name: data.school_name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        notify_email: data.notify_email || "",
      });
    }
  }, [data]);

  const save = async () => {
    const targetId = data?.id || "default";
    const { error } = await supabase.from("school_settings").update(form).eq("id", targetId);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAudit("settings.update", "school_settings", {});
    toast.success("School details saved");
    void qc.invalidateQueries({ queryKey: ["settings"] });
  };

  const backup = async () => {
    const [students, attendance] = await Promise.all([fetchStudents(), fetchAttendance()]);
    const blob = new Blob(
      [JSON.stringify({ students, attendance, exportedAt: new Date().toISOString() }, null, 2)],
      {
        type: "application/json",
      },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schooltrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    await logAudit("system.backup", "system", {});
  };

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(getCookiePreferences());
  const securityStatus = getPortalSecurityStatus();

  useEffect(() => {
    setSoundEnabled(isNotificationSoundEnabled());
    setCookiePrefs(getCookiePreferences());

    const handleSound = (e: any) => {
      if (typeof e?.detail?.enabled === "boolean") setSoundEnabled(e.detail.enabled);
    };
    const handleCookies = (e: any) => {
      if (e?.detail) setCookiePrefs(e.detail);
    };

    window.addEventListener("lga-sound-pref-changed", handleSound);
    window.addEventListener("lga-cookie-consent-updated", handleCookies);
    return () => {
      window.removeEventListener("lga-sound-pref-changed", handleSound);
      window.removeEventListener("lga-cookie-consent-updated", handleCookies);
    };
  }, []);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setNotificationSoundEnabled(enabled);
    if (enabled) {
      playChimeSound("announcement");
      toast.success("Notification sound chime activated");
    } else {
      toast.info("Notification sound muted");
    }
  };

  const handleTestChime = () => {
    playChimeSound("announcement");
    toast.success("Playing announcement chime preview");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="School Settings"
        description="Manage school profile details, security posture, cookies, and system backups."
      />

      {/* NOTIFICATIONS & SOUND CHIME ALERTS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-primary" />
            <CardTitle className="text-base">Notification & Announcement Audio Chimes</CardTitle>
          </div>
          <CardDescription>
            Plays a pleasant, harmonic chime whenever new announcements or critical attendance notifications arrive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/80 p-3 bg-muted/20">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Play Announcement Chime</p>
              <p className="text-[11px] text-muted-foreground">
                Synthesized crystal bell chime for browser alerts and broadcasts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleTestChime}
              >
                <BellRing className="size-3.5 text-primary" /> Test Chime
              </Button>
              <Switch
                checked={soundEnabled}
                onCheckedChange={handleToggleSound}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COOKIES & PRIVACY CONTROL */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cookie className="size-4 text-primary" />
            <CardTitle className="text-base">Cookies & Browser Storage</CardTitle>
          </div>
          <CardDescription>
            Review and adjust cookie permissions for login authentication, device registration, and audio settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Essential</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Sessions, CSRF & login security.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Functional</span>
                <span className="text-[10px] font-bold text-primary">
                  {cookiePrefs.functional ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Chimes, UI filters & themes.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Diagnostics</span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {cookiePrefs.analytics ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Security & performance traces.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={openCookiePreferencesModal}
            >
              <Cookie className="size-3.5" /> Manage Cookie Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PORTAL SECURITY & COMPLIANCE */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base">Portal Security & Access Protection</CardTitle>
          </div>
          <CardDescription>
            Little Gems Academy automated security posture and defensive protections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 bg-card">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">HTTPS Transport Security</p>
                <p className="text-[11px] text-muted-foreground">TLS encryption in transit enabled</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 bg-card">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Brute-Force Rate Limiting</p>
                <p className="text-[11px] text-muted-foreground">Automatic 30s lock on 5 failed attempts</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 bg-card">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Role-Based Access Control (RBAC)</p>
                <p className="text-[11px] text-muted-foreground">Granular permissions by staff role</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/60 p-2.5 bg-card">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Tamper-Proof Audit Logging</p>
                <p className="text-[11px] text-muted-foreground">Every administrative action tracked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SCHOOL LOGO & BRANDING */}
      <SchoolLogoManager />

      {/* SCHOOL PROFILE SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">School Details</CardTitle>
          <CardDescription>
            These details appear on ID cards, reports and parent notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {(
            [
              ["school_name", "School name"],
              ["address", "Address"],
              ["phone", "Phone"],
              ["email", "School email"],
              ["notify_email", "Notification sender / reply-to email"],
            ] as const
          ).map(([key, label]) => (
            <div className="space-y-2" key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <Button onClick={() => void save()}>
            <Save className="size-4" /> Save school details
          </Button>
        </CardContent>
      </Card>

      {/* BACKUP */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backup & Export</CardTitle>
          <CardDescription>
            Download a full JSON snapshot of students and attendance records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => void backup()}>
            <Download className="size-4" /> Download backup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
