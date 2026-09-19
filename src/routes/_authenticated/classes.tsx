import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, School, Users, Search, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/school/ui";
import { StudentProfileModal, type StudentProfileData } from "@/components/school/student-profile-modal";
import { useAuth } from "@/lib/auth";
import { fetchClasses, fetchStudents, logAudit } from "@/lib/school";
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
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/classes")({
  head: () => ({
    meta: [
      { title: "Classes — Little Gems Academy" },
      {
        name: "description",
        content: "Create and manage school classes and their student allocation.",
      },
      { property: "og:title", content: "Classes — Little Gems Academy" },
      {
        property: "og:description",
        content: "Create and manage school classes and their student allocation.",
      },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  const qc = useQueryClient();
  const { role } = useAuth();
  const canManage = role === "admin" || role === "secretary";
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [selectedRosterClass, setSelectedRosterClass] = useState<any | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfileData | null>(null);

  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const { data: students } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });

  const add = useMutation({
    mutationFn: async (className: string) => {
      const trimmed = className.trim();
      if (!trimmed) throw new Error("Please enter a class name");
      const { error } = await supabase.from("classes").insert({ name: trimmed });
      if (error) throw error;
      await logAudit("class.create", "classes", { name: trimmed });
    },
    onSuccess: () => {
      setName("");
      setNewClassName("");
      setDialogOpen(false);
      toast.success("Class created successfully");
      void qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const studentCount = (students ?? []).filter((s) => s.class_id === id).length;
      if (studentCount > 0) {
        if (!confirm(`This class has ${studentCount} student(s) enrolled. Delete anyway?`)) {
          return;
        }
      }
      const { error } = await supabase.from("classes").delete().eq("id", id);
      if (error) throw error;
      await logAudit("class.delete", "classes", { id });
    },
    onSuccess: () => {
      toast.success("Class deleted");
      void qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filteredClasses = useMemo(() => {
    return (classes ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [classes, search]);

  const totalLearners = students?.length ?? 0;
  const avgClassSize =
    (classes?.length ?? 0) > 0 ? Math.round(totalLearners / (classes?.length || 1)) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes & Grades"
        description="Administrators and secretaries can add new grade levels, nursery, primary, or secondary classes."
        action={
          canManage && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" /> Create new class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create new class</DialogTitle>
                  <DialogDescription>
                    Add a new grade or class section (e.g. Nursery 1, Primary 7, Senior 1).
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="class-name">Class or Grade Name *</Label>
                    <Input
                      id="class-name"
                      placeholder="e.g. Primary 7, Baby Class, Grade 4B"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newClassName.trim()) {
                          add.mutate(newClassName);
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => add.mutate(newClassName)}
                    disabled={!newClassName.trim() || add.isPending}
                  >
                    Save class
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 flex items-center gap-4">
          <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <School className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{classes?.length ?? 0}</div>
            <div className="text-xs text-muted-foreground">Active classes created</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalLearners}</div>
            <div className="text-xs text-muted-foreground">Total enrolled students</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="size-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
            <Users className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{avgClassSize}</div>
            <div className="text-xs text-muted-foreground">Average students per class</div>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Input
                  placeholder="Quick add: e.g. Primary 7"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs w-48"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) {
                      add.mutate(name);
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="h-9 gap-1"
                  onClick={() => add.mutate(name)}
                  disabled={!name.trim() || add.isPending}
                >
                  <Plus className="size-3.5" /> Add
                </Button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Enrolled Students</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((c) => {
                  const classStudents = (students ?? []).filter((s) => s.class_id === c.id);
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-semibold text-sm">
                        <div className="flex items-center gap-2">
                          <School className="size-4 text-muted-foreground" />
                          <span>{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={classStudents.length > 0 ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {classStudents.length} student{classStudents.length === 1 ? "" : "s"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5 cursor-pointer"
                          onClick={() => setSelectedRosterClass(c)}
                        >
                          <Users className="size-3 text-primary" />
                          <span>View roster ({classStudents.length})</span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        {canManage ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete class"
                            onClick={() => remove.mutate(c.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">View only</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!filteredClasses.length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      No classes found.{" "}
                      {canManage ? "Use the 'Create new class' button above to add one." : ""}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Class Section Roster Dialog */}
      <Dialog
        open={!!selectedRosterClass}
        onOpenChange={(open) => !open && setSelectedRosterClass(null)}
      >
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <School className="size-5 text-primary" />
              {selectedRosterClass?.name} · Class Roster
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enrolled students in this classroom section. Click any learner to open their full profile.
            </DialogDescription>
          </DialogHeader>

          {selectedRosterClass && (
            <div className="space-y-2 pt-1">
              {(() => {
                const enrolled = (students ?? []).filter(
                  (s) => s.class_id === selectedRosterClass.id,
                );
                if (enrolled.length === 0) {
                  return (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No learners currently assigned to {selectedRosterClass.name}.
                    </div>
                  );
                }
                return (
                  <div className="space-y-1.5">
                    {enrolled.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {st.photo_url ? (
                            <img
                              src={st.photo_url}
                              alt={st.full_name}
                              className="size-9 rounded-full object-cover border shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border">
                              {st.full_name?.charAt(0) ?? "S"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-xs truncate text-foreground">
                              {st.full_name}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              ID: {st.student_code}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 cursor-pointer shrink-0"
                          onClick={() => {
                            setSelectedStudentForProfile({
                              ...st,
                              classes: { name: selectedRosterClass.name },
                            });
                          }}
                        >
                          <GraduationCap className="size-3 text-primary" />
                          <span>Profile</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Profile Dialog */}
      <StudentProfileModal
        open={!!selectedStudentForProfile}
        onOpenChange={(open) => !open && setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
      />
    </div>
  );
}
