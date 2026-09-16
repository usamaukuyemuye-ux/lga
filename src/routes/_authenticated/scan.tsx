import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, CameraOff, Search, LogIn, LogOut, CheckCircle2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatusBadge, StatCard } from "@/components/school/ui";
import { fetchClasses, fmtDate, fmtTime, todayISO, logAudit } from "@/lib/school";
import { buildMessage, queueAttendanceNotification, type Status } from "@/lib/notify.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, UserX, Thermometer, Clock, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/scan")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: search["tab"] === "staff" ? ("staff" as const) : ("students" as const),
  }),

  head: () => ({
    meta: [
      { title: "QR Scanner — SchoolTrack Attendance" },
      { name: "description", content: "Scan a student ID card to record attendance instantly." },
      { property: "og:title", content: "QR Scanner — SchoolTrack Attendance" },
      {
        property: "og:description",
        content: "Scan a student ID card to record attendance instantly.",
      },
    ],
  }),
  component: ScanPage,
});

type Student = {
  id: string;
  student_code: string;
  full_name: string;
  gender: string;
  photo_url: string | null;
  class_id: string | null;
  parent_id: string | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone?: string | null;
  classes?: { name: string } | null;
};

const STATUSES: { value: Status; label: string; icon: typeof UserCheck; tone: string }[] = [
  {
    value: "present",
    label: "Present",
    icon: UserCheck,
    tone: "bg-success text-success-foreground",
  },
  {
    value: "absent",
    label: "Absent",
    icon: UserX,
    tone: "bg-destructive text-destructive-foreground",
  },
  { value: "sick", label: "Sick", icon: Thermometer, tone: "bg-warning text-warning-foreground" },
  { value: "late", label: "Late", icon: Clock, tone: "bg-info text-info-foreground" },
];

function ScanPage() {
  const { profile, user } = useAuth();
  const [classId, setClassId] = useState<string>("all");
  const [scanning, setScanning] = useState(false);
  const [manual, setManual] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [status, setStatus] = useState<Status>("present");
  const [mode, setMode] = useState<"arrival" | "departure">("arrival");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);

  const { tab: initialTab } = Route.useSearch();
  const [tab, setTab] = useState<"students" | "staff">(initialTab);

  const [staffQuery, setStaffQuery] = useState("");
  const [savingStaff, setSavingStaff] = useState<string | null>(null);

  const { data: staffPermissions } = useQuery({
    queryKey: ["staff-permissions-pending"],
    queryFn: async () => {
      const { data } = await supabase
        .from("permission_requests")
        .select("teacher_id, status")
        .in("status", ["pending", "approved"]);
      return data ?? [];
    },
  });

  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

  const { data: staff } = useQuery({
    queryKey: ["staff-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, active")
        .order("full_name");
      return data ?? [];
    },
  });

  const { data: staffToday, refetch: refetchStaffToday } = useQuery({
    queryKey: ["staff-attendance-today"],
    queryFn: async () => {
      const { data } = await supabase
        .from("staff_attendance")
        .select("*")
        .eq("attendance_date", todayISO());
      return data ?? [];
    },
  });

  const recordStaff = async (staffId: string, staffName: string, kind: "arrival" | "departure") => {
    setSavingStaff(staffId);
    const now = new Date().toISOString();
    const existing = (staffToday ?? []).find((r) => r.staff_id === staffId);
    const patch = {
      staff_id: staffId,
      staff_name: staffName,
      status: "present",
      attendance_date: todayISO(),
      recorded_by: user?.id ?? null,
      recorded_by_name: profile?.full_name ?? "",
      arrival_time: kind === "arrival" ? now : (existing?.arrival_time ?? null),
      departure_time: kind === "departure" ? now : (existing?.departure_time ?? null),
    };

    const { error } = existing
      ? await supabase.from("staff_attendance").update(patch).eq("id", existing.id)
      : await supabase.from("staff_attendance").insert(patch);

    setSavingStaff(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    await logAudit("staff_attendance.record", "staff_attendance", { staff: staffName, kind });
    if (kind === "arrival") {
      toast.success("Welcome back to school! 👋", {
        description: `${staffName} marked PRESENT · Arrival ${fmtTime(now)}`,
        duration: 5000,
      });
      // Also log notification for staff member
      const staffMember = (staff ?? []).find((s) => s.id === staffId);
      if (staffMember?.email) {
        await supabase
          .from("parent_notifications")
          .insert({
            student_id: null,
            parent_id: staffId,
            recipient_email: staffMember.email,
            subject: "Welcome back to school!",
            body: `Welcome back to school, ${staffName}! Your arrival was recorded at ${fmtTime(now)}. Have a great teaching day!`,
            status: "sent",
          })
          .select()
          .maybeSingle();
      }
    } else {
      toast.success(`${staffName} departure recorded at ${fmtTime(now)}`);
    }
    void refetchStaffToday();
  };
  const { data: todayStats, refetch: refetchStats } = useQuery({
    queryKey: ["scan-today"],
    queryFn: async () => {
      const { data } = await supabase
        .from("attendance")
        .select("status")
        .eq("attendance_date", todayISO());
      return data ?? [];
    },
  });

  const lookup = async (code: string) => {
    const value = code.trim();
    if (!value) return;

    // Check if code matches a teacher or staff member first
    const staffMatch = (staff ?? []).find(
      (s) => s.id === value || s.email.toLowerCase() === value.toLowerCase(),
    );
    if (staffMatch) {
      await recordStaff(staffMatch.id, staffMatch.full_name, "arrival");
      return;
    }

    const { data, error } = await supabase
      .from("students")
      .select("*, classes(name)")
      .or(`qr_token.eq.${value},student_code.eq.${value}`)
      .maybeSingle();
    if (error || !data) {
      toast.error("No student or staff member found for this code");
      return;
    }
    if (classId !== "all" && data.class_id !== classId) {
      toast.error(`${data.full_name} is not in the selected class`);
      return;
    }
    setStudent(data as Student);
    setStatus("present");
    setNote("");
  };

  const stopScanner = async () => {
    try {
      await scannerRef.current?.stop();
      scannerRef.current?.clear();
    } catch {
      /* already stopped */
    }
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    if (!scanning) return;
    let cancelled = false;
    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const instance = new Html5Qrcode("qr-reader");
      scannerRef.current = instance as unknown as { stop: () => Promise<void>; clear: () => void };
      try {
        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            void instance.stop().then(() => {
              scannerRef.current = null;
              setScanning(false);
              void lookup(decoded);
            });
          },
          () => undefined,
        );
      } catch {
        toast.error("Unable to access the camera. Use the manual code box instead.");
        setScanning(false);
      }
    })();
    return () => {
      cancelled = true;
      void stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const submit = async () => {
    if (!student) return;
    setSaving(true);
    const now = new Date().toISOString();
    const payload: {
      student_id: string;
      class_id: string | null;
      status: Status;
      attendance_date: string;
      recorded_by: string | null;
      recorded_by_name: string;
      note: string | null;
      arrival_time?: string | null;
      departure_time?: string | null;
    } = {
      student_id: student.id,
      class_id: student.class_id,
      status,
      attendance_date: todayISO(),
      recorded_by: user?.id ?? null,
      recorded_by_name: profile?.full_name ?? "",
      note: note || null,
    };
    if (mode === "arrival") payload.arrival_time = status === "absent" ? null : now;
    else payload.departure_time = now;

    const { error } = await supabase
      .from("attendance")
      .upsert(payload, { onConflict: "student_id,attendance_date" });

    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }

    const { subject, body } = buildMessage({
      studentName: student.full_name,
      status,
      date: fmtDate(new Date()),
      time: fmtTime(new Date()),
      className: student.classes?.name ?? "—",
      teacher: profile?.full_name ?? "",
      schoolName: "SchoolTrack Primary School",
    });
    const finalBody =
      mode === "departure" ? `${body}\n\nDeparture time: ${fmtTime(new Date())}` : body;

    if (student.parent_email) {
      await queueAttendanceNotification({
        data: {
          studentId: student.id,
          parentId: student.parent_id,
          recipientEmail: student.parent_email,
          subject,
          body: finalBody,
        },
      }).catch(() =>
        toast.warning("Attendance saved, but the parent notification could not be recorded."),
      );
    }

    await logAudit("attendance.record", "attendance", { student: student.full_name, status, mode });
    setSaving(false);
    toast.success(`${student.full_name} marked ${status.toUpperCase()}`);
    setStudent(null);
    setManual("");
    void refetchStats();
  };

  const c = (s: string) => (todayStats ?? []).filter((a) => a.status === s).length;

  return (
    <div>
      <PageHeader
        title="QR Scanner"
        description="Scan student ID cards, and record teacher & staff arrival and departure."
      />

      <div className="mb-4 flex gap-2">
        <Button
          variant={tab === "students" ? "default" : "outline"}
          onClick={() => setTab("students")}
        >
          <QrCode className="size-4" /> Students
        </Button>
        <Button variant={tab === "staff" ? "default" : "outline"} onClick={() => setTab("staff")}>
          <Users className="size-4" /> Teachers & staff
        </Button>
      </div>

      {tab === "staff" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teacher & staff attendance</CardTitle>
            <CardDescription>
              Only the secretary records staff arrival and departure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-56 flex-1 space-y-2">
                <Label htmlFor="staff-search">Search staff</Label>
                <Input
                  id="staff-search"
                  value={staffQuery}
                  placeholder="Name or email"
                  onChange={(e) => setStaffQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff member</TableHead>
                    <TableHead>In</TableHead>
                    <TableHead>Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Record</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(staff ?? [])
                    .filter((p) => {
                      const q = staffQuery.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
                      );
                    })
                    .map((p) => {
                      const rec = (staffToday ?? []).find((r) => r.staff_id === p.id);
                      const permission = (staffPermissions ?? []).find(
                        (r) => r.teacher_id === p.id,
                      );
                      return (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="font-medium">{p.full_name || "—"}</div>
                            <div className="text-xs text-muted-foreground">{p.email}</div>
                          </TableCell>
                          <TableCell>
                            {rec?.arrival_time ? fmtTime(rec.arrival_time) : "—"}
                          </TableCell>
                          <TableCell>
                            {rec?.departure_time ? fmtTime(rec.departure_time) : "—"}
                          </TableCell>
                          <TableCell>
                            {rec ? (
                              <StatusBadge status={rec.status} />
                            ) : (
                              <span className="text-xs text-muted-foreground">Not scanned</span>
                            )}
                            {permission && (
                              <div className="mt-1 inline-flex rounded-full bg-warning/25 px-2 py-0.5 text-[11px] font-medium text-warning-foreground">
                                Permission requested
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                disabled={savingStaff === p.id}
                                onClick={() => void recordStaff(p.id, p.full_name, "arrival")}
                              >
                                <LogIn className="size-4" /> Arrival
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={savingStaff === p.id}
                                onClick={() => void recordStaff(p.id, p.full_name, "departure")}
                              >
                                <LogOut className="size-4" /> Departure
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {!(staff ?? []).length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No staff profiles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Today's attendance"
              value={todayStats?.length ?? 0}
              icon={CheckCircle2}
            />
            <StatCard label="Present" value={c("present")} icon={UserCheck} tone="success" />
            <StatCard label="Absent" value={c("absent")} icon={UserX} tone="destructive" />
            <StatCard label="Sick" value={c("sick")} icon={Thermometer} tone="warning" />
            <StatCard label="Late" value={c("late")} icon={Clock} tone="info" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">1. Select class & scan</CardTitle>
                <CardDescription>
                  Point the camera at the QR code on the student's ID card.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={classId} onValueChange={setClassId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All classes</SelectItem>
                        {(classes ?? []).map((cl) => (
                          <SelectItem key={cl.id} value={cl.id}>
                            {cl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Scan type</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={mode === "arrival" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setMode("arrival")}
                      >
                        <LogIn className="size-4" /> Arrival
                      </Button>
                      <Button
                        type="button"
                        variant={mode === "departure" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setMode("departure")}
                      >
                        <LogOut className="size-4" /> Departure
                      </Button>
                    </div>
                  </div>
                </div>

                <div id="qr-reader" className="overflow-hidden rounded-xl border bg-muted" />

                <div className="flex gap-2">
                  {scanning ? (
                    <Button variant="outline" className="flex-1" onClick={() => void stopScanner()}>
                      <CameraOff className="size-4" /> Stop camera
                    </Button>
                  ) : (
                    <Button className="flex-1" onClick={() => setScanning(true)}>
                      <Camera className="size-4" /> Start camera
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual">Or enter the student ID / QR code manually</Label>
                  <div className="flex gap-2">
                    <Input
                      id="manual"
                      value={manual}
                      placeholder="STD-0001"
                      onChange={(e) => setManual(e.target.value)}
                    />
                    <Button variant="secondary" onClick={() => void lookup(manual)}>
                      <Search className="size-4" /> Find
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">2. Student profile & status</CardTitle>
                <CardDescription>The parent is notified as soon as you submit.</CardDescription>
              </CardHeader>
              <CardContent>
                {!student ? (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    Scan or search a student to continue.
                  </p>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
                      <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xl font-bold text-primary">
                        {student.photo_url ? (
                          <img
                            src={student.photo_url}
                            alt={student.full_name}
                            className="size-full object-cover"
                          />
                        ) : (
                          student.full_name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold">{student.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.student_code} · {student.classes?.name ?? "No class"} ·{" "}
                          {student.gender}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          Parent: {student.parent_email ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setStatus(s.value)}
                          className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-semibold transition-all ${
                            status === s.value
                              ? `${s.tone} border-transparent`
                              : "bg-card hover:bg-accent"
                          }`}
                        >
                          <s.icon className="size-5" />
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note">Note (optional)</Label>
                      <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Any remark for this record"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
                      <span className="text-muted-foreground">Recording</span>
                      <span className="font-medium">
                        {mode === "arrival" ? "Arrival" : "Departure"} · {fmtDate(new Date())} ·{" "}
                        {fmtTime(new Date())}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={status} />
                      <Button className="ml-auto" onClick={() => void submit()} disabled={saving}>
                        {saving ? "Saving…" : "Submit attendance"}
                      </Button>
                      <Button variant="ghost" onClick={() => setStudent(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
