export type AllowedSalaryMonth = {
  value: string; // "YYYY-MM"
  label: string; // "September 2026 (Current Month)"
  monthName: string; // "September 2026"
  offset: number; // -1, 0, 1
  badge: string;
};

/**
 * Enforces strict policy:
 * Only 1 month before current, the current month, and 1 month after current can be paid.
 */
export function getAllowedSalaryMonths(baseDate: Date = new Date()): AllowedSalaryMonth[] {
  const currentYear = baseDate.getFullYear();
  const currentMonthIndex = baseDate.getMonth();

  const offsets = [-1, 0, 1] as const;

  return offsets.map((offset) => {
    const d = new Date(currentYear, currentMonthIndex + offset, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const yyyymm = `${y}-${m}`;
    const monthName = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    let badge = "Current Month";
    if (offset === -1) badge = "Previous Month";
    if (offset === 1) badge = "Next Month (Advance)";

    return {
      value: yyyymm,
      label: `${monthName} (${badge})`,
      monthName,
      offset,
      badge,
    };
  });
}

export function isMonthAllowedForSalary(monthYear: string, baseDate: Date = new Date()): boolean {
  const allowed = getAllowedSalaryMonths(baseDate).map((m) => m.value);
  return allowed.includes(monthYear);
}

export function getRoleDefaultDuty(role?: string | null): string {
  switch (role) {
    case "teacher":
      return "Senior Primary Teacher";
    case "secretary":
      return "School Secretary & Registrar";
    case "finance":
      return "Finance & Bursar Officer";
    case "head_of_studies":
      return "Director of Academics & Head of Studies";
    case "admin":
      return "Systems Administrator & IT Lead";
    case "owner":
      return "School Director & Proprietor";
    default:
      return "Academic & Administrative Staff";
  }
}
