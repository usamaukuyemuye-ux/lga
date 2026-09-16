import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileDown, FileSpreadsheet, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/school/ui";
import { fetchAttendance, fetchClasses, fetchStudents, fmtTime, todayISO } from "@/lib/school";
import { exportExcel, exportPdf } from "@/lib/export";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — SchoolTrack Attendance" },
      {
        name: "description",
        content:
          "Daily, weekly, monthly attendance and tuition fee reports with PDF and Excel export.",
      },
      { property: "og:title", content: "Reports — SchoolTrack Attendance" },
      {
        property: "og:description",
        content: "Daily, weekly, monthly attendance and tuition fee reports.",
      },
    ],
  }),
  component: ReportsPage,
});

const STAFF_REPORTS = [
  { value: "daily", label: "Daily attendance report" },
  { value: "weekly", label: "Weekly attendance report" },
  { value: "monthly", label: "Monthly attendance report" },
  { value: "student", label: "Student attendance report" },
  { value: "class", label: "Class attendance report" },
  { value: "teacher", label: "Teacher attendance report" },
  { value: "absentees", label: "Absentee list" },
  { value: "sick", label: "Sick student list" },
  { value: "late", label: "Late student list" },
  { value: "percentage", label: "Attendance percentage report" },
  { value: "religion", label: "Students by religion & gender" },
];

const PARENT_REPORTS = [
  { value: "daily", label: "Attendance of the Day (Daily)" },
  { value: "weekly", label: "Attendance of the Week (Weekly)" },
  { value: "monthly", label: "Attendance of the Month (Monthly)" },
  { value: "tuition_daily", label: "Tuition Fees of the Day (Daily)" },
  { value: "tuition_weekly", label: "Tuition Fees of the Week (Weekly)" },
  { value: "tuition_monthly", label: "Tuition Fees of the Month (Monthly)" },
];

function ReportsPage() {
  const { role, user } = useAuth();
  const isParent = role === "parent";

  const [type, setType] = useState("daily");
  const [from, setFrom] = useState(new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10));
  const [to, setTo] = useState(todayISO());
  const [classFilter, setClassFilter] = useState("all");
  const [childFilter, setChildFilter] = useState("all");

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    enabled: !isParent,
  });

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    enabled: !isParent,
  });

  const { data: all } = useQuery({
    queryKey: ["attendance", from, to],
    queryFn: () => fetchAttendance({ from, to }),
  });

  // Query only the logged in parent's children
  const { data: myChildren } = useQuery({
    queryKey: ["parent-my-children-reports", user?.id],
    enabled: isParent && !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, full_name, student_code, class_id")
        .eq("parent_id", user!.id)
        .order("full_name");
      return data ?? [];
    },
  });

  // Query tuition fees for parent's children
  const { data: myPayments } = useQuery({
    queryKey: ["parent-payments-reports", user?.id, from, to],
    enabled: isParent && !!user?.id,
    queryFn: async () => {
      const childIds = (myChildren ?? []).map((c) => c.id);
      if (!childIds.length) return [];
      const { data } = await supabase
        .from("payments")
        .select("*, students(full_name, student_code)")
        .in("student_id", childIds)
        .gte("paid_on", from)
        .lte("paid_on", to)
        .order("paid_on", { ascending: false });
      return data ?? [];
    },
  });

  const records = useMemo(() => {
    let r = all ?? [];
    if (isParent) {
      const childIds = (myChildren ?? []).map((c) => c.id);
      r = r.filter((x) => childIds.includes(x.student_id));
      if (childFilter !== "all") {
        r = r.filter((x) => x.student_id === childFilter);
      }
    } else {
      if (classFilter !== "all") r = r.filter((x) => x.class_id === classFilter);
    }
    return r;
  }, [all, isParent, myChildren, childFilter, classFilter]);

  const feeRecords = useMemo(() => {
    if (!isParent) return [];
    let pList = myPayments ?? [];
    if (childFilter !== "all") {
      pList = pList.filter((p) => p.student_id === childFilter);
    }
    return pList;
  }, [isParent, myPayments, childFilter]);

  const { title, head, rows } = useMemo(() => {
    const toParentStatus = (s: string) => (s === "present" || s === "late" ? "Present" : "Absent");

    // Parent Portal Reports: Only attendance of day/week/month and tuition fees of day/week/month
    if (isParent) {
      switch (type) {
        case "daily": {
          return {
            title: "Daily Attendance Report (My Children)",
            head: ["Student", "Student ID", "Date", "Status", "Arrival Time", "Departure Time"],
            rows: records.map((r) => [
              r.students?.full_name ?? "Child",
              r.students?.student_code ?? "—",
              r.attendance_date,
              toParentStatus(r.status),
              r.arrival_time ? fmtTime(r.arrival_time) : "—",
              r.departure_time ? fmtTime(r.departure_time) : "On campus",
            ]),
          };
        }
        case "weekly": {
          const weekMap = new Map<
            string,
            { week: string; student: string; present: number; absent: number }
          >();
          records.forEach((r) => {
            const d = new Date(r.attendance_date);
            const start = new Date(d);
            start.setDate(d.getDate() - d.getDay());
            const weekStr = `Week of ${start.toISOString().slice(0, 10)}`;
            const studentName = r.students?.full_name ?? "Child";
            const key = `${weekStr}|${studentName}`;
            const cur = weekMap.get(key) ?? {
              week: weekStr,
              student: studentName,
              present: 0,
              absent: 0,
            };
            if (r.status === "present" || r.status === "late") {
              cur.present += 1;
            } else {
              cur.absent += 1;
            }
            weekMap.set(key, cur);
          });
          return {
            title: "Weekly Attendance Report (My Children)",
            head: ["Week", "Student", "Present Days", "Absent Days", "Total Records", "Rate %"],
            rows: [...weekMap.values()].map((v) => {
              const total = v.present + v.absent;
              return [
                v.week,
                v.student,
                v.present,
                v.absent,
                total,
                total ? Math.round((v.present / total) * 100) : 0,
              ];
            }),
          };
        }
        case "monthly": {
          const monthMap = new Map<
            string,
            { month: string; student: string; present: number; absent: number }
          >();
          records.forEach((r) => {
            const monthStr = r.attendance_date.slice(0, 7);
            const studentName = r.students?.full_name ?? "Child";
            const key = `${monthStr}|${studentName}`;
            const cur = monthMap.get(key) ?? {
              month: monthStr,
              student: studentName,
              present: 0,
              absent: 0,
            };
            if (r.status === "present" || r.status === "late") {
              cur.present += 1;
            } else {
              cur.absent += 1;
            }
            monthMap.set(key, cur);
          });
          return {
            title: "Monthly Attendance Report (My Children)",
            head: ["Month", "Student", "Present Days", "Absent Days", "Total Records", "Rate %"],
            rows: [...monthMap.values()].map((v) => {
              const total = v.present + v.absent;
              return [
                v.month,
                v.student,
                v.present,
                v.absent,
                total,
                total ? Math.round((v.present / total) * 100) : 0,
              ];
            }),
          };
        }
        case "tuition_daily": {
          return {
            title: "Daily Tuition Fees Report (My Children)",
            head: [
              "Student",
              "Student ID",
              "Payment Date",
              "Category",
              "Term",
              "Amount",
              "Method",
              "Status",
              "Receipt / Reference",
            ],
            rows: feeRecords.map((p) => [
              p.students?.full_name ?? "Child",
              p.students?.student_code ?? "—",
              p.paid_on,
              p.category,
              p.term,
              `${p.currency ?? "RWF"} ${Number(p.amount).toLocaleString()}`,
              p.method,
              (p.status ?? "paid").toUpperCase(),
              p.reference ?? "—",
            ]),
          };
        }
        case "tuition_weekly": {
          const weekFeeMap = new Map<
            string,
            { week: string; student: string; category: string; total: number; count: number }
          >();
          feeRecords.forEach((p) => {
            const d = new Date(p.paid_on);
            const start = new Date(d);
            start.setDate(d.getDate() - d.getDay());
            const weekStr = `Week of ${start.toISOString().slice(0, 10)}`;
            const studentName = p.students?.full_name ?? "Child";
            const key = `${weekStr}|${studentName}|${p.category}`;
            const cur = weekFeeMap.get(key) ?? {
              week: weekStr,
              student: studentName,
              category: p.category,
              total: 0,
              count: 0,
            };
            cur.total += Number(p.amount);
            cur.count += 1;
            weekFeeMap.set(key, cur);
          });
          return {
            title: "Weekly Tuition Fees Report (My Children)",
            head: ["Week", "Student", "Fee Category", "Total Paid", "Payments Count"],
            rows: [...weekFeeMap.values()].map((v) => [
              v.week,
              v.student,
              v.category,
              `RWF ${v.total.toLocaleString()}`,
              v.count,
            ]),
          };
        }
        case "tuition_monthly": {
          const monthFeeMap = new Map<
            string,
            { month: string; student: string; category: string; total: number; count: number }
          >();
          feeRecords.forEach((p) => {
            const monthStr = p.paid_on.slice(0, 7);
            const studentName = p.students?.full_name ?? "Child";
            const key = `${monthStr}|${studentName}|${p.category}`;
            const cur = monthFeeMap.get(key) ?? {
              month: monthStr,
              student: studentName,
              category: p.category,
              total: 0,
              count: 0,
            };
            cur.total += Number(p.amount);
            cur.count += 1;
            monthFeeMap.set(key, cur);
          });
          return {
            title: "Monthly Tuition Fees Report (My Children)",
            head: ["Month", "Student", "Fee Category", "Total Paid", "Payments Count"],
            rows: [...monthFeeMap.values()].map((v) => [
              v.month,
              v.student,
              v.category,
              `RWF ${v.total.toLocaleString()}`,
              v.count,
            ]),
          };
        }
        default: {
          // Fallback to daily
          return {
            title: "Daily Attendance Report (My Children)",
            head: ["Student", "Student ID", "Date", "Status", "Arrival Time", "Departure Time"],
            rows: records.map((r) => [
              r.students?.full_name ?? "Child",
              r.students?.student_code ?? "—",
              r.attendance_date,
              toParentStatus(r.status),
              r.arrival_time ? fmtTime(r.arrival_time) : "—",
              r.departure_time ? fmtTime(r.departure_time) : "On campus",
            ]),
          };
        }
      }
    }

    // Staff Reports
    const dayFmt = (d: string) => d;
    const group = (keyFn: (r: (typeof records)[number]) => string, label: string) => {
      const map = new Map<
        string,
        { present: number; absent: number; sick: number; late: number }
      >();
      records.forEach((r) => {
        const k = keyFn(r);
        const cur = map.get(k) ?? { present: 0, absent: 0, sick: 0, late: 0 };
        cur[r.status as "present"] += 1;
        map.set(k, cur);
      });
      return {
        head: [label, "Present", "Absent", "Sick", "Late", "Total", "Rate %"],
        rows: [...map.entries()].map(([k, v]) => {
          const total = v.present + v.absent + v.sick + v.late;
          return [
            k,
            v.present,
            v.absent,
            v.sick,
            v.late,
            total,
            total ? Math.round((v.present / total) * 100) : 0,
          ];
        }),
      };
    };

    const listOf = (status: string, label: string) => ({
      head: ["Student", "Student ID", "Class", "Date", "Teacher"],
      rows: records
        .filter((r) => r.status === status)
        .map((r) => [
          r.students?.full_name ?? "",
          r.students?.student_code ?? "",
          r.classes?.name ?? "",
          r.attendance_date,
          r.recorded_by_name ?? "",
        ]),
      title: label,
    });

    if (type === "religion") {
      const list = (students ?? []).filter(
        (s) => classFilter === "all" || s.class_id === classFilter,
      );
      const key = (r: string, g: string) => `${r}|${g}`;
      const map = new Map<string, number>();
      list.forEach((s) => {
        const k = key((s.religion ?? "non-muslim").toLowerCase(), (s.gender ?? "").toLowerCase());
        map.set(k, (map.get(k) ?? 0) + 1);
      });
      const religions = ["muslim", "non-muslim"];
      const rows = religions.map((r) => {
        const boys = map.get(key(r, "male")) ?? 0;
        const girls = map.get(key(r, "female")) ?? 0;
        return [r === "muslim" ? "Muslim" : "Non-Muslim", boys, girls, boys + girls];
      });
      rows.push([
        "Total",
        rows.reduce((a, b) => a + (b[1] as number), 0),
        rows.reduce((a, b) => a + (b[2] as number), 0),
        rows.reduce((a, b) => a + (b[3] as number), 0),
      ]);
      return {
        title: "Students by Religion & Gender",
        head: ["Religion", "Boys", "Girls", "Total"],
        rows,
      };
    }

    switch (type) {
      case "daily": {
        const g = group((r) => dayFmt(r.attendance_date), "Date");
        return { title: "Daily Attendance Report", ...g };
      }
      case "weekly": {
        const g = group((r) => {
          const d = new Date(r.attendance_date);
          const start = new Date(d);
          start.setDate(d.getDate() - d.getDay());
          return `Week of ${start.toISOString().slice(0, 10)}`;
        }, "Week");
        return { title: "Weekly Attendance Report", ...g };
      }
      case "monthly": {
        const g = group((r) => r.attendance_date.slice(0, 7), "Month");
        return { title: "Monthly Attendance Report", ...g };
      }
      case "student": {
        const g = group((r) => r.students?.full_name ?? "Unknown", "Student");
        return { title: "Student Attendance Report", ...g };
      }
      case "class": {
        const g = group((r) => r.classes?.name ?? "Unassigned", "Class");
        return { title: "Class Attendance Report", ...g };
      }
      case "teacher": {
        const g = group((r) => r.recorded_by_name ?? "Unknown", "Teacher");
        return { title: "Teacher Attendance Report", ...g };
      }
      case "absentees":
        return { ...listOf("absent", "Absentee List"), title: "Absentee List" };
      case "sick":
        return { ...listOf("sick", "Sick Student List"), title: "Sick Student List" };
      case "late":
        return { ...listOf("late", "Late Student List"), title: "Late Student List" };
      default: {
        const head = ["Student", "Class", "Present", "Total records", "Attendance %"];
        const rows = (students ?? [])
          .filter((s) => classFilter === "all" || s.class_id === classFilter)
          .map((s) => {
            const rs = records.filter((r) => r.student_id === s.id);
            const present = rs.filter((r) => r.status === "present").length;
            return [
              s.full_name,
              s.classes?.name ?? "—",
              present,
              rs.length,
              rs.length ? Math.round((present / rs.length) * 100) : 0,
            ];
          });
        return { title: "Attendance Percentage Report", head, rows };
      }
    }
  }, [type, records, students, classFilter, isParent, feeRecords]);

  const fileName = title.toLowerCase().replace(/\s+/g, "-");
  const reportOptions = isParent ? PARENT_REPORTS : STAFF_REPORTS;

  return (
    <div>
      <PageHeader
        title={isParent ? "My Children Reports" : "Reports"}
        description={
          isParent
            ? "Generate attendance and tuition fee reports for your children with PDF or Excel export."
            : "Generate attendance reports and export them to PDF or Excel."
        }
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportPdf(title, head, rows as (string | number)[][], fileName)}
            >
              <FileDown className="size-4" /> PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => exportExcel(head, rows as (string | number)[][], fileName)}
            >
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
          </div>
        }
      />

      <Card className="print-area">
        <CardContent className="p-4">
          <div className="no-print mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Report type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            {/* In Parent Portal: Class filter is DELETED and replaced by Child filter */}
            {isParent ? (
              <div className="space-y-2">
                <Label>Child</Label>
                <Select value={childFilter} onValueChange={setChildFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All my children</SelectItem>
                    {(myChildren ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.full_name} ({c.student_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All classes</SelectItem>
                    {(classes ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {from} to {to}
              {isParent
                ? childFilter !== "all"
                  ? ` · ${(myChildren ?? []).find((c) => c.id === childFilter)?.full_name ?? "Child"}`
                  : " · All my children"
                : classFilter !== "all"
                  ? ` · ${(classes ?? []).find((c) => c.id === classFilter)?.name ?? ""}`
                  : " · All classes"}
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {head.map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    {r.map((cell, j) => {
                      // Remove background on Present / Absent status
                      const isPresent = cell === "Present";
                      const isAbsent = cell === "Absent";
                      if (isPresent || isAbsent) {
                        return (
                          <TableCell key={j}>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-semibold",
                                isPresent
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400",
                              )}
                            >
                              <span
                                className={cn(
                                  "size-1.5 rounded-full",
                                  isPresent ? "bg-emerald-500" : "bg-rose-500",
                                )}
                              />
                              {cell}
                            </span>
                          </TableCell>
                        );
                      }
                      return <TableCell key={j}>{cell}</TableCell>;
                    })}
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={head.length} className="text-center text-muted-foreground">
                      No data for this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
