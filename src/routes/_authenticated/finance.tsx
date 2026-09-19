import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Wallet,
  Receipt,
  Users,
  FileDown,
  Briefcase,
  Calendar,
  CreditCard,
  Building,
  UserCheck,
  Phone,
  Mail,
  Printer,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/school/ui";
import { StudentProfileModal, type StudentProfileData } from "@/components/school/student-profile-modal";
import { fetchClasses, fetchStudents, fmtDate, logAudit, todayISO } from "@/lib/school";
import { exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PayslipModal, formatMonthName, type SalaryRecord } from "@/components/school/payslip-modal";
import {
  getAllowedSalaryMonths,
  isMonthAllowedForSalary,
  getRoleDefaultDuty,
} from "@/lib/salary-utils";

export const Route = createFileRoute("/_authenticated/finance")({
  head: () => ({
    meta: [
      { title: "Finance, Fees & Staff Salaries — Little Gems Academy" },
      {
        name: "description",
        content: "Manage student fees, staff records, and monthly salary disbursements.",
      },
      { property: "og:title", content: "Finance, Fees & Staff Salaries — Little Gems Academy" },
      {
        property: "og:description",
        content: "Manage student fees, staff records, and monthly salary disbursements.",
      },
    ],
  }),
  component: FinancePage,
});

const CATEGORIES = ["School fees", "Uniform", "Transport", "Meals", "Books", "Other"];
const METHODS = ["cash", "bank", "mobile money", "cheque"];

function FinancePage() {
  const qc = useQueryClient();
  const { role, profile, user } = useAuth();
  const canManage = role === "admin" || role === "finance" || role === "owner";

  // Section switcher: "fees" or "payroll"
  const [activeSection, setActiveSection] = useState<"fees" | "payroll">("fees");

  // Student Fees state
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pickerClass, setPickerClass] = useState("all");
  const [pickerSearch, setPickerSearch] = useState("");
  const [browseClass, setBrowseClass] = useState("all");
  const [browseSearch, setBrowseSearch] = useState("");
  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    category: CATEGORIES[0]!,
    term: "Term 1",
    method: METHODS[0]!,
    reference: "",
    description: "",
    status: "paid",
    paid_on: todayISO(),
  });

  // Payroll / Salary state
  const allowedMonths = useMemo(() => getAllowedSalaryMonths(), []);
  const currentMonthValue = allowedMonths.find((m) => m.offset === 0)?.value || allowedMonths[0]!.value;

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");
  const [payrollSearch, setPayrollSearch] = useState("");
  const [viewingPayslip, setViewingPayslip] = useState<SalaryRecord | null>(null);

  const [salaryForm, setSalaryForm] = useState({
    staff_id: "",
    month_year: currentMonthValue,
    base_amount: "450000",
    allowances: "50000",
    deductions: "30000",
    currency: "RWF",
    payment_method: "bank",
    payment_date: todayISO(),
    reference: "",
    notes: "",
    status: "paid",
  });

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfileData | null>(null);

  // Queries
  const { data: students } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });
  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, students(full_name, student_code, classes(name))")
        .order("paid_on", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch staff profiles & roles for staff salary management
  const { data: staffList = [] } = useQuery({
    queryKey: ["school-staff-profiles"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");
      if (pErr) throw pErr;

      const { data: roles, error: rErr } = await supabase.from("user_roles").select("*");
      if (rErr) throw rErr;

      const roleMap = new Map((roles ?? []).map((r: any) => [r.user_id, r.role]));

      // Filter out pure parents, keep staff roles
      return (profiles ?? [])
        .map((p: any) => {
          const staffRole = roleMap.get(p.id) || "staff";
          return {
            ...p,
            role: staffRole,
            duty: p.duty || getRoleDefaultDuty(staffRole),
            phone: p.phone || "+250 780 000 000",
            photo_url: p.photo_url || null,
          };
        })
        .filter((p: any) => p.role !== "parent");
    },
  });

  // Fetch salaries
  const { data: salaries = [] } = useQuery<SalaryRecord[]>({
    queryKey: ["staff-salaries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salaries")
        .select("*")
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return (data as any) ?? [];
    },
  });

  // Fees calculations
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (payments ?? []).filter(
      (p) =>
        !q ||
        p.students?.full_name?.toLowerCase().includes(q) ||
        p.students?.student_code?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [payments, search]);

  const total = rows.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const pending = rows.filter((p) => p.status !== "paid").reduce((s, p) => s + Number(p.amount), 0);

  const pickerStudents = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    return (students ?? []).filter(
      (s) =>
        (pickerClass === "all" || s.class_id === pickerClass) &&
        (!q || s.full_name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)),
    );
  }, [students, pickerClass, pickerSearch]);

  const browseStudents = useMemo(() => {
    const q = browseSearch.trim().toLowerCase();
    return (students ?? []).filter(
      (s) =>
        (browseClass === "all" || s.class_id === browseClass) &&
        (!q || s.full_name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)),
    );
  }, [students, browseClass, browseSearch]);

  const paidByStudent = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of payments ?? []) {
      if (p.status !== "paid") continue;
      map.set(p.student_id, (map.get(p.student_id) ?? 0) + Number(p.amount));
    }
    return map;
  }, [payments]);

  // Payroll calculations
  const filteredStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    return staffList.filter(
      (s) =>
        !q ||
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.duty?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q),
    );
  }, [staffList, staffSearch]);

  const filteredSalaries = useMemo(() => {
    const q = payrollSearch.trim().toLowerCase();
    return salaries.filter(
      (s) =>
        !q ||
        s.staff_name?.toLowerCase().includes(q) ||
        s.staff_duty?.toLowerCase().includes(q) ||
        s.month_year?.toLowerCase().includes(q) ||
        s.reference?.toLowerCase().includes(q),
    );
  }, [salaries, payrollSearch]);

  // Total salaries paid for the current month
  const totalSalariesThisMonth = useMemo(() => {
    return salaries
      .filter((s) => s.month_year === currentMonthValue && s.status === "paid")
      .reduce((sum, s) => sum + Number(s.net_amount || 0), 0);
  }, [salaries, currentMonthValue]);

  // Check paid status for each staff member for current month
  const staffPaidMapCurrentMonth = useMemo(() => {
    const map = new Map<string, SalaryRecord>();
    for (const s of salaries) {
      if (s.month_year === currentMonthValue) {
        map.set(s.staff_id, s);
      }
    }
    return map;
  }, [salaries, currentMonthValue]);

  // Net amount live calculation for the salary form
  const calculatedNetPay = useMemo(() => {
    const b = Number(salaryForm.base_amount || 0);
    const a = Number(salaryForm.allowances || 0);
    const d = Number(salaryForm.deductions || 0);
    return Math.max(0, b + a - d);
  }, [salaryForm.base_amount, salaryForm.allowances, salaryForm.deductions]);

  // Fee payment creation
  const createPayment = useMutation({
    mutationFn: async () => {
      if (!form.student_id) throw new Error("Select a student");
      const { error } = await supabase.from("payments").insert({
        student_id: form.student_id,
        amount: Number(form.amount || 0),
        category: form.category,
        term: form.term,
        method: form.method,
        reference: form.reference || null,
        description: form.description,
        status: form.status,
        paid_on: form.paid_on,
        recorded_by: user?.id ?? null,
        recorded_by_name: profile?.full_name ?? "",
      });
      if (error) throw error;
      await logAudit("payment.create", "payments", {
        student: form.student_id,
        amount: form.amount,
      });
    },
    onSuccess: () => {
      toast.success("Payment recorded");
      setOpen(false);
      setForm({ ...form, amount: "", reference: "", description: "" });
      void qc.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removePayment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payments").delete().eq("id", id);
      if (error) throw error;
      await logAudit("payment.delete", "payments", { id });
    },
    onSuccess: () => {
      toast.success("Payment removed");
      void qc.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Salary disbursement mutation
  const disburseSalary = useMutation({
    mutationFn: async () => {
      if (!salaryForm.staff_id) throw new Error("Select a staff member");

      // STRICT VALIDATION: enforce allowed months (1 month prior, current, 1 month ahead)
      if (!isMonthAllowedForSalary(salaryForm.month_year)) {
        throw new Error(
          "Payroll policy error: Salary payments can only be processed for 1 month prior, the current month, or 1 month ahead.",
        );
      }

      const staff = staffList.find((s) => s.id === salaryForm.staff_id);
      if (!staff) throw new Error("Selected staff member not found");

      const base = Number(salaryForm.base_amount || 0);
      const allowances = Number(salaryForm.allowances || 0);
      const deductions = Number(salaryForm.deductions || 0);
      const net = base + allowances - deductions;

      const salId = `sal-${staff.id}-${salaryForm.month_year}`;

      const { error } = await supabase.from("salaries").upsert({
        id: salId,
        staff_id: staff.id,
        staff_name: staff.full_name,
        staff_email: staff.email,
        staff_duty: staff.duty,
        staff_role: staff.role,
        staff_phone: staff.phone,
        staff_photo_url: staff.photo_url || null,
        month_year: salaryForm.month_year,
        base_amount: base,
        allowances,
        deductions,
        net_amount: net,
        currency: salaryForm.currency,
        payment_method: salaryForm.payment_method,
        payment_date: salaryForm.payment_date,
        reference: salaryForm.reference.trim() || `PAY-${salaryForm.month_year}-${Date.now().toString().slice(-4)}`,
        notes: salaryForm.notes.trim() || null,
        status: salaryForm.status,
        paid_by: user?.id || null,
        paid_by_name: profile?.full_name || "Finance Officer",
      });

      if (error) throw error;

      await logAudit("salary.disburse", "salaries", {
        staff_name: staff.full_name,
        month_year: salaryForm.month_year,
        net_amount: net,
      });
    },
    onSuccess: () => {
      toast.success("Staff salary recorded successfully");
      setSalaryModalOpen(false);
      void qc.invalidateQueries({ queryKey: ["staff-salaries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeSalary = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("salaries").delete().eq("id", id);
      if (error) throw error;
      await logAudit("salary.delete", "salaries", { id });
    },
    onSuccess: () => {
      toast.success("Salary record removed");
      void qc.invalidateQueries({ queryKey: ["staff-salaries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openPayDialogForStaff = (staff: any) => {
    setSalaryForm((prev) => ({
      ...prev,
      staff_id: staff.id,
      month_year: currentMonthValue,
      reference: `BK-PAY-${currentMonthValue.replace("-", "")}-${staff.id.slice(-3)}`,
    }));
    setSalaryModalOpen(true);
  };

  const head = [
    "Student",
    "Student ID",
    "Class",
    "Category",
    "Term",
    "Amount",
    "Method",
    "Status",
    "Date",
  ];
  const body = rows.map((p) => [
    p.students?.full_name ?? "",
    p.students?.student_code ?? "",
    p.students?.classes?.name ?? "",
    p.category,
    p.term,
    `${p.currency} ${Number(p.amount).toLocaleString()}`,
    p.method,
    p.status,
    p.paid_on,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance, Fees & Staff Salaries"
        description="Oversee school fee collections, manage staff directory, and disburse monthly staff salaries."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              value={activeSection}
              onValueChange={(v) => setActiveSection(v as "fees" | "payroll")}
              className="w-auto"
            >
              <TabsList className="h-9 p-1">
                <TabsTrigger value="fees" className="text-xs px-3 h-7 gap-1.5 cursor-pointer">
                  <Receipt className="size-3.5" />
                  <span>Student Fees</span>
                </TabsTrigger>
                <TabsTrigger value="payroll" className="text-xs px-3 h-7 gap-1.5 cursor-pointer">
                  <Users className="size-3.5" />
                  <span>Staff Salaries & Payroll</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeSection === "fees" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportPdf("School Payments", head, body, "payments")}
                  className="h-9 text-xs gap-1.5"
                >
                  <FileDown className="size-3.5" /> PDF
                </Button>
                {canManage && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-9 text-xs gap-1.5">
                        <Plus className="size-3.5" /> Record payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Record student fee payment</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Class</Label>
                          <Select
                            value={pickerClass}
                            onValueChange={(v) => {
                              setPickerClass(v);
                              setForm({ ...form, student_id: "" });
                            }}
                          >
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
                          <Label>Find student</Label>
                          <Input
                            placeholder="Name or student number…"
                            value={pickerSearch}
                            onChange={(e) => setPickerSearch(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Student *</Label>
                          <Select
                            value={form.student_id}
                            onValueChange={(v) => setForm({ ...form, student_id: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select student…" />
                            </SelectTrigger>
                            <SelectContent>
                              {pickerStudents.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.full_name} ({s.student_code}) · {s.classes?.name ?? "No class"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount (RWF) *</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date of payment *</Label>
                          <Input
                            type="date"
                            value={form.paid_on}
                            onChange={(e) => setForm({ ...form, paid_on: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={form.category}
                            onValueChange={(v) => setForm({ ...form, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Term</Label>
                          <Select
                            value={form.term}
                            onValueChange={(v) => setForm({ ...form, term: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["Term 1", "Term 2", "Term 3"].map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Payment method</Label>
                          <Select
                            value={form.method}
                            onValueChange={(v) => setForm({ ...form, method: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {METHODS.map((m) => (
                                <SelectItem key={m} value={m} className="capitalize">
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Payment status</Label>
                          <Select
                            value={form.status}
                            onValueChange={(v) => setForm({ ...form, status: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["paid", "partial", "pending"].map((s) => (
                                <SelectItem key={s} value={s} className="capitalize">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Reference / receipt no.</Label>
                          <Input
                            value={form.reference}
                            onChange={(e) => setForm({ ...form, reference: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createPayment.mutate()} disabled={createPayment.isPending}>
                          Save payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}

            {activeSection === "payroll" && canManage && (
              <Button
                size="sm"
                onClick={() => {
                  setSalaryForm({
                    staff_id: staffList[0]?.id || "",
                    month_year: currentMonthValue,
                    base_amount: "450000",
                    allowances: "50000",
                    deductions: "30000",
                    currency: "RWF",
                    payment_method: "bank",
                    payment_date: todayISO(),
                    reference: `BK-PAY-${currentMonthValue.replace("-", "")}-001`,
                    notes: "",
                    status: "paid",
                  });
                  setSalaryModalOpen(true);
                }}
                className="h-9 text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" /> Disburse Salary
              </Button>
            )}
          </div>
        }
      />

      {/* SECTION 1: STUDENT FEES */}
      {activeSection === "fees" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total collected"
              value={`RWF ${total.toLocaleString()}`}
              icon={Wallet}
              tone="success"
            />
            <StatCard
              label="Outstanding"
              value={`RWF ${pending.toLocaleString()}`}
              icon={Receipt}
              tone="destructive"
            />
            <StatCard label="Payments recorded" value={rows.length} icon={Receipt} />
            <StatCard label="Students" value={students?.length ?? 0} icon={Users} tone="info" />
          </div>

          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">Students Ledger</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Select value={browseClass} onValueChange={setBrowseClass}>
                  <SelectTrigger className="w-44">
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
                <Input
                  className="w-56"
                  placeholder="Name or student number…"
                  value={browseSearch}
                  onChange={(e) => setBrowseSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student number</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total paid</TableHead>
                    {canManage && <TableHead />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {browseStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => setSelectedStudentForProfile(s)}
                        >
                          {s.photo_url ? (
                            <img
                              src={s.photo_url}
                              alt={s.full_name}
                              className="size-7 rounded-full object-cover border group-hover:opacity-80"
                            />
                          ) : (
                            <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold group-hover:bg-primary/20">
                              {s.full_name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="group-hover:text-primary group-hover:underline">{s.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.student_code}</TableCell>
                      <TableCell>{s.classes?.name ?? "—"}</TableCell>
                      <TableCell className="font-semibold">
                        RWF {(paidByStudent.get(s.id) ?? 0).toLocaleString()}
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setForm({ ...form, student_id: s.id });
                              setPickerClass(s.class_id ?? "all");
                              setPickerSearch("");
                              setOpen(true);
                            }}
                          >
                            <Plus className="size-4" /> Payment
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {!browseStudents.length && (
                    <TableRow>
                      <TableCell
                        colSpan={canManage ? 5 : 4}
                        className="text-center text-muted-foreground"
                      >
                        No students match this class or search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Payment History</CardTitle>
              <Input
                className="max-w-xs"
                placeholder="Search student or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    {canManage && <TableHead />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium text-left hover:text-primary hover:underline cursor-pointer block leading-tight text-foreground"
                          onClick={() => {
                            const st = (students ?? []).find((s) => s.id === p.student_id);
                            if (st) {
                              setSelectedStudentForProfile(st);
                            } else {
                              setSelectedStudentForProfile({
                                id: p.student_id,
                                student_code: p.students?.student_code ?? "",
                                full_name: p.students?.full_name ?? "Student",
                                classes: { name: p.students?.classes?.name },
                              });
                            }
                          }}
                        >
                          {p.students?.full_name}
                        </button>
                        <div className="font-mono text-xs text-muted-foreground">
                          {p.students?.student_code}
                        </div>
                      </TableCell>
                      <TableCell>{p.students?.classes?.name ?? "—"}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.term}</TableCell>
                      <TableCell className="font-semibold">
                        {p.currency} {Number(p.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{p.method}</TableCell>
                      <TableCell className="capitalize">{p.status}</TableCell>
                      <TableCell>{fmtDate(p.paid_on)}</TableCell>
                      {canManage && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePayment.mutate(p.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {!rows.length && (
                    <TableRow>
                      <TableCell
                        colSpan={canManage ? 9 : 8}
                        className="text-center text-muted-foreground"
                      >
                        No payments recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 2: STAFF SALARIES & PAYROLL */}
      {activeSection === "payroll" && (
        <div className="space-y-6">
          {/* Payroll KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={`Salaries Paid (${formatMonthName(currentMonthValue)})`}
              value={`RWF ${totalSalariesThisMonth.toLocaleString()}`}
              icon={Wallet}
              tone="success"
            />
            <StatCard
              label="Staff Headcount"
              value={staffList.length}
              icon={Users}
              tone="info"
            />
            <StatCard
              label="Paid Payroll Vouchers"
              value={salaries.length}
              icon={Receipt}
            />
            <StatCard
              label="Payment Window"
              value="Current ± 1 Mo."
              icon={Calendar}
              tone="accent"
            />
          </div>

          {/* Section: Staff Members Directory with Full Details */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span>School Staff Directory & Payroll Status</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Academic and administrative staff details: full name, duty, email, photo, phone number and salary dispatch.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search staff name, duty, phone…"
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Duty / Position</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>{formatMonthName(currentMonthValue)} Status</TableHead>
                    {canManage && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((st) => {
                    const paidRecord = staffPaidMapCurrentMonth.get(st.id);
                    return (
                      <TableRow key={st.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {st.photo_url ? (
                              <img
                                src={st.photo_url}
                                alt={st.full_name}
                                className="size-10 rounded-full object-cover border border-muted shadow-sm flex-shrink-0"
                              />
                            ) : (
                              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 border">
                                {st.full_name?.slice(0, 2).toUpperCase() || "ST"}
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-sm text-foreground block">
                                {st.full_name}
                              </span>
                              <span className="text-[11px] text-muted-foreground capitalize">
                                {st.role.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-medium py-0.5">
                            {st.duty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3.5 text-slate-400" />
                            <span>{st.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                            <Phone className="size-3.5 text-slate-400" />
                            <span>{st.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {paidRecord ? (
                            <div className="flex items-center gap-1.5">
                              <Badge className="bg-emerald-600 text-white text-[11px] font-semibold gap-1">
                                <CheckCircle2 className="size-3" /> Paid: RWF {Number(paidRecord.net_amount).toLocaleString()}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="secondary" className="text-[11px] gap-1 text-muted-foreground">
                              <Clock className="size-3" /> Pending
                            </Badge>
                          )}
                        </TableCell>
                        {canManage && (
                          <TableCell className="text-right">
                            <Button
                              variant={paidRecord ? "outline" : "default"}
                              size="sm"
                              onClick={() => openPayDialogForStaff(st)}
                              className="h-8 text-xs gap-1.5 cursor-pointer"
                            >
                              <CreditCard className="size-3.5" />
                              <span>{paidRecord ? "Add/Revise" : "Pay Salary"}</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  {!filteredStaff.length && (
                    <TableRow>
                      <TableCell colSpan={canManage ? 6 : 5} className="text-center py-8 text-muted-foreground">
                        No staff members found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Section: Disbursed Salaries & Payslips Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="size-4 text-primary" />
                  <span>Salary Disbursal Records & Payslips</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Official historical payroll records with downloadable & printable employee payslips.
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search payroll records, staff…"
                  value={payrollSearch}
                  onChange={(e) => setPayrollSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Duty</TableHead>
                    <TableHead>Month Paid</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Disbursed On</TableHead>
                    <TableHead className="text-right">Payslip & Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalaries.map((sal) => (
                    <TableRow key={sal.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {sal.staff_photo_url ? (
                            <img
                              src={sal.staff_photo_url}
                              alt={sal.staff_name}
                              className="size-8 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {sal.staff_name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-xs block">{sal.staff_name}</span>
                            <span className="text-[11px] text-muted-foreground">{sal.staff_email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {sal.staff_duty || "Staff"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium text-xs">
                          {formatMonthName(sal.month_year)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-foreground text-xs">
                        {sal.currency || "RWF"} {Number(sal.net_amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize text-xs">
                        {sal.payment_method}
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        {sal.reference || "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {fmtDate(sal.payment_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1 cursor-pointer"
                            onClick={() => setViewingPayslip(sal)}
                          >
                            <Printer className="size-3" />
                            <span>Payslip</span>
                          </Button>
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() => removeSalary.mutate(sal.id)}
                              title="Delete record"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredSalaries.length && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No salary records found. Click "Disburse Salary" to add a staff salary.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DISBURSE SALARY DIALOG WITH STRICT MONTH POLICY */}
      <Dialog open={salaryModalOpen} onOpenChange={setSalaryModalOpen}>
        <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Record Staff Salary Disbursement</DialogTitle>
            <DialogDescription className="text-xs">
              Process monthly salary payment for staff. Strictly limited to 1 month prior, the current month, or 1 month ahead.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Staff Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Staff Member *</Label>
              <Select
                value={salaryForm.staff_id}
                onValueChange={(val) => {
                  setSalaryForm((prev) => ({
                    ...prev,
                    staff_id: val,
                    reference: `BK-PAY-${prev.month_year.replace("-", "")}-${val.slice(-3)}`,
                  }));
                }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Pick staff member…" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((st) => (
                    <SelectItem key={st.id} value={st.id} className="text-xs">
                      {st.full_name} — {st.duty} ({st.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Strict Month Selection */}
            <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Salary Month *</Label>
                <Badge variant="outline" className="text-[10px] text-primary">
                  Policy Enforced: Current ± 1 Month Only
                </Badge>
              </div>
              <Select
                value={salaryForm.month_year}
                onValueChange={(val) =>
                  setSalaryForm((prev) => ({
                    ...prev,
                    month_year: val,
                    reference: `BK-PAY-${val.replace("-", "")}-${prev.staff_id.slice(-3)}`,
                  }))
                }
              >
                <SelectTrigger className="text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allowedMonths.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Per financial control rules, payroll entries can only be entered for 1 month prior, the current month, or 1 month ahead.
              </p>
            </div>

            {/* Compensation Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Base Salary (RWF) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={salaryForm.base_amount}
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, base_amount: e.target.value })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Allowances (RWF)</Label>
                <Input
                  type="number"
                  min="0"
                  value={salaryForm.allowances}
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, allowances: e.target.value })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Deductions (RWF)</Label>
                <Input
                  type="number"
                  min="0"
                  value={salaryForm.deductions}
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, deductions: e.target.value })
                  }
                  className="text-xs"
                />
              </div>
            </div>

            {/* Net Amount Preview Box */}
            <div className="rounded-lg bg-slate-900 text-white p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Net Payable Remuneration
                </span>
                <span className="text-xs text-slate-300">Base + Allowances - Deductions</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-white">
                  RWF {calculatedNetPay.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Particulars */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Payment Method</Label>
                <Select
                  value={salaryForm.payment_method}
                  onValueChange={(v) =>
                    setSalaryForm({ ...salaryForm, payment_method: v })
                  }
                >
                  <SelectTrigger className="text-xs capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["bank", "mobile money", "cash", "cheque"].map((m) => (
                      <SelectItem key={m} value={m} className="capitalize text-xs">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Disbursement Date</Label>
                <Input
                  type="date"
                  value={salaryForm.payment_date}
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, payment_date: e.target.value })
                  }
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Payment Reference / Transaction Slip No.</Label>
              <Input
                placeholder="e.g. BK-TX-984214 or MOMO-LGA-1234"
                value={salaryForm.reference}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, reference: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Remarks / Notes</Label>
              <Textarea
                placeholder="Optional payroll remarks or disbursement memo…"
                value={salaryForm.notes}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, notes: e.target.value })
                }
                className="text-xs h-16"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSalaryModalOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              onClick={() => disburseSalary.mutate()}
              disabled={!salaryForm.staff_id || disburseSalary.isPending}
              className="text-xs h-8 gap-1.5"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Confirm & Save Salary</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Official Printable Payslip Modal */}
      <PayslipModal
        open={!!viewingPayslip}
        onOpenChange={(open) => {
          if (!open) setViewingPayslip(null);
        }}
        salary={viewingPayslip}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        open={!!selectedStudentForProfile}
        onOpenChange={(open) => !open && setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
      />
    </div>
  );
}
