import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Baby,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  CircleCheck,
  Clock,
  FileCheck,
  FileDown,
  FileSpreadsheet,
  Plus,
  Send,
  UserX,
  ShieldAlert,
  AlertTriangle,
  Check,
  Trophy,
  MapPin,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, ParentStatusBadge, StatCard, StatusBadge } from "@/components/school/ui";
import { fmtDate, fmtTime, todayISO, logAudit } from "@/lib/school";
import { exportExcel, exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/children")({
  head: () => ({
    meta: [
      { title: "My Children — SchoolTrack" },
      {
        name: "description",
        content: "View your child's profile, daily attendance, and submit leave permissions.",
      },
      { property: "og:title", content: "My Children — SchoolTrack" },
      {
        property: "og:description",
        content: "View your child's profile, daily attendance, and submit leave permissions.",
      },
    ],
  }),
  component: ChildrenPage,
});

function getOffsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function ChildrenPage() {
  const qc = useQueryClient();
  const { user, profile } = useAuth();

  const todayStr = todayISO();
  const yesterdayStr = getOffsetDate(-1);
  const tomorrowStr = getOffsetDate(1);

  // Selected quick day focus
  const [selectedDay, setSelectedDay] = useState(todayStr);

  // Permission Request Modal State
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionStudentId, setPermissionStudentId] = useState("");
  const [permissionTitle, setPermissionTitle] = useState("");
  const [permissionDate, setPermissionDate] = useState(todayStr);
  const [permissionReason, setPermissionReason] = useState("");

  // Query parent's children and full attendance
  const { data, isLoading } = useQuery({
    queryKey: ["my-children-full", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: students } = await supabase
        .from("students")
        .select("*, classes(name)")
        .eq("parent_id", user!.id)
        .order("full_name");
      const ids = (students ?? []).map((s) => s.id);

      const [
        { data: att },
        { data: permissions },
        { data: discipline },
        { data: clubMemberships },
        { data: clubsList },
      ] = await Promise.all([
        ids.length
          ? supabase
              .from("attendance")
              .select("*")
              .in("student_id", ids)
              .order("attendance_date", { ascending: false })
              .limit(500)
          : Promise.resolve({ data: [] }),
        ids.length
          ? supabase
              .from("permission_requests")
              .select("*")
              .in("student_id", ids)
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [] }),
        ids.length
          ? supabase
              .from("discipline_incidents")
              .select("*")
              .in("student_id", ids)
              .order("incident_date", { ascending: false })
          : Promise.resolve({ data: [] }),
        ids.length
          ? supabase.from("club_memberships").select("*").in("student_id", ids)
          : Promise.resolve({ data: [] }),
        supabase.from("clubs").select("*"),
      ]);

      return {
        students: students ?? [],
        attendance: att ?? [],
        permissions: permissions ?? [],
        discipline: discipline ?? [],
        clubMemberships: clubMemberships ?? [],
        clubs: clubsList ?? [],
      };
    },
  });

  // Acknowledge discipline notice
  const acknowledgeDiscipline = useMutation({
    mutationFn: async (incidentId: string) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("discipline_incidents")
        .update({
          parent_acknowledged: true,
          parent_acknowledged_at: now,
        })
        .eq("id", incidentId);
      if (error) throw error;
      await logAudit("discipline.parent_acknowledged", "discipline_incidents", {
        incident_id: incidentId,
        parent_id: user?.id,
      });
    },
    onSuccess: () => {
      toast.success("Conduct notice acknowledged.");
      void qc.invalidateQueries({ queryKey: ["my-children-full"] });
      void qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
      void qc.invalidateQueries({ queryKey: ["pending-discipline-count"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Submit permission request
  const submitPermission = useMutation({
    mutationFn: async () => {
      if (!permissionStudentId) throw new Error("Please select your child.");
      if (!permissionTitle.trim()) throw new Error("Please enter a title for the permission.");
      if (!permissionReason.trim()) throw new Error("Please provide a reason for the absence.");

      const child = (data?.students ?? []).find((s) => s.id === permissionStudentId);

      const { error } = await supabase.from("permission_requests").insert({
        type: "student_leave",
        teacher_id: user!.id,
        parent_id: user!.id,
        teacher_name: profile?.full_name || "Parent",
        parent_name: profile?.full_name || "Parent",
        student_id: permissionStudentId,
        student_name: child?.full_name ?? "Student",
        class_id: child?.class_id ?? null,
        title: permissionTitle.trim(),
        permission_date: permissionDate,
        reason: permissionReason.trim(),
        status: "pending",
      });
      if (error) throw error;
      await logAudit("permission.student_leave_request", "permission_requests", {
        student_id: permissionStudentId,
        date: permissionDate,
      });
    },
    onSuccess: () => {
      toast.success("Permission request sent to Secretary and Administration.");
      setShowPermissionDialog(false);
      setPermissionTitle("");
      setPermissionReason("");
      void qc.invalidateQueries({ queryKey: ["my-children-full"] });
      void qc.invalidateQueries({ queryKey: ["permission-requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleExportChildPdf = (student: any, attRows: any[]) => {
    const head = ["Date", "Status", "Arrival Time", "Departure Time", "Notes"];
    const body = attRows.map((r) => [
      r.attendance_date,
      r.status === "present" || r.status === "late" ? "Present" : "Absent",
      r.arrival_time ? fmtTime(r.arrival_time) : "—",
      r.departure_time ? fmtTime(r.departure_time) : "—",
      r.note || "—",
    ]);
    exportPdf(
      `Attendance Record - ${student.full_name}`,
      head,
      body,
      `attendance-${student.student_code}`,
    );
  };

  const handleExportChildExcel = (student: any, attRows: any[]) => {
    const head = ["Date", "Status", "Arrival Time", "Departure Time", "Notes"];
    const body = attRows.map((r) => [
      r.attendance_date,
      r.status === "present" || r.status === "late" ? "Present" : "Absent",
      r.arrival_time ? fmtTime(r.arrival_time) : "—",
      r.departure_time ? fmtTime(r.departure_time) : "—",
      r.note || "—",
    ]);
    exportExcel(head, body, `attendance-${student.student_code}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Children"
        description="Monitor daily school attendance for yesterday, today, and tomorrow, and request leave permissions."
        action={
          <Button
            className="gap-2 shadow-sm"
            onClick={() => {
              if (data?.students?.length) {
                setPermissionStudentId(data.students[0].id);
              }
              setShowPermissionDialog(true);
            }}
          >
            <Plus className="size-4" /> Request Leave / Permission
          </Button>
        }
      />

      {/* Date Switcher Bar (Yesterday, Today, Tomorrow) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            View Day Status:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDay(yesterdayStr)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium border transition-colors",
              selectedDay === yesterdayStr
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            Yesterday ({fmtDate(yesterdayStr)})
          </button>
          <button
            onClick={() => setSelectedDay(todayStr)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium border transition-colors",
              selectedDay === todayStr
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            Today ({fmtDate(todayStr)})
          </button>
          <button
            onClick={() => setSelectedDay(tomorrowStr)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium border transition-colors",
              selectedDay === tomorrowStr
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            Tomorrow ({fmtDate(tomorrowStr)})
          </button>
        </div>
      </div>

      {!data?.students.length && !isLoading && (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-3">
            <Baby className="mx-auto size-10 text-muted-foreground/50" />
            <p className="font-semibold text-base">No children linked to your account</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Please contact the school secretary with your child's student registration code to
              link their profile.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Children List */}
      {(data?.students ?? []).map((s) => {
        const rows = (data?.attendance ?? []).filter((a) => a.student_id === s.id);
        const permissions = (data?.permissions ?? []).filter((p) => p.student_id === s.id);

        const presentCount = rows.filter(
          (r) => r.status === "present" || r.status === "late",
        ).length;
        const absentCount = rows.filter((r) => r.status === "absent" || r.status === "sick").length;
        const rate = rows.length ? Math.round((presentCount / rows.length) * 100) : 0;

        // Check record for the selected day focus
        const dayRecord = rows.find((r) => r.attendance_date === selectedDay);
        const dayPermission = permissions.find((p) => p.permission_date === selectedDay);

        return (
          <Card key={s.id} className="shadow-sm border">
            <CardHeader className="border-b pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold">{s.full_name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                      {s.student_code}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">
                    Class:{" "}
                    <span className="font-semibold text-foreground">
                      {s.classes?.name ?? "Assigned Class"}
                    </span>
                  </CardDescription>
                </div>

                {/* Day status focus indicator */}
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border bg-muted/40 px-3 py-1.5 text-right">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      Status on {fmtDate(selectedDay)}
                    </p>
                    <div className="mt-0.5 flex items-center justify-end gap-1.5">
                      {dayRecord ? (
                        <ParentStatusBadge status={dayRecord.status} />
                      ) : dayPermission ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <FileCheck className="size-3" /> Permission {dayPermission.status}
                        </span>
                      ) : selectedDay === tomorrowStr ? (
                        <span className="text-xs text-muted-foreground">Scheduled Day</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not recorded</span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs h-8"
                    onClick={() => {
                      setPermissionStudentId(s.id);
                      setPermissionDate(selectedDay);
                      setShowPermissionDialog(true);
                    }}
                  >
                    <Send className="size-3.5" /> Request Leave
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Metrics Grid */}
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                  label="Attendance Rate"
                  value={`${rate}%`}
                  icon={CircleCheck}
                  tone="success"
                  hint="Calculated from gate logs"
                />
                <StatCard
                  label="Days Present"
                  value={presentCount}
                  icon={CalendarCheck}
                  tone="info"
                  hint="Present & on-time"
                />
                <StatCard
                  label="Days Absent"
                  value={absentCount}
                  icon={UserX}
                  tone="destructive"
                  hint="Excused & unexcused"
                />
              </div>

              {/* Active Permissions Section for this Child */}
              {permissions.length > 0 && (
                <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
                  <p className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                    <FileCheck className="size-3.5 text-primary" /> Leave & Permission Requests
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {permissions.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="rounded-md border bg-card p-2.5 text-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold">{p.title || "Absence Permission"}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Date: {p.permission_date || fmtDate(p.created_at)}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            Reason: {p.reason}
                          </p>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discipline & Conduct Records for this Child */}
              {(() => {
                const childIncidents = (data?.discipline ?? []).filter(
                  (d: any) => d.student_id === s.id,
                );
                const unacknowledgedCount = childIncidents.filter(
                  (d: any) => !d.parent_acknowledged,
                ).length;

                return (
                  <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                        <ShieldAlert className="size-3.5 text-primary" /> Conduct & Discipline
                        Records
                        <span className="text-[11px] font-normal text-muted-foreground ml-1">
                          ({childIncidents.length}{" "}
                          {childIncidents.length === 1 ? "record" : "records"})
                        </span>
                      </p>
                      {unacknowledgedCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="size-3 text-amber-600" />
                          {unacknowledgedCount} requires acknowledgement
                        </span>
                      )}
                    </div>

                    {childIncidents.length === 0 ? (
                      <div className="rounded-md border bg-card/60 p-3 text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          <strong>Exemplary Standing:</strong> No discipline notices or conduct
                          infractions have been recorded.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {childIncidents.map((incident: any) => {
                          const isPending = !incident.parent_acknowledged;
                          const isMajor = incident.severity === "major";
                          const isModerate = incident.severity === "moderate";

                          return (
                            <div
                              key={incident.id}
                              className={cn(
                                "rounded-md border p-3 text-xs space-y-2 transition-all",
                                isPending
                                  ? isMajor
                                    ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20"
                                    : "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20"
                                  : "bg-card",
                              )}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">
                                      {incident.category}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-[10px] uppercase font-bold",
                                        isMajor
                                          ? "text-rose-700 bg-rose-500/10 border-rose-300"
                                          : isModerate
                                            ? "text-amber-700 bg-amber-500/10 border-amber-300"
                                            : "text-blue-700 bg-blue-500/10 border-blue-300",
                                      )}
                                    >
                                      {incident.severity}
                                    </Badge>
                                  </div>
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                                    <span>{fmtDate(incident.incident_date)}</span>
                                    {incident.incident_time && (
                                      <span>· {incident.incident_time}</span>
                                    )}
                                    <span>
                                      · Reported by {incident.reported_by_name || "Teacher"}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  {isPending ? (
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                      onClick={() => acknowledgeDiscipline.mutate(incident.id)}
                                      disabled={acknowledgeDiscipline.isPending}
                                    >
                                      <Check className="size-3.5" /> Acknowledge & Sign
                                    </Button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-medium border border-emerald-500/20">
                                      <Check className="size-3" /> Acknowledged on{" "}
                                      {fmtDate(incident.parent_acknowledged_at)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="text-foreground/90 leading-relaxed pt-0.5">
                                {incident.description}
                              </p>

                              {incident.action_taken && (
                                <div className="text-[11px] text-muted-foreground bg-muted/40 rounded px-2.5 py-1 border">
                                  <span className="font-semibold text-foreground">
                                    Action taken by school:{" "}
                                  </span>
                                  {incident.action_taken}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Extracurricular Activities & Clubs Section for Child */}
              {(() => {
                const childClubs = (data?.clubMemberships ?? []).filter(
                  (m: any) => m.student_id === s.id,
                );
                return (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Trophy className="size-3.5 text-primary" />
                        Extracurricular Clubs & Activities
                      </p>
                      <Link
                        to="/activities"
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Browse All Clubs →
                      </Link>
                    </div>

                    {childClubs.length === 0 ? (
                      <div className="rounded-md border bg-card/60 p-3 text-xs text-muted-foreground flex items-center justify-between">
                        <span>Not currently enrolled in any extracurricular clubs.</span>
                        <Link
                          to="/activities"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View Club Schedules
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {childClubs.map((m: any) => {
                          const club = (data?.clubs ?? []).find((c: any) => c.id === m.club_id);
                          return (
                            <div
                              key={m.id}
                              className="rounded-md border bg-card p-3 text-xs space-y-1.5 shadow-xs"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-bold text-foreground">
                                  {club?.name || "School Club"}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-primary/10 text-primary border-primary/30"
                                >
                                  {m.role_in_club}
                                </Badge>
                              </div>
                              {club && (
                                <div className="text-[11px] text-muted-foreground space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="size-3 shrink-0" />
                                    <span>{club.schedule}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="size-3 shrink-0" />
                                    <span>{club.venue}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-foreground/80">
                                    <span>Coach: {club.coach_name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Attendance Records Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Attendance History ({rows.length} records)
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleExportChildPdf(s, rows)}
                    >
                      <FileDown className="size-3.5" /> PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleExportChildExcel(s, rows)}
                    >
                      <FileSpreadsheet className="size-3.5" /> Excel
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Arrival In</TableHead>
                        <TableHead>Departure Out</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.slice(0, 20).map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-xs">
                            {fmtDate(r.attendance_date)}
                          </TableCell>
                          <TableCell>
                            <ParentStatusBadge status={r.status} />
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.arrival_time ? fmtTime(r.arrival_time) : "—"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.departure_time ? fmtTime(r.departure_time) : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {!rows.length && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground py-6 text-xs"
                          >
                            No attendance recorded yet for this student.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Leave / Permission Request Modal */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Send className="size-4 text-primary" /> Request Leave or Absence Permission
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submit an official permission request to the school secretary and principal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Select Child</Label>
              <Select value={permissionStudentId} onValueChange={setPermissionStudentId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Choose child" />
                </SelectTrigger>
                <SelectContent>
                  {(data?.students ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.full_name} ({c.student_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Permission Title</Label>
              <Input
                placeholder="e.g. Doctor appointment, illness, bereavement..."
                value={permissionTitle}
                onChange={(e) => setPermissionTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Date of Permission</Label>
              <Input
                type="date"
                value={permissionDate}
                onChange={(e) => setPermissionDate(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Reason & Explanation</Label>
              <Textarea
                rows={3}
                placeholder="Please describe why your child will be absent..."
                value={permissionReason}
                onChange={(e) => setPermissionReason(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPermissionDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => submitPermission.mutate()}
              disabled={
                !permissionStudentId ||
                !permissionTitle.trim() ||
                !permissionReason.trim() ||
                submitPermission.isPending
              }
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
