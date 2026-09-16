import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/school/ui";
import { fetchClasses, logAudit } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/_authenticated/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable — SchoolTrack" },
      {
        name: "description",
        content: "Subjects, times, classes and the teacher assigned to each lesson.",
      },
      { property: "og:title", content: "Timetable — SchoolTrack" },
      {
        property: "og:description",
        content: "Subjects, times, classes and the teacher assigned to each lesson.",
      },
    ],
  }),
  component: TimetablePage,
});

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TimetablePage() {
  const qc = useQueryClient();
  const { role, user } = useAuth();
  const canManage = role === "admin" || role === "secretary" || role === "head_of_studies";
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState(role === "teacher");
  const [form, setForm] = useState({
    class_id: "",
    teacher_id: "",
    subject: "",
    day_of_week: "1",
    start_time: "08:00",
    end_time: "09:00",
    room: "",
  });

  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const { data: teachers } = useQuery({
    queryKey: ["teacher-profiles"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher");
      const ids = (roles ?? []).map((r) => r.user_id);
      if (!ids.length) return [];
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids)
        .order("full_name");
      return data ?? [];
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ["timetable"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timetable")
        .select("*, classes(name), profiles(full_name)")
        .order("day_of_week")
        .order("start_time");
      if (error) throw error;
      return data;
    },
  });

  const rows = (lessons ?? []).filter((l) => !mine || l.teacher_id === user?.id);

  const create = useMutation({
    mutationFn: async () => {
      if (!form.subject.trim()) throw new Error("Subject is required");
      const { error } = await supabase.from("timetable").insert({
        class_id: form.class_id || null,
        teacher_id: form.teacher_id || null,
        subject: form.subject.trim(),
        day_of_week: Number(form.day_of_week),
        start_time: form.start_time,
        end_time: form.end_time,
        room: form.room || null,
      });
      if (error) throw error;
      await logAudit("timetable.create", "timetable", { subject: form.subject });
    },
    onSuccess: () => {
      toast.success("Lesson added to the timetable");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["timetable"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("timetable").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lesson removed");
      void qc.invalidateQueries({ queryKey: ["timetable"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Timetable"
        description="Subject, time, class and room for every lesson. Administrators and secretaries set it up."
        action={
          <div className="flex gap-2">
            {role === "teacher" && (
              <Button variant="outline" onClick={() => setMine((m) => !m)}>
                {mine ? "Show all lessons" : "Show only mine"}
              </Button>
            )}
            {canManage && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4" /> Add lesson
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a lesson</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Subject</Label>
                      <Input
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Mathematics"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Select
                        value={form.class_id}
                        onValueChange={(v) => setForm({ ...form, class_id: v })}
                      >
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
                    <div className="space-y-2">
                      <Label>Teacher</Label>
                      <Select
                        value={form.teacher_id}
                        onValueChange={(v) => setForm({ ...form, teacher_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {(teachers ?? []).map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select
                        value={form.day_of_week}
                        onValueChange={(v) => setForm({ ...form, day_of_week: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d, i) => (
                            <SelectItem key={d} value={String(i)}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Room</Label>
                      <Input
                        value={form.room}
                        onChange={(e) => setForm({ ...form, room: e.target.value })}
                        placeholder="Block A - 12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Starts</Label>
                      <Input
                        type="time"
                        value={form.start_time}
                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ends</Label>
                      <Input
                        type="time"
                        value={form.end_time}
                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => create.mutate()} disabled={create.isPending}>
                      Save lesson
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                {canManage && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{DAYS[l.day_of_week] ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {String(l.start_time).slice(0, 5)} – {String(l.end_time).slice(0, 5)}
                  </TableCell>
                  <TableCell className="font-medium">{l.subject}</TableCell>
                  <TableCell>{l.classes?.name ?? "—"}</TableCell>
                  <TableCell>{l.profiles?.full_name ?? "—"}</TableCell>
                  <TableCell>{l.room ?? "—"}</TableCell>
                  {canManage && (
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(l.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell
                    colSpan={canManage ? 7 : 6}
                    className="text-center text-muted-foreground"
                  >
                    No lessons scheduled yet.
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
