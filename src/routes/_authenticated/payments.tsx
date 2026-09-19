import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Receipt, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/school/ui";
import { fmtDate } from "@/lib/school";
import { exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [
      { title: "My Payments — Little Gems Academy" },
      { name: "description", content: "See every school fee payment recorded for your children." },
      { property: "og:title", content: "My Payments — Little Gems Academy" },
      {
        property: "og:description",
        content: "See every school fee payment recorded for your children.",
      },
    ],
  }),
  component: MyPaymentsPage,
});

function MyPaymentsPage() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["my-payments", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: children } = await supabase
        .from("students")
        .select("id, full_name, student_code")
        .eq("parent_id", user!.id);
      const ids = (children ?? []).map((c) => c.id);
      if (!ids.length) return { children: children ?? [], payments: [] };
      const { data: payments } = await supabase
        .from("payments")
        .select("*, students(full_name, student_code)")
        .in("student_id", ids)
        .order("paid_on", { ascending: false });
      return { children: children ?? [], payments: payments ?? [] };
    },
  });

  const payments = data?.payments ?? [];
  const paid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount), 0);
  const due = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + Number(p.amount), 0);

  const head = ["Student", "Category", "Term", "Amount", "Method", "Status", "Date", "Receipt"];
  const body = payments.map((p) => [
    p.students?.full_name ?? "",
    p.category,
    p.term,
    `${p.currency} ${Number(p.amount).toLocaleString()}`,
    p.method,
    p.status,
    p.paid_on,
    p.reference ?? "—",
  ]);

  return (
    <div>
      <PageHeader
        title="My payments"
        description="Every fee payment the school finance office has recorded for your children."
        action={
          <Button
            variant="outline"
            onClick={() => exportPdf("My Payments", head, body, "my-payments")}
          >
            <FileDown className="size-4" /> PDF
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total paid"
          value={`RWF ${paid.toLocaleString()}`}
          icon={Wallet}
          tone="success"
        />
        <StatCard
          label="Outstanding"
          value={`RWF ${due.toLocaleString()}`}
          icon={Receipt}
          tone="destructive"
        />
        <StatCard label="Receipts" value={payments.length} icon={Receipt} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Payment history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.students?.full_name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.term}</TableCell>
                  <TableCell className="font-semibold">
                    {p.currency} {Number(p.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{p.method}</TableCell>
                  <TableCell className="capitalize">{p.status}</TableCell>
                  <TableCell>{fmtDate(p.paid_on)}</TableCell>
                  <TableCell className="font-mono text-xs">{p.reference ?? "—"}</TableCell>
                </TableRow>
              ))}
              {!payments.length && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
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
