import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  Award,
  Baby,
  BookOpen,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileBarChart,
  FileChartColumnIncreasing,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  Megaphone,
  Percent,
  Plus,
  Printer,
  QrCode,
  Receipt,
  School,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, roleLabel } from "@/lib/auth";
import { StatCard, PageHeader, StatusBadge, ParentStatusBadge } from "@/components/school/ui";
import { fmtDate, fmtTime, todayISO, logAudit, fetchClasses } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentQrModal, type StudentProfileForQr } from "@/components/school/student-qr-modal";

export function AdminDashboard() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const today = todayISO();

  const [selectedStudentForQr, setSelectedStudentForQr] = useState<StudentProfileForQr | null>(
    null,
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"gate" | "profiles">("gate");
  const [studentSearch, setStudentSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin-dashboard-data", today],
    queryFn: async () => {
      const [studentsRes, classesRes, rolesRes, attTodayRes, recentAttRes, staffTodayRes] =
        await Promise.all([
          supabase
            .from("students")
            .select(
              "id, full_name, student_code, class_id, gender, religion, date_of_birth, parent_name, parent_email, parent_phone, address, photo_url, qr_token, classes(name)",
            )
            .order("full_name", { ascending: true }),
          supabase.from("classes").select("id, name").order("name", { ascending: true }),
          supabase.from("user_roles").select("role"),
          supabase
            .from("attendance")
            .select("id, status, student_id, arrival_time, departure_time")
            .eq("attendance_date", today),
          supabase
            .from("attendance")
            .select(
              "id, status, arrival_time, departure_time, student_id, students(id, full_name, student_code, class_id, gender, religion, date_of_birth, parent_name, parent_email, parent_phone, address, photo_url, qr_token, classes(name)), classes(name)",
            )
            .eq("attendance_date", today)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("staff_attendance")
            .select("id, staff_name, status, arrival_time")
            .eq("attendance_date", today),
        ]);

      const totalStudents = studentsRes.data?.length ?? 0;
      const roles = rolesRes.data ?? [];
      const teacherCount = roles.filter((r) => r.role === "teacher").length;
      const parentCount = roles.filter((r) => r.role === "parent").length;

      return {
        totalStudents,
        students: (studentsRes.data ?? []) as any[],
        classes: (classesRes.data ?? []) as any[],
        totalClasses: classesRes.data?.length ?? 0,
        teacherCount,
        parentCount,
        attToday: attTodayRes.data ?? [],
        recentAtt: recentAttRes.data ?? [],
        staffToday: staffTodayRes.data ?? [],
      };
    },
  });

  const totalStudents = adminData?.totalStudents ?? 0;
  const attToday = adminData?.attToday ?? [];
  const presentStudents = attToday.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;
  const rate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  const studentsList: any[] = adminData?.students ?? [];
  const classesList: any[] = adminData?.classes ?? [];

  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      !studentSearch.trim() ||
      s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.student_code?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.classes?.name?.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass = classFilter === "all" || s.class_id === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Administrator"}`}
        description={`School Administration & Gate Operations · ${fmtDate(new Date())}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-medium cursor-pointer"
              onClick={() => {
                setActiveTab("profiles");
                if (studentsList.length > 0 && !selectedStudentForQr) {
                  setSelectedStudentForQr(studentsList[0]);
                }
              }}
            >
              <QrCode className="size-4" />
              <span>Student QR Passes</span>
            </Button>
            <Button asChild className="gap-2">
              <Link to="/students">
                <Plus className="size-4" /> Register Student / Parent
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/classes">
                <School className="size-4" /> Manage Classes
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/scan" search={{ tab: "students" }}>
                <QrCode className="size-4" /> Scan Student QR
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/settings">
                <Settings className="size-4" /> Settings
              </Link>
            </Button>
          </div>
        }
      />

      {/* Top School Core KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          tone="primary"
          hint="Enrolled active learners"
        />
        <StatCard
          label="Attendance Rate Today"
          value={`${rate}%`}
          icon={Percent}
          tone="success"
          hint={`${presentStudents} of ${totalStudents} present`}
        />
        <StatCard
          label="Active Classes"
          value={adminData?.totalClasses ?? 0}
          icon={School}
          tone="info"
          hint="All grade levels"
        />
        <StatCard
          label="Teaching Staff"
          value={adminData?.teacherCount ?? 0}
          icon={Users}
          tone="primary"
          hint={`${adminData?.staffToday.length ?? 0} checked in today`}
        />
      </div>

      {/* Today's Gate Status Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Present on Time"
          value={attToday.filter((a) => a.status === "present").length}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Late Scans"
          value={attToday.filter((a) => a.status === "late").length}
          icon={Clock}
          tone="info"
        />
        <StatCard
          label="Sick Leave"
          value={attToday.filter((a) => a.status === "sick").length}
          icon={Thermometer}
          tone="warning"
        />
        <StatCard
          label="Unscanned / Absent"
          value={Math.max(0, totalStudents - presentStudents)}
          icon={UserX}
          tone="destructive"
        />
      </div>

      {/* Main Grid: Live Gate Stream & Student Profiles with QR Modal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>Gate Operations & Student Credentials</span>
              </CardTitle>
              <CardDescription>
                Live gate attendance scans & printable student QR code passes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "gate" | "profiles")}
                className="w-auto"
              >
                <TabsList className="h-8 p-0.5">
                  <TabsTrigger value="gate" className="text-xs px-3 h-7 gap-1.5 cursor-pointer">
                    <CalendarCheck className="size-3.5" />
                    <span>Live Gate Activity</span>
                  </TabsTrigger>
                  <TabsTrigger value="profiles" className="text-xs px-3 h-7 gap-1.5 cursor-pointer">
                    <QrCode className="size-3.5" />
                    <span>Student Profiles & QR</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          {activeTab === "gate" ? (
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arrival In</TableHead>
                    <TableHead>Departure Out</TableHead>
                    <TableHead className="text-right">QR Pass</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(adminData?.recentAtt ?? []).map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <button
                          type="button"
                          className="text-left font-medium text-sm hover:text-primary transition-colors cursor-pointer hover:underline"
                          onClick={() => {
                            if (rec.students) {
                              setSelectedStudentForQr(rec.students as any);
                              setQrModalOpen(true);
                            }
                          }}
                          title="Click to preview & print student QR pass"
                        >
                          {rec.students?.full_name ?? "—"}
                        </button>
                        <div className="font-mono text-xs text-muted-foreground">
                          {rec.students?.student_code ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{rec.classes?.name ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={rec.status} />
                      </TableCell>
                      <TableCell className="text-xs">
                        {rec.arrival_time ? fmtTime(rec.arrival_time) : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {rec.departure_time ? fmtTime(rec.departure_time) : "On campus"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1 hover:border-primary hover:text-primary cursor-pointer"
                          onClick={() => {
                            if (rec.students) {
                              setSelectedStudentForQr(rec.students as any);
                              setQrModalOpen(true);
                            }
                          }}
                          title="Preview & print QR pass"
                        >
                          <QrCode className="size-3.5 text-primary" />
                          <span className="hidden sm:inline">QR Pass</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!(adminData?.recentAtt ?? []).length && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground text-xs"
                      >
                        {isLoading
                          ? "Loading live gate scans…"
                          : "No gate scans recorded yet today."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                <span>Showing latest real-time gate attendance events.</span>
                <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                  <Link to="/reports">
                    <CalendarCheck className="mr-1.5 size-3.5" /> View full attendance log
                  </Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-4 space-y-4">
              {/* Filter and search bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search student name, ID code (e.g. STD-0001)..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classesList.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Students Directory List */}
              <div className="grid gap-2.5 sm:grid-cols-2 max-h-[420px] overflow-y-auto pr-1">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {s.full_name
                          ? s.full_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join("")
                          : "ST"}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-semibold text-xs truncate text-foreground">
                          {s.full_name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-mono">{s.student_code}</span>
                          <span>·</span>
                          <span className="truncate">{s.classes?.name || "No Class"}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1.5 shrink-0 hover:border-primary hover:text-primary cursor-pointer"
                      onClick={() => {
                        setSelectedStudentForQr(s);
                        setQrModalOpen(true);
                      }}
                      title="Preview and print official QR pass"
                    >
                      <QrCode className="size-3.5 text-primary" />
                      <Printer className="size-3" />
                      <span className="hidden md:inline">Print Pass</span>
                    </Button>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="col-span-full py-8 text-center text-xs text-muted-foreground">
                    No students match your search filter.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <span>
                  Showing {filteredStudents.length} of {studentsList.length} students
                </span>
                <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                  <Link to="/students">Manage all students in directory →</Link>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Administration Shortcuts */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Administration Tools</CardTitle>
              <CardDescription>Quick access to school management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-xs h-9 cursor-pointer border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium"
                onClick={() => {
                  setActiveTab("profiles");
                  if (studentsList.length > 0) {
                    setSelectedStudentForQr(studentsList[0]);
                    setQrModalOpen(true);
                  }
                }}
              >
                <QrCode className="mr-2 size-3.5 text-primary" />
                <span>Preview & Print Student QR Passes</span>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/cards">
                  <CreditCard className="mr-2 size-3.5" /> Printable QR ID Cards
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/users">
                  <Users className="mr-2 size-3.5" /> Manage User Accounts & Roles
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/classes">
                  <School className="mr-2 size-3.5" /> Manage Classes & Grade Levels
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/reports">
                  <FileBarChart className="mr-2 size-3.5" /> Attendance & Export Reports
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/audit">
                  <ShieldCheck className="mr-2 size-3.5" /> Security & Audit Trail
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable QR Code Preview Modal for Student Profiles */}
      <StudentQrModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        student={selectedStudentForQr}
      />
    </div>
  );
}

export function SecretaryDashboard() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const today = todayISO();

  // 1. Secretary queries: only gate & operational data
  const { data: gateData, isLoading } = useQuery({
    queryKey: ["secretary-dashboard", today],
    queryFn: async () => {
      const [studentsRes, attTodayRes, staffTodayRes, requestsRes, recentRes] = await Promise.all([
        supabase.from("students").select("id, full_name, student_code, class_id"),
        supabase
          .from("attendance")
          .select("id, status, student_id, arrival_time, departure_time, class_id")
          .eq("attendance_date", today),
        supabase
          .from("staff_attendance")
          .select("id, staff_id, staff_name, status, arrival_time, departure_time")
          .eq("attendance_date", today),
        supabase
          .from("permission_requests")
          .select(
            "id, teacher_id, teacher_name, class_id, reason, status, created_at, classes(name)",
          )
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("attendance")
          .select(
            "id, status, student_id, arrival_time, departure_time, created_at, students(full_name, student_code), classes(name)",
          )
          .eq("attendance_date", today)
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      return {
        totalStudents: studentsRes.data?.length ?? 0,
        attToday: attTodayRes.data ?? [],
        staffToday: staffTodayRes.data ?? [],
        requests: requestsRes.data ?? [],
        recentGate: recentRes.data ?? [],
      };
    },
  });

  const handleApproveRequest = async (reqId: string, classId: string, teacherId: string) => {
    setActionBusyId(reqId);
    try {
      const { error } = await supabase
        .from("permission_requests")
        .update({ status: "approved" })
        .eq("id", reqId);

      if (error) {
        toast.error(error.message);
        return;
      }

      await logAudit("permission.approve", "permission_requests", {
        request_id: reqId,
        class_id: classId,
        teacher_id: teacherId,
      });

      toast.success("Teacher granted class access.");
      void queryClient.invalidateQueries({ queryKey: ["secretary-dashboard"] });
    } catch {
      toast.error("Failed to approve request.");
    } finally {
      setActionBusyId(null);
    }
  };

  const handleRejectRequest = async (reqId: string) => {
    setActionBusyId(reqId);
    try {
      const { error } = await supabase
        .from("permission_requests")
        .update({ status: "rejected" })
        .eq("id", reqId);

      if (error) {
        toast.error(error.message);
        return;
      }

      await logAudit("permission.reject", "permission_requests", { request_id: reqId });
      toast.info("Teacher request rejected.");
      void queryClient.invalidateQueries({ queryKey: ["secretary-dashboard"] });
    } catch {
      toast.error("Failed to reject request.");
    } finally {
      setActionBusyId(null);
    }
  };

  const presentStudents =
    gateData?.attToday.filter((a) => a.status === "present" || a.status === "late").length ?? 0;
  const lateStudents = gateData?.attToday.filter((a) => a.status === "late").length ?? 0;
  const absentStudents = Math.max(0, (gateData?.totalStudents ?? 0) - presentStudents);
  const pendingRequests = (gateData?.requests ?? []).filter((r) => r.status === "pending");

  const filteredGate = (gateData?.recentGate ?? []).filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.students?.full_name?.toLowerCase().includes(term) ||
      r.students?.student_code?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Mary Uwase"}`}
        description={`Secretary Front Desk & Gate Operations · ${fmtDate(new Date())}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild className="gap-2">
              <Link to="/students">
                <Plus className="size-4" /> Register Student / Parent
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/classes">
                <School className="size-4" /> Manage Classes
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/scan" search={{ tab: "students" }}>
                <QrCode className="size-4" /> Scan Student Gate Card
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/scan" search={{ tab: "staff" }}>
                <Users className="size-4" /> Scan Staff Check-in
              </Link>
            </Button>
          </div>
        }
      />

      {/* Top Secretary KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Students Scanned In"
          value={presentStudents}
          icon={UserCheck}
          tone="success"
          hint={`Out of ${gateData?.totalStudents ?? 0} enrolled`}
        />
        <StatCard
          label="Unscanned / Absent"
          value={absentStudents}
          icon={UserX}
          tone="destructive"
          hint="Not scanned at gate today"
        />
        <StatCard
          label="Late Arrivals"
          value={lateStudents}
          icon={Clock}
          tone="info"
          hint="Scanned after gate cutoff"
        />
        <StatCard
          label="Staff Checked In"
          value={gateData?.staffToday.length ?? 0}
          icon={CalendarCheck}
          tone="primary"
          hint="Teachers & admin staff"
        />
        <StatCard
          label="Pending Access Requests"
          value={pendingRequests.length}
          icon={ShieldAlert}
          tone={pendingRequests.length > 0 ? "warning" : "muted"}
          hint={pendingRequests.length > 0 ? "Requires secretary review" : "All cleared"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Left: Gate Activity & Search */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pending Teacher Permissions Alert Box */}
          {pendingRequests.length > 0 && (
            <Card className="border-warning/40 bg-warning/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-5 text-warning" />
                    <CardTitle className="text-base">
                      Pending Teacher Class Access Requests
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-warning text-warning-foreground font-semibold"
                  >
                    {pendingRequests.length} action required
                  </Badge>
                </div>
                <CardDescription>
                  Teachers requesting permission to manage attendance for specific classes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        {req.teacher_name || "Teacher"} →{" "}
                        <span className="text-primary font-bold">
                          {req.classes?.name ?? "Class"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Reason: {req.reason || "Class substitution / attendance access"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Requested {fmtTime(req.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="h-8 gap-1 bg-success hover:bg-success/90 text-white"
                        disabled={actionBusyId === req.id}
                        onClick={() =>
                          void handleApproveRequest(req.id, req.class_id, req.teacher_id)
                        }
                      >
                        <CheckCircle2 className="size-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-destructive hover:bg-destructive/10"
                        disabled={actionBusyId === req.id}
                        onClick={() => void handleRejectRequest(req.id)}
                      >
                        <XCircle className="size-3.5" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Today's Gate Live Stream */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Today's Gate Stream</CardTitle>
                <CardDescription>Live scans recorded at school entry/exit points</CardDescription>
              </div>
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Filter student or code…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arrival In</TableHead>
                    <TableHead>Departure Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGate.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{rec.students?.full_name ?? "—"}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {rec.students?.student_code ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{rec.classes?.name ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={rec.status} />
                      </TableCell>
                      <TableCell className="text-xs">
                        {rec.arrival_time ? fmtTime(rec.arrival_time) : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {rec.departure_time ? fmtTime(rec.departure_time) : "On campus"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredGate.length && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-muted-foreground text-sm"
                      >
                        {isLoading ? "Loading gate scans…" : "No student scans recorded yet today."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Staff Checked In & Quick Links */}
        <div className="space-y-6">
          {/* Staff Check-in Today */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Staff Attendance Today</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {gateData?.staffToday.length ?? 0} scanned
                </Badge>
              </div>
              <CardDescription>Teachers and staff scanned at arrival</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(gateData?.staffToday ?? []).slice(0, 8).map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium text-xs">
                          {staff.staff_name || "Staff Member"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {staff.arrival_time ? fmtTime(staff.arrival_time) : "—"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={staff.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {!(gateData?.staffToday ?? []).length && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-4 text-xs text-muted-foreground"
                        >
                          No staff check-ins recorded yet today.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full text-xs">
                <Link to="/scan" search={{ tab: "staff" }}>
                  Scan Staff Attendance
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Secretary Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Front-Desk Quick Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/students">
                  <GraduationCap className="mr-2 size-3.5" /> Register Students & Parents
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/classes">
                  <School className="mr-2 size-3.5" /> Manage & Create Classes
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/cards">
                  <QrCode className="mr-2 size-3.5" /> Print Student ID Cards
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/permissions">
                  <ShieldAlert className="mr-2 size-3.5" /> View All Teacher Permissions
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/reports">
                  <CalendarCheck className="mr-2 size-3.5" /> Generate Attendance Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TeacherDashboard() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const today = todayISO();

  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [markingStudent, setMarkingStudent] = useState<any | null>(null);
  const [markStatus, setMarkStatus] = useState<"present" | "late" | "sick" | "absent">("present");
  const [markNotes, setMarkNotes] = useState("");
  const [isSubmittingMark, setIsSubmittingMark] = useState(false);

  // Queries for teacher view
  const { data: teacherData, isLoading } = useQuery({
    queryKey: ["teacher-dashboard-main", user?.id, today],
    queryFn: async () => {
      const [classesRes, studentsRes, attTodayRes, teacherAttRes, newsRes] = await Promise.all([
        supabase.from("classes").select("id, name, teacher_id").order("name"),
        supabase
          .from("students")
          .select("id, full_name, student_code, class_id, classes(name)")
          .order("full_name"),
        supabase
          .from("attendance")
          .select("id, student_id, status, arrival_time, departure_time, notes")
          .eq("attendance_date", today),
        user?.id
          ? supabase
              .from("staff_attendance")
              .select("id, status, arrival_time")
              .eq("staff_id", user.id)
              .eq("attendance_date", today)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("announcements")
          .select("id, title, body, created_at")
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

      return {
        classes: classesRes.data ?? [],
        students: studentsRes.data ?? [],
        attendanceToday: attTodayRes.data ?? [],
        teacherAtt: teacherAttRes.data ?? null,
        announcements: newsRes.data ?? [],
      };
    },
  });

  const allClasses = teacherData?.classes ?? [];
  const myAssignedClasses = allClasses.filter((c) => c.teacher_id === user?.id);
  const effectiveClasses = myAssignedClasses.length > 0 ? myAssignedClasses : allClasses;

  const attMap = new Map<string, any>();
  (teacherData?.attendanceToday ?? []).forEach((a) => {
    attMap.set(a.student_id, a);
  });

  // Students filtering
  const allStudents = teacherData?.students ?? [];
  const classStudents = allStudents.filter((s) => {
    if (selectedClassId === "all") {
      if (myAssignedClasses.length > 0) {
        return myAssignedClasses.some((c) => c.id === s.class_id);
      }
      return true;
    }
    return s.class_id === selectedClassId;
  });

  const filteredStudents = classStudents.filter((s) => {
    const rec = attMap.get(s.id);
    const status = rec?.status ?? "unmarked";

    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return s.full_name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q);
    }
    return true;
  });

  // Stats calculation
  const totalRoster = classStudents.length;
  const presentCount = classStudents.filter((s) => attMap.get(s.id)?.status === "present").length;
  const lateCount = classStudents.filter((s) => attMap.get(s.id)?.status === "late").length;
  const sickCount = classStudents.filter((s) => attMap.get(s.id)?.status === "sick").length;
  const absentCount = classStudents.filter((s) => attMap.get(s.id)?.status === "absent").length;
  const markedCount = presentCount + lateCount + sickCount + absentCount;
  const rate = totalRoster > 0 ? Math.round(((presentCount + lateCount) / totalRoster) * 100) : 0;

  const handleSaveAttendance = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!markingStudent) return;
    setIsSubmittingMark(true);
    try {
      const existing = attMap.get(markingStudent.id);
      const payload: any = {
        student_id: markingStudent.id,
        attendance_date: today,
        status: markStatus,
        notes: markNotes.trim() || null,
        recorded_by: user?.id ?? "teacher",
        recorded_by_name: profile?.full_name ?? "Teacher",
      };

      if (markStatus === "present" || markStatus === "late") {
        if (!existing?.arrival_time) {
          payload.arrival_time = new Date().toTimeString().slice(0, 8);
        }
      }

      if (existing?.id) {
        const { error } = await supabase.from("attendance").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("attendance").insert(payload);
        if (error) throw error;
      }

      await logAudit("attendance.manual_mark", "attendance", {
        student_id: markingStudent.id,
        status: markStatus,
        date: today,
      });

      toast.success(`Updated attendance for ${markingStudent.full_name}`);
      setMarkingStudent(null);
      setMarkNotes("");
      void queryClient.invalidateQueries({ queryKey: ["teacher-dashboard-main"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save attendance.");
    } finally {
      setIsSubmittingMark(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Teacher"}`}
        description={`Teacher Portal · Class attendance, daily rosters & operations · ${fmtDate(new Date())}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm">
              <Link to="/attendance">
                <CalendarCheck className="mr-1.5 size-4" /> Mark Class Attendance
              </Link>
            </Button>
            <Button variant="outline" asChild size="sm">
              <Link to="/reports">
                <FileBarChart className="mr-1.5 size-4" /> Attendance Reports
              </Link>
            </Button>
          </div>
        }
      />

      {teacherData?.teacherAtt?.status === "present" && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-800 dark:text-emerald-300 shadow-sm">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold">Welcome back to school! 👋</span> You are marked{" "}
            <span className="font-semibold uppercase">Present</span> today{" "}
            {teacherData.teacherAtt.arrival_time && (
              <span>(Arrival: {fmtTime(teacherData.teacherAtt.arrival_time)})</span>
            )}
            . Have a productive teaching day!
          </div>
        </div>
      )}

      {/* Roster & Attendance KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Class Roster"
          value={totalRoster}
          icon={Users}
          tone="primary"
          hint="Enrolled learners"
        />
        <StatCard
          label="Present in Class"
          value={presentCount}
          icon={UserCheck}
          tone="success"
          hint="Checked in on time"
        />
        <StatCard
          label="Late Arrival"
          value={lateCount}
          icon={Clock}
          tone="warning"
          hint="Arrived after bell"
        />
        <StatCard
          label="Absent / Sick"
          value={absentCount + sickCount}
          icon={UserX}
          tone="danger"
          hint={`${absentCount} absent · ${sickCount} sick`}
        />
        <StatCard
          label="Attendance Rate"
          value={`${rate}%`}
          icon={Percent}
          tone="primary"
          hint={`${markedCount} of ${totalRoster} logged`}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Class Roster & Gate Check-in Status */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold">Today's Class Roster</CardTitle>
                  <CardDescription className="text-xs">
                    Live gate status and classroom attendance check
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={selectedClassId} onValueChange={(val) => setSelectedClassId(val)}>
                    <SelectTrigger className="h-8 w-[160px] text-xs">
                      <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {effectiveClasses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name or code…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(["all", "present", "late", "absent", "sick", "unmarked"] as const).map((st) => (
                    <Button
                      key={st}
                      variant={statusFilter === st ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs capitalize px-2.5"
                      onClick={() => setStatusFilter(st)}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Student</TableHead>
                    <TableHead className="text-xs">Code</TableHead>
                    <TableHead className="text-xs">Class</TableHead>
                    <TableHead className="text-xs">Gate / Today Status</TableHead>
                    <TableHead className="text-xs">Arrival In</TableHead>
                    <TableHead className="text-xs text-right">Quick Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => {
                    const rec = attMap.get(s.id);
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium text-xs">{s.full_name}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {s.student_code}
                        </TableCell>
                        <TableCell className="text-xs">
                          {s.classes?.name ?? "Assigned Class"}
                        </TableCell>
                        <TableCell>
                          {rec ? (
                            <StatusBadge status={rec.status} />
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Not recorded
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {rec?.arrival_time ? fmtTime(rec.arrival_time) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2 text-primary"
                            onClick={() => {
                              setMarkingStudent(s);
                              setMarkStatus(rec?.status ?? "present");
                              setMarkNotes(rec?.notes ?? "");
                            }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!filteredStudents.length && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground text-xs"
                      >
                        {isLoading
                          ? "Loading class roster…"
                          : "No students matching the selected criteria."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Teacher Info, Attendance Record & Announcements */}
        <div className="space-y-6 lg:col-span-1">
          {/* Teacher Own Gate Attendance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">My Gate Check-In</CardTitle>
              <CardDescription className="text-xs">
                Your personal gate arrival record today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teacherData?.teacherAtt ? (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 block">
                      Gate Arrival Recorded
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Time:{" "}
                      {teacherData.teacherAtt.arrival_time
                        ? fmtTime(teacherData.teacherAtt.arrival_time)
                        : "On record"}
                    </span>
                  </div>
                  <Badge variant="default" className="bg-emerald-600 text-xs">
                    {teacherData.teacherAtt.status}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-amber-50 dark:bg-amber-950/20 text-xs">
                  <div>
                    <span className="font-semibold text-amber-800 dark:text-amber-300 block">
                      Gate Scan Pending
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Check in at the security gate terminal
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Pending
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Megaphone className="size-4 text-primary" /> School Bulletins
              </CardTitle>
              <CardDescription className="text-xs">Administrative updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(teacherData?.announcements ?? []).map((n) => (
                <div key={n.id} className="rounded-lg border p-3 text-xs space-y-1">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground/70 pt-1">
                    {fmtDate(n.created_at)}
                  </p>
                </div>
              ))}
              {!(teacherData?.announcements ?? []).length && (
                <p className="text-xs text-muted-foreground">No recent notices published.</p>
              )}
            </CardContent>
          </Card>

          {/* Teacher Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/attendance">
                  <CalendarCheck className="mr-2 size-3.5" /> Mark Class Attendance
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/students">
                  <GraduationCap className="mr-2 size-3.5" /> View Student Profiles
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/reports">
                  <FileBarChart className="mr-2 size-3.5" /> Generate Attendance Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Attendance Update Dialog */}
      <Dialog
        open={!!markingStudent}
        onOpenChange={(open) => {
          if (!open) setMarkingStudent(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Student Attendance</DialogTitle>
            <DialogDescription>
              Record or revise today's attendance status for {markingStudent?.full_name} (
              {markingStudent?.student_code}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAttendance} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <div className="grid grid-cols-4 gap-2">
                {(["present", "late", "sick", "absent"] as const).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={markStatus === s ? "default" : "outline"}
                    size="sm"
                    className="capitalize text-xs"
                    onClick={() => setMarkStatus(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Teacher Notes (Optional)</Label>
              <Input
                placeholder="e.g. Excused for clinic or doctor appointment"
                value={markNotes}
                onChange={(e) => setMarkNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setMarkingStudent(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isSubmittingMark}>
                {isSubmittingMark ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : null}
                Save Attendance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ParentDashboard() {
  const { profile, user } = useAuth();
  const today = todayISO();
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

  const [activeDateFocus, setActiveDateFocus] = useState(today);

  // Scoped parent queries: only children, their attendance, announcements, and payments
  const { data: parentData, isLoading } = useQuery({
    queryKey: ["parent-dashboard", user?.id, today],
    enabled: !!user?.id,
    queryFn: async () => {
      // 1. Fetch children linked to this parent
      const { data: children } = await supabase
        .from("students")
        .select("id, full_name, student_code, class_id, qr_token, classes(name)")
        .eq("parent_id", user!.id);

      const childIds = (children ?? []).map((c) => c.id);

      // 2. Fetch attendance, announcements, permissions, and payments
      const [{ data: attHistory }, { data: news }, { data: payments }, { data: permissions }] =
        await Promise.all([
          childIds.length
            ? supabase
                .from("attendance")
                .select("*, students(full_name, student_code), classes(name)")
                .in("student_id", childIds)
                .order("attendance_date", { ascending: false })
                .limit(60)
            : Promise.resolve({ data: [] }),
          supabase
            .from("announcements")
            .select("id, title, body, created_at, action_label, action_url")
            .order("created_at", { ascending: false })
            .limit(3),
          childIds.length
            ? supabase
                .from("payments")
                .select("amount, status, category, paid_on")
                .in("student_id", childIds)
            : Promise.resolve({ data: [] }),
          childIds.length
            ? supabase
                .from("permission_requests")
                .select("*")
                .in("student_id", childIds)
                .order("created_at", { ascending: false })
            : Promise.resolve({ data: [] }),
        ]);

      return {
        children: children ?? [],
        attendance: attHistory ?? [],
        news: news ?? [],
        payments: payments ?? [],
        permissions: permissions ?? [],
      };
    },
  });

  const att = parentData?.attendance ?? [];
  const total = att.length || 1;
  const present = att.filter((a) => a.status === "present" || a.status === "late").length;
  const absent = att.filter((a) => a.status === "absent" || a.status === "sick").length;
  const pct = Math.round((present / total) * 100);

  // Check selected date focus status for each child
  const focusAttMap = new Map<string, any>();
  att
    .filter((a) => a.attendance_date === activeDateFocus)
    .forEach((a) => focusAttMap.set(a.student_id, a));

  const focusPermMap = new Map<string, any>();
  (parentData?.permissions ?? [])
    .filter((p) => p.permission_date === activeDateFocus)
    .forEach((p) => focusPermMap.set(p.student_id, p));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Parent"}`}
        description={`Parent Portal · Real-time attendance tracking for your children · ${fmtDate(new Date())}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild size="sm">
              <Link to="/permissions">
                <Send className="mr-1.5 size-4" /> Request Permission
              </Link>
            </Button>
            <Button variant="outline" asChild size="sm">
              <Link to="/children">
                <Baby className="mr-1.5 size-4" /> My Children
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/payments">
                <Receipt className="mr-1.5 size-4" /> View Fees & Receipts
              </Link>
            </Button>
          </div>
        }
      />

      {/* Attendance Stats Cards - Present and Absent only */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Attendance Rate"
          value={`${att.length ? pct : 0}%`}
          icon={Percent}
          tone="primary"
          hint="Overall gate check-ins"
        />
        <StatCard
          label="Present Days"
          value={present}
          icon={UserCheck}
          tone="success"
          hint="Attended school"
        />
        <StatCard
          label="Absent Days"
          value={absent}
          icon={UserX}
          tone="destructive"
          hint="Missed school days"
        />
      </div>

      {/* Main Children & Timeline Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Children Status Cards with Yesterday / Today / Tomorrow Switcher */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Children</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {parentData?.children.length ?? 0} enrolled
                </Badge>
              </div>

              {/* Day filter tabs: Yesterday, Today, Tomorrow */}
              <div className="mt-2 flex items-center gap-1 rounded-lg bg-muted/60 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveDateFocus(yesterday)}
                  className={cn(
                    "flex-1 rounded-md py-1 text-center font-medium transition-all",
                    activeDateFocus === yesterday
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDateFocus(today)}
                  className={cn(
                    "flex-1 rounded-md py-1 text-center font-medium transition-all",
                    activeDateFocus === today
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDateFocus(tomorrow)}
                  className={cn(
                    "flex-1 rounded-md py-1 text-center font-medium transition-all",
                    activeDateFocus === tomorrow
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Tomorrow
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(parentData?.children ?? []).map((c) => {
                const dayRec = focusAttMap.get(c.id);
                const dayPerm = focusPermMap.get(c.id);

                return (
                  <div
                    key={c.id}
                    className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-base">{c.full_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          {c.student_code} · {c.classes?.name ?? "Assigned Class"}
                        </p>
                      </div>
                      {dayRec ? (
                        <ParentStatusBadge status={dayRec.status} />
                      ) : dayPerm ? (
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Permission {dayPerm.status}
                        </span>
                      ) : activeDateFocus === tomorrow ? (
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Scheduled Day
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {activeDateFocus === today ? "Not scanned yet" : "No record"}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 rounded-lg bg-muted/40 p-2.5 text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Arrival at Gate:</span>
                        <span className="font-medium text-foreground">
                          {dayRec?.arrival_time ? fmtTime(dayRec.arrival_time) : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Departure:</span>
                        <span className="font-medium text-foreground">
                          {dayRec?.departure_time
                            ? fmtTime(dayRec.departure_time)
                            : dayRec
                              ? "On campus"
                              : "—"}
                        </span>
                      </div>
                      {dayPerm && (
                        <div className="flex justify-between text-muted-foreground pt-1 border-t">
                          <span>Leave Note:</span>
                          <span className="font-medium text-primary truncate max-w-[150px]">
                            {dayPerm.title} ({dayPerm.status})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {!(parentData?.children ?? []).length && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {isLoading
                    ? "Loading your children…"
                    : "No children registered under this account yet."}
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="size-4 text-primary" />
                <CardTitle className="text-base">School Announcements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(parentData?.news ?? []).map((n) => (
                <div key={n.id} className="rounded-lg border p-3 text-xs space-y-1">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground/70 pt-1">
                    {fmtDate(n.created_at)}
                  </p>
                </div>
              ))}
              {!(parentData?.news ?? []).length && (
                <p className="text-xs text-muted-foreground">No announcements right now.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attendance Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Attendance Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Recent Attendance Timeline</CardTitle>
                <CardDescription>Daily check-in and departure log</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link to="/reports">
                  <CalendarCheck className="mr-1.5 size-3.5" /> Full History
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Arrival In</TableHead>
                    <TableHead>Departure Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {att.slice(0, 12).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-xs">
                        {a.students?.full_name ?? "Child"}
                      </TableCell>
                      <TableCell className="text-xs">{fmtDate(a.attendance_date)}</TableCell>
                      <TableCell className="text-xs">
                        {a.arrival_time ? fmtTime(a.arrival_time) : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {a.departure_time ? fmtTime(a.departure_time) : "—"}
                      </TableCell>
                      <TableCell>
                        <ParentStatusBadge status={a.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {a.recorded_by_name ?? "Gate Staff"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!att.length && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground text-xs"
                      >
                        {isLoading
                          ? "Loading attendance records…"
                          : "No attendance records logged yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function FinanceDashboard() {
  const { profile } = useAuth();
  const today = todayISO();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: financeData, isLoading } = useQuery({
    queryKey: ["finance-dashboard", today],
    queryFn: async () => {
      const [paymentsRes, studentsRes] = await Promise.all([
        supabase
          .from("payments")
          .select("*, students(full_name, student_code)")
          .order("paid_on", { ascending: false })
          .limit(100),
        supabase.from("students").select("id, full_name, class_id"),
      ]);

      return {
        payments: paymentsRes.data ?? [],
        totalStudents: studentsRes.data?.length ?? 0,
      };
    },
  });

  const payments = financeData?.payments ?? [];
  const collected = payments
    .filter((p) => p.status === "paid" || p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pending = payments
    .filter((p) => p.status !== "paid" && p.status !== "completed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalBilled = collected + pending;
  const collectionRate = totalBilled > 0 ? Math.round((collected / totalBilled) * 100) : 100;

  // Filtered payments list
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.students?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.students?.student_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === "all" || p.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  // Group by category
  const categories = ["all", "Tuition", "Uniform", "Meals", "Transport", "Books"];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Finance Officer"}`}
        description={`School Finance & Tuition Collection Center · ${fmtDate(new Date())}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild size="sm">
              <Link to="/reports">
                <FileBarChart className="mr-1.5 size-4" /> Financial Reports
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/finance">
                <Receipt className="mr-1.5 size-4" /> Record New Payment
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Collected"
          value={`$${collected.toLocaleString()}`}
          icon={TrendingUp}
          tone="success"
          hint="Verified paid transactions"
        />
        <StatCard
          label="Pending Balances"
          value={`$${pending.toLocaleString()}`}
          icon={DollarSign}
          tone="destructive"
          hint="Uncollected student dues"
        />
        <StatCard
          label="Collection Rate"
          value={`${collectionRate}%`}
          icon={CheckCircle2}
          tone="primary"
          hint={`${payments.length} transactions processed`}
        />
        <StatCard
          label="Enrolled Students"
          value={financeData?.totalStudents ?? 0}
          icon={GraduationCap}
          tone="info"
          hint="Eligible for term billing"
        />
      </div>

      {/* Payments Table with category tabs & search */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-base">Tuition & Fee Payment Logs</CardTitle>
            <CardDescription>Recent payments recorded across all grades</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search student or ref…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        {/* Category filter pills */}
        <div className="px-6 py-2 border-b flex gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 capitalize transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.slice(0, 15).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{p.students?.full_name ?? "Student"}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {p.students?.student_code ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{p.category || "Tuition"}</TableCell>
                  <TableCell className="text-xs font-semibold">
                    {p.currency || "$"} {Number(p.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.method || "Cash"}
                  </TableCell>
                  <TableCell className="text-xs">{fmtDate(p.paid_on || p.created_at)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "paid" || p.status === "completed" ? "default" : "destructive"
                      }
                      className="text-[11px] capitalize font-medium"
                    >
                      {p.status || "paid"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!filteredPayments.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    {isLoading
                      ? "Loading payments…"
                      : "No payment records found matching criteria."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function OwnerDashboard() {
  const { profile } = useAuth();
  const today = todayISO();

  const { data: ownerData, isLoading } = useQuery({
    queryKey: ["owner-dashboard-data", today],
    queryFn: async () => {
      const [studentsRes, classesRes, staffRes, attRes, paymentsRes, newsRes] = await Promise.all([
        supabase.from("students").select("id, full_name, class_id"),
        supabase.from("classes").select("id, name"),
        supabase
          .from("staff_attendance")
          .select("id, staff_name, status, arrival_time, departure_time")
          .eq("attendance_date", today),
        supabase
          .from("attendance")
          .select("id, status, arrival_time, departure_time, students(full_name), classes(name)")
          .eq("attendance_date", today),
        supabase.from("payments").select("amount, status, category"),
        supabase
          .from("announcements")
          .select("id, title, body, created_at")
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

      return {
        students: studentsRes.data ?? [],
        classes: classesRes.data ?? [],
        staffToday: staffRes.data ?? [],
        attToday: attRes.data ?? [],
        payments: paymentsRes.data ?? [],
        news: newsRes.data ?? [],
      };
    },
  });

  const totalStudents = ownerData?.students.length ?? 0;
  const presentStudents = (ownerData?.attToday ?? []).filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;
  const attRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  const payments = ownerData?.payments ?? [];
  const collected = payments
    .filter((p) => p.status === "paid" || p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const outstanding = payments
    .filter((p) => p.status !== "paid" && p.status !== "completed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "School Owner"}`}
        description={`Executive Overview & Operational Metrics · ${fmtDate(new Date())}`}
        action={
          <Button variant="outline" asChild size="sm">
            <Link to="/reports">
              <FileBarChart className="mr-1.5 size-4" /> Full Institutional Reports
            </Link>
          </Button>
        }
      />

      {/* Top Level Institutional KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Enrollment"
          value={totalStudents}
          icon={GraduationCap}
          tone="primary"
          hint={`${ownerData?.classes.length ?? 0} active classes`}
        />
        <StatCard
          label="Student Attendance Today"
          value={`${attRate}%`}
          icon={Percent}
          tone="success"
          hint={`${presentStudents} students on campus`}
        />
        <StatCard
          label="Revenue Collected"
          value={`$${collected.toLocaleString()}`}
          icon={TrendingUp}
          tone="success"
          hint={`Pending: $${outstanding.toLocaleString()}`}
        />
        <StatCard
          label="Staff on Duty Today"
          value={ownerData?.staffToday.length ?? 0}
          icon={Users}
          tone="info"
          hint="Teachers and administrators"
        />
      </div>

      {/* Attendance Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Present Students"
          value={(ownerData?.attToday ?? []).filter((a) => a.status === "present").length}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Late Arrivals"
          value={(ownerData?.attToday ?? []).filter((a) => a.status === "late").length}
          icon={Clock}
          tone="info"
        />
        <StatCard
          label="Sick Leave"
          value={(ownerData?.attToday ?? []).filter((a) => a.status === "sick").length}
          icon={Thermometer}
          tone="warning"
        />
        <StatCard
          label="Unscanned / Absent"
          value={Math.max(0, totalStudents - presentStudents)}
          icon={UserX}
          tone="destructive"
        />
      </div>

      {/* Main Grid: Staff Attendance & Announcements */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Staff Attendance Today</CardTitle>
                <CardDescription>Teacher and staff check-ins logged at the gate</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {ownerData?.staffToday.length ?? 0} scanned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Arrival In</TableHead>
                  <TableHead>Departure Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(ownerData?.staffToday ?? []).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-xs">{s.staff_name || "Staff"}</TableCell>
                    <TableCell className="text-xs">
                      {s.arrival_time ? fmtTime(s.arrival_time) : "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {s.departure_time ? fmtTime(s.departure_time) : "On campus"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!(ownerData?.staffToday ?? []).length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground text-xs"
                    >
                      {isLoading
                        ? "Loading staff records…"
                        : "No staff attendance recorded yet today."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Announcements & High-Level Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="size-4 text-primary" />
                <CardTitle className="text-base">School Announcements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(ownerData?.news ?? []).map((n) => (
                <div key={n.id} className="rounded-lg border p-3 text-xs space-y-1">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-muted-foreground">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground/70">{fmtDate(n.created_at)}</p>
                </div>
              ))}
              {!(ownerData?.news ?? []).length && (
                <p className="text-xs text-muted-foreground">No recent announcements.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Executive Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/classes">
                  <School className="mr-2 size-3.5" /> View All Classes & Teachers
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-xs h-9">
                <Link to="/audit">
                  <FileBarChart className="mr-2 size-3.5" /> Security & System Audit Logs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SchoolTrack" },
      { name: "description", content: "School attendance and operations dashboard" },
      { property: "og:title", content: "Dashboard — SchoolTrack" },
      { property: "og:description", content: "School attendance and operations dashboard" },
    ],
  }),
  component: DashboardDispatcher,
});

function DashboardDispatcher() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  switch (role) {
    case "parent":
      return <ParentDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "secretary":
      return <SecretaryDashboard />;
    case "finance":
      return <FinanceDashboard />;
    case "owner":
      return <OwnerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return (
        <Card className="m-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold">Welcome to SchoolTrack</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account role is currently: {role ? roleLabel[role] : "Standard User"}
            </p>
            <div className="mt-6">
              <AdminDashboard />
            </div>
          </CardContent>
        </Card>
      );
  }
}
