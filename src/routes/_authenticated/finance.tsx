import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Wallet, Receipt, Users, FileDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/school/ui";
import { fetchClasses, fetchStudents, fmtDate, logAudit, todayISO } from "@/lib/school";
import { exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/finance")({
  head: () => ({
    meta: [
      { title: "Finance & Fees — SchoolTrack" },
      {
        name: "description",
        content: "Record school fee payments and track balances per student.",
      },
      { property: "og:title", content: "Finance & Fees — SchoolTrack" },
      {
        property: "og:description",
        content: "Record school fee payments and track balances per student.",
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
  const canManage = role === "admin" || role === "finance";
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

  const create = useMutation({
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

  const remove = useMutation({
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
    <div>
      <PageHeader
        title="Finance & fees"
        description="Record every payment made by parents. Parents see their own child's receipts instantly."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportPdf("School Payments", head, body, "payments")}
            >
              <FileDown className="size-4" /> PDF
            </Button>
            {canManage && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4" /> Record payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Record a payment</DialogTitle>
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
                      <Label>Student ({pickerStudents.length} found)</Label>
                      <Select
                        value={form.student_id}
                        onValueChange={(v) => setForm({ ...form, student_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {pickerStudents.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.full_name} · {s.student_code} · {s.classes?.name ?? "No class"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (RWF)</Label>
                      <Input
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Paid on</Label>
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
                      <Label>Method</Label>
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
                      <Label>Status</Label>
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
                    <Button onClick={() => create.mutate()} disabled={create.isPending}>
                      Save payment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

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

      <Card className="mt-6">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">Students</CardTitle>
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
                  <TableCell className="font-medium">{s.full_name}</TableCell>
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

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Payment history</CardTitle>
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
                    <div className="font-medium">{p.students?.full_name}</div>
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
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(p.id)}>
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
  );
}
