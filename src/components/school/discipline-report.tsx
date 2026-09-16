import { useState, useMemo } from "react";
import {
  ShieldAlert,
  Clock,
  FileText,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Check,
  Printer,
  Download,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fmtDate, fmtTime } from "@/lib/school";
import { cn } from "@/lib/utils";
import { exportPdf } from "@/lib/export";
import type { DisciplineIncident, DisciplineSeverity } from "@/routes/_authenticated/discipline";

export type ReportCategory = "All" | "Conduct" | "Punctuality" | "Other";

export const CATEGORY_ICONS: Record<string, typeof ShieldAlert> = {
  Conduct: ShieldAlert,
  Punctuality: Clock,
  Other: FileText,
};

export function normalizeToPrimaryCategory(category: string): "Conduct" | "Punctuality" | "Other" {
  const cat = (category || "").toLowerCase();
  if (
    cat.includes("punctual") ||
    cat.includes("late") ||
    cat.includes("tardy") ||
    cat.includes("attendance")
  ) {
    return "Punctuality";
  }
  if (
    cat.includes("conduct") ||
    cat.includes("behavior") ||
    cat.includes("respect") ||
    cat.includes("polite") ||
    cat.includes("conflict") ||
    cat.includes("peer") ||
    cat.includes("property") ||
    cat.includes("disrupt")
  ) {
    return "Conduct";
  }
  return "Other";
}

export const SEVERITY_CONFIG: Record<
  DisciplineSeverity,
  { label: string; badgeColor: string; icon: typeof Info; desc: string }
> = {
  minor: {
    label: "Minor Notice",
    badgeColor:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
    icon: Info,
    desc: "First reminder or classroom guidance",
  },
  moderate: {
    label: "Moderate Warning",
    badgeColor:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    icon: AlertTriangle,
    desc: "Repeated disruption, late arrival, or rule infringement",
  },
  major: {
    label: "Major Infraction",
    badgeColor:
      "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    icon: AlertCircle,
    desc: "Serious misconduct or defiance requiring parent consultation",
  },
};

interface DisciplineReportProps {
  students: any[];
  incidents: DisciplineIncident[];
  selectedStudentId?: string;
  onSelectStudent?: (studentId: string) => void;
  onAcknowledge?: (incident: DisciplineIncident) => void;
  isParentView?: boolean;
}

export function DisciplineReport({
  students,
  incidents,
  selectedStudentId,
  onSelectStudent,
  onAcknowledge,
  isParentView = true,
}: DisciplineReportProps) {
  // Current active student
  const [activeStudentId, setActiveStudentId] = useState<string>(
    selectedStudentId || students[0]?.id || "",
  );

  // Sync if selectedStudentId changes from outside
  const currentStudentId = selectedStudentId || activeStudentId;
  const currentStudent = useMemo(
    () => students.find((s) => s.id === currentStudentId) || students[0] || null,
    [students, currentStudentId],
  );

  const handleSelectStudent = (id: string) => {
    setActiveStudentId(id);
    onSelectStudent?.(id);
  };

  // Filter category state: All | Conduct | Punctuality | Other
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [feedSearch, setFeedSearch] = useState<string>("");

  // Incidents specifically for the active student
  const studentAllIncidents = useMemo(() => {
    if (!currentStudent) return [];
    return incidents.filter((inc) => inc.student_id === currentStudent.id);
  }, [incidents, currentStudent]);

  // Counts by primary category
  const categoryCounts = useMemo(() => {
    const counts = {
      All: studentAllIncidents.length,
      Conduct: 0,
      Punctuality: 0,
      Other: 0,
    };
    for (const inc of studentAllIncidents) {
      const primary = normalizeToPrimaryCategory(inc.category);
      counts[primary] = (counts[primary] || 0) + 1;
    }
    return counts;
  }, [studentAllIncidents]);

  // Severity counts
  const severityCounts = useMemo(() => {
    const counts = { minor: 0, moderate: 0, major: 0, acknowledged: 0, pending: 0 };
    for (const inc of studentAllIncidents) {
      if (inc.severity === "minor") counts.minor++;
      if (inc.severity === "moderate") counts.moderate++;
      if (inc.severity === "major") counts.major++;
      if (inc.parent_acknowledged) counts.acknowledged++;
      else counts.pending++;
    }
    return counts;
  }, [studentAllIncidents]);

  // Filtered feed
  const filteredFeed = useMemo(() => {
    let list = studentAllIncidents;

    // Filter Category
    if (selectedCategory !== "All") {
      list = list.filter((inc) => normalizeToPrimaryCategory(inc.category) === selectedCategory);
    }

    // Filter Severity
    if (selectedSeverity !== "all") {
      list = list.filter((inc) => inc.severity === selectedSeverity);
    }

    // Search query in description, notes, or action
    if (feedSearch.trim()) {
      const q = feedSearch.toLowerCase();
      list = list.filter(
        (inc) =>
          inc.description?.toLowerCase().includes(q) ||
          inc.action_taken?.toLowerCase().includes(q) ||
          inc.category?.toLowerCase().includes(q) ||
          inc.reported_by_name?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [studentAllIncidents, selectedCategory, selectedSeverity, feedSearch]);

  // Disciplinary Standing assessment
  const standingMeta = useMemo(() => {
    if (studentAllIncidents.length === 0) {
      return {
        label: "Exemplary Conduct",
        badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300",
        description: "Zero conduct infractions on record. Exceptional behavioral standing.",
        color: "emerald",
      };
    }
    if (severityCounts.major > 0) {
      return {
        label: "Disciplinary Review Required",
        badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300",
        description:
          "One or more major infractions recorded. Requires close parental consultation.",
        color: "rose",
      };
    }
    if (severityCounts.moderate > 0 || severityCounts.pending > 0) {
      return {
        label: "Attention & Review Needed",
        badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300",
        description:
          severityCounts.pending > 0
            ? `${severityCounts.pending} notice(s) require parent acknowledgement.`
            : "Moderate warnings recorded. Ongoing behavioral monitoring advised.",
        color: "amber",
      };
    }
    return {
      label: "Good Standing",
      badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300",
      description: "Minor reminders logged. Good cooperation in the learning environment.",
      color: "blue",
    };
  }, [studentAllIncidents, severityCounts]);

  // Export official Student Discipline Report
  const handleExportReportPdf = () => {
    if (!currentStudent) return;
    const title = `Official Student Discipline & Conduct Report — ${currentStudent.full_name} (${currentStudent.student_code})`;
    const head = [
      "Date",
      "Time",
      "Category",
      "Severity",
      "Teacher Notes & Description",
      "Action Taken",
      "Reported By",
      "Parent Acknowledged",
    ];
    const rows = studentAllIncidents.map((i) => [
      i.incident_date,
      i.incident_time || "—",
      `${i.category} [${normalizeToPrimaryCategory(i.category)}]`,
      SEVERITY_CONFIG[i.severity]?.label || i.severity,
      i.description,
      i.action_taken || "—",
      i.reported_by_name || "Teacher",
      i.parent_acknowledged ? `Yes (${fmtDate(i.parent_acknowledged_at)})` : "Pending Review",
    ]);

    exportPdf(title, head, rows, `discipline-report-${currentStudent.student_code}`);
  };

  return (
    <div className="space-y-6">
      {/* Student Switcher / Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="size-4 text-primary" />
            {isParentView ? "Select Child's Discipline Report" : "Student Discipline Record"}
          </div>

          {/* Student Picker: Chips for multiple children if <= 4, or Select dropdown */}
          {students.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {students.map((s) => {
                const isSelected = s.id === currentStudent?.id;
                const childPending = incidents.filter(
                  (inc) => inc.student_id === s.id && !inc.parent_acknowledged,
                ).length;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStudent(s.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border",
                    )}
                  >
                    <User className="size-3.5" />
                    <span>{s.full_name}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1 rounded",
                        isSelected
                          ? "bg-primary-foreground/20 text-white"
                          : "text-muted-foreground",
                      )}
                    >
                      {s.classes?.name || s.class_name || "Class"}
                    </span>
                    {childPending > 0 && (
                      <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="font-bold text-base text-foreground flex items-center gap-2">
              <span>{currentStudent?.full_name || "Student"}</span>
              <span className="font-mono text-xs font-normal text-muted-foreground">
                ({currentStudent?.student_code})
              </span>
            </div>
          )}
        </div>

        {/* Quick Report Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReportPdf}
            disabled={!currentStudent}
            className="gap-1.5 text-xs h-8"
          >
            <Download className="size-3.5" /> Export PDF Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs h-8 hidden sm:inline-flex"
          >
            <Printer className="size-3.5" /> Print
          </Button>
        </div>
      </div>

      {/* Selected Student Executive Summary Card */}
      {currentStudent && (
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
                  {currentStudent.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-foreground">
                      {currentStudent.full_name}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {currentStudent.student_code}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {currentStudent.classes?.name ||
                        currentStudent.class_name ||
                        "Assigned Class"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-3">
                    <span>
                      Guardian:{" "}
                      <strong className="text-foreground">
                        {currentStudent.parent_name ||
                          currentStudent.parent_email ||
                          "Registered Parent"}
                      </strong>
                    </span>
                    {currentStudent.parent_phone && (
                      <span>· Phone: {currentStudent.parent_phone}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Standing Badge */}
              <div className="flex flex-col md:items-end">
                <Badge
                  variant="outline"
                  className={cn("text-xs font-semibold px-2.5 py-1", standingMeta.badgeClass)}
                >
                  {standingMeta.color === "emerald" && <Sparkles className="size-3 mr-1" />}
                  {standingMeta.color === "amber" && <AlertTriangle className="size-3 mr-1" />}
                  {standingMeta.color === "rose" && <AlertCircle className="size-3 mr-1" />}
                  {standingMeta.label}
                </Badge>
                <span className="text-[11px] text-muted-foreground mt-1 max-w-xs md:text-right">
                  {standingMeta.description}
                </span>
              </div>
            </div>

            {/* Category Breakdown Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="rounded-lg border bg-muted/20 p-3">
                <span className="text-[11px] font-medium text-muted-foreground block">
                  Total Disciplinary Actions
                </span>
                <div className="text-xl font-bold mt-0.5 text-foreground">
                  {studentAllIncidents.length}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {severityCounts.pending > 0
                    ? `${severityCounts.pending} awaiting parent review`
                    : "All notices acknowledged"}
                </span>
              </div>

              <div className="rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-500/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    Conduct Actions
                  </span>
                  <ShieldAlert className="size-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-xl font-bold mt-0.5 text-purple-700 dark:text-purple-300">
                  {categoryCounts.Conduct}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Behavior & classroom respect
                </span>
              </div>

              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    Punctuality Notices
                  </span>
                  <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-xl font-bold mt-0.5 text-amber-700 dark:text-amber-300">
                  {categoryCounts.Punctuality}
                </div>
                <span className="text-[10px] text-muted-foreground">Arrival time & attendance</span>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-500/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Other Notices
                  </span>
                  <FileText className="size-3.5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="text-xl font-bold mt-0.5 text-slate-700 dark:text-slate-300">
                  {categoryCounts.Other}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Uniform, materials, homework
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disciplinary Feed Filter & Category Pills (Conduct, Punctuality, Other) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border">
          {/* Category Tabs: Categorized by 'Conduct', 'Punctuality', or 'Other' */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(["All", "Conduct", "Punctuality", "Other"] as ReportCategory[]).map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat];

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    isSelected
                      ? "bg-foreground text-background shadow-xs"
                      : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80",
                  )}
                >
                  {cat === "Conduct" && <ShieldAlert className="size-3.5" />}
                  {cat === "Punctuality" && <Clock className="size-3.5" />}
                  {cat === "Other" && <FileText className="size-3.5" />}
                  <span>{cat === "All" ? "All Categories" : cat}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] px-1.5 py-0 rounded-full h-4",
                      isSelected
                        ? "bg-background/20 text-background font-bold"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Severity & Feed Search */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-44">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="h-8 text-xs w-36">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="minor">Minor Notice</SelectItem>
                <SelectItem value="moderate">Moderate Warning</SelectItem>
                <SelectItem value="major">Major Infraction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student Feed List */}
        {filteredFeed.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <CardContent className="space-y-3">
              <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-foreground">
                  {studentAllIncidents.length === 0
                    ? "Exemplary Conduct Standing"
                    : "No Records in this Filter"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {studentAllIncidents.length === 0
                    ? `${currentStudent?.full_name || "Student"} has zero disciplinary actions recorded on their profile. Keep up the wonderful conduct!`
                    : `No disciplinary entries found matching category "${selectedCategory}" with selected filters.`}
                </p>
              </div>
              {studentAllIncidents.length > 0 && selectedCategory !== "All" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedSeverity("all");
                    setFeedSearch("");
                  }}
                  className="text-xs h-8"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-muted-foreground px-1 flex items-center justify-between">
              <span>
                Showing {filteredFeed.length}{" "}
                {filteredFeed.length === 1 ? "Disciplinary Action" : "Disciplinary Actions"}
              </span>
              <span className="text-[11px] font-normal">
                Category: <strong>{selectedCategory}</strong>
              </span>
            </div>

            {/* Individual Feed Cards */}
            {filteredFeed.map((incident) => {
              const primaryCat = normalizeToPrimaryCategory(incident.category);
              const severityMeta = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.minor;
              const isPending = !incident.parent_acknowledged;

              return (
                <div
                  key={incident.id}
                  className={cn(
                    "rounded-xl border p-4 text-xs transition-all space-y-3",
                    isPending
                      ? incident.severity === "major"
                        ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs"
                        : "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs"
                      : "bg-card shadow-xs",
                  )}
                >
                  {/* Incident Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-2.5">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Primary Category Badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[11px] font-semibold gap-1",
                            primaryCat === "Conduct" &&
                              "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300",
                            primaryCat === "Punctuality" &&
                              "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300",
                            primaryCat === "Other" &&
                              "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300",
                          )}
                        >
                          {primaryCat === "Conduct" && <ShieldAlert className="size-3" />}
                          {primaryCat === "Punctuality" && <Clock className="size-3" />}
                          {primaryCat === "Other" && <FileText className="size-3" />}
                          {incident.category}
                        </Badge>

                        {/* Severity Level */}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold uppercase",
                            severityMeta.badgeColor,
                          )}
                        >
                          {severityMeta.label}
                        </Badge>

                        {incident.parent_notified && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            <Check className="size-2.5" /> Dispatched to Parent
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Calendar className="size-3 text-muted-foreground" />
                          {fmtDate(incident.incident_date)}
                        </span>
                        {incident.incident_time && <span>at {incident.incident_time}</span>}
                        <span>
                          · Logged by {incident.reported_by_name || "Teacher"} (
                          {incident.reported_by_role || "Staff"})
                        </span>
                      </div>
                    </div>

                    {/* Acknowledgement Status / Action */}
                    <div>
                      {isPending ? (
                        onAcknowledge && (
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                            onClick={() => onAcknowledge(incident)}
                          >
                            <CheckCircle2 className="size-3.5" /> Acknowledge & Sign
                          </Button>
                        )
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-[11px] font-semibold border border-emerald-500/30">
                            <Check className="size-3 text-emerald-600" /> Acknowledged by Parent
                          </span>
                          {incident.parent_acknowledged_at && (
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {fmtDate(incident.parent_acknowledged_at)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher Notes (Observation / Description) */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                      Teacher Notes & Incident Observation:
                    </span>
                    <p className="text-foreground leading-relaxed bg-background/60 p-2.5 rounded-lg border text-xs">
                      {incident.description}
                    </p>
                  </div>

                  {/* Action Taken by School */}
                  {incident.action_taken && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Corrective Guidance & Action Taken:
                      </span>
                      <div className="text-xs text-foreground bg-muted/40 p-2.5 rounded-lg border border-border/80 flex items-start gap-2">
                        <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{incident.action_taken}</span>
                      </div>
                    </div>
                  )}

                  {/* Parent Feedback / Acknowledged Notes */}
                  {incident.parent_notes && (
                    <div className="text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-dashed">
                      <span className="font-semibold text-foreground">Parent Response Note: </span>
                      <span className="italic">"{incident.parent_notes}"</span>
                    </div>
                  )}

                  {/* Pending Notice Callout for Parents */}
                  {isPending && isParentView && (
                    <div className="flex items-center justify-between gap-2 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-950 dark:text-amber-200 text-[11px]">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          Please review the teacher's note above and confirm you have addressed it
                          with {incident.student_name}.
                        </span>
                      </div>
                      {onAcknowledge && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] font-semibold border-amber-400 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20"
                          onClick={() => onAcknowledge(incident)}
                        >
                          Sign Now
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
