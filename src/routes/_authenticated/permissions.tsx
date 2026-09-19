import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Baby,
  Calendar,
  Check,
  Clock,
  FileCheck,
  FileText,
  Filter,
  Send,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatusBadge } from "@/components/school/ui";
import { fetchClasses, fmtDate, logAudit, todayISO } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions & Requests — Little Gems Academy" },
      {
        name: "description",
        content:
          "Student leave permissions, attendance corrections, and teacher class access requests.",
      },
      { property: "og:title", content: "Permissions & Requests — Little Gems Academy" },
      {
        property: "og:description",
        content:
          "Student leave permissions, attendance corrections, and teacher class access requests.",
      },
    ],
  }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const qc = useQueryClient();
  const { role, profile, user } = useAuth();
  const isTeacher = role === "teacher";
  const isParent = role === "parent";
  const canReview = role === "admin" || role === "secretary" || role === "owner";

  // Filter state for reviews
  const [filterType, setFilterType] = useState<
    "all" | "student_leave" | "attendance_correction" | "class_access"
  >("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">(
    "all",
  );

  // Parent form state
  const [selectedChildId, setSelectedChildId] = useState("");
  const [permissionTitle, setPermissionTitle] = useState("");
  const [permissionDate, setPermissionDate] = useState(todayISO());
  const [permissionReason, setPermissionReason] = useState("");

  // Teacher class access form state
  const [teacherClassId, setTeacherClassId] = useState("");
  const [teacherReason, setTeacherReason] = useState("");

  // Inspection modal
  const [inspectedRequest, setInspectedRequest] = useState<any | null>(null);
  const [decisionNote, setDecisionNote] = useState("");

  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

  // Query parent's children if parent
  const { data: myChildren } = useQuery({
    queryKey: ["parent-children-permissions", user?.id],
    enabled: isParent && !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, full_name, student_code, class_id, classes(name)")
        .eq("parent_id", user!.id)
        .order("full_name");
      return data ?? [];
    },
  });

  // Query all permission requests
  const { data: rawRequests, isLoading } = useQuery({
    queryKey: ["permission-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_requests")
        .select("*, classes(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Parent submits Student Leave Permission
  const submitParentPermission = useMutation({
    mutationFn: async () => {
      if (!selectedChildId) throw new Error("Please select which child this permission is for.");
      if (!permissionTitle.trim()) throw new Error("Please enter a title for the permission.");
      if (!permissionReason.trim())
        throw new Error("Please provide a reason for the absence/leave.");

      const child = (myChildren ?? []).find((c) => c.id === selectedChildId);

      const { error } = await supabase.from("permission_requests").insert({
        type: "student_leave",
        teacher_id: user!.id, // stored in creator field
        parent_id: user!.id,
        teacher_name: profile?.full_name || "Parent",
        parent_name: profile?.full_name || "Parent",
        student_id: selectedChildId,
        student_name: child?.full_name ?? "Student",
        class_id: child?.class_id ?? null,
        title: permissionTitle.trim(),
        permission_date: permissionDate,
        reason: permissionReason.trim(),
        status: "pending",
      });
      if (error) throw error;
      await logAudit("permission.student_leave_request", "permission_requests", {
        student_id: selectedChildId,
        date: permissionDate,
      });
    },
    onSuccess: () => {
      toast.success("Permission request submitted to the school administration.");
      setPermissionTitle("");
      setPermissionReason("");
      void qc.invalidateQueries({ queryKey: ["permission-requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Teacher submits Class Access Request
  const submitTeacherClassRequest = useMutation({
    mutationFn: async () => {
      if (!teacherClassId) throw new Error("Select the class you need access to.");
      const { error } = await supabase.from("permission_requests").insert({
        type: "class_access",
        teacher_id: user!.id,
        teacher_name: profile?.full_name ?? "",
        class_id: teacherClassId,
        reason: teacherReason.trim(),
        status: "pending",
      });
      if (error) throw error;
      await logAudit("permission.request", "permission_requests", { teacherClassId });
    },
    onSuccess: () => {
      toast.success("Class access request sent to the secretary.");
      setTeacherReason("");
      setTeacherClassId("");
      void qc.invalidateQueries({ queryKey: ["permission-requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Review Decision (Secretary / Admin / Owner)
  const decide = useMutation({
    mutationFn: async (v: { id: string; status: "approved" | "rejected"; note?: string }) => {
      const { error } = await supabase
        .from("permission_requests")
        .update({
          status: v.status,
          decision_note: v.note || null,
          reviewed_by: user?.id ?? null,
          reviewed_by_name: profile?.full_name ?? "Administration",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", v.id);
      if (error) throw error;
      await logAudit(`permission.${v.status}`, "permission_requests", v);
    },
    onSuccess: (_, vars) => {
      toast.success(`Request marked as ${vars.status}`);
      setInspectedRequest(null);
      setDecisionNote("");
      void qc.invalidateQueries({ queryKey: ["permission-requests"] });
      void qc.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      void qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    let list = rawRequests ?? [];

    if (isParent) {
      // Parents see only their own requests or requests for their children
      list = list.filter(
        (r) =>
          r.parent_id === user?.id ||
          r.teacher_id === user?.id ||
          (myChildren ?? []).some((c) => c.id === r.student_id),
      );
    } else if (isTeacher) {
      // Teachers see their requests
      list = list.filter((r) => r.teacher_id === user?.id);
    }

    if (filterType !== "all") {
      list = list.filter((r) => (r.type || "class_access") === filterType);
    }

    if (filterStatus !== "all") {
      list = list.filter((r) => r.status === filterStatus);
    }

    return list;
  }, [rawRequests, isParent, isTeacher, user?.id, myChildren, filterType, filterStatus]);

  const pendingCount = useMemo(() => {
    return (rawRequests ?? []).filter((r) => r.status === "pending").length;
  }, [rawRequests]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isParent ? "Leave & Permission Requests" : "Permissions & Requests"}
        description={
          isParent
            ? "Submit leave and permission requests for your child. The school administration and secretary review all requests."
            : isTeacher
              ? "Submit class access requests or view your permission statuses."
              : "Review and approve student leave requests from parents and access requests from teachers."
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Parent Submission Card */}
        {isParent && (
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Send className="size-4 text-primary" /> Request Leave for Child
              </CardTitle>
              <CardDescription>
                Submit absence notices or medical leave. The secretary reviews and excuses
                attendance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Child</Label>
                <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose student" />
                  </SelectTrigger>
                  <SelectContent>
                    {(myChildren ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.full_name} ({c.student_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Permission Title</Label>
                <Input
                  placeholder="e.g. Medical Appointment / Sick Leave / Family Travel"
                  value={permissionTitle}
                  onChange={(e) => setPermissionTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Permission Date</Label>
                <Input
                  type="date"
                  value={permissionDate}
                  onChange={(e) => setPermissionDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Reason & Details</Label>
                <Textarea
                  rows={3}
                  value={permissionReason}
                  onChange={(e) => setPermissionReason(e.target.value)}
                  placeholder="Explain the reason for absence..."
                />
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => submitParentPermission.mutate()}
                disabled={
                  !selectedChildId ||
                  !permissionTitle.trim() ||
                  !permissionReason.trim() ||
                  submitParentPermission.isPending
                }
              >
                <Send className="size-4" /> Send Request
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Teacher Class Access Request Card */}
        {isTeacher && (
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Request Class Access
              </CardTitle>
              <CardDescription>
                Ask the secretary for access to a class. Once approved, that class appears on your
                dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={teacherClassId} onValueChange={setTeacherClassId}>
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
                <Label>Reason</Label>
                <Textarea
                  rows={3}
                  value={teacherReason}
                  onChange={(e) => setTeacherReason(e.target.value)}
                  placeholder="e.g. I teach Mathematics and Science in this class."
                />
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => submitTeacherClassRequest.mutate()}
                disabled={!teacherClassId || submitTeacherClassRequest.isPending}
              >
                <Send className="size-4" /> Send Access Request
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Requests Table / Feed */}
        <Card className={cn(isParent || isTeacher ? "lg:col-span-2" : "lg:col-span-3")}>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileCheck className="size-4 text-primary" />
                  {isParent ? "Submitted Leave Requests" : "Requests & Permissions"}
                  {canReview && pendingCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400"
                    >
                      {pendingCount} Pending
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isParent
                    ? "Track your child's leave permissions and administrative approval."
                    : "Requests sent by parents and teachers awaiting approval."}
                </CardDescription>
              </div>

              {/* Review Filters */}
              {canReview && (
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                    <SelectTrigger className="h-8 text-xs w-36">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="student_leave">Student Leave</SelectItem>
                      <SelectItem value="class_access">Class Access</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                    <SelectTrigger className="h-8 text-xs w-28">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type / Title</TableHead>
                  <TableHead>{isParent ? "Child" : "Requester"}</TableHead>
                  <TableHead>Target Date / Class</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((r) => {
                  const isStudentLeave = r.type === "student_leave";
                  return (
                    <TableRow key={r.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="font-semibold text-sm">
                          {isStudentLeave ? r.title || "Student Leave" : "Class Access"}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          {isStudentLeave ? (
                            <Badge variant="outline" className="text-[10px] py-0 h-4">
                              Leave
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] py-0 h-4">
                              Access
                            </Badge>
                          )}
                          <span>{fmtDate(r.created_at)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {isStudentLeave ? (
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {r.student_name || "Student"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Parent: {r.parent_name || r.teacher_name}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {r.teacher_name || "Teacher"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">Staff Access</p>
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        {isStudentLeave ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="size-3.5 text-muted-foreground" />
                            <span>{r.permission_date || fmtDate(r.created_at)}</span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium">{r.classes?.name ?? "Class"}</div>
                        )}
                      </TableCell>

                      <TableCell className="max-w-[200px]">
                        <p className="truncate text-xs text-muted-foreground">{r.reason || "—"}</p>
                        {r.decision_note && (
                          <p className="truncate text-[10px] text-primary italic mt-0.5">
                            Note: {r.decision_note}
                          </p>
                        )}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => {
                              setInspectedRequest(r);
                              setDecisionNote(r.decision_note || "");
                            }}
                          >
                            Details
                          </Button>

                          {canReview && r.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="h-7 text-xs px-2 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => decide.mutate({ id: r.id, status: "approved" })}
                              >
                                <Check className="size-3" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2 gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                onClick={() => decide.mutate({ id: r.id, status: "rejected" })}
                              >
                                <X className="size-3" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!filteredRequests.length && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-xs text-muted-foreground"
                    >
                      No permission requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Details & Review Dialog */}
      <Dialog open={!!inspectedRequest} onOpenChange={(open) => !open && setInspectedRequest(null)}>
        <DialogContent className="max-w-md">
          {inspectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={inspectedRequest.status} />
                  <span className="text-xs text-muted-foreground">
                    Submitted {fmtDate(inspectedRequest.created_at)}
                  </span>
                </div>
                <DialogTitle className="text-lg font-bold">
                  {inspectedRequest.type === "student_leave"
                    ? inspectedRequest.title || "Student Leave Permission"
                    : "Class Access Request"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {inspectedRequest.type === "student_leave"
                    ? `Request for student ${inspectedRequest.student_name}`
                    : `Teacher access request for ${inspectedRequest.classes?.name || "Class"}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-sm">
                <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-xs">
                  {inspectedRequest.type === "student_leave" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student:</span>
                        <span className="font-semibold text-foreground">
                          {inspectedRequest.student_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parent:</span>
                        <span className="font-medium text-foreground">
                          {inspectedRequest.parent_name || inspectedRequest.teacher_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Permission Date:</span>
                        <span className="font-semibold text-primary">
                          {inspectedRequest.permission_date || fmtDate(inspectedRequest.created_at)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teacher:</span>
                        <span className="font-semibold text-foreground">
                          {inspectedRequest.teacher_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Class:</span>
                        <span className="font-medium text-foreground">
                          {inspectedRequest.classes?.name}
                        </span>
                      </div>
                    </>
                  )}

                  {inspectedRequest.reviewed_by_name && (
                    <div className="flex justify-between border-t pt-1.5 mt-1.5">
                      <span className="text-muted-foreground">Reviewed by:</span>
                      <span className="font-medium">
                        {inspectedRequest.reviewed_by_name} ({fmtDate(inspectedRequest.reviewed_at)}
                        )
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Reason stated by requester
                  </Label>
                  <p className="mt-1 rounded border p-2.5 text-xs leading-relaxed bg-background">
                    {inspectedRequest.reason || "No detailed reason provided."}
                  </p>
                </div>

                {canReview && inspectedRequest.status === "pending" && (
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs">Decision Note (Optional)</Label>
                    <Input
                      placeholder="e.g. Approved with medical certificate / Class access granted"
                      value={decisionNote}
                      onChange={(e) => setDecisionNote(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {canReview && inspectedRequest.status === "pending" ? (
                  <div className="flex w-full items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 text-xs"
                      onClick={() =>
                        decide.mutate({
                          id: inspectedRequest.id,
                          status: "rejected",
                          note: decisionNote,
                        })
                      }
                    >
                      <X className="size-3.5" /> Reject Request
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                      onClick={() =>
                        decide.mutate({
                          id: inspectedRequest.id,
                          status: "approved",
                          note: decisionNote,
                        })
                      }
                    >
                      <Check className="size-3.5" /> Approve Permission
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setInspectedRequest(null)}
                    className="w-full"
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
