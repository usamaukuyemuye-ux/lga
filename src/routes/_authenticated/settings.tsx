import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/school/ui";
import { fetchAttendance, fetchStudents, logAudit } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolLogoManager } from "@/components/school/school-logo-manager";

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

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="School Settings"
        description="Manage school profile details, official school logo, and system backups."
      />

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
