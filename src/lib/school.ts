import { supabase } from "@/integrations/supabase/client";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

export const fmtTime = (d: string | Date) =>
  new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });

export async function fetchClasses() {
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, teacher_id")
    .order("name");
  if (error) throw error;
  return data;
}

export async function fetchStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("*, classes(name)")
    .order("full_name");
  if (error) throw error;
  return data;
}

export async function fetchAttendance(range?: { from?: string; to?: string }) {
  let q = supabase
    .from("attendance")
    .select("*, students(full_name, student_code, parent_email), classes(name)")
    .order("attendance_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1000);
  if (range?.from) q = q.gte("attendance_date", range.from);
  if (range?.to) q = q.lte("attendance_date", range.to);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function logAudit(
  action: string,
  entity: string,
  details: Record<string, unknown> = {},
) {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return;
  const { data: prof } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", uid)
    .maybeSingle();
  await supabase.from("audit_logs").insert({
    user_id: uid,
    user_name: prof?.full_name ?? data.user?.email ?? "",
    action,
    entity,
    details: details as never,
  });
}
