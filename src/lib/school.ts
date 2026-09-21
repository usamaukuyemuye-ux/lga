import { supabase } from "@/integrations/supabase/client";

export type CampusCode = "1" | "2"; // 1 = Kacyiru, 2 = Kicukiro

export interface CampusInfo {
  code: CampusCode;
  id: string;
  name: string;
  shortName: string;
  location: string;
}

export const CAMPUSES: Record<CampusCode, CampusInfo> = {
  "1": {
    code: "1",
    id: "kacyiru",
    name: "Kacyiru Campus",
    shortName: "Kacyiru",
    location: "Kigali - Gasabo, Kacyiru",
  },
  "2": {
    code: "2",
    id: "kicukiro",
    name: "Kicukiro Campus",
    shortName: "Kicukiro",
    location: "Kigali - Kicukiro",
  },
};

export const CAMPUS_LIST = [CAMPUSES["1"], CAMPUSES["2"]];

/**
 * 8-Digit Student Registration Number Format:
 * [Digit 1: Campus (1=Kacyiru, 2=Kicukiro)]
 * [Digit 2: Year (e.g. 2026 -> 6)]
 * [Digit 3: Sex (0=Male, 1=Female)]
 * [Digit 4: Religion (0=Christian, 1=Muslim)]
 * [Digits 5-8: Sequential student number, 0001-9999]
 */
export function generateStudentRegistrationCode({
  campus,
  academicYear,
  gender,
  religion,
  sequence,
}: {
  campus: CampusCode | string;
  academicYear?: string;
  gender: "male" | "female" | string;
  religion: "christian" | "muslim" | "non-muslim" | string;
  sequence: number;
}): string {
  // Digit 1: Campus (1=Kacyiru, 2=Kicukiro)
  const campusDigit = campus === "2" || String(campus).toLowerCase().includes("kicukiro") ? "2" : "1";

  // Digit 2: Year last digit (e.g. 2026 -> 6)
  const yearStr = academicYear || new Date().getFullYear().toString();
  const yearNum = parseInt(yearStr.slice(0, 4), 10) || new Date().getFullYear();
  const yearDigit = String(yearNum % 10);

  // Digit 3: Sex (0=Male, 1=Female)
  const sexDigit = String(gender).toLowerCase() === "female" ? "1" : "0";

  // Digit 4: Religion (0=Christian/Non-Muslim, 1=Muslim)
  const isMuslim = String(religion).toLowerCase() === "muslim";
  const religionDigit = isMuslim ? "1" : "0";

  // Digits 5-8: Student sequence (0001 - 9999)
  const seqBounded = Math.max(1, Math.min(9999, sequence));
  const seqStr = String(seqBounded).padStart(4, "0");

  return `${campusDigit}${yearDigit}${sexDigit}${religionDigit}${seqStr}`;
}

export function parseStudentRegistrationCode(code: string): {
  campusCode: CampusCode;
  campusName: string;
  yearDigit: string;
  sex: "Male" | "Female";
  religion: "Christian" | "Muslim";
  sequenceNumber: number;
  isValid: boolean;
} | null {
  const clean = (code || "").trim();
  if (!/^\d{8}$/.test(clean)) return null;

  const campusCode = clean[0] === "2" ? "2" : "1";
  const yearDigit = clean[1];
  const sex = clean[2] === "1" ? "Female" : "Male";
  const religion = clean[3] === "1" ? "Muslim" : "Christian";
  const sequenceNumber = parseInt(clean.slice(4, 8), 10);

  return {
    campusCode,
    campusName: CAMPUSES[campusCode]?.name ?? "Unknown Campus",
    yearDigit,
    sex,
    religion,
    sequenceNumber,
    isValid: true,
  };
}

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
