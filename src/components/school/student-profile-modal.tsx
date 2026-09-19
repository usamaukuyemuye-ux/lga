import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  Calendar,
  Phone,
  Mail,
  Lock,
  QrCode,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentQrModal } from "./student-qr-modal";

export interface StudentProfileData {
  id: string;
  student_code: string;
  full_name: string;
  gender?: string | null;
  religion?: string | null;
  academic_year?: string | null;
  date_of_birth?: string | null;
  class_id?: string | null;
  classes?: { name?: string | null } | null;
  parent_name?: string | null;
  parent_email?: string | null;
  parent_phone?: string | null;
  address?: string | null;
  photo_url?: string | null;
}

interface StudentProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData | null;
}

export function StudentProfileModal({
  open,
  onOpenChange,
  student,
}: StudentProfileModalProps) {
  const { role } = useAuth();
  const [qrOpen, setQrOpen] = useState(false);

  const canViewContacts =
    role === "admin" || role === "secretary" || role === "owner" || role === "finance" || role === "head_of_studies";

  // Fetch discipline incidents for this student
  const { data: studentDiscipline } = useQuery({
    queryKey: ["student-discipline-history", student?.id],
    enabled: !!student?.id && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discipline_incidents")
        .select("*")
        .eq("student_id", student!.id)
        .order("incident_date", { ascending: false });
      if (error) return [];
      return data ?? [];
    },
  });

  // Fetch recent attendance history for this student
  const { data: recentAttendance } = useQuery({
    queryKey: ["student-recent-attendance", student?.id],
    enabled: !!student?.id && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("id, date, status, arrival_time")
        .eq("student_id", student!.id)
        .order("date", { ascending: false })
        .limit(5);
      if (error) return [];
      return data ?? [];
    },
  });

  if (!student) return null;

  const academicYear =
    student.academic_year ||
    "2025-2026";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="size-5 text-primary" />
              Student Profile · Little Gems Academy
            </DialogTitle>
            <DialogDescription className="text-xs">
              Learner information, classroom section, and records.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Header / Avatar Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/40 border">
              {student.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.full_name}
                  className="size-16 rounded-full object-cover border-2 border-primary/30 shadow-sm shrink-0"
                />
              ) : (
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0 border">
                  {student.full_name?.charAt(0) ?? "S"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base truncate text-foreground">
                  {student.full_name}
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="font-mono font-semibold text-primary">
                    ID: {student.student_code}
                  </span>
                  <span>·</span>
                  <Badge variant="outline" className="text-[11px] h-5 px-1.5 font-medium">
                    {student.classes?.name ?? "No Section / Class"}
                  </Badge>
                  <span>·</span>
                  <Badge variant="secondary" className="text-[10px] font-mono h-5 px-1.5">
                    Year: {academicYear}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5 h-8"
                onClick={() => setQrOpen(true)}
              >
                <QrCode className="size-3.5 text-primary" /> View / Print QR Pass
              </Button>
            </div>

            {/* General Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-md border bg-card">
                <span className="text-muted-foreground block text-[11px]">Academic Year</span>
                <span className="font-semibold font-mono text-primary mt-0.5 block">
                  {academicYear}
                </span>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <span className="text-muted-foreground block text-[11px]">Gender</span>
                <span className="font-medium capitalize mt-0.5 block">
                  {student.gender || "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <span className="text-muted-foreground block text-[11px]">Religion</span>
                <span className="font-medium capitalize mt-0.5 block">
                  {student.religion || "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <span className="text-muted-foreground block text-[11px]">Date of Birth</span>
                <span className="font-medium mt-0.5 block">
                  {student.date_of_birth || "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-md border bg-card sm:col-span-2">
                <span className="text-muted-foreground block text-[11px]">Classroom Section</span>
                <span className="font-medium mt-0.5 block truncate">
                  {student.classes?.name || "Unassigned"}
                </span>
              </div>
            </div>

            {/* Parent / Guardian Information */}
            <div className="rounded-lg border p-3 bg-muted/20 space-y-2 text-xs">
              <div className="font-semibold flex items-center gap-1.5 text-foreground">
                <Users className="size-3.5 text-primary" />
                Parent / Guardian Information
              </div>
              <div>
                <span className="text-muted-foreground">Name: </span>
                <span className="font-medium text-foreground">
                  {student.parent_name || "Not provided"}
                </span>
              </div>

              {canViewContacts ? (
                <div className="space-y-1 pt-1.5 border-t border-muted">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="size-3 text-primary" />
                    <span>{student.parent_email || "No email on record"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="size-3 text-primary" />
                    <span>{student.parent_phone || "No phone on record"}</span>
                  </div>
                  {student.address && (
                    <div className="text-[11px] text-muted-foreground pt-0.5">
                      Address: {student.address}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground flex items-center gap-1.5 border border-muted">
                  <Lock className="size-3 shrink-0" />
                  <span>Contact info (phone/email) is restricted to school administration.</span>
                </div>
              )}
            </div>

            {/* Recent Attendance */}
            <div className="rounded-lg border p-3 bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-semibold flex items-center gap-1.5 text-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  Recent Attendance
                </div>
                <span className="text-[11px] text-muted-foreground">Last 5 logs</span>
              </div>

              {!recentAttendance || recentAttendance.length === 0 ? (
                <p className="text-[11px] text-muted-foreground italic">No attendance records found yet.</p>
              ) : (
                <div className="space-y-1">
                  {recentAttendance.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-1.5 rounded bg-card border text-[11px]"
                    >
                      <span className="font-mono text-muted-foreground">{rec.date}</span>
                      <div className="flex items-center gap-1.5">
                        {rec.arrival_time && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="size-2.5" />
                            {rec.arrival_time}
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase font-mono px-1.5 py-0 h-4",
                            rec.status === "present" && "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
                            rec.status === "late" && "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30",
                            rec.status === "absent" && "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/30",
                            rec.status === "sick" && "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30",
                          )}
                        >
                          {rec.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conduct & Disciplinary Record */}
            <div className="rounded-lg border p-3 bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-semibold flex items-center gap-1.5 text-foreground">
                  <ShieldAlert className="size-3.5 text-primary" />
                  Conduct & Disciplinary Record
                </div>
                <Badge variant="outline" className="text-[10px] font-normal">
                  {(studentDiscipline ?? []).length}{" "}
                  {(studentDiscipline ?? []).length === 1 ? "Incident" : "Incidents"}
                </Badge>
              </div>

              {!(studentDiscipline ?? []).length ? (
                <div className="rounded bg-muted/40 p-2 text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Exemplary record. No disciplinary incidents logged.</span>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {(studentDiscipline ?? []).map((inc: any) => (
                    <div
                      key={inc.id}
                      className="rounded border bg-card p-2 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-foreground truncate">
                          {inc.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          {inc.incident_date}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {inc.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Pass Modal */}
      {qrOpen && (
        <StudentQrModal
          open={qrOpen}
          onOpenChange={setQrOpen}
          student={{
            id: student.id,
            student_code: student.student_code,
            full_name: student.full_name,
            gender: student.gender ?? "male",
            religion: student.religion ?? "non-muslim",
            academic_year: student.academic_year ?? "2025-2026",
            date_of_birth: student.date_of_birth ?? null,
            class_id: student.class_id ?? null,
            parent_name: student.parent_name ?? null,
            parent_email: student.parent_email ?? null,
            parent_phone: student.parent_phone ?? null,
            address: student.address ?? null,
            photo_url: student.photo_url ?? null,
            classes: student.classes ? { name: student.classes.name ?? "" } : null,
          }}
        />
      )}
    </>
  );
}
