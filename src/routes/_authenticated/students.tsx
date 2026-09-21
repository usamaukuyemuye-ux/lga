import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
  UserPlus,
  School,
  CheckCircle2,
  Mail,
  Phone,
  UserCheck,
  Eye,
  ShieldAlert,
  Lock,
  Printer,
  QrCode,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/school/ui";
import {
  fetchClasses,
  fetchStudents,
  logAudit,
  type CampusCode,
  CAMPUSES,
  generateStudentRegistrationCode,
  parseStudentRegistrationCode,
} from "@/lib/school";
import { cn } from "@/lib/utils";
import { StudentQrModal } from "@/components/school/student-qr-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/students")({
  head: () => ({
    meta: [
      { title: "Students & Parents — Little Gems Academy" },
      {
        name: "description",
        content: "Register and manage student records and parent accounts at Little Gems Academy.",
      },
      { property: "og:title", content: "Students & Parents — Little Gems Academy" },
      {
        property: "og:description",
        content: "Register and manage student records and parent accounts at Little Gems Academy.",
      },
    ],
  }),
  component: StudentsPage,
});

export const ACADEMIC_YEARS = [
  "2029-2030",
  "2028-2029",
  "2027-2028",
  "2026-2027",
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2020-2021",
  "2019-2020",
  "2018-2019",
  "2017-2018",
  "2016-2017",
  "2015-2016",
] as const;

export const DEFAULT_ACADEMIC_YEAR = "2025-2026";

export const STUDENT_PHOTO_PRESETS = [
  {
    label: "Boy Learner (P1-P3)",
    url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&h=200&fit=crop&crop=faces",
  },
  {
    label: "Girl Learner (P1-P3)",
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop&crop=faces",
  },
  {
    label: "Girl Learner (P4-P6)",
    url: "https://images.unsplash.com/photo-1595454223600-91fbdd7ce51a?w=200&h=200&fit=crop&crop=faces",
  },
  {
    label: "Boy Learner (P4-P6)",
    url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=faces",
  },
  {
    label: "Young Student",
    url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=200&h=200&fit=crop&crop=faces",
  },
  {
    label: "Senior Student",
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop&crop=faces",
  },
];

export function getStudentAcademicYear(
  s: { academic_year?: string | null; created_at?: string } | null | undefined,
): string {
  if (!s) return DEFAULT_ACADEMIC_YEAR;
  if (s.academic_year) return s.academic_year;
  if (s.created_at) {
    const yr = new Date(s.created_at).getFullYear();
    if (!isNaN(yr) && yr >= 2015 && yr <= 2030) {
      return `${yr}-${yr + 1}`;
    }
  }
  return DEFAULT_ACADEMIC_YEAR;
}

type Form = {
  id?: string;
  student_code: string;
  full_name: string;
  gender: string;
  religion: string;
  academic_year: string;
  date_of_birth: string;
  class_id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  photo_url: string;
  create_parent_account: boolean;
};

const empty: Form = {
  student_code: "",
  full_name: "",
  gender: "male",
  religion: "non-muslim",
  academic_year: DEFAULT_ACADEMIC_YEAR,
  date_of_birth: "",
  class_id: "",
  parent_name: "",
  parent_email: "",
  parent_phone: "",
  address: "",
  photo_url: "",
  create_parent_account: true,
};

function StudentsPage() {
  const { role, profile, user } = useAuth();
  const qc = useQueryClient();
  const canManage = role === "admin" || role === "secretary";
  const isTeacher = role === "teacher";

  const [activeTab, setActiveTab] = useState<"students" | "parents">("students");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrStudent, setQrStudent] = useState<any | null>(null);
  const [parentDialogOpen, setParentDialogOpen] = useState(false);
  const [quickClassOpen, setQuickClassOpen] = useState(false);
  const [quickClassName, setQuickClassName] = useState("");
  const [form, setForm] = useState<Form>(empty);

  const [parentForm, setParentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "Parent123",
    studentIds: [] as string[],
  });

  const { data: students } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });
  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

  // Approved class access requests for teachers
  const { data: approvedClassAccess } = useQuery({
    queryKey: ["teacher-class-access-students", profile?.id],
    enabled: isTeacher,
    queryFn: async () => {
      const { data } = await supabase
        .from("permission_requests")
        .select("request_details")
        .eq("teacher_id", profile?.id ?? "")
        .eq("status", "approved")
        .eq("request_type", "class_access");
      return (data ?? [])
        .map((r) => (r.request_details as any)?.class_id)
        .filter(Boolean) as string[];
    },
  });

  // Filter classes assigned to the teacher
  const assignedClasses = useMemo(() => {
    if (!classes) return [];
    if (!isTeacher) return classes;
    return classes.filter(
      (c) =>
        c.teacher_id === profile?.id ||
        c.teacher_id === user?.id ||
        approvedClassAccess?.includes(c.id),
    );
  }, [classes, isTeacher, profile?.id, user?.id, approvedClassAccess]);

  const assignedClassIds = useMemo(
    () => new Set(assignedClasses.map((c) => c.id)),
    [assignedClasses],
  );

  const { data: registeredParents } = useQuery({
    queryKey: ["registered-parents"],
    enabled: canManage,
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("role", "parent");
      const parentUserIds = (roles ?? []).map((r) => r.user_id);
      if (!parentUserIds.length) return [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, active")
        .in("id", parentUserIds);
      return profiles ?? [];
    },
  });

  const { data: studentDiscipline } = useQuery({
    queryKey: ["student-discipline-history", selectedStudent?.id],
    enabled: !!selectedStudent?.id && profileDialogOpen,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discipline_incidents")
        .select("*")
        .eq("student_id", selectedStudent!.id)
        .order("incident_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // All students across all classes and sections are accessible to school staff
  const visibleStudents = useMemo(() => students ?? [], [students]);

  const filteredStudents = useMemo(
    () =>
      visibleStudents.filter((s) => {
        const matchesClass = classFilter === "all" || s.class_id === classFilter;
        const studentYear = getStudentAcademicYear(s);
        const matchesYear = academicYearFilter === "all" || studentYear === academicYearFilter;
        const matchesSearch =
          `${s.full_name} ${s.student_code} ${s.classes?.name ?? ""} ${studentYear} ${s.parent_name ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesClass && matchesYear && matchesSearch;
      }),
    [visibleStudents, search, classFilter, academicYearFilter],
  );

  const filteredParents = useMemo(() => {
    return (registeredParents ?? []).filter((p) =>
      `${p.full_name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [registeredParents, search]);

  // Quick class creator
  const createClassMutation = useMutation({
    mutationFn: async (className: string) => {
      const trimmed = className.trim();
      if (!trimmed) throw new Error("Class name is required");
      const { data, error } = await supabase
        .from("classes")
        .insert({ name: trimmed })
        .select("id")
        .single();
      if (error) throw error;
      await logAudit("class.create", "classes", { name: trimmed });
      return data;
    },
    onSuccess: (data) => {
      toast.success("New class created");
      setQuickClassName("");
      setQuickClassOpen(false);
      if (data?.id) {
        setForm((prev) => ({ ...prev, class_id: data.id }));
      }
      void qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Save student mutation (handles automatic parent account creation & linking)
  const save = useMutation({
    mutationFn: async (f: Form) => {
      let parentId: string | null = null;

      // 1. Check if parent already exists by email
      if (f.parent_email.trim()) {
        const { data: existingParent } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", f.parent_email.trim().toLowerCase())
          .maybeSingle();

        if (existingParent?.id) {
          parentId = existingParent.id;
        } else if (f.create_parent_account && f.parent_name.trim()) {
          // Auto-create parent profile and user_role so they can log in
          const newParentId = `user-${Date.now()}`;
          await supabase.from("profiles").upsert({
            id: newParentId,
            full_name: f.parent_name.trim(),
            email: f.parent_email.trim().toLowerCase(),
            phone: f.parent_phone.trim() || null,
            active: true,
          });
          await supabase.from("user_roles").upsert({
            user_id: newParentId,
            role: "parent",
          });
          parentId = newParentId;
          await logAudit("parent.create_auto", "users", {
            email: f.parent_email,
            name: f.parent_name,
          });
        }
      }

      const row = {
        student_code: f.student_code.trim(),
        full_name: f.full_name.trim(),
        gender: f.gender,
        religion: f.religion,
        academic_year: f.academic_year || DEFAULT_ACADEMIC_YEAR,
        date_of_birth: f.date_of_birth || null,
        class_id: f.class_id || null,
        parent_name: f.parent_name.trim() || null,
        parent_email: f.parent_email.trim().toLowerCase() || null,
        parent_phone: f.parent_phone.trim() || null,
        address: f.address.trim() || null,
        photo_url: f.photo_url.trim() || null,
        parent_id: parentId,
      };

      const res = f.id
        ? await supabase.from("students").update(row).eq("id", f.id)
        : await supabase.from("students").insert(row);
      if (res.error) throw res.error;

      await logAudit(f.id ? "student.update" : "student.create", "students", { name: f.full_name });
    },
    onSuccess: () => {
      toast.success("Student registered successfully");
      setOpen(false);
      setForm(empty);
      void qc.invalidateQueries({ queryKey: ["students"] });
      void qc.invalidateQueries({ queryKey: ["registered-parents"] });
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Dedicated parent account registration
  const createParentMutation = useMutation({
    mutationFn: async (pf: typeof parentForm) => {
      if (!pf.fullName.trim() || !pf.email.trim()) {
        throw new Error("Parent full name and email are required.");
      }
      const parentId = `user-${Date.now()}`;
      const email = pf.email.trim().toLowerCase();

      // Create in profiles
      const profRes = await supabase.from("profiles").upsert({
        id: parentId,
        full_name: pf.fullName.trim(),
        email,
        phone: pf.phone.trim() || null,
        active: true,
      });
      if (profRes.error) throw profRes.error;

      // Assign parent role
      const roleRes = await supabase.from("user_roles").upsert({
        user_id: parentId,
        role: "parent",
      });
      if (roleRes.error) throw roleRes.error;

      // Link selected students
      if (pf.studentIds.length > 0) {
        const updateRes = await supabase
          .from("students")
          .update({
            parent_id: parentId,
            parent_name: pf.fullName.trim(),
            parent_email: email,
            parent_phone: pf.phone.trim() || null,
          })
          .in("id", pf.studentIds);
        if (updateRes.error) throw updateRes.error;
      }

      await logAudit("parent.create", "users", {
        name: pf.fullName,
        email,
        linkedStudents: pf.studentIds.length,
      });
    },
    onSuccess: () => {
      toast.success("Parent account registered and linked successfully");
      setParentDialogOpen(false);
      setParentForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "Parent123",
        studentIds: [],
      });
      void qc.invalidateQueries({ queryKey: ["registered-parents"] });
      void qc.invalidateQueries({ queryKey: ["students"] });
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
      await logAudit("student.delete", "students", { id });
    },
    onSuccess: () => {
      toast.success("Student removed");
      void qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const nextCode = () => `STD-${String((students?.length ?? 0) + 1).padStart(4, "0")}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students & Parents"
        description="Administrators and secretaries can register learners, create parent accounts, and assign classes."
        action={
          canManage && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Register Student Dialog */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() =>
                      setForm({ ...empty, student_code: nextCode(), create_parent_account: true })
                    }
                    className="gap-1.5"
                  >
                    <Plus className="size-4" /> Register student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{form.id ? "Edit student" : "Register new student"}</DialogTitle>
                    <DialogDescription>
                      Create student profile, assign grade/class, and link parent details.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    {/* Student Basic Info */}
                    <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="size-4 text-primary" /> Learner Details
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="student_code">Student ID / Code *</Label>
                          <Input
                            id="student_code"
                            value={form.student_code}
                            onChange={(e) => setForm({ ...form, student_code: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="full_name">Full name *</Label>
                          <Input
                            id="full_name"
                            placeholder="e.g. Alice Uwase"
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Class / Grade</Label>
                          <div className="flex gap-1.5">
                            <Select
                              value={form.class_id}
                              onValueChange={(v) => setForm({ ...form, class_id: v })}
                            >
                              <SelectTrigger className="flex-1">
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
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              title="Quick create class"
                              className="px-2 text-xs"
                              onClick={() => setQuickClassOpen(!quickClassOpen)}
                            >
                              + Class
                            </Button>
                          </div>
                          {quickClassOpen && (
                            <div className="flex gap-1.5 pt-1">
                              <Input
                                placeholder="New class name (e.g. Primary 7)"
                                value={quickClassName}
                                onChange={(e) => setQuickClassName(e.target.value)}
                                className="h-8 text-xs"
                              />
                              <Button
                                size="sm"
                                className="h-8 px-2 text-xs"
                                disabled={!quickClassName.trim() || createClassMutation.isPending}
                                onClick={() => createClassMutation.mutate(quickClassName)}
                              >
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="dob">Date of birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={form.date_of_birth}
                            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Gender</Label>
                          <Select
                            value={form.gender}
                            onValueChange={(v) => setForm({ ...form, gender: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Religion</Label>
                          <Select
                            value={form.religion}
                            onValueChange={(v) => setForm({ ...form, religion: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="muslim">Muslim</SelectItem>
                              <SelectItem value="non-muslim">Non-Muslim</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Academic Year</Label>
                          <Select
                            value={form.academic_year}
                            onValueChange={(v) => setForm({ ...form, academic_year: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ACADEMIC_YEARS.map((yr) => (
                                <SelectItem key={yr} value={yr}>
                                  {yr} {yr === DEFAULT_ACADEMIC_YEAR ? "(Current)" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Child Profile Picture Selector */}
                        <div className="space-y-2 col-span-full pt-1 border-t">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold flex items-center gap-1.5">
                              <Camera className="size-3.5 text-primary" /> Child Profile Picture
                            </Label>
                            {form.photo_url && (
                              <button
                                type="button"
                                className="text-[11px] text-destructive hover:underline font-medium cursor-pointer"
                                onClick={() => setForm({ ...form, photo_url: "" })}
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-2.5 rounded-lg border bg-background">
                            <div className="size-14 rounded-full overflow-hidden border-2 border-primary/20 bg-muted/40 shrink-0 flex items-center justify-center">
                              {form.photo_url ? (
                                <img
                                  src={form.photo_url}
                                  alt={form.full_name || "Student"}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-base text-muted-foreground flex items-center justify-center">
                                  {form.full_name ? (
                                    form.full_name.charAt(0).toUpperCase()
                                  ) : (
                                    <Camera className="size-5 text-muted-foreground/60" />
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 space-y-2 w-full min-w-0">
                              <Input
                                placeholder="Paste photo image URL (https://...) or choose a preset below"
                                value={form.photo_url}
                                onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                                className="h-8 text-xs"
                              />
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  Sample Avatars:
                                </span>
                                {STUDENT_PHOTO_PRESETS.map((preset, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    className={cn(
                                      "size-7 rounded-full overflow-hidden border hover:scale-110 transition-transform cursor-pointer shadow-2xs",
                                      form.photo_url === preset.url &&
                                        "ring-2 ring-primary border-primary",
                                    )}
                                    title={preset.label}
                                    onClick={() => setForm({ ...form, photo_url: preset.url })}
                                  >
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="size-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Details & Account Creation */}
                    <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <UserCheck className="size-4 text-emerald-600" /> Parent / Guardian
                          Information
                        </div>
                        {(registeredParents ?? []).length > 0 && (
                          <Select
                            onValueChange={(val) => {
                              const p = (registeredParents ?? []).find((x) => x.id === val);
                              if (p) {
                                setForm((prev) => ({
                                  ...prev,
                                  parent_name: p.full_name,
                                  parent_email: p.email,
                                  parent_phone: p.phone ?? "",
                                }));
                              }
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs w-48">
                              <SelectValue placeholder="Pick existing parent…" />
                            </SelectTrigger>
                            <SelectContent>
                              {(registeredParents ?? []).map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.full_name} ({p.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="parent_name">Parent name</Label>
                          <Input
                            id="parent_name"
                            placeholder="e.g. Robert Smith"
                            value={form.parent_name}
                            onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="parent_email">Parent email</Label>
                          <Input
                            id="parent_email"
                            type="email"
                            placeholder="e.g. robert.smith@example.com"
                            value={form.parent_email}
                            onChange={(e) => setForm({ ...form, parent_email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="parent_phone">Parent phone (Gate alerts)</Label>
                          <Input
                            id="parent_phone"
                            placeholder="+250 788 123 456"
                            value={form.parent_phone}
                            onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="address">Residential address</Label>
                          <Input
                            id="address"
                            placeholder="District / Sector / Cell"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                          />
                        </div>
                      </div>

                      {!form.id && (
                        <div className="flex items-center justify-between rounded-lg bg-card p-2.5 border mt-2">
                          <div className="space-y-0.5">
                            <Label className="text-xs font-semibold cursor-pointer">
                              Auto-create Parent Portal account
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                              Allows parent to log in immediately and receive gate notifications.
                            </p>
                          </div>
                          <Switch
                            checked={form.create_parent_account}
                            onCheckedChange={(checked) =>
                              setForm({ ...form, create_parent_account: checked })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => save.mutate(form)}
                      disabled={!form.full_name || !form.student_code || save.isPending}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="size-4" /> Save student
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dedicated Register Parent Dialog */}
              <Dialog open={parentDialogOpen} onOpenChange={setParentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1.5">
                    <UserPlus className="size-4" /> Register parent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Register new parent</DialogTitle>
                    <DialogDescription>
                      Create a parent account and optionally link their children right away.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="p_name">Parent Full Name *</Label>
                      <Input
                        id="p_name"
                        placeholder="e.g. Grace Mukamana"
                        value={parentForm.fullName}
                        onChange={(e) => setParentForm({ ...parentForm, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="p_email">Email Address (Login ID) *</Label>
                      <Input
                        id="p_email"
                        type="email"
                        placeholder="e.g. grace@example.com"
                        value={parentForm.email}
                        onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="p_phone">Phone Number</Label>
                      <Input
                        id="p_phone"
                        placeholder="+250 788 123 456"
                        value={parentForm.phone}
                        onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="p_pwd">Initial Login Password</Label>
                      <Input
                        id="p_pwd"
                        value={parentForm.password}
                        onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <Label>Link Enrolled Students (Optional)</Label>
                      <div className="max-h-36 overflow-y-auto border rounded-md p-2 space-y-1 bg-muted/10">
                        {(students ?? []).map((s) => {
                          const isSelected = parentForm.studentIds.includes(s.id);
                          return (
                            <label
                              key={s.id}
                              className="flex items-center gap-2 text-xs p-1 rounded hover:bg-muted cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setParentForm({
                                      ...parentForm,
                                      studentIds: [...parentForm.studentIds, s.id],
                                    });
                                  } else {
                                    setParentForm({
                                      ...parentForm,
                                      studentIds: parentForm.studentIds.filter((id) => id !== s.id),
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-primary"
                              />
                              <span className="font-medium">{s.full_name}</span>
                              <span className="font-mono text-muted-foreground">
                                ({s.student_code})
                              </span>
                            </label>
                          );
                        })}
                        {!(students ?? []).length && (
                          <div className="text-xs text-muted-foreground py-2 text-center">
                            No students registered yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => createParentMutation.mutate(parentForm)}
                      disabled={
                        !parentForm.fullName.trim() ||
                        !parentForm.email.trim() ||
                        createParentMutation.isPending
                      }
                    >
                      Create parent account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )
        }
      />

      {/* Tabs: Students Roster vs Parents Directory (Parents directory only for admin / secretary) */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => setActiveTab("students")}
          >
            <GraduationCap className="size-4" /> Students ({visibleStudents.length})
          </Button>
          {canManage && (
            <Button
              variant={activeTab === "parents" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
              onClick={() => setActiveTab("parents")}
            >
              <Users className="size-4" /> Registered Parents ({registeredParents?.length ?? 0})
            </Button>
          )}
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          {canManage
            ? "Admins & Secretaries have full management rights"
            : isTeacher
              ? "Teacher view · Scoped to your assigned classes"
              : "Read-only view"}
        </div>
      </div>

      {isTeacher && assignedClasses.length === 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="size-4" /> No Classes Assigned
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            You do not currently have any classes assigned to your teaching profile. Teachers are
            only permitted to view profiles of students in classes assigned to them. Please contact
            the school administration to assign your classroom roster.
          </p>
        </div>
      )}

      {activeTab === "students" ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-56 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9 h-9 text-xs"
                  placeholder={
                    isTeacher
                      ? "Search students in your classes by name or student ID…"
                      : "Search students by name, ID, or class…"
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-44 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All classes & sections</SelectItem>
                  {(classes ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                <SelectTrigger className="w-48 h-9 text-xs">
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Academic Years (2015–2030)</SelectItem>
                  {ACADEMIC_YEARS.map((yr) => (
                    <SelectItem key={yr} value={yr}>
                      {yr}{" "}
                      {yr === DEFAULT_ACADEMIC_YEAR
                        ? "★ Current"
                        : yr < DEFAULT_ACADEMIC_YEAR
                          ? "· Past Year"
                          : "· Future"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Secretary & Admin Historical Academic Year Archive Bar */}
            {canManage && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-border/50 pt-1">
                <span className="text-muted-foreground whitespace-nowrap font-medium text-[11px] mr-1">
                  Secretary Archive (2015–2030):
                </span>
                <Badge
                  variant={academicYearFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer text-[10px] whitespace-nowrap hover:bg-primary/20"
                  onClick={() => setAcademicYearFilter("all")}
                >
                  All Years
                </Badge>
                {ACADEMIC_YEARS.map((yr) => (
                  <Badge
                    key={yr}
                    variant={academicYearFilter === yr ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px] whitespace-nowrap hover:bg-primary/20 font-mono",
                      yr === DEFAULT_ACADEMIC_YEAR &&
                        "border-primary/50 text-primary font-semibold",
                      yr < DEFAULT_ACADEMIC_YEAR && "text-muted-foreground",
                    )}
                    onClick={() => setAcademicYearFilter(yr)}
                  >
                    {yr}
                  </Badge>
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Learner Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Religion</TableHead>
                    <TableHead>Parent / Guardian</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {s.student_code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {s.photo_url ? (
                            <img
                              src={s.photo_url}
                              alt={s.full_name}
                              className="size-8 rounded-full object-cover border shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border">
                              {s.full_name?.charAt(0) ?? "S"}
                            </div>
                          )}
                          <button
                            type="button"
                            className="font-medium text-left hover:text-primary transition-colors cursor-pointer truncate max-w-[200px]"
                            onClick={() => {
                              setSelectedStudent(s);
                              setProfileDialogOpen(true);
                            }}
                          >
                            {s.full_name}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {s.classes?.name ?? "Unassigned"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-mono",
                            getStudentAcademicYear(s) === DEFAULT_ACADEMIC_YEAR
                              ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                              : getStudentAcademicYear(s) < DEFAULT_ACADEMIC_YEAR
                                ? "border-muted-foreground/30 text-muted-foreground bg-muted/30"
                                : "border-blue-500/40 text-blue-700 dark:text-blue-300",
                          )}
                        >
                          {getStudentAcademicYear(s)}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize text-xs">{s.gender}</TableCell>
                      <TableCell className="capitalize text-xs">{s.religion}</TableCell>
                      <TableCell>
                        {/* Parent name only - phone number and email address hidden for privacy */}
                        <div className="text-xs font-medium">{s.parent_name ?? "—"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View student profile"
                            onClick={() => {
                              setSelectedStudent(s);
                              setProfileDialogOpen(true);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Link
                            to="/discipline"
                            search={{ studentId: s.id }}
                            className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                            title="Discipline & Conduct Records"
                          >
                            <ShieldAlert className="size-4" />
                          </Link>
                          {canManage && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit student"
                                onClick={() => {
                                  setForm({
                                    id: s.id,
                                    student_code: s.student_code,
                                    full_name: s.full_name,
                                    gender: s.gender,
                                    religion: s.religion ?? "non-muslim",
                                    academic_year: getStudentAcademicYear(s),
                                    date_of_birth: s.date_of_birth ?? "",
                                    class_id: s.class_id ?? "",
                                    parent_name: s.parent_name ?? "",
                                    parent_email: s.parent_email ?? "",
                                    parent_phone: s.parent_phone ?? "",
                                    address: s.address ?? "",
                                    photo_url: s.photo_url ?? "",
                                    create_parent_account: false,
                                  });
                                  setOpen(true);
                                }}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Remove student"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${s.full_name}?`)) {
                                    remove.mutate(s.id);
                                  }
                                }}
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredStudents.length && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground text-sm"
                      >
                        {isTeacher && assignedClasses.length === 0
                          ? "No assigned classes available."
                          : "No students found."}{" "}
                        {canManage ? "Click 'Register student' above to add one." : ""}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Parents Directory View (Admin / Secretary only) */
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative min-w-56 flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9 h-9 text-xs"
                  placeholder="Search parents by name, email, or phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {canManage && (
                <Button
                  size="sm"
                  onClick={() => setParentDialogOpen(true)}
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" /> Add parent
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Login Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Linked Learners</TableHead>
                    <TableHead>Portal Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.map((p) => {
                    const children = (students ?? []).filter(
                      (s) =>
                        s.parent_id === p.id ||
                        (s.parent_email && s.parent_email.toLowerCase() === p.email.toLowerCase()),
                    );
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              {p.full_name.charAt(0)}
                            </div>
                            <span>{p.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="size-3.5" /> {p.email}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          {p.phone ? (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="size-3.5" /> {p.phone}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {children.map((child) => (
                              <Badge key={child.id} variant="secondary" className="text-xs">
                                {child.full_name} ({child.classes?.name ?? "No class"})
                              </Badge>
                            ))}
                            {!children.length && (
                              <span className="text-xs text-muted-foreground italic">
                                No children linked yet
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.active ? "default" : "secondary"} className="text-xs">
                            {p.active ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!filteredParents.length && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground text-sm"
                      >
                        No parents found.{" "}
                        {canManage ? "Use the 'Register parent' button above to create one." : ""}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Student Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              Student Profile
            </DialogTitle>
            <DialogDescription>
              {isTeacher
                ? "Classroom learner profile (Privacy protected)"
                : "Comprehensive student information & academic record"}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-muted/40 border">
                    {selectedStudent.photo_url ? (
                      <img
                        src={selectedStudent.photo_url}
                        alt={selectedStudent.full_name}
                        className="size-14 rounded-full object-cover border-2 border-primary/30 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0 border">
                        {selectedStudent.full_name?.charAt(0) ?? "S"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {selectedStudent.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-mono font-medium text-primary">
                          ID: {selectedStudent.student_code}
                        </span>
                        <span>·</span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                          {selectedStudent.classes?.name ?? "No class"}
                        </Badge>
                        <span>·</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] font-mono",
                            getStudentAcademicYear(selectedStudent) === DEFAULT_ACADEMIC_YEAR
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          Year: {getStudentAcademicYear(selectedStudent)}
                          {getStudentAcademicYear(selectedStudent) < DEFAULT_ACADEMIC_YEAR &&
                            " (Past Archive)"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-md border bg-card">
                      <span className="text-muted-foreground block text-[11px]">Academic Year</span>
                      <span className="font-semibold font-mono text-primary mt-0.5 block">
                        {getStudentAcademicYear(selectedStudent)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-md border bg-card">
                      <span className="text-muted-foreground block text-[11px]">Gender</span>
                      <span className="font-medium capitalize mt-0.5 block">
                        {selectedStudent.gender || "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-md border bg-card">
                      <span className="text-muted-foreground block text-[11px]">Religion</span>
                      <span className="font-medium capitalize mt-0.5 block">
                        {selectedStudent.religion || "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-md border bg-card">
                      <span className="text-muted-foreground block text-[11px]">Date of Birth</span>
                      <span className="font-medium mt-0.5 block">
                        {selectedStudent.date_of_birth || "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-md border bg-card">
                      <span className="text-muted-foreground block text-[11px]">Classroom</span>
                      <span className="font-medium mt-0.5 block">
                        {selectedStudent.classes?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  {/* Parent / Guardian Information */}
                  <div className="rounded-lg border p-3 bg-muted/20 space-y-2">
                    <div className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <Users className="size-3.5 text-primary" />
                      Parent / Guardian Information
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Name: </span>
                      <span className="font-medium">
                        {selectedStudent.parent_name || "Not provided"}
                      </span>
                    </div>

                    {/* Phone & Email: Strictly hidden for teachers as requested */}
                    {isTeacher ? (
                      <div className="rounded bg-muted/60 px-2.5 py-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5 border border-muted">
                        <Lock className="size-3 text-muted-foreground/80 shrink-0" />
                        <span>
                          Contact information (phone & email) is hidden for learner privacy.
                        </span>
                      </div>
                    ) : canManage ? (
                      <div className="space-y-1 pt-1 text-xs border-t border-muted">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="size-3" />
                          <span>{selectedStudent.parent_email || "No email on record"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="size-3" />
                          <span>{selectedStudent.parent_phone || "No phone on record"}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Conduct & Disciplinary Record */}
                  <div className="rounded-lg border p-3 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                        <ShieldAlert className="size-3.5 text-primary" />
                        Conduct & Disciplinary Record
                      </div>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {(studentDiscipline ?? []).length}{" "}
                        {(studentDiscipline ?? []).length === 1 ? "Incident" : "Incidents"}
                      </Badge>
                    </div>

                    {!(studentDiscipline ?? []).length ? (
                      <div className="rounded bg-muted/40 p-2.5 text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Exemplary record. No behavioral incidents logged.</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-44 overflow-y-auto">
                        {(studentDiscipline ?? []).slice(0, 5).map((inc: any) => (
                          <div
                            key={inc.id}
                            className="rounded border bg-card p-2 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-foreground">
                                {inc.category} ({inc.severity})
                              </span>
                              <span className="text-muted-foreground">{inc.incident_date}</span>
                            </div>
                            <p className="text-muted-foreground text-[11px] line-clamp-2">
                              {inc.description}
                            </p>
                            <div className="flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground">
                              <span>Action: {inc.action_taken || "Noted"}</span>
                              <span>
                                {inc.parent_acknowledged
                                  ? "✓ Acknowledged by parent"
                                  : "⏳ Pending parent review"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-1">
                      <Link
                        to="/discipline"
                        search={{ studentId: selectedStudent.id }}
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                        onClick={() => setProfileDialogOpen(false)}
                      >
                        Go to Student Discipline module →
                      </Link>
                    </div>
                  </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-between">
            {canManage && selectedStudent && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 cursor-pointer text-xs"
                onClick={() => {
                  setProfileDialogOpen(false);
                  setForm({
                    id: selectedStudent.id,
                    student_code: selectedStudent.student_code,
                    full_name: selectedStudent.full_name,
                    gender: selectedStudent.gender,
                    religion: selectedStudent.religion ?? "non-muslim",
                    academic_year: getStudentAcademicYear(selectedStudent),
                    date_of_birth: selectedStudent.date_of_birth ?? "",
                    class_id: selectedStudent.class_id ?? "",
                    parent_name: selectedStudent.parent_name ?? "",
                    parent_email: selectedStudent.parent_email ?? "",
                    parent_phone: selectedStudent.parent_phone ?? "",
                    address: selectedStudent.address ?? "",
                    photo_url: selectedStudent.photo_url ?? "",
                    create_parent_account: false,
                  });
                  setOpen(true);
                }}
              >
                <Pencil className="size-3.5" />
                <span>Edit & Photo</span>
              </Button>
            )}
            <Button
              size="sm"
              className="gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={() => {
                setQrStudent(selectedStudent);
                setQrModalOpen(true);
              }}
            >
              <QrCode className="size-3.5" />
              <Printer className="size-3.5" />
              <span>Print QR Pass</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setProfileDialogOpen(false);
                setSelectedStudent(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Printable QR Code Preview Modal */}
      <StudentQrModal open={qrModalOpen} onOpenChange={setQrModalOpen} student={qrStudent} />
    </div>
  );
}
