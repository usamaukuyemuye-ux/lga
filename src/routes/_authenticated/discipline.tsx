import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Info,
  ListFilter,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Trash2,
  UserCheck,
  Users,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/school/ui";
import { StudentProfileModal, type StudentProfileData } from "@/components/school/student-profile-modal";
import { fmtDate, fmtTime, todayISO, logAudit } from "@/lib/school";
import { exportExcel, exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DisciplineReport,
  normalizeToPrimaryCategory,
} from "@/components/school/discipline-report";
import { dispatchLocalNotification } from "@/lib/device-notifications";

export const Route = createFileRoute("/_authenticated/discipline")({
  validateSearch: (search: Record<string, unknown>): { studentId?: string; view?: "report" | "register" } => ({
    studentId: typeof search.studentId === "string" ? search.studentId : undefined,
    view: typeof search.view === "string" ? (search.view as "report" | "register") : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Student Discipline & Conduct — Little Gems Academy" },
      {
        name: "description",
        content:
          "Track student conduct, punctuality notices, behavioral incidents, and parent acknowledgements.",
      },
      { property: "og:title", content: "Student Discipline & Conduct — Little Gems Academy" },
      {
        property: "og:description",
        content:
          "Track student conduct, punctuality notices, behavioral incidents, and parent acknowledgements.",
      },
    ],
  }),
  component: DisciplinePage,
});

export type DisciplineSeverity = "minor" | "moderate" | "major";

export interface DisciplineIncident {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  class_id?: string | null;
  class_name?: string | null;
  parent_id?: string | null;
  category: string;
  severity: DisciplineSeverity;
  incident_date: string;
  incident_time: string;
  description: string;
  action_taken: string;
  reported_by_id: string;
  reported_by_name: string;
  reported_by_role: string;
  parent_notified: boolean;
  last_sent_at?: string | null;
  parent_acknowledged: boolean;
  parent_acknowledged_at?: string | null;
  parent_notes?: string | null;
  created_at: string;
}

const CATEGORIES = [
  "Conduct",
  "Punctuality",
  "Uniform & Dress Code",
  "Classroom Behavior",
  "Homework & Preparedness",
  "Respect & Politeness",
  "Peer Conflict",
  "Property Care",
  "Other",
];

const SEVERITY_CONFIG: Record<
  DisciplineSeverity,
  { label: string; badgeColor: string; icon: typeof Info; desc: string }
> = {
  minor: {
    label: "Minor Notice",
    badgeColor:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
    icon: Info,
    desc: "First reminder or minor classroom guidance",
  },
  moderate: {
    label: "Moderate Warning",
    badgeColor:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    icon: AlertTriangle,
    desc: "Repeated disruption, late arrival, or rule infringement",
  },
  major: {
    label: "Major Infraction",
    badgeColor:
      "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    icon: AlertCircle,
    desc: "Serious misconduct, bullying, or defiance requiring immediate parent intervention",
  },
};

function getCurrentTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function DisciplinePage() {
  const { role, profile, user } = useAuth();
  const qc = useQueryClient();
  const searchParams = Route.useSearch();

  const isParent = role === "parent";
  const isTeacher = role === "teacher";
  const canManage = role === "admin" || role === "secretary" || role === "owner";
  const canLog = canManage || isTeacher;

  // View state: 'report' vs 'register'
  const [activeView, setActiveView] = useState<"report" | "register">(
    searchParams.view || (isParent ? "report" : "register"),
  );
  const [selectedReportStudentId, setSelectedReportStudentId] = useState<string>(
    searchParams.studentId || "",
  );

  // Send to Parent Modal State
  const [showSendModal, setShowSendModal] = useState(false);
  const [incidentToSend, setIncidentToSend] = useState<DisciplineIncident | null>(null);
  const [sendingIncidentId, setSendingIncidentId] = useState<string | null>(null);

  // Dialog State
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false);
  const [selectedIncidentForAck, setSelectedIncidentForAck] = useState<DisciplineIncident | null>(
    null,
  );
  const [parentComment, setParentComment] = useState("");

  // Form State for Logging Incidents
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [formStudentId, setFormStudentId] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Conduct");
  const [formSeverity, setFormSeverity] = useState<DisciplineSeverity>("minor");
  const [formDate, setFormDate] = useState<string>(todayISO());
  const [formTimeVal, setFormTimeVal] = useState<string>(getCurrentTimeStr());
  const [formDescription, setFormDescription] = useState<string>("");
  const [formActionTaken, setFormActionTaken] = useState<string>("Verbal guidance & counseling");
  const [formNotifyParent, setFormNotifyParent] = useState<boolean>(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAck, setFilterAck] = useState("all");
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfileData | null>(null);

  // Query: Classes
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Query: Students
  const { data: students } = useQuery({
    queryKey: ["students-for-discipline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*, classes(name)")
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Query: Parent's children if role === "parent"
  const parentChildIds = useMemo(() => {
    if (!isParent || !students || !user?.id) return new Set<string>();
    return new Set(students.filter((s) => s.parent_id === user.id).map((s) => s.id));
  }, [isParent, students, user?.id]);

  // Query: Discipline Incidents
  const { data: incidents, isLoading } = useQuery({
    queryKey: ["discipline-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discipline_incidents")
        .select("*")
        .order("incident_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DisciplineIncident[];
    },
  });

  // Mutation: Log Incident
  const logIncidentMutation = useMutation({
    mutationFn: async () => {
      if (!formStudentId) throw new Error("Please select a student.");
      if (!formDescription.trim()) throw new Error("Please provide an incident description.");

      const student = (students ?? []).find((s) => s.id === formStudentId);
      if (!student) throw new Error("Selected student not found.");

      const studentClass = (classes ?? []).find((c) => c.id === student.class_id);

      const incidentData: Partial<DisciplineIncident> = {
        student_id: student.id,
        student_name: student.full_name,
        student_code: student.student_code,
        class_id: student.class_id || null,
        class_name: studentClass?.name || student.classes?.name || "Unassigned",
        parent_id: student.parent_id || null,
        category: formCategory,
        severity: formSeverity,
        incident_date: formDate,
        incident_time: formTimeVal,
        description: formDescription.trim(),
        action_taken: formActionTaken.trim() || "Verbal reminder",
        reported_by_id: user?.id || "",
        reported_by_name: profile?.full_name || "Teacher",
        reported_by_role: role || "staff",
        parent_notified: formNotifyParent,
        parent_acknowledged: false,
        parent_acknowledged_at: null,
        parent_notes: null,
        created_at: new Date().toISOString(),
      };

      const { data: created, error } = await supabase
        .from("discipline_incidents")
        .insert(incidentData)
        .select()
        .single();
      if (error) throw error;

      // Also trigger parent notification if parent email/account is linked
      if (formNotifyParent && student.parent_id) {
        try {
          await supabase.from("parent_notifications").insert({
            student_id: student.id,
            parent_id: student.parent_id,
            recipient_email: student.parent_email || null,
            subject: `⚠️ Little Gems Academy Conduct Notice: ${student.full_name} (${formCategory})`,
            body: `Dear Parent,\n\nA conduct incident regarding ${student.full_name} has been logged by ${profile?.full_name || "School Staff"}.\n\nCategory: ${formCategory}\nSeverity: ${SEVERITY_CONFIG[formSeverity].label}\nDate: ${formDate}\nDescription: ${formDescription}\nAction Taken: ${formActionTaken}\n\nPlease sign into your Parent Portal to review and acknowledge this record.\n\nWarm regards,\nLittle Gems Academy Administration`,
            status: "sent",
          });
        } catch (notifErr) {
          console.warn("Could not insert parent notification record:", notifErr);
        }
      }

      await logAudit("discipline.incident_logged", "discipline_incidents", {
        student_id: student.id,
        severity: formSeverity,
        category: formCategory,
      });

      return created;
    },
    onSuccess: () => {
      toast.success("Conduct incident logged successfully!");
      setShowLogDialog(false);
      setFormStudentId("");
      setFormDescription("");
      setFormActionTaken("Verbal guidance & counseling");
      setFormCategory("Conduct");
      setFormSeverity("minor");
      void qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
      void qc.invalidateQueries({ queryKey: ["my-children-full"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to record incident"),
  });

  // Mutation: Parent Acknowledge
  const acknowledgeMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("discipline_incidents")
        .update({
          parent_acknowledged: true,
          parent_acknowledged_at: now,
          parent_notes: notes?.trim() || null,
        })
        .eq("id", id);
      if (error) throw error;

      await logAudit("discipline.parent_acknowledged", "discipline_incidents", {
        incident_id: id,
        parent_id: user?.id,
      });
    },
    onSuccess: () => {
      toast.success("Thank you! Incident acknowledgement recorded.");
      setShowAcknowledgeDialog(false);
      setSelectedIncidentForAck(null);
      setParentComment("");
      void qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
      void qc.invalidateQueries({ queryKey: ["my-children-full"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to acknowledge incident"),
  });

  // Mutation: Delete Incident
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("discipline_incidents").delete().eq("id", id);
      if (error) throw error;
      await logAudit("discipline.incident_deleted", "discipline_incidents", { incident_id: id });
    },
    onSuccess: () => {
      toast.success("Incident record removed.");
      void qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to remove incident"),
  });

  // Mutation: Send to Parent (Triggered by Teacher / Staff)
  const sendToParentMutation = useMutation({
    mutationFn: async (incident: DisciplineIncident) => {
      setSendingIncidentId(incident.id);

      const student = (students ?? []).find((s) => s.id === incident.student_id);
      const parentEmail =
        student?.parent_email ||
        (incident.parent_id
          ? `${incident.student_code}@parents.littlegems.edu`
          : "parent@littlegems.edu");
      const parentName = student?.parent_name || "Parent / Guardian";
      const parentId = student?.parent_id || incident.parent_id || null;

      const subject = `⚠️ Little Gems Academy Disciplinary Notice: ${incident.student_name} (${incident.category})`;
      const body = `Dear ${parentName},\n\nA student disciplinary notice has been issued for ${incident.student_name} by ${profile?.full_name || "School Staff"} (${profile?.role || "Teacher"}).\n\nIncident Category: ${incident.category} [${normalizeToPrimaryCategory(incident.category)}]\nSeverity Level: ${SEVERITY_CONFIG[incident.severity]?.label || incident.severity}\nDate: ${incident.incident_date} at ${incident.incident_time || "—"}\n\nTeacher Notes & Observation:\n${incident.description}\n\nAction Taken by School:\n${incident.action_taken || "Verbal counseling & behavioral guidance"}\n\nPlease sign into your Little Gems Academy Parent Portal -> Discipline Report to review this feed and acknowledge the notice.\n\nWarm regards,\nLittle Gems Academy Administration`;

      // 1. Insert official notification record
      try {
        await supabase.from("notifications").insert({
          student_id: incident.student_id,
          parent_id: parentId,
          recipient_email: parentEmail,
          subject,
          body,
          status: "sent",
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("Notice insertion warning:", e);
      }

      // Also insert into parent_notifications if parent_id exists
      if (parentId) {
        try {
          await supabase.from("parent_notifications").insert({
            student_id: incident.student_id,
            parent_id: parentId,
            recipient_email: parentEmail,
            subject,
            body,
            status: "sent",
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Parent notification table warning:", e);
        }
      }

      // 2. Update discipline_incidents to set parent_notified: true & last_sent_at
      const now = new Date().toISOString();
      const { error: updateErr } = await supabase
        .from("discipline_incidents")
        .update({
          parent_notified: true,
          last_sent_at: now,
        })
        .eq("id", incident.id);
      if (updateErr) throw updateErr;

      // 3. Dispatch web push / local notification
      dispatchLocalNotification(
        `Disciplinary Notice: ${incident.student_name}`,
        `${incident.category} (${incident.severity}): ${incident.description.slice(0, 80)}...`,
        "/discipline",
      );

      // 4. Audit log
      await logAudit("discipline.sent_to_parent", "discipline_incidents", {
        incident_id: incident.id,
        student_id: incident.student_id,
        student_name: incident.student_name,
        recipient_email: parentEmail,
        sent_by: profile?.full_name,
      });

      return { parentEmail, parentName, studentName: incident.student_name };
    },
    onSuccess: (res) => {
      toast.success(`Disciplinary notice for ${res.studentName} sent to parent!`, {
        description: `Dispatched to ${res.parentEmail}`,
      });
      setSendingIncidentId(null);
      setShowSendModal(false);
      setIncidentToSend(null);
      void qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
      void qc.invalidateQueries({ queryKey: ["my-children-full"] });
      void qc.invalidateQueries({ queryKey: ["pending-discipline-count"] });
    },
    onError: (err: any) => {
      setSendingIncidentId(null);
      toast.error(err?.message || "Failed to send notice to parent");
    },
  });

  // Available students for the log form (filtered by class selector if chosen)
  const availableStudentsForForm = useMemo(() => {
    let list = students ?? [];
    if (selectedClassId !== "all") {
      list = list.filter((s) => s.class_id === selectedClassId);
    }
    return list;
  }, [students, selectedClassId]);

  // Filtered Incidents List
  const filteredIncidents = useMemo(() => {
    let list = incidents ?? [];

    // If parent, only show their children's records
    if (isParent) {
      list = list.filter(
        (item) =>
          (item.parent_id && item.parent_id === user?.id) || parentChildIds.has(item.student_id),
      );
    }

    // Filter by Class
    if (filterClass !== "all") {
      list = list.filter((item) => item.class_id === filterClass);
    }

    // Filter by Severity
    if (filterSeverity !== "all") {
      list = list.filter((item) => item.severity === filterSeverity);
    }

    // Filter by Category
    if (filterCategory !== "all") {
      list = list.filter((item) => item.category === filterCategory);
    }

    // Filter by Acknowledgment
    if (filterAck === "pending") {
      list = list.filter((item) => !item.parent_acknowledged);
    } else if (filterAck === "acknowledged") {
      list = list.filter((item) => item.parent_acknowledged);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.student_name?.toLowerCase().includes(q) ||
          item.student_code?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.class_name?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [
    incidents,
    isParent,
    user?.id,
    parentChildIds,
    filterClass,
    filterSeverity,
    filterCategory,
    filterAck,
    search,
  ]);

  // Statistical KPIs
  const stats = useMemo(() => {
    const list = isParent
      ? (incidents ?? []).filter(
          (item) =>
            (item.parent_id && item.parent_id === user?.id) || parentChildIds.has(item.student_id),
        )
      : (incidents ?? []);

    const total = list.length;
    const minor = list.filter((i) => i.severity === "minor").length;
    const moderate = list.filter((i) => i.severity === "moderate").length;
    const major = list.filter((i) => i.severity === "major").length;
    const acknowledged = list.filter((i) => i.parent_acknowledged).length;
    const pendingAck = total - acknowledged;

    return { total, minor, moderate, major, acknowledged, pendingAck };
  }, [incidents, isParent, user?.id, parentChildIds]);

  // Export to PDF
  const handleExportPdf = () => {
    const head = [
      "Date",
      "Student",
      "Code",
      "Class",
      "Category",
      "Severity",
      "Description",
      "Action",
      "Parent Status",
    ];
    const rows = filteredIncidents.map((i) => [
      i.incident_date,
      i.student_name,
      i.student_code,
      i.class_name || "—",
      i.category,
      SEVERITY_CONFIG[i.severity]?.label || i.severity,
      i.description,
      i.action_taken || "—",
      i.parent_acknowledged ? "Acknowledged" : "Pending Review",
    ]);
    exportPdf(
      "Student Discipline & Conduct Register — Little Gems Academy",
      head,
      rows,
      "discipline-register",
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    const head = [
      "Date",
      "Time",
      "Student Name",
      "Student Code",
      "Class",
      "Category",
      "Severity",
      "Description",
      "Action Taken",
      "Reported By",
      "Parent Acknowledged",
      "Acknowledged Date",
      "Parent Comment",
    ];
    const rows = filteredIncidents.map((i) => [
      i.incident_date,
      i.incident_time || "",
      i.student_name,
      i.student_code,
      i.class_name || "—",
      i.category,
      SEVERITY_CONFIG[i.severity]?.label || i.severity,
      i.description,
      i.action_taken || "—",
      i.reported_by_name || "Staff",
      i.parent_acknowledged ? "Yes" : "No",
      i.parent_acknowledged_at ? fmtDate(i.parent_acknowledged_at) : "—",
      i.parent_notes || "",
    ]);
    exportExcel(head, rows, "discipline-register");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isParent ? "Student Conduct & Behavior Notices" : "Student Discipline & Conduct"}
        description={
          isParent
            ? "View your child's conduct record, punctuality reports, and acknowledge school notices."
            : "Log behavioral incidents, conduct notes, punctuality warnings, and track parent acknowledgments."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={!filteredIncidents.length}
              className="gap-1.5 text-xs h-9"
            >
              <Download className="size-3.5" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={!filteredIncidents.length}
              className="gap-1.5 text-xs h-9"
            >
              <FileSpreadsheet className="size-3.5" /> Excel
            </Button>

            {canLog && (
              <Button
                onClick={() => {
                  setFormDate(todayISO());
                  setFormTimeVal(getCurrentTimeStr());
                  setShowLogDialog(true);
                }}
                size="sm"
                className="gap-1.5 text-xs h-9 font-semibold shadow-sm"
              >
                <Plus className="size-4" /> Log Incident
              </Button>
            )}
          </div>
        }
      />

      {/* View Mode Switcher */}
      {!isParent ? (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-2 rounded-xl border shadow-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView("report")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeView === "report"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border",
              )}
            >
              <FileText className="size-3.5" />
              <span>Student Discipline Report</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("register")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeView === "register"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border",
              )}
            >
              <ListFilter className="size-3.5" />
              <span>Discipline Register & Actions</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4",
                  activeView === "register" ? "bg-primary-foreground/20 text-white" : "",
                )}
              >
                {stats.total}
              </Badge>
            </button>
          </div>

          <div className="text-xs text-muted-foreground hidden sm:block">
            {activeView === "report"
              ? "Dedicated student conduct feed & printable report cards"
              : "Complete register with teacher notification actions & mobile scroll"}
          </div>
        </div>
      ) : (
        <div className="bg-card p-3 rounded-xl border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <FileText className="size-4 text-primary" />
            <span>Official Conduct & Guidance Notices for Your Children</span>
          </div>
          {stats.pendingAck > 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-0.5">
              {stats.pendingAck} Pending Acknowledgment
            </Badge>
          )}
        </div>
      )}

      {isParent || activeView === "report" ? (
        <DisciplineReport
          students={
            isParent ? (students ?? []).filter((s) => parentChildIds.has(s.id)) : (students ?? [])
          }
          incidents={
            isParent
              ? (incidents ?? []).filter(
                  (item) =>
                    (item.parent_id && item.parent_id === user?.id) ||
                    parentChildIds.has(item.student_id),
                )
              : (incidents ?? [])
          }
          selectedStudentId={selectedReportStudentId}
          onSelectStudent={(id) => setSelectedReportStudentId(id)}
          onAcknowledge={(incident) => {
            setSelectedIncidentForAck(incident);
            setParentComment("");
            setShowAcknowledgeDialog(true);
          }}
          isParentView={isParent}
        />
      ) : (
        <div className="space-y-6">
          {/* Parent Attention Banner if there are pending reviews */}
          {isParent && stats.pendingAck > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-200 shadow-sm flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  Action Needed: {stats.pendingAck} Unreviewed Conduct{" "}
                  {stats.pendingAck === 1 ? "Notice" : "Notices"}
                </div>
                <p className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                  The school has shared conduct or punctuality notes regarding your child. Please
                  review the entries below and tap <strong>"Acknowledge & Sign"</strong> to confirm
                  you have discussed them at home.
                </p>
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
            <Card className="p-3.5">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Total Incidents
              </span>
              <div className="text-2xl font-bold mt-1 text-foreground">{stats.total}</div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Cumulative logged records
              </span>
            </Card>

            <Card className="p-3.5 border-l-4 border-l-blue-500">
              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 block">
                Minor Notices
              </span>
              <div className="text-2xl font-bold mt-1 text-blue-700 dark:text-blue-400">
                {stats.minor}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Verbal reminders & advice
              </span>
            </Card>

            <Card className="p-3.5 border-l-4 border-l-amber-500">
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 block">
                Moderate Warnings
              </span>
              <div className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-400">
                {stats.moderate}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Punctuality & uniform issues
              </span>
            </Card>

            <Card className="p-3.5 border-l-4 border-l-rose-500">
              <span className="text-[11px] font-medium text-rose-700 dark:text-rose-300 block">
                Major Infractions
              </span>
              <div className="text-2xl font-bold mt-1 text-rose-700 dark:text-rose-400">
                {stats.major}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Requires disciplinary meeting
              </span>
            </Card>

            <Card className="p-3.5 border-l-4 border-l-emerald-500 col-span-2 lg:col-span-1">
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 block">
                Parent Reviewed
              </span>
              <div className="text-2xl font-bold mt-1 text-emerald-700 dark:text-emerald-400">
                {stats.acknowledged}
                <span className="text-xs text-muted-foreground font-normal ml-1.5">
                  ({stats.total ? Math.round((stats.acknowledged / stats.total) * 100) : 100}%)
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {stats.pendingAck} pending acknowledgment
              </span>
            </Card>
          </div>

          {/* Main List and Filter Controls */}
          <Card>
            <CardHeader className="pb-3 border-b bg-muted/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShieldAlert className="size-4 text-primary" />
                    {isParent ? "My Children's Conduct Log" : "Schoolwide Disciplinary Register"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {filteredIncidents.length}{" "}
                    {filteredIncidents.length === 1 ? "entry" : "entries"} found
                  </CardDescription>
                </div>

                {/* Quick Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search student, description, code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
              </div>

              {/* Filter Bar */}
              <div className="grid gap-2 pt-3 sm:grid-cols-2 md:grid-cols-4">
                {!isParent && (
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {(classes ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="minor">Minor Notices</SelectItem>
                    <SelectItem value="moderate">Moderate Warnings</SelectItem>
                    <SelectItem value="major">Major Infractions</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterAck} onValueChange={setFilterAck}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Parent review status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Awaiting Parent Review</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged by Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-16 text-center text-xs text-muted-foreground">
                  Loading discipline register...
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="py-14 text-center space-y-2">
                  <CheckCircle2 className="size-9 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-sm">No Incidents Found</div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {search || filterCategory !== "all" || filterSeverity !== "all"
                      ? "No conduct records match the applied search filters."
                      : "All students are in good standing with exemplary conduct."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden bg-card">
                  {/* Mobile swipe helper bar */}
                  <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-primary/10 border-b border-primary/20 text-xs text-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Send className="size-3.5 text-primary shrink-0" />
                      <span>
                        Swipe table horizontally to reach the <strong>Send to Parent</strong> button
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold shrink-0">
                      Scroll →
                    </span>
                  </div>

                  <div className="overflow-x-auto touch-pan-x scrollbar-thin">
                    <Table className="w-full min-w-[1080px]">
                      <TableHeader>
                        <TableRow className="text-xs">
                          <TableHead className="w-[120px]">Date / Time</TableHead>
                          <TableHead className="w-[150px]">Student</TableHead>
                          <TableHead className="w-[90px]">Class</TableHead>
                          <TableHead className="w-[140px]">Category & Severity</TableHead>
                          <TableHead className="min-w-[220px]">Description & Action</TableHead>
                          <TableHead className="w-[120px]">Reported By</TableHead>
                          <TableHead className="w-[130px]">Parent Status</TableHead>
                          {!isParent && (
                            <TableHead className="w-[150px] whitespace-nowrap font-bold text-primary">
                              Send to Parent
                            </TableHead>
                          )}
                          <TableHead className="text-right w-[80px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIncidents.map((incident) => {
                          const severityMeta =
                            SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.minor;
                          const isMyChild = isParent && parentChildIds.has(incident.student_id);

                          return (
                            <TableRow key={incident.id} className="text-xs hover:bg-muted/30">
                              <TableCell className="whitespace-nowrap">
                                <div className="font-medium text-foreground">
                                  {fmtDate(incident.incident_date)}
                                </div>
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {incident.incident_time || "—"}
                                </div>
                              </TableCell>

                              <TableCell>
                                <button
                                  type="button"
                                  className="font-semibold text-foreground text-left hover:text-primary hover:underline cursor-pointer block leading-tight"
                                  onClick={() => {
                                    const st = (students ?? []).find((s) => s.id === incident.student_id);
                                    if (st) {
                                      setSelectedStudentForProfile(st);
                                    } else {
                                      setSelectedStudentForProfile({
                                        id: incident.student_id,
                                        student_code: incident.student_code,
                                        full_name: incident.student_name,
                                        classes: { name: incident.class_name },
                                      });
                                    }
                                  }}
                                >
                                  {incident.student_name}
                                </button>
                                <div className="font-mono text-[10px] text-primary">
                                  {incident.student_code}
                                </div>
                              </TableCell>

                              <TableCell>
                                <Badge variant="outline" className="text-[10px] font-normal">
                                  {incident.class_name || "Unassigned"}
                                </Badge>
                              </TableCell>

                              <TableCell>
                                <div className="space-y-1">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] font-semibold",
                                      severityMeta.badgeColor,
                                    )}
                                  >
                                    {severityMeta.label}
                                  </Badge>
                                  <div className="text-[11px] font-medium text-foreground">
                                    {incident.category}
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="space-y-1 text-xs max-w-sm">
                                  <div className="leading-relaxed text-foreground">
                                    {incident.description}
                                  </div>
                                  {incident.action_taken && (
                                    <div className="text-[11px] text-muted-foreground bg-muted/40 rounded px-2 py-1 border">
                                      <span className="font-semibold text-foreground">
                                        Action taken:{" "}
                                      </span>
                                      {incident.action_taken}
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="whitespace-nowrap">
                                <div className="font-medium text-foreground">
                                  {incident.reported_by_name || "Staff"}
                                </div>
                                <div className="text-[10px] text-muted-foreground capitalize">
                                  {incident.reported_by_role || "Teacher"}
                                </div>
                              </TableCell>

                              <TableCell>
                                {incident.parent_acknowledged ? (
                                  <div className="space-y-0.5">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                      Acknowledged
                                    </span>
                                    {incident.parent_acknowledged_at && (
                                      <div className="text-[10px] text-muted-foreground">
                                        {fmtDate(incident.parent_acknowledged_at)}
                                      </div>
                                    )}
                                    {incident.parent_notes && (
                                      <div className="text-[10px] text-muted-foreground italic border-l-2 pl-1.5 mt-0.5">
                                        "{incident.parent_notes}"
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] font-normal border-amber-400 text-amber-700 dark:text-amber-300 bg-amber-500/10"
                                  >
                                    Awaiting Review
                                  </Badge>
                                )}
                              </TableCell>

                              {/* Send to Parent column for Teachers/Admins */}
                              {!isParent && (
                                <TableCell className="whitespace-nowrap">
                                  {incident.parent_notified ? (
                                    <div className="flex flex-col gap-1 items-start">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 gap-1 py-0.5"
                                      >
                                        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                        Sent to Parent
                                      </Badge>
                                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                        <span>
                                          {incident.last_sent_at
                                            ? fmtDate(incident.last_sent_at)
                                            : "Delivered"}
                                        </span>
                                        <button
                                          type="button"
                                          className="text-[10px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                                          title="Resend disciplinary notice to parent"
                                          onClick={() => {
                                            setIncidentToSend(incident);
                                            setShowSendModal(true);
                                          }}
                                        >
                                          <Send className="size-2.5" /> Resend
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs"
                                      onClick={() => {
                                        setIncidentToSend(incident);
                                        setShowSendModal(true);
                                      }}
                                      disabled={
                                        sendToParentMutation.isPending &&
                                        sendingIncidentId === incident.id
                                      }
                                      title="Send disciplinary notice to parent"
                                    >
                                      <Send className="size-3.5" />
                                      {sendToParentMutation.isPending &&
                                      sendingIncidentId === incident.id
                                        ? "Sending..."
                                        : "Send to Parent"}
                                    </Button>
                                  )}
                                </TableCell>
                              )}

                              <TableCell className="text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                      setSelectedReportStudentId(incident.student_id);
                                      setActiveView("report");
                                    }}
                                    title="Open student-specific Discipline Report"
                                  >
                                    <FileText className="size-3.5" /> Report
                                  </Button>

                                  {isParent && !incident.parent_acknowledged ? (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="h-7 text-xs font-semibold px-2.5 gap-1 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => {
                                        setSelectedIncidentForAck(incident);
                                        setParentComment("");
                                        setShowAcknowledgeDialog(true);
                                      }}
                                    >
                                      <CheckCircle2 className="size-3.5" /> Acknowledge & Sign
                                    </Button>
                                  ) : canManage ? (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-muted-foreground hover:text-destructive"
                                      title="Delete entry"
                                      onClick={() => {
                                        if (
                                          confirm(
                                            `Remove incident record for ${incident.student_name}?`,
                                          )
                                        ) {
                                          deleteMutation.mutate(incident.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground">—</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog: Log Incident (Teachers / Admins / Staff) */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldAlert className="size-4 text-primary" />
              Log Student Conduct Incident
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record behavioral issues, punctuality warnings, or discipline notes for student
              profile and parent communication.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Class Filter & Student Picker */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  1. Filter by Class (Optional)
                </label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {(classes ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  2. Select Student *
                </label>
                <Select value={formStudentId} onValueChange={setFormStudentId}>
                  <SelectTrigger className="h-9 text-xs font-medium">
                    <SelectValue placeholder="Choose student..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {availableStudentsForForm.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.full_name} ({s.student_code})
                      </SelectItem>
                    ))}
                    {!availableStudentsForForm.length && (
                      <SelectItem value="none" disabled>
                        No students found in this class
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category and Severity */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Category *
                </label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Severity Level *
                </label>
                <Select
                  value={formSeverity}
                  onValueChange={(v) => setFormSeverity(v as DisciplineSeverity)}
                >
                  <SelectTrigger className="h-9 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor Notice (Reminder)</SelectItem>
                    <SelectItem value="moderate">Moderate Warning (Rule Break)</SelectItem>
                    <SelectItem value="major">Major Infraction (Urgent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Incident Date
                </label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Approximate Time
                </label>
                <Input
                  type="time"
                  value={formTimeVal}
                  onChange={(e) => setFormTimeVal(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                Incident Description *
              </label>
              <Textarea
                rows={3}
                placeholder="Detail what occurred, circumstances, or specific behavior observed..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-xs leading-relaxed"
              />
            </div>

            {/* Action Taken */}
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                Action Taken by Staff
              </label>
              <Input
                placeholder="e.g. Verbal guidance, counseling session, detention, parent conference requested..."
                value={formActionTaken}
                onChange={(e) => setFormActionTaken(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Notify Parent Checkbox */}
            <div className="rounded-lg border p-3 bg-muted/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-xs text-foreground flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-primary" />
                  Notify Parent & Require Acknowledgement
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Sends an automated notification to the parent portal and parent email.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formNotifyParent}
                onChange={(e) => setFormNotifyParent(e.target.checked)}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowLogDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => logIncidentMutation.mutate()}
              disabled={!formStudentId || !formDescription.trim() || logIncidentMutation.isPending}
              size="sm"
              className="gap-1.5 font-semibold"
            >
              {logIncidentMutation.isPending ? "Recording..." : "Record Incident"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Parent Acknowledge & Sign */}
      <Dialog open={showAcknowledgeDialog} onOpenChange={setShowAcknowledgeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              Acknowledge Conduct Notice
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm you have reviewed this record and addressed the matter with your child.
            </DialogDescription>
          </DialogHeader>

          {selectedIncidentForAck && (
            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-lg border p-3 bg-muted/30 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-foreground">
                    {selectedIncidentForAck.student_name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedIncidentForAck.category}
                  </Badge>
                </div>
                <div className="text-xs text-foreground/90 leading-relaxed">
                  {selectedIncidentForAck.description}
                </div>
                {selectedIncidentForAck.action_taken && (
                  <div className="text-[11px] text-muted-foreground pt-1 border-t">
                    <span className="font-semibold">Action: </span>
                    {selectedIncidentForAck.action_taken}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Parent Response / Note (Optional)
                </label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Discussed with child at home, agreed on behavior improvements..."
                  value={parentComment}
                  onChange={(e) => setParentComment(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAcknowledgeDialog(false);
                setSelectedIncidentForAck(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedIncidentForAck) {
                  acknowledgeMutation.mutate({
                    id: selectedIncidentForAck.id,
                    notes: parentComment,
                  });
                }
              }}
              disabled={acknowledgeMutation.isPending}
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {acknowledgeMutation.isPending ? "Confirming..." : "Confirm & Sign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Send Disciplinary Notice to Parent (Teacher / Admin Action) */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <Send className="size-4 text-primary" />
              Send Disciplinary Notice to Parent
            </DialogTitle>
            <DialogDescription className="text-xs">
              This will dispatch an official notification directly to the parent's portal and email
              address requesting acknowledgment.
            </DialogDescription>
          </DialogHeader>

          {incidentToSend && (
            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-lg border p-3 bg-muted/30 space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground text-[11px]">Student</span>
                  <span className="font-semibold text-foreground">
                    {incidentToSend.student_name} ({incidentToSend.student_code})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground text-[11px]">Category & Severity</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">{incidentToSend.category}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold",
                        SEVERITY_CONFIG[incidentToSend.severity]?.badgeColor,
                      )}
                    >
                      {SEVERITY_CONFIG[incidentToSend.severity]?.label || incidentToSend.severity}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground text-[11px]">Date of Incident</span>
                  <span className="font-medium text-foreground">
                    {fmtDate(incidentToSend.incident_date)} at {incidentToSend.incident_time || "—"}
                  </span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground text-[11px] block">
                    Observation & Notes:
                  </span>
                  <p className="text-xs text-foreground/90 leading-relaxed bg-background/60 p-2 rounded border">
                    {incidentToSend.description}
                  </p>
                </div>
                {incidentToSend.action_taken && (
                  <div className="text-[11px] text-muted-foreground pt-1">
                    <span className="font-semibold text-foreground">Action taken: </span>
                    {incidentToSend.action_taken}
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-3 bg-blue-50/50 dark:bg-blue-950/20 text-blue-950 dark:text-blue-200 space-y-1">
                <div className="font-semibold text-[11px] flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                  <CheckCircle2 className="size-3.5" /> What happens when you click Send:
                </div>
                <ul className="list-disc pl-4 text-[10px] space-y-0.5 text-blue-900/80 dark:text-blue-300/80">
                  <li>The notice appears in the parent's dedicated Discipline Report feed.</li>
                  <li>An official notification record is created for parent review.</li>
                  <li>The parent receives a direct prompt to review and sign acknowledgment.</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSendModal(false);
                setIncidentToSend(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (incidentToSend) {
                  sendToParentMutation.mutate(incidentToSend);
                }
              }}
              disabled={sendToParentMutation.isPending}
              size="sm"
              className="gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="size-3.5" />
              {sendToParentMutation.isPending ? "Sending Notice..." : "Confirm & Send to Parent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Profile Modal */}
      <StudentProfileModal
        open={!!selectedStudentForProfile}
        onOpenChange={(open) => !open && setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
      />
    </div>
  );
}
