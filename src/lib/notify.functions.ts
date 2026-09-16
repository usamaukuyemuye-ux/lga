import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Status = "present" | "absent" | "sick" | "late";

export function buildMessage(opts: {
  studentName: string;
  status: Status;
  date: string;
  time: string;
  className: string;
  teacher: string;
  schoolName: string;
}) {
  const s = opts.status.toUpperCase();
  const lines: Record<Status, string> = {
    present: `Your child ${opts.studentName} has arrived at school on ${opts.date} at ${opts.time}.`,
    absent: `Your child ${opts.studentName} has been marked ABSENT on ${opts.date}.`,
    sick: `Your child ${opts.studentName} has been marked SICK on ${opts.date}.`,
    late: `Your child ${opts.studentName} has been marked LATE on ${opts.date} at ${opts.time}.`,
  };
  const body = [
    "Dear Parent,",
    "",
    lines[opts.status],
    "",
    `Status: ${s}`,
    `Class: ${opts.className}`,
    `Recorded By: Teacher ${opts.teacher}`,
    "",
    "Thank you.",
    opts.schoolName,
  ].join("\n");
  return { subject: "Attendance Notification", body };
}

/** Records the parent notification for an attendance entry. */
export const queueAttendanceNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      studentId: string;
      parentId: string | null;
      recipientEmail: string;
      subject: string;
      body: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("notifications").insert({
      student_id: data.studentId,
      parent_id: data.parentId,
      recipient_email: data.recipientEmail,
      subject: data.subject,
      body: data.body,
      status: "sent",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
