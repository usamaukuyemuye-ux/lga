import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { Printer } from "lucide-react";
import { PageHeader } from "@/components/school/ui";
import { fetchClasses, fetchStudents } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SchoolLogo } from "@/components/school/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/cards")({
  head: () => ({
    meta: [
      { title: "Student ID Cards — SchoolTrack Attendance" },
      { name: "description", content: "Generate and print student ID cards with unique QR codes." },
      { property: "og:title", content: "Student ID Cards — SchoolTrack Attendance" },
      {
        property: "og:description",
        content: "Generate and print student ID cards with unique QR codes.",
      },
    ],
  }),
  component: CardsPage,
});

function CardsPage() {
  const [classFilter, setClassFilter] = useState("all");
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const { data: students } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });
  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

  const list = (students ?? []).filter((s) => classFilter === "all" || s.class_id === classFilter);

  useEffect(() => {
    let active = true;
    (async () => {
      const out: Record<string, string> = {};
      for (const s of list) {
        out[s.id] = await QRCode.toDataURL(s.qr_token, { margin: 1, width: 220 });
      }
      if (active) setQrs(out);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, classFilter]);

  return (
    <div>
      <PageHeader
        title="Student ID Cards & QR codes"
        description="Every student has a unique QR code. Print the cards and hand them out."
        action={
          <Button onClick={() => window.print()}>
            <Printer className="size-4" /> Print cards
          </Button>
        }
      />

      <div className="mb-4 print:hidden">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-56">
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-4 py-2.5 text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <SchoolLogo size="sm" />
              <span className="text-xs font-bold tracking-tight uppercase">
                Little Gems Academy
              </span>
            </div>
            <CardContent className="flex gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-bold">{s.full_name}</p>
                <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground">ID:</dt>
                    <dd className="font-mono">{s.student_code}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground">Class:</dt>
                    <dd>{s.classes?.name ?? "—"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground">Gender:</dt>
                    <dd className="capitalize">{s.gender}</dd>
                  </div>
                </dl>
              </div>
              {qrs[s.id] ? (
                <img
                  src={qrs[s.id]}
                  alt={`QR code for ${s.full_name}`}
                  className="size-28 rounded-lg border bg-card p-1"
                />
              ) : (
                <div className="size-28 animate-pulse rounded-lg bg-muted" />
              )}
            </CardContent>
          </Card>
        ))}
        {!list.length && (
          <p className="text-sm text-muted-foreground">No students in this class yet.</p>
        )}
      </div>
    </div>
  );
}
