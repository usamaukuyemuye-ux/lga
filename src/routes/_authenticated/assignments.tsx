import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpenCheck,
  Plus,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Save,
  Loader2,
  ShieldAlert,
  Trash2,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/school/ui";
import { fetchClasses, fetchStudents, fmtDate } from "@/lib/school";
import { exportExcel } from "@/lib/export";
import { dispatchLocalNotification } from "@/lib/device-notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments & Homework — Little Gems Academy" },
      {
        name: "description",
        content:
          "Create, submit, and mark classroom assignments for teachers, parents, and academic heads.",
      },
    ],
  }),
  component: AssignmentsPage,
});

export type AssignmentRecord = {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  class_id: string;
  class_name?: string;
  title: string;
  subject?: string;
  questions: string;
  description?: string;
  target_student_ids?: string[] | string;
  due_date?: string;
  total_points?: number;
  status: "active" | "completed";
  created_at: string;
};

export type SubmissionRecord = {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name?: string;
  parent_id?: string;
  class_id?: string;
  answers: string;
  status: "submitted" | "graded";
  score?: number | null;
  max_score?: number;
  teacher_feedback?: string | null;
  submitted_at: string;
  marked_at?: string | null;
  created_at: string;
};

function AssignmentsPage() {
  const { role, profile, user } = useAuth();
  const qc = useQueryClient();

  const isTeacher = role === "teacher";
  const isParent = role === "parent";
  const isHeadOfStudies = role === "head_of_studies";
  const isAdmin = role === "admin" || role === "owner";
  const isSecretary = role === "secretary";

  // Single selected assignment (defaults to first assignment)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Single "Make Assignment" dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // View Sent Answer Modal state
  const [viewingAnswerSubmission, setViewingAnswerSubmission] = useState<{
    studentName: string;
    studentCode: string;
    assignmentTitle: string;
    questions: string;
    answers: string;
    submittedAt?: string;
    score?: number | null;
    maxScore?: number;
  } | null>(null);

  // Parent/Student submission modal (plain text typing only, no stickers or svgs)
  const [answeringAssignment, setAnsweringAssignment] = useState<AssignmentRecord | null>(null);
  const [answeringStudentId, setAnsweringStudentId] = useState<string>("");
  const [submissionAnswerText, setSubmissionAnswerText] = useState("");

  // Selected marks state for each student row: key = `${assignmentId}_${studentId}`
  const [selectedMarks, setSelectedMarks] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Make Assignment Form fields (Exact requested order: Class -> Subject -> Title -> Questions -> Marks -> Deadline -> Save)
  const [newClassId, setNewClassId] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newQuestions, setNewQuestions] = useState("");
  const [newTotalPoints, setNewTotalPoints] = useState("100");
  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  // Load Classes & Students
  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const { data: students } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });

  const DEMO_SAMPLE_IDS = useMemo(
    () => new Set(["asg-1", "asg-2", "asg-3", "asg-math-p4", "asg-sci-p6"]),
    [],
  );

  // Background cleanup: permanently purge leftover demo seed assignments and legacy student from Firestore
  useQuery({
    queryKey: ["purge_demo_sample_assignments"],
    queryFn: async () => {
      const demoAssignments = ["asg-1", "asg-2", "asg-3", "asg-math-p4", "asg-sci-p6"];
      for (const id of demoAssignments) {
        try {
          await supabase.from("assignments").delete().eq("id", id);
        } catch {
          // ignore
        }
      }
      const demoSubs = ["sub-1", "sub-math-p4-std-0001", "sub-math-p4-std-0002"];
      for (const id of demoSubs) {
        try {
          await supabase.from("assignment_submissions").delete().eq("id", id);
        } catch {
          // ignore
        }
      }
      // Purge removed P6 student user if still in profiles/users
      try {
        await supabase.from("profiles").delete().eq("id", "user-student");
        await supabase.from("users").delete().eq("id", "user-student");
      } catch {
        // ignore
      }
      // Ensure std-0001 is mapped to Primary 1 if needed
      try {
        await supabase
          .from("students")
          .update({ class_id: "class-p1", parent_id: "user-parent" })
          .eq("id", "std-0001");
      } catch {
        // ignore
      }
      return true;
    },
    staleTime: Infinity,
  });

  // Load Assignments - ONLY assignments created by users/teachers
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      const all = (data ?? []) as AssignmentRecord[];
      // Strictly filter out all demo/sample items so only real created assignments appear
      return all.filter((a) => !DEMO_SAMPLE_IDS.has(a.id));
    },
  });

  // Load Submissions
  const { data: submissions } = useQuery({
    queryKey: ["assignment_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignment_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SubmissionRecord[];
    },
  });

  // Student Key input state for parents
  const [studentKeyInput, setStudentKeyInput] = useState("");
  const [linkingStudent, setLinkingStudent] = useState(false);

  // Linked children for parent (assigned by parent_id, parent_email, or student key)
  const myChildren = useMemo(() => {
    if (!isParent || !students) return [];
    return students.filter(
      (s) =>
        s.parent_id === user?.id ||
        (s.parent_id === "user-parent" &&
          (user?.email === "parent@school.com" || user?.id === "user-parent")) ||
        (s.parent_email &&
          user?.email &&
          s.parent_email.toLowerCase() === user.email.toLowerCase()),
    );
  }, [isParent, students, user?.id, user?.email]);

  const handleLinkStudentKey = async () => {
    const key = studentKeyInput.trim().toUpperCase();
    if (!key) {
      toast.error("Please enter a Student Key (e.g. STD-0001).");
      return;
    }
    setLinkingStudent(true);
    try {
      const match = (students ?? []).find((s) => s.student_code?.toUpperCase() === key);
      if (!match) {
        toast.error(
          `No student found with Student Key "${key}". Please verify the key with the school.`,
        );
        setLinkingStudent(false);
        return;
      }
      const { error } = await supabase
        .from("students")
        .update({
          parent_id: user?.id ?? "user-parent",
          parent_email: user?.email ?? "parent@school.com",
        })
        .eq("id", match.id);
      if (error) throw error;
      toast.success(`Success! Linked ${match.full_name} (${match.student_code}) to your account.`);
      setStudentKeyInput("");
      void qc.invalidateQueries({ queryKey: ["students"] });
      void qc.invalidateQueries({ queryKey: ["assignments"] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to link student key.");
    } finally {
      setLinkingStudent(false);
    }
  };

  // Submissions map: `${assignmentId}_${studentId}` -> SubmissionRecord
  const submissionMap = useMemo(() => {
    const map = new Map<string, SubmissionRecord>();
    (submissions ?? []).forEach((sub) => {
      map.set(`${sub.assignment_id}_${sub.student_id}`, sub);
    });
    return map;
  }, [submissions]);

  // Filtered assignments based on role
  // Teacher sees ONLY assignments assigned to their subjects/classes
  const visibleAssignments = useMemo(() => {
    const list = assignments ?? [];

    return list.filter((asg) => {
      if (isTeacher) {
        const isMyAssignment =
          asg.teacher_id === user?.id ||
          (user?.id && asg.teacher_id === "user-teacher" && user?.email === "teacher@school.com") ||
          (profile?.full_name &&
            asg.teacher_name &&
            asg.teacher_name.trim().toLowerCase() === profile.full_name.trim().toLowerCase()) ||
          (user?.email && asg.teacher_id === user.email);

        return isMyAssignment;
      }

      if (isParent) {
        return myChildren.some((child) => child.class_id === asg.class_id);
      }

      return true;
    });
  }, [assignments, isTeacher, isParent, myChildren, user, profile]);

  // Active assignment: currently selected or first visible assignment
  const activeAssignment = useMemo(() => {
    if (visibleAssignments.length === 0) return null;
    if (selectedAssignmentId) {
      const found = visibleAssignments.find((a) => a.id === selectedAssignmentId);
      if (found) return found;
    }
    return visibleAssignments[0];
  }, [visibleAssignments, selectedAssignmentId]);

  // Create Assignment Mutation (Direct & Simple: Class -> Subject -> Title -> Questions -> Marks -> Deadline -> Save)
  const createAssignmentMutation = useMutation({
    mutationFn: async () => {
      if (!newClassId) throw new Error("Please select a class for this assignment.");
      if (!newSubject.trim()) throw new Error("Please enter the subject.");
      if (!newTitle.trim()) throw new Error("Please provide an assignment title.");
      if (!newQuestions.trim()) throw new Error("Please type the assignment question(s).");

      const selectedClass = classes?.find((c) => c.id === newClassId);
      const assignmentId = `asg-${Date.now()}`;

      const payload: AssignmentRecord = {
        id: assignmentId,
        teacher_id: user?.id ?? "user-teacher",
        teacher_name: profile?.full_name ?? "Teacher",
        class_id: newClassId,
        class_name: selectedClass?.name ?? "Class",
        title: newTitle.trim(),
        subject: newSubject.trim(),
        questions: newQuestions.trim(),
        description: newQuestions.trim(),
        target_student_ids: ["all"],
        due_date: newDueDate,
        total_points: parseInt(newTotalPoints, 10) || 100,
        status: "active",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("assignments").insert(payload as any);
      if (error) throw error;

      // Notify all parents of students in the selected class (e.g. Primary 1)
      try {
        const classStudents = (students ?? []).filter((s) => s.class_id === newClassId);
        for (const st of classStudents) {
          const notifId = `asg-notif-${assignmentId}-${st.id}`;
          // 1. In-app parent notification record
          await supabase.from("parent_notifications").insert({
            id: notifId,
            parent_id: st.parent_id || null,
            student_id: st.id,
            student_name: st.full_name,
            student_code: st.student_code,
            title: `New Assignment: ${newTitle.trim()} (${newSubject.trim()})`,
            body: `A new assignment has been assigned for ${selectedClass?.name ?? "Class"}: "${newTitle.trim()}". Subject: ${newSubject.trim()}, Marks: ${newTotalPoints}, Deadline: ${newDueDate ? fmtDate(newDueDate) : "Open"}. Please log in to submit answers.`,
            type: "assignment",
            created_at: new Date().toISOString(),
            read: false,
          } as any);

          // 2. Notification log record
          if (st.parent_email) {
            await supabase.from("notifications").insert({
              id: `notif-${assignmentId}-${st.id}`,
              student_id: st.id,
              parent_id: st.parent_id || null,
              recipient_email: st.parent_email,
              subject: `New Assignment Alert: ${newTitle.trim()} (${selectedClass?.name ?? "Class"})`,
              body: `Dear Parent of ${st.full_name} (${st.student_code}),\n\nA new assignment has been posted for ${selectedClass?.name ?? "Primary 1"}:\n\nTitle: ${newTitle.trim()}\nSubject: ${newSubject.trim()}\nTotal Marks: ${newTotalPoints}\nDeadline: ${newDueDate ? fmtDate(newDueDate) : "Open"}\n\nPlease log in to the Parent Portal to view the questions, submit answers, and review marks.\n\nThank you,\nLittle Gems Academy`,
              status: "sent",
              created_at: new Date().toISOString(),
            } as any);
          }
        }

        // 3. Dispatch web push / local device notification
        dispatchLocalNotification(
          `New Assignment: ${newTitle.trim()}`,
          `Posted for ${selectedClass?.name ?? "Class"}. All parents have been notified.`,
          "/assignments",
        );
      } catch (notifErr) {
        console.warn("Could not dispatch notifications:", notifErr);
      }

      return payload;
    },
    onSuccess: (newAsg) => {
      toast.success(`Assignment saved! All parents of ${newAsg.class_name} have been notified.`);
      setCreateDialogOpen(false);
      setNewClassId("");
      setNewSubject("");
      setNewTitle("");
      setNewQuestions("");
      setNewTotalPoints("100");
      setSelectedAssignmentId(newAsg.id);
      void qc.invalidateQueries({ queryKey: ["assignments"] });
      void qc.invalidateQueries({ queryKey: ["parent_notifications"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete Assignment Mutation (Teacher / Admin can remove created assignments)
  const deleteAssignmentMutation = useMutation({
    mutationFn: async (asgId: string) => {
      const { error } = await supabase.from("assignments").delete().eq("id", asgId);
      if (error) throw error;
      try {
        await supabase.from("assignment_submissions").delete().eq("assignment_id", asgId);
      } catch {
        // ignore
      }
      return asgId;
    },
    onSuccess: (deletedId) => {
      toast.success("Assignment removed successfully.");
      if (selectedAssignmentId === deletedId) {
        setSelectedAssignmentId(null);
      }
      void qc.invalidateQueries({ queryKey: ["assignments"] });
      void qc.invalidateQueries({ queryKey: ["assignment_submissions"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Submit Answer Mutation (Parent / Student - plain text typing only, no stickers/svgs)
  const submitAnswerMutation = useMutation({
    mutationFn: async () => {
      if (!answeringAssignment) throw new Error("No assignment selected.");
      if (!answeringStudentId) throw new Error("Student ID missing.");
      if (!submissionAnswerText.trim()) {
        throw new Error("Please type your answer before saving.");
      }

      const st = students?.find((s) => s.id === answeringStudentId);
      const subId = `sub-${answeringAssignment.id}-${answeringStudentId}`;

      const payload: SubmissionRecord = {
        id: subId,
        assignment_id: answeringAssignment.id,
        student_id: answeringStudentId,
        student_name: st?.full_name ?? "Student",
        parent_id: user?.id ?? undefined,
        class_id: answeringAssignment.class_id,
        answers: submissionAnswerText.trim(),
        status: "submitted",
        score: null,
        max_score: answeringAssignment.total_points ?? 100,
        teacher_feedback: null,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("assignment_submissions").upsert(payload as any);
      if (error) throw error;
      return payload;
    },
    onSuccess: () => {
      toast.success("Assignment answer saved and submitted successfully!");
      setAnsweringAssignment(null);
      setSubmissionAnswerText("");
      void qc.invalidateQueries({ queryKey: ["assignment_submissions"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Save selected mark for a student row
  const handleSaveStudentMark = async (
    st: { id: string; full_name: string; student_code: string },
    sub: SubmissionRecord | undefined,
    asg: AssignmentRecord,
    markValue: string,
  ) => {
    if (!markValue.trim()) {
      toast.error("Please select a mark before saving.");
      return;
    }

    const numScore = parseFloat(markValue);
    if (isNaN(numScore) || numScore < 0) {
      toast.error("Invalid mark value.");
      return;
    }

    const key = `${asg.id}_${st.id}`;
    setSavingKey(key);

    try {
      if (sub?.id) {
        const { error } = await supabase
          .from("assignment_submissions")
          .update({
            score: numScore,
            status: "graded",
            marked_at: new Date().toISOString(),
          } as any)
          .eq("id", sub.id);
        if (error) throw error;
      } else {
        // Record mark directly even if submitted offline
        const subId = `sub-${asg.id}-${st.id}`;
        const { error } = await supabase.from("assignment_submissions").upsert({
          id: subId,
          assignment_id: asg.id,
          student_id: st.id,
          student_name: st.full_name,
          class_id: asg.class_id,
          answers: "Marked by teacher in classroom session.",
          score: numScore,
          max_score: asg.total_points ?? 100,
          status: "graded",
          submitted_at: new Date().toISOString(),
          marked_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        } as any);
        if (error) throw error;
      }

      toast.success(`Mark ${numScore}/${asg.total_points ?? 100} saved for ${st.full_name}!`);
      void qc.invalidateQueries({ queryKey: ["assignment_submissions"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save mark.");
    } finally {
      setSavingKey(null);
    }
  };

  // Export current assignment table to Excel (.xlsx)
  const handleExportToExcel = (asg: AssignmentRecord) => {
    const classStudents = (students ?? []).filter((s) => s.class_id === asg.class_id);
    if (classStudents.length === 0) {
      toast.error("No students in this class to export.");
      return;
    }

    const head = [
      "Student ID",
      "Name of Student",
      "Assignment",
      "Subject",
      "Answer Status",
      "Sent Answer",
      "Marks",
      "Max Marks",
      "Submitted Date",
    ];

    const rows = classStudents.map((st) => {
      const sub = submissionMap.get(`${asg.id}_${st.id}`);
      return [
        st.student_code,
        st.full_name,
        asg.title,
        asg.subject || "General",
        sub ? "Sent" : "Not Sent",
        sub?.answers || "-",
        sub?.score != null ? sub.score : "-",
        sub?.max_score ?? asg.total_points ?? 100,
        sub?.submitted_at ? fmtDate(sub.submitted_at) : "-",
      ];
    });

    const filename = `${asg.title.replace(/[^a-zA-Z0-9]/g, "_")}_Marks_Sheet`;
    exportExcel(head, rows, filename);
    toast.success("Assignment marks exported to Excel (.xlsx)!");
  };

  // Helper to generate selectable marks options from max score down to 0
  const getMarksOptions = (maxScore: number) => {
    const max = Math.max(1, maxScore || 100);
    const options: number[] = [];
    const step = max <= 20 ? 1 : max <= 50 ? 5 : 5;
    for (let i = max; i >= 0; i -= step) {
      options.push(i);
    }
    if (!options.includes(0)) options.push(0);
    return options;
  };

  // Check canCreate: teachers, head of studies, admins, owners (only ONE single button on page)
  const canCreate = !isSecretary && (isTeacher || isHeadOfStudies || isAdmin || !role);

  // User requirement: Secretary can't see assignments
  if (isSecretary) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="rounded-full bg-muted p-4 mb-4 border">
          <ShieldAlert className="size-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          The Assignments module is not available for secretaries. This section is restricted to
          teachers, parents, students, and academic administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header with ONLY ONE single "Make Assignment" button */}
      <PageHeader
        title="Classroom Assignments & Homework"
        description={
          isParent
            ? "View your child's assignments, read questions, and submit typed answers."
            : "Click an assignment to view student IDs, names, sent answers, and set marks."
        }
        action={
          canCreate ? (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-primary text-primary-foreground font-semibold shadow-sm"
            >
              <Plus className="size-4" /> Make Assignment
            </Button>
          ) : undefined
        }
      />

      {assignmentsLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span>Loading assignments...</span>
        </div>
      ) : visibleAssignments.length === 0 ? (
        <Card className="border-dashed py-14 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <BookOpenCheck className="size-10 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">No assignments found</p>
              <p className="text-xs text-muted-foreground max-w-md">
                {isParent
                  ? "There are currently no active assignments for your children."
                  : "No assignments have been created yet. Click 'Make Assignment' above to create Assignment 1."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isParent ? (
        // Parent View: Children's Homework List
        // User requirements:
        // 1. "the all thing will be seen by parent assigned to student key"
        // 2. "please let parent see marks they cant edit okey"
        <div className="space-y-4">
          {/* Linked Children by Student Key Card */}
          <div className="rounded-lg border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" />
                  Assigned Student Key(s)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Assignments are automatically displayed for children linked to your account via
                  their Student Key.
                </p>
              </div>

              {/* Quick Link Student Key Form */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Student Key (e.g. STD-0001)"
                  value={studentKeyInput}
                  onChange={(e) => setStudentKeyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleLinkStudentKey();
                    }
                  }}
                  className="h-8 text-xs w-56 font-mono"
                />
                <Button
                  size="sm"
                  onClick={handleLinkStudentKey}
                  disabled={linkingStudent || !studentKeyInput.trim()}
                  className="h-8 text-xs gap-1.5 font-semibold"
                >
                  {linkingStudent ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="size-3.5" />
                  )}
                  Link Key
                </Button>
              </div>
            </div>

            {/* List of currently linked children */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t">
              <span className="text-xs font-semibold text-muted-foreground">
                Your Linked Children:
              </span>
              {myChildren.length === 0 ? (
                <span className="text-xs text-amber-600 dark:text-amber-400 italic">
                  No children currently linked. Enter a Student Key (e.g. STD-0001) above to link
                  your child.
                </span>
              ) : (
                myChildren.map((child) => (
                  <Badge
                    key={child.id}
                    variant="secondary"
                    className="text-xs py-1 px-2.5 flex items-center gap-1.5 bg-muted/60"
                  >
                    <span className="font-semibold text-foreground">{child.full_name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      (Key: {child.student_code})
                    </span>
                    <span className="text-[10px] text-primary font-medium">
                      • {classes?.find((c) => c.id === child.class_id)?.name ?? child.class_id}
                    </span>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
              <h3 className="text-sm font-bold text-foreground">Assigned Homework & Marks</h3>
              <p className="text-xs text-muted-foreground">
                Review assigned questions, marks (read-only), deadlines, and submit typed answers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-xs font-semibold">Child (Student Key)</TableHead>
                    <TableHead className="text-xs font-semibold">Assignment</TableHead>
                    <TableHead className="text-xs font-semibold">Subject</TableHead>
                    <TableHead className="text-xs font-semibold">Teacher</TableHead>
                    <TableHead className="text-xs font-semibold">Marks (Read-Only)</TableHead>
                    <TableHead className="text-xs font-semibold">Deadline</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-xs text-muted-foreground"
                      >
                        No assignments created yet.
                      </TableCell>
                    </TableRow>
                  ) : myChildren.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-xs text-muted-foreground"
                      >
                        Please link your child using their Student Key above to view their classroom
                        assignments.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleAssignments.flatMap((asg, idx) => {
                      const matchingChildren = myChildren.filter(
                        (c) => c.class_id === asg.class_id,
                      );
                      if (matchingChildren.length === 0) return [];
                      return matchingChildren.map((child) => {
                        const sub = submissionMap.get(`${asg.id}_${child.id}`);
                        const isSubmitted = !!sub;
                        const isGraded = sub?.status === "graded";

                        return (
                          <TableRow key={`${asg.id}_${child.id}`} className="hover:bg-muted/20">
                            <TableCell className="text-xs font-medium">
                              <span className="font-semibold text-foreground block">
                                {child.full_name}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                Key: {child.student_code} • {asg.class_name}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs">
                              <span className="font-bold text-foreground block">
                                Assignment {idx + 1}: {asg.title}
                              </span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1 font-mono">
                                {asg.questions}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-primary">
                              {asg.subject || "General"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {asg.teacher_name || "Teacher"}
                            </TableCell>
                            <TableCell className="text-xs font-mono font-semibold">
                              {/* Read-Only Marks for Parents */}
                              {isGraded ? (
                                <div className="flex flex-col">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                                    {sub.score} / {sub.max_score} Marks
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-normal">
                                    (Teacher Graded · Read-Only)
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="font-mono text-xs font-semibold text-foreground">
                                    {asg.total_points ?? 100} Total Marks
                                  </span>
                                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                                    {isSubmitted ? "Pending Grading" : "Not Sent"}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {asg.due_date ? fmtDate(asg.due_date) : "Open"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {isGraded ? (
                                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                                  Marked: {sub.score}/{sub.max_score}
                                </Badge>
                              ) : isSubmitted ? (
                                <Badge
                                  variant="secondary"
                                  className="text-blue-700 bg-blue-500/10 text-[10px]"
                                >
                                  Submitted
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-amber-700 border-amber-400/40 text-[10px]"
                                >
                                  Not Sent
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-right whitespace-nowrap">
                              {!isSubmitted ? (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setAnsweringAssignment(asg);
                                    setAnsweringStudentId(child.id);
                                    setSubmissionAnswerText("");
                                  }}
                                  className="h-7 text-xs"
                                >
                                  Type Answer
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setViewingAnswerSubmission({
                                      studentName: child.full_name,
                                      studentCode: child.student_code,
                                      assignmentTitle: asg.title,
                                      questions: asg.questions,
                                      answers: sub.answers,
                                      submittedAt: sub.submitted_at,
                                      score: sub.score,
                                      maxScore: sub.max_score,
                                    });
                                  }}
                                  className="h-7 text-xs"
                                >
                                  View Answer & Marks
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      ) : (
        // Teacher / Academic Head View:
        // User requirement: "NOTHING WILL BW SHOW EXECPT Assigmet 1 when clickes show a colums of student id ,name of students,andanswer (will be button called view when clicked show sent asigemt oif he did sent show not set okey ) then marks we ca select maks okey then remove oe "make appoiytmaent ""
        <div className="space-y-4">
          {/* Assignment Selection: Clean and numbered (Assignment 1, Assignment 2, etc.) */}
          <div className="flex flex-wrap items-center gap-2">
            {visibleAssignments.map((asg, idx) => {
              const isSelected = activeAssignment?.id === asg.id;
              return (
                <button
                  key={asg.id}
                  type="button"
                  onClick={() => setSelectedAssignmentId(asg.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-foreground hover:bg-muted/60 border-border"
                  }`}
                >
                  <span className="font-bold">Assignment {idx + 1}</span>
                  <span className="opacity-80 font-normal">
                    ({asg.title} • {asg.class_name})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Assignment Student Table */}
          {activeAssignment && (
            <div className="rounded-lg border bg-card shadow-xs overflow-hidden space-y-0">
              {/* Assignment Details Header Bar */}
              <div className="p-4 border-b bg-muted/20 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-foreground">
                      Assignment{" "}
                      {visibleAssignments.findIndex((a) => a.id === activeAssignment.id) + 1}:{" "}
                      {activeAssignment.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activeAssignment.class_name}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>
                      <strong className="text-foreground">Subject:</strong>{" "}
                      {activeAssignment.subject || "General"}
                    </span>
                    <span>
                      <strong className="text-foreground">Total Marks:</strong>{" "}
                      {activeAssignment.total_points ?? 100}
                    </span>
                    <span>
                      <strong className="text-foreground">Deadline:</strong>{" "}
                      {activeAssignment.due_date ? fmtDate(activeAssignment.due_date) : "None"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Export to Excel button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportToExcel(activeAssignment)}
                    className="h-8 gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-600/30 hover:bg-emerald-500/10"
                  >
                    <FileSpreadsheet className="size-3.5 text-emerald-600" /> Export Excel (.xlsx)
                  </Button>

                  {canCreate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to remove "${activeAssignment.title}"?`,
                          )
                        ) {
                          deleteAssignmentMutation.mutate(activeAssignment.id);
                        }
                      }}
                      disabled={deleteAssignmentMutation.isPending}
                      className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      {deleteAssignmentMutation.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      Remove Assignment
                    </Button>
                  )}
                </div>
              </div>

              {/* Questions display */}
              <div className="px-4 py-3 bg-muted/10 border-b text-xs">
                <span className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Questions:
                </span>
                <p className="whitespace-pre-wrap font-mono text-foreground leading-relaxed">
                  {activeAssignment.questions}
                </p>
              </div>

              {/* Exact Requested Columns Table:
                  1. Student ID
                  2. Name of Students
                  3. Answer (button called "View" if sent, or "Not Sent" if not sent)
                  4. Marks (select marks dropdown + Save button)
              */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-semibold w-36">Student ID</TableHead>
                      <TableHead className="text-xs font-semibold min-w-48">
                        Name of Students
                      </TableHead>
                      <TableHead className="text-xs font-semibold w-32">Answer</TableHead>
                      <TableHead className="text-xs font-semibold min-w-48">Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const classStudents = (students ?? []).filter(
                        (s) => s.class_id === activeAssignment.class_id,
                      );

                      if (classStudents.length === 0) {
                        return (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center py-8 text-xs text-muted-foreground"
                            >
                              No students currently registered in this class.
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return classStudents.map((st) => {
                        const sub = submissionMap.get(`${activeAssignment.id}_${st.id}`);
                        const isSent = !!sub;
                        const key = `${activeAssignment.id}_${st.id}`;
                        const currentMarkVal =
                          selectedMarks[key] ?? (sub?.score != null ? String(sub.score) : "");
                        const isSaving = savingKey === key;
                        const maxScore = activeAssignment.total_points ?? 100;

                        return (
                          <TableRow key={st.id} className="hover:bg-muted/20">
                            {/* Column 1: Student ID */}
                            <TableCell className="text-xs font-mono font-medium text-muted-foreground">
                              {st.student_code || st.id.slice(0, 8)}
                            </TableCell>

                            {/* Column 2: Name of Students */}
                            <TableCell className="text-xs font-semibold text-foreground">
                              {st.full_name}
                            </TableCell>

                            {/* Column 3: Answer (button called "View" if sent, or "Not Sent" if not sent) */}
                            <TableCell className="text-xs">
                              {isSent ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10"
                                  onClick={() =>
                                    setViewingAnswerSubmission({
                                      studentName: st.full_name,
                                      studentCode: st.student_code,
                                      assignmentTitle: activeAssignment.title,
                                      questions: activeAssignment.questions,
                                      answers: sub.answers,
                                      submittedAt: sub.submitted_at,
                                      score: sub.score,
                                      maxScore: sub.max_score ?? maxScore,
                                    })
                                  }
                                >
                                  View
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground font-medium">
                                  Not Sent
                                </span>
                              )}
                            </TableCell>

                            {/* Column 4: Marks (we can select marks + Save button) */}
                            <TableCell className="text-xs">
                              <div className="flex items-center gap-2">
                                <select
                                  value={currentMarkVal}
                                  onChange={(e) =>
                                    setSelectedMarks((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="h-8 text-xs border rounded-md px-2.5 bg-background font-mono cursor-pointer min-w-32 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                  <option value="">Select Marks</option>
                                  {getMarksOptions(maxScore).map((m) => (
                                    <option key={m} value={m}>
                                      {m} / {maxScore}
                                    </option>
                                  ))}
                                </select>

                                <Button
                                  size="sm"
                                  disabled={isSaving || !currentMarkVal}
                                  onClick={() =>
                                    handleSaveStudentMark(st, sub, activeAssignment, currentMarkVal)
                                  }
                                  className="h-8 text-xs gap-1 px-3"
                                >
                                  {isSaving ? (
                                    <Loader2 className="size-3 animate-spin" />
                                  ) : (
                                    <Save className="size-3" />
                                  )}
                                  Save
                                </Button>

                                {sub?.status === "graded" && (
                                  <Badge className="bg-emerald-600 text-white text-[10px] font-bold gap-1 py-0.5">
                                    <CheckCircle2 className="size-2.5" /> Saved: {sub.score}/
                                    {sub.max_score}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DIALOG 1: Teacher Make Assignment
          Exact requested sequence:
          1. Select class
          2. Subject
          3. Title
          4. Type question
          5. Set marks
          6. Deadline
          7. Save button
      */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Make Assignment</DialogTitle>
            <DialogDescription>
              Select class, enter subject, title, type the question, set marks, and deadline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            {/* 1. Select Class */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Class <span className="text-destructive">*</span>
              </Label>
              <Select value={newClassId} onValueChange={setNewClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {(classes ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Subject */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Mathematics, Science, English, Social Studies"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>

            {/* 3. Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Fractions and Mixed Numbers Practice"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            {/* 4. Type Question */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Question <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={6}
                placeholder="Type the question(s) here..."
                value={newQuestions}
                onChange={(e) => setNewQuestions(e.target.value)}
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            {/* 5. Set Marks & 6. Deadline */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Set Marks <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 100"
                  value={newTotalPoints}
                  onChange={(e) => setNewTotalPoints(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Deadline <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 7. Save Button */}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createAssignmentMutation.mutate()}
              disabled={
                !newClassId ||
                !newSubject.trim() ||
                !newTitle.trim() ||
                !newQuestions.trim() ||
                createAssignmentMutation.isPending
              }
              className="gap-2"
            >
              {createAssignmentMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Save Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: View Sent Assignment Answer
          User requirement: "button called view when clicked show sent asigemt"
      */}
      <Dialog
        open={!!viewingAnswerSubmission}
        onOpenChange={(open) => !open && setViewingAnswerSubmission(null)}
      >
        <DialogContent className="max-w-md">
          {viewingAnswerSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold">
                  Sent Assignment: {viewingAnswerSubmission.studentName}
                </DialogTitle>
                <DialogDescription>
                  Student ID: {viewingAnswerSubmission.studentCode} •{" "}
                  {viewingAnswerSubmission.assignmentTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div>
                  <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
                    Question:
                  </span>
                  <div className="p-2.5 bg-muted/30 rounded border font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {viewingAnswerSubmission.questions}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-foreground block text-[11px] uppercase tracking-wider mb-1">
                    Student Sent Answer:
                  </span>
                  <div className="p-3 bg-muted/40 rounded border font-mono text-foreground whitespace-pre-wrap leading-relaxed">
                    {viewingAnswerSubmission.answers}
                  </div>
                </div>

                {/* Teacher Marks Section (Read-Only for Parent) */}
                <div className="p-3 bg-muted/40 rounded border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
                      Teacher Marks Assessment:
                    </span>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      Read-Only
                    </Badge>
                  </div>
                  {viewingAnswerSubmission.score != null ? (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">Awarded Score:</span>
                      <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {viewingAnswerSubmission.score} / {viewingAnswerSubmission.maxScore ?? 100}{" "}
                        Marks
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground pt-1">
                      Awaiting teacher grading. (Total possible:{" "}
                      {viewingAnswerSubmission.maxScore ?? 100} marks)
                    </p>
                  )}
                </div>

                {viewingAnswerSubmission.submittedAt && (
                  <div className="text-[11px] text-muted-foreground">
                    Submitted Date: {fmtDate(viewingAnswerSubmission.submittedAt)}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingAnswerSubmission(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Parent Answering Form
          User requirement: "on answering he can type only avoid using stickers, svg okey"
          Clean, text-only answering interface without stickers or decorative SVGs.
      */}
      <Dialog
        open={!!answeringAssignment}
        onOpenChange={(open) => !open && setAnsweringAssignment(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {answeringAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{answeringAssignment.title}</DialogTitle>
                <DialogDescription>
                  Type your answers below and click Save to submit to your teacher.
                </DialogDescription>
              </DialogHeader>

              {/* Assignment details: Title, Subject, Teacher, Marks, Deadline */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-md border">
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                    Subject
                  </span>
                  <span className="font-medium text-foreground">
                    {answeringAssignment.subject || "General"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                    Teacher
                  </span>
                  <span className="font-medium text-foreground">
                    {answeringAssignment.teacher_name || "Teacher"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                    Total Marks
                  </span>
                  <span className="font-semibold font-mono text-foreground">
                    {answeringAssignment.total_points ?? 100} Marks
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                    Deadline
                  </span>
                  <span className="font-medium text-foreground">
                    {answeringAssignment.due_date ? fmtDate(answeringAssignment.due_date) : "None"}
                  </span>
                </div>
              </div>

              {/* Question display (plain text) */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Questions:
                </span>
                <div className="p-3 bg-muted/30 border rounded text-xs whitespace-pre-wrap font-mono leading-relaxed">
                  {answeringAssignment.questions}
                </div>
              </div>

              {/* Answer input (TYPE ONLY, NO STICKERS, NO ICONS) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Type Your Answer Here <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  rows={8}
                  placeholder="Type your answers here..."
                  value={submissionAnswerText}
                  onChange={(e) => setSubmissionAnswerText(e.target.value)}
                  className="font-mono text-xs leading-relaxed"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setAnsweringAssignment(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => submitAnswerMutation.mutate()}
                  disabled={!submissionAnswerText.trim() || submitAnswerMutation.isPending}
                >
                  {submitAnswerMutation.isPending ? "Saving..." : "Save Answer"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
