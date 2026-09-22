import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileDown,
  FileSpreadsheet,
  Lock,
  Save,
  Send,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatusBadge } from "@/components/school/ui";
import { StudentProfileModal, type StudentProfileData } from "@/components/school/student-profile-modal";
import { fetchAttendance, fetchClasses, fmtDate, fmtTime, logAudit, todayISO } from "@/lib/school";
import { exportExcel, exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance & Register — Little Gems Academy" },
      {
        name: "description",
        content: "Mark student attendance, review absence permissions, and export historical logs.",
      },
      { property: "og:title", content: "Attendance & Register — Little Gems Academy" },
      {
        property: "og:description",
        content: "Mark student attendance, review absence permissions, and export historical logs.",
      },
    ],
  }),
  component: AttendancePage,
});

function getOffsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function AttendancePage() {
  const qc = useQueryClient();
  const { role, profile, user } = useAuth();

  const isTeacher = role === "teacher";
  const canAdminEdit =
    role === "admin" || role === "secretary" || role === "owner" || role === "head_of_studies";

  // Quick date navigation for Register
  const todayStr = todayISO();
  const yesterdayStr = getOffsetDate(-1);
  const tomorrowStr = getOffsetDate(1);
  const lastWeekStr = getOffsetDate(-7);
  const nextWeekStr = getOffsetDate(7);

  // Top Section: Live Register State
  const [registerDate, setRegisterDate] = useState(todayStr);
  const [registerClassId, setRegisterClassId] = useState<string>("");

  // Permission review modal
  const [selectedPermission, setSelectedPermission] = useState<any | null>(null);

  // Correction request modal for teachers on past attendance
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [correctionStudentId, setCorrectionStudentId] = useState("");
  const [correctionTargetStatus, setCorrectionTargetStatus] = useState("present");
  const [correctionReason, setCorrectionReason] = useState("");

  // Student profile modal state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfileData | null>(null);

  // Historical Records Table State
  const [from, setFrom] = useState(new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10));
  const [to, setTo] = useState(todayStr);
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

  // Query approved permission requests for class_access
  const { data: approvedClassAccess } = useQuery({
    queryKey: ["approved-class-access", user?.id],
    enabled: isTeacher && !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_requests")
        .select("class_id")
        .eq("type", "class_access")
        .eq("teacher_id", user!.id)
        .eq("status", "approved");
      if (error) return [];
      return data ?? [];
    },
  });

  // Allow inspecting all classes/sections across the academy
  const availableClasses = useMemo(() => {
    return classes ?? [];
  }, [classes]);

  const hasNoAssignedClasses = false;

  // Auto-select first class when classes load if none selected
  useMemo(() => {
    if (availableClasses.length > 0) {
      if (!registerClassId || !availableClasses.some((c) => c.id === registerClassId)) {
        setRegisterClassId(availableClasses[0].id);
      }
    } else if (hasNoAssignedClasses) {
      setRegisterClassId("");
    }
  }, [availableClasses, registerClassId, hasNoAssignedClasses]);

  // Query enrolled students for active register class
  const { data: classStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ["register-students", registerClassId],
    enabled: !!registerClassId && !hasNoAssignedClasses,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select(
          "id, full_name, student_code, photo_url, class_id, parent_phone, parent_name, parent_email",
        )
        .eq("class_id", registerClassId)
        .eq("active", true)
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Query attendance for active register date & class
  const { data: dayAttendance, isLoading: loadingDayAttendance } = useQuery({
    queryKey: ["register-attendance", registerClassId, registerDate],
    enabled: !!registerClassId && !hasNoAssignedClasses,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("class_id", registerClassId)
        .eq("attendance_date", registerDate);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Query permission requests for the active register date
  const { data: dayPermissions } = useQuery({
    queryKey: ["register-permissions", registerDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_requests")
        .select("*")
        .eq("permission_date", registerDate);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Query historical records for bottom report table
  const { data: records } = useQuery({
    queryKey: ["attendance", from, to],
    queryFn: () => fetchAttendance({ from, to }),
  });

  const isToday = registerDate === todayStr;
  const isPastDate = registerDate < todayStr;
  const isFutureDate = registerDate > todayStr;
  // Teachers can only mark and edit attendance for TODAY!
  // If the date is yesterday or tomorrow or anything other than today, editing is locked for teachers.
  const isDateLockedForTeacher = isTeacher && !isToday;

  // Local state for roll call marks before batch saving
  const [localStatuses, setLocalStatuses] = useState<Record<string, "present" | "absent">>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  // Sync dayAttendance into localStatuses whenever database data or class/date changes
  useEffect(() => {
    if (dayAttendance) {
      const initial: Record<string, "present" | "absent"> = {};
      dayAttendance.forEach((a) => {
        if (a.status === "present" || a.status === "late") {
          initial[a.student_id] = "present";
        } else if (a.status === "absent") {
          initial[a.student_id] = "absent";
        }
      });
      setLocalStatuses(initial);
      setHasUnsavedChanges(false);
    }
  }, [dayAttendance, registerClassId, registerDate]);

  const handleToggleStatus = (studentId: string, targetStatus: "present" | "absent") => {
    if (isDateLockedForTeacher) {
      toast.error(
        isPastDate
          ? "Past attendance is locked. Submit a correction request."
          : "Future dates cannot be marked in advance. Only today's attendance can be marked.",
      );
      return;
    }
    setLocalStatuses((prev) => {
      const next = { ...prev };
      if (next[studentId] === targetStatus) {
        delete next[studentId];
      } else {
        next[studentId] = targetStatus;
      }
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleMarkAllPresent = () => {
    if (isDateLockedForTeacher) {
      toast.error("Attendance can only be marked for today.");
      return;
    }
    if (!classStudents?.length) return;
    const allPresent: Record<string, "present" | "absent"> = {};
    classStudents.forEach((s) => {
      allPresent[s.id] = "present";
    });
    setLocalStatuses(allPresent);
    setHasUnsavedChanges(true);
    toast.info("All students marked present. Click 'Save Attendance' below to confirm.");
  };

  const saveAttendanceBatch = async () => {
    if (isDateLockedForTeacher) {
      toast.error("Attendance can only be saved for today.");
      return;
    }
    if (!registerClassId) {
      toast.error("Please select a class first.");
      return;
    }
    if (!classStudents?.length) {
      toast.error("No students in this class to save.");
      return;
    }

    setIsSavingBatch(true);
    try {
      const nowTime = new Date().toLocaleTimeString("en-US", { hour12: false });
      const currentAttendanceMap = new Map((dayAttendance ?? []).map((a) => [a.student_id, a]));

      for (const student of classStudents) {
        const status = localStatuses[student.id];
        if (!status) continue;
        const existing = currentAttendanceMap.get(student.id);
        if (existing) {
          await supabase
            .from("attendance")
            .update({
              status,
              recorded_by: user?.id ?? null,
              recorded_by_name: profile?.full_name ?? "Staff",
              arrival_time: status === "present" ? existing.arrival_time || nowTime : null,
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("attendance").insert({
            student_id: student.id,
            class_id: registerClassId,
            attendance_date: registerDate,
            status,
            arrival_time: status === "present" ? nowTime : null,
            recorded_by: user?.id ?? null,
            recorded_by_name: profile?.full_name ?? "Staff",
          });
        }
      }

      const currentClassObj = availableClasses.find((c) => c.id === registerClassId);
      await logAudit("attendance.save_register", "attendance", {
        class_id: registerClassId,
        class_name: currentClassObj?.name,
        date: registerDate,
        marked_count: Object.keys(localStatuses).length,
      });

      setHasUnsavedChanges(false);
      toast.success(`Attendance for ${currentClassObj?.name ?? "class"} saved!`, {
        description: "Records stored in database.",
        duration: 4000,
      });
      void qc.invalidateQueries({ queryKey: ["register-attendance"] });
      void qc.invalidateQueries({ queryKey: ["attendance"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save attendance.");
    } finally {
      setIsSavingBatch(false);
    }
  };

  // Single student mark mutation (for immediate fallback/admin use)
  const markStudent = useMutation({
    mutationFn: async (v: { studentId: string; status: string }) => {
      if (isDateLockedForTeacher) {
        throw new Error(
          "Attendance can only be marked for today. Direct editing of past/future dates is locked.",
        );
      }

      const existing = (dayAttendance ?? []).find((a) => a.student_id === v.studentId);
      const nowTime = new Date().toLocaleTimeString("en-US", { hour12: false });

      if (existing) {
        const { error } = await supabase
          .from("attendance")
          .update({
            status: v.status as "present",
            recorded_by: user?.id ?? null,
            recorded_by_name: profile?.full_name ?? "Staff",
            arrival_time: v.status === "present" ? existing.arrival_time || nowTime : null,
          })
          .eq("id", existing.id);
        if (error) throw error;
        await logAudit("attendance.edit", "attendance", { id: existing.id, status: v.status });
      } else {
        const { error } = await supabase.from("attendance").insert({
          student_id: v.studentId,
          class_id: registerClassId,
          attendance_date: registerDate,
          status: v.status as "present",
          arrival_time: v.status === "present" ? nowTime : null,
          recorded_by: user?.id ?? null,
          recorded_by_name: profile?.full_name ?? "Staff",
        });
        if (error) throw error;
        await logAudit("attendance.create", "attendance", {
          student_id: v.studentId,
          status: v.status,
        });
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["register-attendance"] });
      void qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Mark all present mutation
  const markAllPresent = useMutation({
    mutationFn: async () => {
      if (isDateLockedForTeacher) {
        throw new Error("Past attendance is locked for teachers.");
      }
      if (!classStudents?.length) return;

      const nowTime = new Date().toLocaleTimeString("en-US", { hour12: false });
      const attendanceMap = new Map((dayAttendance ?? []).map((a) => [a.student_id, a]));

      for (const student of classStudents) {
        const existing = attendanceMap.get(student.id);
        if (existing) {
          if (existing.status !== "present") {
            await supabase
              .from("attendance")
              .update({
                status: "present",
                recorded_by: user?.id ?? null,
                recorded_by_name: profile?.full_name ?? "Staff",
                arrival_time: existing.arrival_time || nowTime,
              })
              .eq("id", existing.id);
          }
        } else {
          await supabase.from("attendance").insert({
            student_id: student.id,
            class_id: registerClassId,
            attendance_date: registerDate,
            status: "present",
            arrival_time: nowTime,
            recorded_by: user?.id ?? null,
            recorded_by_name: profile?.full_name ?? "Staff",
          });
        }
      }
      await logAudit("attendance.mark_all_present", "attendance", {
        class_id: registerClassId,
        date: registerDate,
      });
    },
    onSuccess: () => {
      toast.success("All students marked present");
      void qc.invalidateQueries({ queryKey: ["register-attendance"] });
      void qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Secretary / Admin Approve or Reject Permission from register
  const decidePermission = useMutation({
    mutationFn: async (v: { id: string; status: "approved" | "rejected"; studentId?: string }) => {
      const { error } = await supabase
        .from("permission_requests")
        .update({
          status: v.status,
          reviewed_by: user?.id ?? null,
          reviewed_by_name: profile?.full_name ?? "Administration",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", v.id);
      if (error) throw error;

      if (v.status === "approved" && v.studentId && registerClassId) {
        // Automatically excuse student in attendance
        await markStudent.mutateAsync({
          studentId: v.studentId,
          status: "sick",
        });
      }
    },
    onSuccess: (_, vars) => {
      toast.success(`Permission request ${vars.status}`);
      setSelectedPermission(null);
      void qc.invalidateQueries({ queryKey: ["register-permissions"] });
      void qc.invalidateQueries({ queryKey: ["register-attendance"] });
      void qc.invalidateQueries({ queryKey: ["permission-requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Submit attendance correction request (for teachers on locked past dates)
  const submitCorrection = useMutation({
    mutationFn: async () => {
      if (!correctionStudentId) throw new Error("Select a student.");
      if (!correctionReason.trim()) throw new Error("Provide a reason for the correction.");

      const student = (classStudents ?? []).find((s) => s.id === correctionStudentId);

      const { error } = await supabase.from("permission_requests").insert({
        type: "attendance_correction",
        teacher_id: user!.id,
        teacher_name: profile?.full_name ?? "Teacher",
        class_id: registerClassId,
        student_id: correctionStudentId,
        student_name: student?.full_name ?? "Student",
        permission_date: registerDate,
        title: `Attendance Correction for ${fmtDate(registerDate)}`,
        reason: `Request to change status to [${correctionTargetStatus.toUpperCase()}]. Reason: ${correctionReason.trim()}`,
        status: "pending",
      });
      if (error) throw error;
      await logAudit("attendance.correction_request", "permission_requests", {
        student_id: correctionStudentId,
        date: registerDate,
        targetStatus: correctionTargetStatus,
      });
    },
    onSuccess: () => {
      toast.success("Attendance correction request sent to the Secretary.");
      setShowCorrectionDialog(false);
      setCorrectionReason("");
      void qc.invalidateQueries({ queryKey: ["permission-requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Historical records filter for bottom section
  const rows = useMemo(
    () =>
      (records ?? []).filter(
        (r) =>
          (classFilter === "all" || r.class_id === classFilter) &&
          (statusFilter === "all" || r.status === statusFilter),
      ),
    [records, classFilter, statusFilter],
  );

  const head = [
    "Student",
    "Student ID",
    "Class",
    "Status",
    "Date",
    "Arrival",
    "Departure",
    "Teacher",
  ];
  const body = rows.map((r) => [
    r.students?.full_name ?? "",
    r.students?.student_code ?? "",
    r.classes?.name ?? "",
    r.status,
    r.attendance_date,
    r.arrival_time ? fmtTime(r.arrival_time) : "—",
    r.departure_time ? fmtTime(r.departure_time) : "—",
    r.recorded_by_name ?? "",
  ]);

  // Attendance stats for the active register
  const currentTally = useMemo(() => {
    const totalEnrolled = classStudents?.length ?? 0;
    let present = 0;
    let absent = 0;
    (classStudents ?? []).forEach((s) => {
      const st = localStatuses[s.id];
      if (st === "present") present++;
      else if (st === "absent") absent++;
    });
    const unmarked = Math.max(0, totalEnrolled - (present + absent));
    return { totalEnrolled, present, absent, unmarked };
  }, [classStudents, localStatuses]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attendance & Register"
        description="Mark live class attendance, review parent permission notes, and export comprehensive audit records."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPdf("Attendance Records", head, body, "attendance-records")}
            >
              <FileDown className="size-4" /> Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportExcel(head, body, "attendance-records", "Attendance Records")}
            >
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
          </div>
        }
      />

      {/* TOP SECTION: MARK CLASS ATTENDANCE / LIVE REGISTER */}
      {hasNoAssignedClasses ? (
        <Card className="border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 p-8 text-center shadow-sm">
          <div className="max-w-md mx-auto space-y-3">
            <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 grid place-items-center mx-auto">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No Classes Assigned</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You do not have any classes assigned to your teacher account yet. As a teacher, you
              can only view and take attendance for classes assigned to you.
            </p>
            <p className="text-xs text-muted-foreground">
              Please contact the school secretary or administrator to assign you to a class.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CalendarCheck className="size-5 text-primary" /> Mark Class Attendance
                </CardTitle>
                <CardDescription>
                  Live daily register. Select class and date to take roll call.
                </CardDescription>
              </div>

              {/* Quick Date Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setRegisterDate(lastWeekStr)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium border transition-colors",
                    registerDate === lastWeekStr
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Last Week
                </button>
                <button
                  onClick={() => setRegisterDate(yesterdayStr)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium border transition-colors",
                    registerDate === yesterdayStr
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => setRegisterDate(todayStr)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium border transition-colors",
                    registerDate === todayStr
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Today
                </button>
                <button
                  onClick={() => setRegisterDate(tomorrowStr)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium border transition-colors",
                    registerDate === tomorrowStr
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => setRegisterDate(nextWeekStr)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium border transition-colors",
                    registerDate === nextWeekStr
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Next Week
                </button>

                <div className="flex items-center gap-1 pl-2">
                  <Input
                    type="date"
                    value={registerDate}
                    onChange={(e) => setRegisterDate(e.target.value)}
                    className="h-7 w-32 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Controls: Class Selector Cell & Summary */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Class:</span>
                  <div className="w-56">
                    <Select value={registerClassId} onValueChange={setRegisterClassId}>
                      <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map((c) => (
                          <SelectItem key={c.id} value={c.id} className="text-xs">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="size-3.5" />
                  <span className="font-semibold text-foreground">{fmtDate(registerDate)}</span>
                  {registerDate === todayStr && (
                    <Badge variant="secondary" className="text-[10px] py-0 font-medium">
                      Today
                    </Badge>
                  )}
                  {isPastDate && (
                    <Badge variant="outline" className="text-[10px] py-0 text-muted-foreground">
                      Past Record
                    </Badge>
                  )}
                  {isFutureDate && (
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 text-sky-600 border-sky-300"
                    >
                      Upcoming Date
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Action Buttons */}
              {!isDateLockedForTeacher && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkAllPresent}
                    disabled={!classStudents?.length}
                    className="gap-1.5 text-xs h-8"
                  >
                    <CheckCheck className="size-3.5 text-emerald-600" /> Mark All Present
                  </Button>
                </div>
              )}
            </div>

            {/* Locked Notice for Teachers on Past or Future Dates */}
            {isDateLockedForTeacher && (
              <div className="mt-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between text-xs text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 shrink-0" />
                  <span>
                    {isPastDate
                      ? `Past attendance records for ${fmtDate(registerDate)} are locked for teachers to preserve official school audit records. Only today's attendance can be marked directly.`
                      : `Future dates (${fmtDate(registerDate)}) cannot be marked in advance. Teachers can only take roll call for today.`}
                  </span>
                </div>
                {isPastDate && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-white dark:bg-card border-amber-300 text-amber-900 dark:text-amber-200"
                    onClick={() => setShowCorrectionDialog(true)}
                  >
                    <Send className="size-3 mr-1" /> Request Correction
                  </Button>
                )}
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs border-t pt-3">
              <div>
                <span className="text-muted-foreground">Enrolled: </span>
                <span className="font-semibold">{currentTally.totalEnrolled}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Present: </span>
                <span className="font-semibold text-emerald-600">✓ {currentTally.present}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Absent: </span>
                <span className="font-semibold text-rose-600">✕ {currentTally.absent}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Unmarked: </span>
                <span className="font-semibold text-muted-foreground">{currentTally.unmarked}</span>
              </div>
            </div>
          </CardHeader>

          {/* Live Student Register Table */}
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permission Notes</TableHead>
                  <TableHead className="text-right">
                    {isDateLockedForTeacher ? "Status" : "Mark Roll Call"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(classStudents ?? []).map((student) => {
                  const effectiveStatus = localStatuses[student.id];
                  const record = (dayAttendance ?? []).find((a) => a.student_id === student.id);
                  const permission = (dayPermissions ?? []).find(
                    (p) => p.student_id === student.id,
                  );

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {student.photo_url ? (
                            <img
                              src={student.photo_url}
                              alt={student.full_name}
                              className="size-8 rounded-full object-cover border shadow-xs shrink-0 cursor-pointer hover:opacity-80"
                              onClick={() =>
                                setSelectedStudentForProfile({
                                  id: student.id,
                                  student_code: student.student_code,
                                  full_name: student.full_name,
                                  photo_url: student.photo_url,
                                  class_id: student.class_id,
                                  classes: {
                                    name: (classes ?? []).find((c) => c.id === student.class_id)?.name,
                                  },
                                  parent_name: student.parent_name,
                                  parent_email: student.parent_email,
                                  parent_phone: student.parent_phone,
                                })
                              }
                            />
                          ) : (
                            <div
                              className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary cursor-pointer hover:bg-primary/20"
                              onClick={() =>
                                setSelectedStudentForProfile({
                                  id: student.id,
                                  student_code: student.student_code,
                                  full_name: student.full_name,
                                  photo_url: student.photo_url,
                                  class_id: student.class_id,
                                  classes: {
                                    name: (classes ?? []).find((c) => c.id === student.class_id)?.name,
                                  },
                                  parent_name: student.parent_name,
                                  parent_email: student.parent_email,
                                  parent_phone: student.parent_phone,
                                })
                              }
                            >
                              {student.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <button
                              type="button"
                              className="font-medium text-sm leading-tight text-foreground text-left hover:text-primary hover:underline cursor-pointer"
                              onClick={() =>
                                setSelectedStudentForProfile({
                                  id: student.id,
                                  student_code: student.student_code,
                                  full_name: student.full_name,
                                  photo_url: student.photo_url,
                                  class_id: student.class_id,
                                  classes: {
                                    name: (classes ?? []).find((c) => c.id === student.class_id)?.name,
                                  },
                                  parent_name: student.parent_name,
                                  parent_email: student.parent_email,
                                  parent_phone: student.parent_phone,
                                })
                              }
                            >
                              {student.full_name}
                            </button>
                            {record?.arrival_time && effectiveStatus === "present" && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="size-3" /> In: {fmtTime(record.arrival_time)}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {student.student_code}
                      </TableCell>

                      <TableCell>
                        {effectiveStatus ? (
                          <StatusBadge status={effectiveStatus} />
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unmarked</span>
                        )}
                      </TableCell>

                      {/* Permission Request column */}
                      <TableCell>
                        {permission ? (
                          <button
                            onClick={() => setSelectedPermission(permission)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                              permission.status === "approved"
                                ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800"
                                : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800",
                            )}
                          >
                            <FileCheck className="size-3" />
                            <span className="truncate max-w-[130px]">
                              {permission.title || "Parent Permission"}
                            </span>
                            <span className="text-[10px] uppercase font-bold">
                              ({permission.status})
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Mark Buttons (Only ✓ Present and ✕ Absent) */}
                      <TableCell className="text-right">
                        {isDateLockedForTeacher ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-muted-foreground">Locked</span>
                            {isPastDate && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-muted-foreground"
                                onClick={() => {
                                  setCorrectionStudentId(student.id);
                                  setShowCorrectionDialog(true);
                                }}
                              >
                                Request Edit
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              type="button"
                              variant={effectiveStatus === "present" ? "default" : "outline"}
                              className={cn(
                                "h-7 px-2.5 text-xs font-semibold gap-1 transition-colors",
                                effectiveStatus === "present"
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                  : "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
                              )}
                              onClick={() => handleToggleStatus(student.id, "present")}
                            >
                              <span className="font-bold text-sm leading-none">✓</span> Present
                            </Button>
                            <Button
                              size="sm"
                              type="button"
                              variant={effectiveStatus === "absent" ? "default" : "outline"}
                              className={cn(
                                "h-7 px-2.5 text-xs font-semibold gap-1 transition-colors",
                                effectiveStatus === "absent"
                                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                                  : "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/20",
                              )}
                              onClick={() => handleToggleStatus(student.id, "absent")}
                            >
                              <span className="font-bold text-sm leading-none">✕</span> Absent
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!classStudents?.length && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-xs text-muted-foreground"
                    >
                      {loadingStudents
                        ? "Loading enrolled students..."
                        : "No enrolled students found in this class."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Dedicated Save Attendance Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">Class:</span>
                <span className="font-semibold text-foreground">
                  {availableClasses.find((c) => c.id === registerClassId)?.name || "—"}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-emerald-600 font-semibold">
                  ✓ {currentTally.present} Present
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-rose-600 font-semibold">✕ {currentTally.absent} Absent</span>
                {currentTally.unmarked > 0 && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{currentTally.unmarked} Unmarked</span>
                  </>
                )}
                {hasUnsavedChanges && (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-300 text-[10px] ml-2"
                  >
                    ● Unsaved changes
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  size="sm"
                  onClick={saveAttendanceBatch}
                  disabled={isDateLockedForTeacher || isSavingBatch || !classStudents?.length}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm h-9 px-5"
                >
                  <Save className="size-4" />
                  {isSavingBatch ? "Saving Attendance..." : "Save Attendance"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BOTTOM SECTION: ATTENDANCE RECORDS & REPORTS TABLE */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" /> Attendance Records & History
            </CardTitle>
            <CardDescription>
              Search historical attendance logs, filter by custom date range, and export to PDF/Excel with school branding.
            </CardDescription>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPdf("Attendance Records", head, body, "attendance-records")}
            >
              <FileDown className="size-4" /> Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportExcel(head, body, "attendance-records", "Attendance Records")}
            >
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {hasNoAssignedClasses ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No attendance records to display. No classes are assigned to your teacher account.
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {isTeacher ? "All my assigned classes" : "All classes"}
                      </SelectItem>
                      {availableClasses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["all", "present", "absent", "sick"].map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s === "all"
                            ? "All statuses"
                            : s === "present"
                              ? "✓ Present"
                              : s === "absent"
                                ? "✕ Absent"
                                : "Sick / Excused"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-medium">{r.students?.full_name}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {r.students?.student_code}
                          </div>
                        </TableCell>
                        <TableCell>{r.classes?.name ?? "—"}</TableCell>
                        <TableCell>{fmtDate(r.attendance_date)}</TableCell>
                        <TableCell>{r.arrival_time ? fmtTime(r.arrival_time) : "—"}</TableCell>
                        <TableCell>{r.departure_time ? fmtTime(r.departure_time) : "—"}</TableCell>
                        <TableCell>{r.recorded_by_name ?? "—"}</TableCell>
                        <TableCell>
                          {/* Admin / Secretary can edit; Teachers see clean status badge */}
                          {canAdminEdit ? (
                            <Select
                              value={r.status}
                              onValueChange={(v) =>
                                supabase
                                  .from("attendance")
                                  .update({ status: v as "present" })
                                  .eq("id", r.id)
                                  .then(() => {
                                    toast.success("Updated");
                                    void qc.invalidateQueries({ queryKey: ["attendance"] });
                                  })
                              }
                            >
                              <SelectTrigger className="w-28 h-7 text-xs capitalize">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["present", "absent", "sick"].map((s) => (
                                  <SelectItem key={s} value={s} className="capitalize text-xs">
                                    {s === "present"
                                      ? "✓ Present"
                                      : s === "absent"
                                        ? "✕ Absent"
                                        : "Sick"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <StatusBadge status={r.status} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!rows.length && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                          No attendance records match your filter criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Permission Detail Dialog (Shows reason and allows Secretary/Admin to approve or reject) */}
      <Dialog
        open={!!selectedPermission}
        onOpenChange={(open) => !open && setSelectedPermission(null)}
      >
        <DialogContent className="max-w-md">
          {selectedPermission && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={selectedPermission.status} />
                  <span className="text-xs text-muted-foreground">
                    Date: {fmtDate(selectedPermission.permission_date || registerDate)}
                  </span>
                </div>
                <DialogTitle className="text-base font-bold">
                  {selectedPermission.title || "Student Permission Request"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Submitted by{" "}
                  {selectedPermission.parent_name || selectedPermission.teacher_name || "Parent"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div className="rounded-md bg-muted/60 p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span className="font-semibold">
                      {selectedPermission.student_name || "Student"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested Date:</span>
                    <span className="font-medium">{selectedPermission.permission_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>{fmtDate(selectedPermission.created_at)}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Reason & Parent Explanation
                  </Label>
                  <p className="mt-1 rounded border p-2.5 leading-relaxed bg-background text-foreground text-xs">
                    {selectedPermission.reason || "No detailed reason provided."}
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {canAdminEdit && selectedPermission.status === "pending" ? (
                  <div className="flex w-full items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                      onClick={() =>
                        decidePermission.mutate({
                          id: selectedPermission.id,
                          status: "rejected",
                        })
                      }
                    >
                      <X className="size-3.5 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      onClick={() =>
                        decidePermission.mutate({
                          id: selectedPermission.id,
                          status: "approved",
                          studentId: selectedPermission.student_id,
                        })
                      }
                    >
                      <Check className="size-3.5 mr-1" /> Approve & Excuse
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPermission(null)}
                    className="w-full text-xs"
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Correction Dialog for Teachers */}
      <Dialog open={showCorrectionDialog} onOpenChange={setShowCorrectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Send className="size-4 text-primary" /> Request Attendance Correction
            </DialogTitle>
            <DialogDescription className="text-xs">
              Past attendance is locked. Submit a request to the Secretary/Administration to update
              the record for {fmtDate(registerDate)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Select Student</Label>
              <Select value={correctionStudentId} onValueChange={setCorrectionStudentId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {(classStudents ?? []).map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.full_name} ({s.student_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Requested Status</Label>
              <Select value={correctionTargetStatus} onValueChange={setCorrectionTargetStatus}>
                <SelectTrigger className="text-xs capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["present", "late", "sick", "absent"].map((s) => (
                    <SelectItem key={s} value={s} className="capitalize text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Reason for Correction</Label>
              <Textarea
                rows={3}
                placeholder="Explain why the record needs to be updated (e.g., student arrived late with permit, wrong button pressed)..."
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCorrectionDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => submitCorrection.mutate()}
              disabled={
                !correctionStudentId || !correctionReason.trim() || submitCorrection.isPending
              }
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Profile Dialog */}
      <StudentProfileModal
        open={!!selectedStudentForProfile}
        onOpenChange={(open) => !open && setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
      />
    </div>
  );
}
