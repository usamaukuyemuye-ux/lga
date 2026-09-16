import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, d as todayISO, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { $ as FileText, D as Printer, G as ListFilter, J as Info, St as Calendar, Z as GraduationCap, _ as ShieldAlert, b as Search, et as FileSpreadsheet, f as Trash2, ft as Clock, ht as CircleAlert, i as User, k as Plus, m as Sparkles, mt as CircleCheck, s as UserCheck, st as Download, u as TriangleAlert, vt as Check, y as Send } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as dispatchLocalNotification } from "./device-notifications-BMIcetfI.mjs";
import { t as Route } from "./discipline-Di7qLwEn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discipline-We4YZQGR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/school/discipline-report.tsx";
function normalizeToPrimaryCategory(category) {
	const cat = (category || "").toLowerCase();
	if (cat.includes("punctual") || cat.includes("late") || cat.includes("tardy") || cat.includes("attendance")) return "Punctuality";
	if (cat.includes("conduct") || cat.includes("behavior") || cat.includes("respect") || cat.includes("polite") || cat.includes("conflict") || cat.includes("peer") || cat.includes("property") || cat.includes("disrupt")) return "Conduct";
	return "Other";
}
var SEVERITY_CONFIG$1 = {
	minor: {
		label: "Minor Notice",
		badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
		icon: Info,
		desc: "First reminder or classroom guidance"
	},
	moderate: {
		label: "Moderate Warning",
		badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
		icon: TriangleAlert,
		desc: "Repeated disruption, late arrival, or rule infringement"
	},
	major: {
		label: "Major Infraction",
		badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
		icon: CircleAlert,
		desc: "Serious misconduct or defiance requiring parent consultation"
	}
};
function DisciplineReport({ students, incidents, selectedStudentId, onSelectStudent, onAcknowledge, isParentView = true }) {
	const [activeStudentId, setActiveStudentId] = (0, import_react.useState)(selectedStudentId || students[0]?.id || "");
	const currentStudentId = selectedStudentId || activeStudentId;
	const currentStudent = (0, import_react.useMemo)(() => students.find((s) => s.id === currentStudentId) || students[0] || null, [students, currentStudentId]);
	const handleSelectStudent = (id) => {
		setActiveStudentId(id);
		onSelectStudent?.(id);
	};
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All");
	const [selectedSeverity, setSelectedSeverity] = (0, import_react.useState)("all");
	const [feedSearch, setFeedSearch] = (0, import_react.useState)("");
	const studentAllIncidents = (0, import_react.useMemo)(() => {
		if (!currentStudent) return [];
		return incidents.filter((inc) => inc.student_id === currentStudent.id);
	}, [incidents, currentStudent]);
	const categoryCounts = (0, import_react.useMemo)(() => {
		const counts = {
			All: studentAllIncidents.length,
			Conduct: 0,
			Punctuality: 0,
			Other: 0
		};
		for (const inc of studentAllIncidents) {
			const primary = normalizeToPrimaryCategory(inc.category);
			counts[primary] = (counts[primary] || 0) + 1;
		}
		return counts;
	}, [studentAllIncidents]);
	const severityCounts = (0, import_react.useMemo)(() => {
		const counts = {
			minor: 0,
			moderate: 0,
			major: 0,
			acknowledged: 0,
			pending: 0
		};
		for (const inc of studentAllIncidents) {
			if (inc.severity === "minor") counts.minor++;
			if (inc.severity === "moderate") counts.moderate++;
			if (inc.severity === "major") counts.major++;
			if (inc.parent_acknowledged) counts.acknowledged++;
			else counts.pending++;
		}
		return counts;
	}, [studentAllIncidents]);
	const filteredFeed = (0, import_react.useMemo)(() => {
		let list = studentAllIncidents;
		if (selectedCategory !== "All") list = list.filter((inc) => normalizeToPrimaryCategory(inc.category) === selectedCategory);
		if (selectedSeverity !== "all") list = list.filter((inc) => inc.severity === selectedSeverity);
		if (feedSearch.trim()) {
			const q = feedSearch.toLowerCase();
			list = list.filter((inc) => inc.description?.toLowerCase().includes(q) || inc.action_taken?.toLowerCase().includes(q) || inc.category?.toLowerCase().includes(q) || inc.reported_by_name?.toLowerCase().includes(q));
		}
		return list;
	}, [
		studentAllIncidents,
		selectedCategory,
		selectedSeverity,
		feedSearch
	]);
	const standingMeta = (0, import_react.useMemo)(() => {
		if (studentAllIncidents.length === 0) return {
			label: "Exemplary Conduct",
			badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300",
			description: "Zero conduct infractions on record. Exceptional behavioral standing.",
			color: "emerald"
		};
		if (severityCounts.major > 0) return {
			label: "Disciplinary Review Required",
			badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300",
			description: "One or more major infractions recorded. Requires close parental consultation.",
			color: "rose"
		};
		if (severityCounts.moderate > 0 || severityCounts.pending > 0) return {
			label: "Attention & Review Needed",
			badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300",
			description: severityCounts.pending > 0 ? `${severityCounts.pending} notice(s) require parent acknowledgement.` : "Moderate warnings recorded. Ongoing behavioral monitoring advised.",
			color: "amber"
		};
		return {
			label: "Good Standing",
			badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300",
			description: "Minor reminders logged. Good cooperation in the learning environment.",
			color: "blue"
		};
	}, [studentAllIncidents, severityCounts]);
	const handleExportReportPdf = () => {
		if (!currentStudent) return;
		exportPdf(`Official Student Discipline & Conduct Report — ${currentStudent.full_name} (${currentStudent.student_code})`, [
			"Date",
			"Time",
			"Category",
			"Severity",
			"Teacher Notes & Description",
			"Action Taken",
			"Reported By",
			"Parent Acknowledged"
		], studentAllIncidents.map((i) => [
			i.incident_date,
			i.incident_time || "—",
			`${i.category} [${normalizeToPrimaryCategory(i.category)}]`,
			SEVERITY_CONFIG$1[i.severity]?.label || i.severity,
			i.description,
			i.action_taken || "—",
			i.reported_by_name || "Teacher",
			i.parent_acknowledged ? `Yes (${fmtDate(i.parent_acknowledged_at)})` : "Pending Review"
		]), `discipline-report-${currentStudent.student_code}`);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "size-4 text-primary" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 269,
							columnNumber: 13
						}, this), isParentView ? "Select Child's Discipline Report" : "Student Discipline Record"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 268,
						columnNumber: 11
					}, this), students.length > 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-2 pt-1",
						children: students.map((s) => {
							const isSelected = s.id === currentStudent?.id;
							const childPending = incidents.filter((inc) => inc.student_id === s.id && !inc.parent_acknowledged).length;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => handleSelectStudent(s.id),
								className: cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer", isSelected ? "bg-primary text-primary-foreground border-primary shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border-border"),
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 294,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: s.full_name }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 295,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: cn("text-[10px] px-1 rounded", isSelected ? "bg-primary-foreground/20 text-white" : "text-muted-foreground"),
										children: s.classes?.name || s.class_name || "Class"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 296,
										columnNumber: 21
									}, this),
									childPending > 0 && /* @__PURE__ */ (void 0)("span", { className: "size-2 rounded-full bg-amber-400 animate-pulse" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 307,
										columnNumber: 23
									}, this)
								]
							}, s.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 283,
								columnNumber: 19
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 275,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-bold text-base text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: currentStudent?.full_name || "Student" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 315,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono text-xs font-normal text-muted-foreground",
							children: [
								"(",
								currentStudent?.student_code,
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 316,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 314,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 267,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleExportReportPdf,
						disabled: !currentStudent,
						className: "gap-1.5 text-xs h-8",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 332,
							columnNumber: 13
						}, this), " Export PDF Report"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 325,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => window.print(),
						className: "gap-1.5 text-xs h-8 hidden sm:inline-flex",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 340,
							columnNumber: 13
						}, this), " Print"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 334,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 324,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 266,
				columnNumber: 7
			}, this),
			currentStudent && /* @__PURE__ */ (void 0)(Card, {
				className: "border-t-4 border-t-primary shadow-sm",
				children: /* @__PURE__ */ (void 0)(CardContent, {
					className: "p-4 sm:p-5",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20",
								children: currentStudent.full_name.charAt(0).toUpperCase()
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 351,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (void 0)("h3", {
										className: "font-bold text-base text-foreground",
										children: currentStudent.full_name
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 356,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)(Badge, {
										variant: "outline",
										className: "text-[10px] font-mono",
										children: currentStudent.student_code
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 359,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: currentStudent.classes?.name || currentStudent.class_name || "Assigned Class"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 362,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 355,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (void 0)("span", { children: [
									"Guardian:",
									" ",
									/* @__PURE__ */ (void 0)("strong", {
										className: "text-foreground",
										children: currentStudent.parent_name || currentStudent.parent_email || "Registered Parent"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 371,
										columnNumber: 23
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 369,
									columnNumber: 21
								}, this), currentStudent.parent_phone && /* @__PURE__ */ (void 0)("span", { children: ["· Phone: ", currentStudent.parent_phone] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 378,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 368,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 354,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 350,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex flex-col md:items-end",
							children: [/* @__PURE__ */ (void 0)(Badge, {
								variant: "outline",
								className: cn("text-xs font-semibold px-2.5 py-1", standingMeta.badgeClass),
								children: [
									standingMeta.color === "emerald" && /* @__PURE__ */ (void 0)(Sparkles, { className: "size-3 mr-1" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 390,
										columnNumber: 56
									}, this),
									standingMeta.color === "amber" && /* @__PURE__ */ (void 0)(TriangleAlert, { className: "size-3 mr-1" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 391,
										columnNumber: 54
									}, this),
									standingMeta.color === "rose" && /* @__PURE__ */ (void 0)(CircleAlert, { className: "size-3 mr-1" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 392,
										columnNumber: 53
									}, this),
									standingMeta.label
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 386,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-[11px] text-muted-foreground mt-1 max-w-xs md:text-right",
								children: standingMeta.description
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 395,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 385,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 349,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border bg-muted/20 p-3",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[11px] font-medium text-muted-foreground block",
										children: "Total Disciplinary Actions"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 404,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-xl font-bold mt-0.5 text-foreground",
										children: studentAllIncidents.length
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 407,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] text-muted-foreground",
										children: severityCounts.pending > 0 ? `${severityCounts.pending} awaiting parent review` : "All notices acknowledged"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 410,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 403,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-500/5 p-3",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-[11px] font-semibold text-purple-700 dark:text-purple-300",
											children: "Conduct Actions"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 419,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-3.5 text-purple-600 dark:text-purple-400" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 422,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 418,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-xl font-bold mt-0.5 text-purple-700 dark:text-purple-300",
										children: categoryCounts.Conduct
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 424,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Behavior & classroom respect"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 427,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 417,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 p-3",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-[11px] font-semibold text-amber-700 dark:text-amber-300",
											children: "Punctuality Notices"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 434,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(Clock, { className: "size-3.5 text-amber-600 dark:text-amber-400" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 437,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 433,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-xl font-bold mt-0.5 text-amber-700 dark:text-amber-300",
										children: categoryCounts.Punctuality
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 439,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Arrival time & attendance"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 442,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 432,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-500/5 p-3",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-[11px] font-semibold text-slate-700 dark:text-slate-300",
											children: "Other Notices"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 447,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(FileText, { className: "size-3.5 text-slate-600 dark:text-slate-400" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 450,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 446,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-xl font-bold mt-0.5 text-slate-700 dark:text-slate-300",
										children: categoryCounts.Other
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 452,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Uniform, materials, homework"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 455,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 445,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 402,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 348,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 347,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0",
						children: [
							"All",
							"Conduct",
							"Punctuality",
							"Other"
						].map((cat) => {
							const isSelected = selectedCategory === cat;
							const count = categoryCounts[cat];
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setSelectedCategory(cat),
								className: cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer", isSelected ? "bg-foreground text-background shadow-xs" : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"),
								children: [
									cat === "Conduct" && /* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 485,
										columnNumber: 41
									}, this),
									cat === "Punctuality" && /* @__PURE__ */ (void 0)(Clock, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 486,
										columnNumber: 45
									}, this),
									cat === "Other" && /* @__PURE__ */ (void 0)(FileText, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 487,
										columnNumber: 39
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: cat === "All" ? "All Categories" : cat }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 488,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										variant: "secondary",
										className: cn("text-[10px] px-1.5 py-0 rounded-full h-4", isSelected ? "bg-background/20 text-background font-bold" : "bg-muted text-foreground"),
										children: count
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 489,
										columnNumber: 19
									}, this)
								]
							}, cat, true, {
								fileName: _jsxFileName$1,
								lineNumber: 474,
								columnNumber: 17
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 468,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative w-full sm:w-44",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 508,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								placeholder: "Search notes...",
								value: feedSearch,
								onChange: (e) => setFeedSearch(e.target.value),
								className: "w-full pl-8 pr-2.5 py-1 text-xs rounded-md border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 509,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 507,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
							value: selectedSeverity,
							onValueChange: setSelectedSeverity,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
								className: "h-8 text-xs w-36",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Severity" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 520,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 519,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "all",
									children: "All Severities"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 523,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "minor",
									children: "Minor Notice"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 524,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "moderate",
									children: "Moderate Warning"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 525,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "major",
									children: "Major Infraction"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 526,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 522,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 518,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 506,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 466,
					columnNumber: 9
				}, this), filteredFeed.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "border-dashed py-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-6" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 537,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 536,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-semibold text-sm text-foreground",
									children: studentAllIncidents.length === 0 ? "Exemplary Conduct Standing" : "No Records in this Filter"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 540,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground max-w-md mx-auto",
									children: studentAllIncidents.length === 0 ? `${currentStudent?.full_name || "Student"} has zero disciplinary actions recorded on their profile. Keep up the wonderful conduct!` : `No disciplinary entries found matching category "${selectedCategory}" with selected filters.`
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 545,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 539,
								columnNumber: 15
							}, this),
							studentAllIncidents.length > 0 && selectedCategory !== "All" && /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setSelectedCategory("All");
									setSelectedSeverity("all");
									setFeedSearch("");
								},
								className: "text-xs h-8",
								children: "Clear Filters"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 552,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 535,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 534,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs font-semibold text-muted-foreground px-1 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
							"Showing ",
							filteredFeed.length,
							" ",
							filteredFeed.length === 1 ? "Disciplinary Action" : "Disciplinary Actions"
						] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 570,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] font-normal",
							children: ["Category: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: selectedCategory }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 575,
								columnNumber: 27
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 574,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 569,
						columnNumber: 13
					}, this), filteredFeed.map((incident) => {
						const primaryCat = normalizeToPrimaryCategory(incident.category);
						const severityMeta = SEVERITY_CONFIG$1[incident.severity] || SEVERITY_CONFIG$1.minor;
						const isPending = !incident.parent_acknowledged;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: cn("rounded-xl border p-4 text-xs transition-all space-y-3", isPending ? incident.severity === "major" ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs" : "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs" : "bg-card shadow-xs"),
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-start justify-between gap-2 border-b pb-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "secondary",
													className: cn("text-[11px] font-semibold gap-1", primaryCat === "Conduct" && "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300", primaryCat === "Punctuality" && "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300", primaryCat === "Other" && "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300"),
													children: [
														primaryCat === "Conduct" && /* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-3" }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 614,
															columnNumber: 56
														}, this),
														primaryCat === "Punctuality" && /* @__PURE__ */ (void 0)(Clock, { className: "size-3" }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 615,
															columnNumber: 60
														}, this),
														primaryCat === "Other" && /* @__PURE__ */ (void 0)(FileText, { className: "size-3" }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 616,
															columnNumber: 54
														}, this),
														incident.category
													]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 602,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: cn("text-[10px] font-semibold uppercase", severityMeta.badgeColor),
													children: severityMeta.label
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 621,
													columnNumber: 25
												}, this),
												incident.parent_notified && /* @__PURE__ */ (void 0)("span", {
													className: "text-[10px] text-emerald-700 dark:text-emerald-300 font-medium inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded",
													children: [/* @__PURE__ */ (void 0)(Check, { className: "size-2.5" }, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 633,
														columnNumber: 29
													}, this), " Dispatched to Parent"]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 632,
													columnNumber: 27
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 600,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "flex items-center gap-1 font-medium text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "size-3 text-muted-foreground" }, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 640,
														columnNumber: 27
													}, this), fmtDate(incident.incident_date)]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 639,
													columnNumber: 25
												}, this),
												incident.incident_time && /* @__PURE__ */ (void 0)("span", { children: ["at ", incident.incident_time] }, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 643,
													columnNumber: 52
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
													"· Logged by ",
													incident.reported_by_name || "Teacher",
													" (",
													incident.reported_by_role || "Staff",
													")"
												] }, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 644,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 638,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 599,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: isPending ? onAcknowledge && /* @__PURE__ */ (void 0)(Button, {
										size: "sm",
										className: "h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs",
										onClick: () => onAcknowledge(incident),
										children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 660,
											columnNumber: 29
										}, this), " Acknowledge & Sign"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 655,
										columnNumber: 27
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-[11px] font-semibold border border-emerald-500/30",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3 text-emerald-600" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 666,
												columnNumber: 29
											}, this), " Acknowledged by Parent"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 665,
											columnNumber: 27
										}, this), incident.parent_acknowledged_at && /* @__PURE__ */ (void 0)("div", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: fmtDate(incident.parent_acknowledged_at)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 669,
											columnNumber: 29
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 664,
										columnNumber: 25
									}, this) }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 652,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 598,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block",
										children: "Teacher Notes & Incident Observation:"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 680,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-foreground leading-relaxed bg-background/60 p-2.5 rounded-lg border text-xs",
										children: incident.description
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 683,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 679,
									columnNumber: 19
								}, this),
								incident.action_taken && /* @__PURE__ */ (void 0)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block",
										children: "Corrective Guidance & Action Taken:"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 691,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-xs text-foreground bg-muted/40 p-2.5 rounded-lg border border-border/80 flex items-start gap-2",
										children: [/* @__PURE__ */ (void 0)(Info, { className: "size-3.5 text-primary shrink-0 mt-0.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 695,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", { children: incident.action_taken }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 696,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 694,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 690,
									columnNumber: 21
								}, this),
								incident.parent_notes && /* @__PURE__ */ (void 0)("div", {
									className: "text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-dashed",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "font-semibold text-foreground",
										children: "Parent Response Note: "
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 704,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "italic",
										children: [
											"\"",
											incident.parent_notes,
											"\""
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 705,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 703,
									columnNumber: 21
								}, this),
								isPending && isParentView && /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between gap-2 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-950 dark:text-amber-200 text-[11px]",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (void 0)(TriangleAlert, { className: "size-4 text-amber-600 dark:text-amber-400 shrink-0" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 713,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", { children: [
											"Please review the teacher's note above and confirm you have addressed it with ",
											incident.student_name,
											"."
										] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 714,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 712,
										columnNumber: 23
									}, this), onAcknowledge && /* @__PURE__ */ (void 0)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-6 text-[10px] font-semibold border-amber-400 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20",
										onClick: () => onAcknowledge(incident),
										children: "Sign Now"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 720,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 711,
									columnNumber: 21
								}, this)
							]
						}, incident.id, true, {
							fileName: _jsxFileName$1,
							lineNumber: 586,
							columnNumber: 17
						}, this);
					})]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 568,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 465,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 264,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/discipline.tsx?tsr-split=component";
var CATEGORIES = [
	"Conduct",
	"Punctuality",
	"Uniform & Dress Code",
	"Classroom Behavior",
	"Homework & Preparedness",
	"Respect & Politeness",
	"Peer Conflict",
	"Property Care",
	"Other"
];
var SEVERITY_CONFIG = {
	minor: {
		label: "Minor Notice",
		badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
		icon: Info,
		desc: "First reminder or minor classroom guidance"
	},
	moderate: {
		label: "Moderate Warning",
		badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
		icon: TriangleAlert,
		desc: "Repeated disruption, late arrival, or rule infringement"
	},
	major: {
		label: "Major Infraction",
		badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
		icon: CircleAlert,
		desc: "Serious misconduct, bullying, or defiance requiring immediate parent intervention"
	}
};
function getCurrentTimeStr() {
	const now = /* @__PURE__ */ new Date();
	return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
function DisciplinePage() {
	const { role, profile, user } = useAuth();
	const qc = useQueryClient();
	const searchParams = Route.useSearch();
	const isParent = role === "parent";
	const isTeacher = role === "teacher";
	const canManage = role === "admin" || role === "secretary" || role === "owner";
	const canLog = canManage || isTeacher;
	const [activeView, setActiveView] = (0, import_react.useState)(searchParams.view || (isParent ? "report" : "register"));
	const [selectedReportStudentId, setSelectedReportStudentId] = (0, import_react.useState)(searchParams.studentId || "");
	const [showSendModal, setShowSendModal] = (0, import_react.useState)(false);
	const [incidentToSend, setIncidentToSend] = (0, import_react.useState)(null);
	const [sendingIncidentId, setSendingIncidentId] = (0, import_react.useState)(null);
	const [showLogDialog, setShowLogDialog] = (0, import_react.useState)(false);
	const [showAcknowledgeDialog, setShowAcknowledgeDialog] = (0, import_react.useState)(false);
	const [selectedIncidentForAck, setSelectedIncidentForAck] = (0, import_react.useState)(null);
	const [parentComment, setParentComment] = (0, import_react.useState)("");
	const [selectedClassId, setSelectedClassId] = (0, import_react.useState)("all");
	const [formStudentId, setFormStudentId] = (0, import_react.useState)("");
	const [formCategory, setFormCategory] = (0, import_react.useState)("Conduct");
	const [formSeverity, setFormSeverity] = (0, import_react.useState)("minor");
	const [formDate, setFormDate] = (0, import_react.useState)(todayISO());
	const [formTimeVal, setFormTimeVal] = (0, import_react.useState)(getCurrentTimeStr());
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formActionTaken, setFormActionTaken] = (0, import_react.useState)("Verbal guidance & counseling");
	const [formNotifyParent, setFormNotifyParent] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterClass, setFilterClass] = (0, import_react.useState)("all");
	const [filterSeverity, setFilterSeverity] = (0, import_react.useState)("all");
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("all");
	const [filterAck, setFilterAck] = (0, import_react.useState)("all");
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("*").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: students } = useQuery({
		queryKey: ["students-for-discipline"],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("*, classes(name)").order("full_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const parentChildIds = (0, import_react.useMemo)(() => {
		if (!isParent || !students || !user?.id) return /* @__PURE__ */ new Set();
		return new Set(students.filter((s) => s.parent_id === user.id).map((s) => s.id));
	}, [
		isParent,
		students,
		user?.id
	]);
	const { data: incidents, isLoading } = useQuery({
		queryKey: ["discipline-incidents"],
		queryFn: async () => {
			const { data, error } = await supabase.from("discipline_incidents").select("*").order("incident_date", { ascending: false }).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const logIncidentMutation = useMutation({
		mutationFn: async () => {
			if (!formStudentId) throw new Error("Please select a student.");
			if (!formDescription.trim()) throw new Error("Please provide an incident description.");
			const student = (students ?? []).find((s) => s.id === formStudentId);
			if (!student) throw new Error("Selected student not found.");
			const studentClass = (classes ?? []).find((c) => c.id === student.class_id);
			const incidentData = {
				student_id: student.id,
				student_name: student.full_name,
				student_code: student.student_code,
				class_id: student.class_id || null,
				class_name: studentClass?.name || student.classes?.name || "Unassigned",
				parent_id: student.parent_id || null,
				category: formCategory,
				severity: formSeverity,
				incident_date: formDate,
				incident_time: formTimeVal,
				description: formDescription.trim(),
				action_taken: formActionTaken.trim() || "Verbal reminder",
				reported_by_id: user?.id || "",
				reported_by_name: profile?.full_name || "Teacher",
				reported_by_role: role || "staff",
				parent_notified: formNotifyParent,
				parent_acknowledged: false,
				parent_acknowledged_at: null,
				parent_notes: null,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const { data: created, error } = await supabase.from("discipline_incidents").insert(incidentData).select().single();
			if (error) throw error;
			if (formNotifyParent && student.parent_id) try {
				await supabase.from("parent_notifications").insert({
					student_id: student.id,
					parent_id: student.parent_id,
					recipient_email: student.parent_email || null,
					subject: `⚠️ Little Gems Academy Conduct Notice: ${student.full_name} (${formCategory})`,
					body: `Dear Parent,\n\nA conduct incident regarding ${student.full_name} has been logged by ${profile?.full_name || "School Staff"}.\n\nCategory: ${formCategory}\nSeverity: ${SEVERITY_CONFIG[formSeverity].label}\nDate: ${formDate}\nDescription: ${formDescription}\nAction Taken: ${formActionTaken}\n\nPlease sign into your Parent Portal to review and acknowledge this record.\n\nWarm regards,\nLittle Gems Academy Administration`,
					status: "sent"
				});
			} catch (notifErr) {
				console.warn("Could not insert parent notification record:", notifErr);
			}
			await logAudit("discipline.incident_logged", "discipline_incidents", {
				student_id: student.id,
				severity: formSeverity,
				category: formCategory
			});
			return created;
		},
		onSuccess: () => {
			toast.success("Conduct incident logged successfully!");
			setShowLogDialog(false);
			setFormStudentId("");
			setFormDescription("");
			setFormActionTaken("Verbal guidance & counseling");
			setFormCategory("Conduct");
			setFormSeverity("minor");
			qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
			qc.invalidateQueries({ queryKey: ["my-children-full"] });
		},
		onError: (err) => toast.error(err?.message || "Failed to record incident")
	});
	const acknowledgeMutation = useMutation({
		mutationFn: async ({ id, notes }) => {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const { error } = await supabase.from("discipline_incidents").update({
				parent_acknowledged: true,
				parent_acknowledged_at: now,
				parent_notes: notes?.trim() || null
			}).eq("id", id);
			if (error) throw error;
			await logAudit("discipline.parent_acknowledged", "discipline_incidents", {
				incident_id: id,
				parent_id: user?.id
			});
		},
		onSuccess: () => {
			toast.success("Thank you! Incident acknowledgement recorded.");
			setShowAcknowledgeDialog(false);
			setSelectedIncidentForAck(null);
			setParentComment("");
			qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
			qc.invalidateQueries({ queryKey: ["my-children-full"] });
		},
		onError: (err) => toast.error(err?.message || "Failed to acknowledge incident")
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("discipline_incidents").delete().eq("id", id);
			if (error) throw error;
			await logAudit("discipline.incident_deleted", "discipline_incidents", { incident_id: id });
		},
		onSuccess: () => {
			toast.success("Incident record removed.");
			qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
		},
		onError: (err) => toast.error(err?.message || "Failed to remove incident")
	});
	const sendToParentMutation = useMutation({
		mutationFn: async (incident) => {
			setSendingIncidentId(incident.id);
			const student = (students ?? []).find((s) => s.id === incident.student_id);
			const parentEmail = student?.parent_email || (incident.parent_id ? `${incident.student_code}@parents.littlegems.edu` : "parent@littlegems.edu");
			const parentName = student?.parent_name || "Parent / Guardian";
			const parentId = student?.parent_id || incident.parent_id || null;
			const subject = `⚠️ Little Gems Academy Disciplinary Notice: ${incident.student_name} (${incident.category})`;
			const body = `Dear ${parentName},\n\nA student disciplinary notice has been issued for ${incident.student_name} by ${profile?.full_name || "School Staff"} (${profile?.role || "Teacher"}).\n\nIncident Category: ${incident.category} [${normalizeToPrimaryCategory(incident.category)}]\nSeverity Level: ${SEVERITY_CONFIG[incident.severity]?.label || incident.severity}\nDate: ${incident.incident_date} at ${incident.incident_time || "—"}\n\nTeacher Notes & Observation:\n${incident.description}\n\nAction Taken by School:\n${incident.action_taken || "Verbal counseling & behavioral guidance"}\n\nPlease sign into your Little Gems Academy Parent Portal -> Discipline Report to review this feed and acknowledge the notice.\n\nWarm regards,\nLittle Gems Academy Administration`;
			try {
				await supabase.from("notifications").insert({
					student_id: incident.student_id,
					parent_id: parentId,
					recipient_email: parentEmail,
					subject,
					body,
					status: "sent",
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			} catch (e) {
				console.warn("Notice insertion warning:", e);
			}
			if (parentId) try {
				await supabase.from("parent_notifications").insert({
					student_id: incident.student_id,
					parent_id: parentId,
					recipient_email: parentEmail,
					subject,
					body,
					status: "sent",
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			} catch (e) {
				console.warn("Parent notification table warning:", e);
			}
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const { error: updateErr } = await supabase.from("discipline_incidents").update({
				parent_notified: true,
				last_sent_at: now
			}).eq("id", incident.id);
			if (updateErr) throw updateErr;
			dispatchLocalNotification(`Disciplinary Notice: ${incident.student_name}`, `${incident.category} (${incident.severity}): ${incident.description.slice(0, 80)}...`, "/discipline");
			await logAudit("discipline.sent_to_parent", "discipline_incidents", {
				incident_id: incident.id,
				student_id: incident.student_id,
				student_name: incident.student_name,
				recipient_email: parentEmail,
				sent_by: profile?.full_name
			});
			return {
				parentEmail,
				parentName,
				studentName: incident.student_name
			};
		},
		onSuccess: (res) => {
			toast.success(`Disciplinary notice for ${res.studentName} sent to parent!`, { description: `Dispatched to ${res.parentEmail}` });
			setSendingIncidentId(null);
			setShowSendModal(false);
			setIncidentToSend(null);
			qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
			qc.invalidateQueries({ queryKey: ["notifications"] });
			qc.invalidateQueries({ queryKey: ["my-children-full"] });
			qc.invalidateQueries({ queryKey: ["pending-discipline-count"] });
		},
		onError: (err) => {
			setSendingIncidentId(null);
			toast.error(err?.message || "Failed to send notice to parent");
		}
	});
	const availableStudentsForForm = (0, import_react.useMemo)(() => {
		let list = students ?? [];
		if (selectedClassId !== "all") list = list.filter((s) => s.class_id === selectedClassId);
		return list;
	}, [students, selectedClassId]);
	const filteredIncidents = (0, import_react.useMemo)(() => {
		let list = incidents ?? [];
		if (isParent) list = list.filter((item) => item.parent_id && item.parent_id === user?.id || parentChildIds.has(item.student_id));
		if (filterClass !== "all") list = list.filter((item) => item.class_id === filterClass);
		if (filterSeverity !== "all") list = list.filter((item) => item.severity === filterSeverity);
		if (filterCategory !== "all") list = list.filter((item) => item.category === filterCategory);
		if (filterAck === "pending") list = list.filter((item) => !item.parent_acknowledged);
		else if (filterAck === "acknowledged") list = list.filter((item) => item.parent_acknowledged);
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter((item) => item.student_name?.toLowerCase().includes(q) || item.student_code?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q) || item.class_name?.toLowerCase().includes(q));
		}
		return list;
	}, [
		incidents,
		isParent,
		user?.id,
		parentChildIds,
		filterClass,
		filterSeverity,
		filterCategory,
		filterAck,
		search
	]);
	const stats = (0, import_react.useMemo)(() => {
		const list = isParent ? (incidents ?? []).filter((item) => item.parent_id && item.parent_id === user?.id || parentChildIds.has(item.student_id)) : incidents ?? [];
		const total = list.length;
		const minor = list.filter((i) => i.severity === "minor").length;
		const moderate = list.filter((i) => i.severity === "moderate").length;
		const major = list.filter((i) => i.severity === "major").length;
		const acknowledged = list.filter((i) => i.parent_acknowledged).length;
		return {
			total,
			minor,
			moderate,
			major,
			acknowledged,
			pendingAck: total - acknowledged
		};
	}, [
		incidents,
		isParent,
		user?.id,
		parentChildIds
	]);
	const handleExportPdf = () => {
		exportPdf("Student Discipline & Conduct Register — Little Gems Academy", [
			"Date",
			"Student",
			"Code",
			"Class",
			"Category",
			"Severity",
			"Description",
			"Action",
			"Parent Status"
		], filteredIncidents.map((i) => [
			i.incident_date,
			i.student_name,
			i.student_code,
			i.class_name || "—",
			i.category,
			SEVERITY_CONFIG[i.severity]?.label || i.severity,
			i.description,
			i.action_taken || "—",
			i.parent_acknowledged ? "Acknowledged" : "Pending Review"
		]), "discipline-register");
	};
	const handleExportExcel = () => {
		exportExcel([
			"Date",
			"Time",
			"Student Name",
			"Student Code",
			"Class",
			"Category",
			"Severity",
			"Description",
			"Action Taken",
			"Reported By",
			"Parent Acknowledged",
			"Acknowledged Date",
			"Parent Comment"
		], filteredIncidents.map((i) => [
			i.incident_date,
			i.incident_time || "",
			i.student_name,
			i.student_code,
			i.class_name || "—",
			i.category,
			SEVERITY_CONFIG[i.severity]?.label || i.severity,
			i.description,
			i.action_taken || "—",
			i.reported_by_name || "Staff",
			i.parent_acknowledged ? "Yes" : "No",
			i.parent_acknowledged_at ? fmtDate(i.parent_acknowledged_at) : "—",
			i.parent_notes || ""
		]), "discipline-register");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: isParent ? "Student Conduct & Behavior Notices" : "Student Discipline & Conduct",
				description: isParent ? "View your child's conduct record, punctuality reports, and acknowledge school notices." : "Log behavioral incidents, conduct notes, punctuality warnings, and track parent acknowledgments.",
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportPdf,
							disabled: !filteredIncidents.length,
							className: "gap-1.5 text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 467,
								columnNumber: 15
							}, this), " PDF"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 466,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportExcel,
							disabled: !filteredIncidents.length,
							className: "gap-1.5 text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileSpreadsheet, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 470,
								columnNumber: 15
							}, this), " Excel"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 469,
							columnNumber: 13
						}, this),
						canLog && /* @__PURE__ */ (void 0)(Button, {
							onClick: () => {
								setFormDate(todayISO());
								setFormTimeVal(getCurrentTimeStr());
								setShowLogDialog(true);
							},
							size: "sm",
							className: "gap-1.5 text-xs h-9 font-semibold shadow-sm",
							children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 478,
								columnNumber: 17
							}, this), " Log Incident"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 473,
							columnNumber: 24
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 465,
					columnNumber: 331
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 465,
				columnNumber: 7
			}, this),
			!isParent ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 bg-card p-2 rounded-xl border shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => setActiveView("report"),
						className: cn("flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer", activeView === "report" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 486,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Student Discipline Report" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 487,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 485,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => setActiveView("register"),
						className: cn("flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer", activeView === "register" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListFilter, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 490,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Discipline Register & Actions" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 491,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "secondary",
								className: cn("text-[10px] px-1.5 py-0 h-4", activeView === "register" ? "bg-primary-foreground/20 text-white" : ""),
								children: stats.total
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 492,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 489,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 484,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-xs text-muted-foreground hidden sm:block",
					children: activeView === "report" ? "Dedicated student conduct feed & printable report cards" : "Complete register with teacher notification actions & mobile scroll"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 498,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 483,
				columnNumber: 20
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-card p-3 rounded-xl border shadow-xs flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 text-xs font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "size-4 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 503,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Official Conduct & Guidance Notices for Your Children" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 504,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 502,
					columnNumber: 11
				}, this), stats.pendingAck > 0 && /* @__PURE__ */ (void 0)(Badge, {
					variant: "destructive",
					className: "text-xs px-2 py-0.5",
					children: [stats.pendingAck, " Pending Acknowledgment"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 506,
					columnNumber: 36
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 501,
				columnNumber: 18
			}, this),
			isParent || activeView === "report" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DisciplineReport, {
				students: isParent ? (students ?? []).filter((s) => parentChildIds.has(s.id)) : students ?? [],
				incidents: isParent ? (incidents ?? []).filter((item) => item.parent_id && item.parent_id === user?.id || parentChildIds.has(item.student_id)) : incidents ?? [],
				selectedStudentId: selectedReportStudentId,
				onSelectStudent: (id) => setSelectedReportStudentId(id),
				onAcknowledge: (incident) => {
					setSelectedIncidentForAck(incident);
					setParentComment("");
					setShowAcknowledgeDialog(true);
				},
				isParentView: isParent
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 511,
				columnNumber: 46
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-6",
				children: [
					isParent && stats.pendingAck > 0 && /* @__PURE__ */ (void 0)("div", {
						className: "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-200 shadow-sm flex items-start gap-3",
						children: [/* @__PURE__ */ (void 0)(TriangleAlert, { className: "size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 518,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "font-semibold text-sm",
								children: [
									"Action Needed: ",
									stats.pendingAck,
									" Unreviewed Conduct",
									" ",
									stats.pendingAck === 1 ? "Notice" : "Notices"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 520,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80",
								children: [
									"The school has shared conduct or punctuality notes regarding your child. Please review the entries below and tap ",
									/* @__PURE__ */ (void 0)("strong", { children: "\"Acknowledge & Sign\"" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 526,
										columnNumber: 52
									}, this),
									" to confirm you have discussed them at home."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 524,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 519,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 517,
						columnNumber: 48
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-3 grid-cols-2 lg:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-muted-foreground block",
										children: "Total Incidents"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 535,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-2xl font-bold mt-1 text-foreground",
										children: stats.total
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 538,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Cumulative logged records"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 539,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 534,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
								className: "p-3.5 border-l-4 border-l-blue-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-blue-700 dark:text-blue-300 block",
										children: "Minor Notices"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 545,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-2xl font-bold mt-1 text-blue-700 dark:text-blue-400",
										children: stats.minor
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 548,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Verbal reminders & advice"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 551,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 544,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
								className: "p-3.5 border-l-4 border-l-amber-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-amber-700 dark:text-amber-300 block",
										children: "Moderate Warnings"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 557,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-2xl font-bold mt-1 text-amber-700 dark:text-amber-400",
										children: stats.moderate
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 560,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Punctuality & uniform issues"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 563,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 556,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
								className: "p-3.5 border-l-4 border-l-rose-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-rose-700 dark:text-rose-300 block",
										children: "Major Infractions"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 569,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-2xl font-bold mt-1 text-rose-700 dark:text-rose-400",
										children: stats.major
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 572,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Requires disciplinary meeting"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 575,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 568,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
								className: "p-3.5 border-l-4 border-l-emerald-500 col-span-2 lg:col-span-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-emerald-700 dark:text-emerald-300 block",
										children: "Parent Reviewed"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 581,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-2xl font-bold mt-1 text-emerald-700 dark:text-emerald-400",
										children: [stats.acknowledged, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground font-normal ml-1.5",
											children: [
												"(",
												stats.total ? Math.round(stats.acknowledged / stats.total * 100) : 100,
												"%)"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 586,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 584,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: [stats.pendingAck, " pending acknowledgment"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 590,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 580,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 533,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3 border-b bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "size-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 602,
									columnNumber: 21
								}, this), isParent ? "My Children's Conduct Log" : "Schoolwide Disciplinary Register"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 601,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
								className: "text-xs",
								children: [
									filteredIncidents.length,
									" ",
									filteredIncidents.length === 1 ? "entry" : "entries",
									" found"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 605,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 600,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative w-full md:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 613,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "Search student, description, code...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "pl-8 h-8 text-xs"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 614,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 612,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 599,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-2 pt-3 sm:grid-cols-2 md:grid-cols-4",
							children: [
								!isParent && /* @__PURE__ */ (void 0)(Select, {
									value: filterClass,
									onValueChange: setFilterClass,
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Filter by class" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 622,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 621,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [/* @__PURE__ */ (void 0)(SelectItem, {
										value: "all",
										children: "All Classes"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 625,
										columnNumber: 23
									}, this), (classes ?? []).map((c) => /* @__PURE__ */ (void 0)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id, false, {
										fileName: _jsxFileName,
										lineNumber: 626,
										columnNumber: 49
									}, this))] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 624,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 620,
									columnNumber: 31
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: filterSeverity,
									onValueChange: setFilterSeverity,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Filter by severity" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 634,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 633,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "all",
											children: "All Severities"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 637,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "minor",
											children: "Minor Notices"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 638,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "moderate",
											children: "Moderate Warnings"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 639,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "major",
											children: "Major Infractions"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 640,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 636,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 632,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: filterCategory,
									onValueChange: setFilterCategory,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Filter by category" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 646,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 645,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: "all",
										children: "All Categories"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 649,
										columnNumber: 21
									}, this), CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: cat,
										children: cat
									}, cat, false, {
										fileName: _jsxFileName,
										lineNumber: 650,
										columnNumber: 44
									}, this))] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 648,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 644,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: filterAck,
									onValueChange: setFilterAck,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Parent review status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 658,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 657,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "all",
											children: "All Statuses"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 661,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "pending",
											children: "Awaiting Parent Review"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 662,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "acknowledged",
											children: "Acknowledged by Parent"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 663,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 660,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 656,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 619,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 598,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "p-0",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "py-16 text-center text-xs text-muted-foreground",
							children: "Loading discipline register..."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 670,
							columnNumber: 28
						}, this) : filteredIncidents.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "py-14 text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-9 text-emerald-500 mx-auto" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 673,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-semibold text-sm",
									children: "No Incidents Found"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 674,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground max-w-sm mx-auto",
									children: search || filterCategory !== "all" || filterSeverity !== "all" ? "No conduct records match the applied search filters." : "All students are in good standing with exemplary conduct."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 675,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 672,
							columnNumber: 59
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-xl border overflow-hidden bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "md:hidden flex items-center justify-between px-3.5 py-2.5 bg-primary/10 border-b border-primary/20 text-xs text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-3.5 text-primary shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 682,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
										"Swipe table horizontally to reach the ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Send to Parent" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 684,
											columnNumber: 63
										}, this),
										" button"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 683,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 681,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] text-muted-foreground font-semibold shrink-0",
									children: "Scroll →"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 687,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 680,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto touch-pan-x scrollbar-thin",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, {
									className: "w-full min-w-[1080px]",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "w-[120px]",
												children: "Date / Time"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 696,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "w-[150px]",
												children: "Student"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 697,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "w-[90px]",
												children: "Class"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 698,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "w-[140px]",
												children: "Category & Severity"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 699,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "min-w-[220px]",
												children: "Description & Action"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 700,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "w-[120px]",
												children: "Reported By"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 701,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "w-[130px]",
												children: "Parent Status"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 702,
												columnNumber: 27
											}, this),
											!isParent && /* @__PURE__ */ (void 0)(TableHead, {
												className: "w-[150px] whitespace-nowrap font-bold text-primary",
												children: "Send to Parent"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 703,
												columnNumber: 41
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
												className: "text-right w-[80px]",
												children: "Action"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 706,
												columnNumber: 27
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 695,
										columnNumber: 25
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 694,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredIncidents.map((incident) => {
										const severityMeta = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.minor;
										isParent && parentChildIds.has(incident.student_id);
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
											className: "text-xs hover:bg-muted/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
													className: "whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "font-medium text-foreground",
														children: fmtDate(incident.incident_date)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 715,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[11px] text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "size-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 719,
															columnNumber: 35
														}, this), incident.incident_time || "—"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 718,
														columnNumber: 33
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 714,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "font-semibold text-foreground",
													children: incident.student_name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 725,
													columnNumber: 33
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "font-mono text-[10px] text-primary",
													children: incident.student_code
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 728,
													columnNumber: 33
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 724,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[10px] font-normal",
													children: incident.class_name || "Unassigned"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 734,
													columnNumber: 33
												}, this) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 733,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
														variant: "outline",
														className: cn("text-[10px] font-semibold", severityMeta.badgeColor),
														children: severityMeta.label
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 741,
														columnNumber: 35
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[11px] font-medium text-foreground",
														children: incident.category
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 744,
														columnNumber: 35
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 740,
													columnNumber: 33
												}, this) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 739,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "space-y-1 text-xs max-w-sm",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "leading-relaxed text-foreground",
														children: incident.description
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 752,
														columnNumber: 35
													}, this), incident.action_taken && /* @__PURE__ */ (void 0)("div", {
														className: "text-[11px] text-muted-foreground bg-muted/40 rounded px-2 py-1 border",
														children: [/* @__PURE__ */ (void 0)("span", {
															className: "font-semibold text-foreground",
															children: ["Action taken:", " "]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 756,
															columnNumber: 39
														}, this), incident.action_taken]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 755,
														columnNumber: 61
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 751,
													columnNumber: 33
												}, this) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 750,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
													className: "whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "font-medium text-foreground",
														children: incident.reported_by_name || "Staff"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 765,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[10px] text-muted-foreground capitalize",
														children: incident.reported_by_role || "Teacher"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 768,
														columnNumber: 33
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 764,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: incident.parent_acknowledged ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "space-y-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3 text-emerald-600 dark:text-emerald-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 776,
																columnNumber: 39
															}, this), "Acknowledged"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 775,
															columnNumber: 37
														}, this),
														incident.parent_acknowledged_at && /* @__PURE__ */ (void 0)("div", {
															className: "text-[10px] text-muted-foreground",
															children: fmtDate(incident.parent_acknowledged_at)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 779,
															columnNumber: 73
														}, this),
														incident.parent_notes && /* @__PURE__ */ (void 0)("div", {
															className: "text-[10px] text-muted-foreground italic border-l-2 pl-1.5 mt-0.5",
															children: [
																"\"",
																incident.parent_notes,
																"\""
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 782,
															columnNumber: 63
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 774,
													columnNumber: 65
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[10px] font-normal border-amber-400 text-amber-700 dark:text-amber-300 bg-amber-500/10",
													children: "Awaiting Review"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 785,
													columnNumber: 44
												}, this) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 773,
													columnNumber: 31
												}, this),
												!isParent && /* @__PURE__ */ (void 0)(TableCell, {
													className: "whitespace-nowrap",
													children: incident.parent_notified ? /* @__PURE__ */ (void 0)("div", {
														className: "flex flex-col gap-1 items-start",
														children: [/* @__PURE__ */ (void 0)(Badge, {
															variant: "outline",
															className: "text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 gap-1 py-0.5",
															children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-3 text-emerald-600 dark:text-emerald-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 794,
																columnNumber: 41
															}, this), "Sent to Parent"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 793,
															columnNumber: 39
														}, this), /* @__PURE__ */ (void 0)("div", {
															className: "text-[10px] text-muted-foreground flex items-center gap-1.5",
															children: [/* @__PURE__ */ (void 0)("span", { children: incident.last_sent_at ? fmtDate(incident.last_sent_at) : "Delivered" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 798,
																columnNumber: 41
															}, this), /* @__PURE__ */ (void 0)("button", {
																type: "button",
																className: "text-[10px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-medium",
																title: "Resend disciplinary notice to parent",
																onClick: () => {
																	setIncidentToSend(incident);
																	setShowSendModal(true);
																},
																children: [/* @__PURE__ */ (void 0)(Send, { className: "size-2.5" }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 805,
																	columnNumber: 43
																}, this), " Resend"]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 801,
																columnNumber: 41
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 797,
															columnNumber: 39
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 792,
														columnNumber: 63
													}, this) : /* @__PURE__ */ (void 0)(Button, {
														size: "sm",
														className: "h-7 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs",
														onClick: () => {
															setIncidentToSend(incident);
															setShowSendModal(true);
														},
														disabled: sendToParentMutation.isPending && sendingIncidentId === incident.id,
														title: "Send disciplinary notice to parent",
														children: [/* @__PURE__ */ (void 0)(Send, { className: "size-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 812,
															columnNumber: 39
														}, this), sendToParentMutation.isPending && sendingIncidentId === incident.id ? "Sending..." : "Send to Parent"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 808,
														columnNumber: 46
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 791,
													columnNumber: 45
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
													className: "text-right whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-center justify-end gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															variant: "ghost",
															size: "sm",
															className: "h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground",
															onClick: () => {
																setSelectedReportStudentId(incident.student_id);
																setActiveView("report");
															},
															title: "Open student-specific Discipline Report",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "size-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 823,
																columnNumber: 37
															}, this), " Report"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 819,
															columnNumber: 35
														}, this), isParent && !incident.parent_acknowledged ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															size: "sm",
															variant: "default",
															className: "h-7 text-xs font-semibold px-2.5 gap-1 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white",
															onClick: () => {
																setSelectedIncidentForAck(incident);
																setParentComment("");
																setShowAcknowledgeDialog(true);
															},
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 831,
																columnNumber: 39
															}, this), " Acknowledge & Sign"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 826,
															columnNumber: 80
														}, this) : canManage ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															variant: "ghost",
															size: "icon",
															className: "size-7 text-muted-foreground hover:text-destructive",
															title: "Delete entry",
															onClick: () => {
																if (confirm(`Remove incident record for ${incident.student_name}?`)) deleteMutation.mutate(incident.id);
															},
															children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 837,
																columnNumber: 39
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 832,
															columnNumber: 61
														}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "text-[11px] text-muted-foreground",
															children: "—"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 838,
															columnNumber: 49
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 818,
														columnNumber: 33
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 817,
													columnNumber: 31
												}, this)
											]
										}, incident.id, true, {
											fileName: _jsxFileName,
											lineNumber: 713,
											columnNumber: 28
										}, this);
									}) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 709,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 693,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 692,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 678,
							columnNumber: 26
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 669,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 597,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 515,
				columnNumber: 37
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: showLogDialog,
				onOpenChange: setShowLogDialog,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 856,
								columnNumber: 15
							}, this), "Log Student Conduct Incident"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 855,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "text-xs",
							children: "Record behavioral issues, punctuality warnings, or discipline notes for student profile and parent communication."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 859,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 854,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "1. Filter by Class (Optional)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 869,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: selectedClassId,
											onValueChange: setSelectedClassId,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "All classes" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 874,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 873,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "all",
												children: "All Classes"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 877,
												columnNumber: 21
											}, this), (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: c.id,
												children: c.name
											}, c.id, false, {
												fileName: _jsxFileName,
												lineNumber: 878,
												columnNumber: 47
											}, this))] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 876,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 872,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 868,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "2. Select Student *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 886,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: formStudentId,
											onValueChange: setFormStudentId,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
												className: "h-9 text-xs font-medium",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Choose student..." }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 891,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 890,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, {
												className: "max-h-56",
												children: [availableStudentsForForm.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: s.id,
													children: [
														s.full_name,
														" (",
														s.student_code,
														")"
													]
												}, s.id, true, {
													fileName: _jsxFileName,
													lineNumber: 894,
													columnNumber: 56
												}, this)), !availableStudentsForForm.length && /* @__PURE__ */ (void 0)(SelectItem, {
													value: "none",
													disabled: true,
													children: "No students found in this class"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 897,
													columnNumber: 58
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 893,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 889,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 885,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 867,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Category *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 908,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: formCategory,
											onValueChange: setFormCategory,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 913,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 912,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: cat,
												children: cat
											}, cat, false, {
												fileName: _jsxFileName,
												lineNumber: 916,
												columnNumber: 44
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 915,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 911,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 907,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Severity Level *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 924,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: formSeverity,
											onValueChange: (v) => setFormSeverity(v),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
												className: "h-9 text-xs font-semibold",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 929,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 928,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "minor",
													children: "Minor Notice (Reminder)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 932,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "moderate",
													children: "Moderate Warning (Rule Break)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 933,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "major",
													children: "Major Infraction (Urgent)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 934,
													columnNumber: 21
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 931,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 927,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 923,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 906,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Incident Date"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 943,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											type: "date",
											value: formDate,
											onChange: (e) => setFormDate(e.target.value),
											className: "h-9 text-xs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 946,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 942,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Approximate Time"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 949,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											type: "time",
											value: formTimeVal,
											onChange: (e) => setFormTimeVal(e.target.value),
											className: "h-9 text-xs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 952,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 948,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 941,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
										children: "Incident Description *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 958,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 3,
										placeholder: "Detail what occurred, circumstances, or specific behavior observed...",
										value: formDescription,
										onChange: (e) => setFormDescription(e.target.value),
										className: "text-xs leading-relaxed"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 961,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 957,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
										children: "Action Taken by Staff"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 966,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Verbal guidance, counseling session, detention, parent conference requested...",
										value: formActionTaken,
										onChange: (e) => setFormActionTaken(e.target.value),
										className: "h-9 text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 969,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 965,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-lg border p-3 bg-muted/20 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-medium text-xs text-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "size-3.5 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 976,
												columnNumber: 19
											}, this), "Notify Parent & Require Acknowledgement"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 975,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-muted-foreground",
											children: "Sends an automated notification to the parent portal and parent email."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 979,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 974,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										type: "checkbox",
										checked: formNotifyParent,
										onChange: (e) => setFormNotifyParent(e.target.checked),
										className: "size-4 rounded accent-primary cursor-pointer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 983,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 973,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 865,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setShowLogDialog(false),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 988,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: () => logIncidentMutation.mutate(),
								disabled: !formStudentId || !formDescription.trim() || logIncidentMutation.isPending,
								size: "sm",
								className: "gap-1.5 font-semibold",
								children: logIncidentMutation.isPending ? "Recording..." : "Record Incident"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 991,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 987,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 853,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 852,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: showAcknowledgeDialog,
				onOpenChange: setShowAcknowledgeDialog,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-5 text-emerald-600 dark:text-emerald-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1003,
								columnNumber: 15
							}, this), "Acknowledge Conduct Notice"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1002,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "text-xs",
							children: "Confirm you have reviewed this record and addressed the matter with your child."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1006,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1001,
							columnNumber: 11
						}, this),
						selectedIncidentForAck && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border p-3 bg-muted/30 space-y-1.5",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between items-center text-[11px]",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "font-semibold text-foreground",
											children: selectedIncidentForAck.student_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1014,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: selectedIncidentForAck.category
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1017,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1013,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "text-xs text-foreground/90 leading-relaxed",
										children: selectedIncidentForAck.description
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1021,
										columnNumber: 17
									}, this),
									selectedIncidentForAck.action_taken && /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] text-muted-foreground pt-1 border-t",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "font-semibold",
											children: "Action: "
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1025,
											columnNumber: 21
										}, this), selectedIncidentForAck.action_taken]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1024,
										columnNumber: 57
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1012,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (void 0)("label", {
									className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
									children: "Parent Response / Note (Optional)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1031,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Textarea, {
									rows: 2,
									placeholder: "e.g. Discussed with child at home, agreed on behavior improvements...",
									value: parentComment,
									onChange: (e) => setParentComment(e.target.value),
									className: "text-xs leading-relaxed"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1034,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1030,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1011,
							columnNumber: 38
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setShowAcknowledgeDialog(false);
									setSelectedIncidentForAck(null);
								},
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1039,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: () => {
									if (selectedIncidentForAck) acknowledgeMutation.mutate({
										id: selectedIncidentForAck.id,
										notes: parentComment
									});
								},
								disabled: acknowledgeMutation.isPending,
								size: "sm",
								className: "gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold",
								children: acknowledgeMutation.isPending ? "Confirming..." : "Confirm & Sign"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1045,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1038,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1e3,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 999,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: showSendModal,
				onOpenChange: setShowSendModal,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1064,
								columnNumber: 15
							}, this), "Send Disciplinary Notice to Parent"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1063,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "text-xs",
							children: "This will dispatch an official notification directly to the parent's portal and email address requesting acknowledgment."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1067,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1062,
							columnNumber: 11
						}, this),
						incidentToSend && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border p-3 bg-muted/30 space-y-2",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground text-[11px]",
											children: "Student"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1076,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-semibold text-foreground",
											children: [
												incidentToSend.student_name,
												" (",
												incidentToSend.student_code,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1077,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1075,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground text-[11px]",
											children: "Category & Severity"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1082,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-medium text-foreground",
												children: incidentToSend.category
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1084,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)(Badge, {
												variant: "outline",
												className: cn("text-[10px] font-semibold", SEVERITY_CONFIG[incidentToSend.severity]?.badgeColor),
												children: SEVERITY_CONFIG[incidentToSend.severity]?.label || incidentToSend.severity
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1085,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1083,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1081,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground text-[11px]",
											children: "Date of Incident"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1091,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-medium text-foreground",
											children: [
												fmtDate(incidentToSend.incident_date),
												" at ",
												incidentToSend.incident_time || "—"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1092,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1090,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-1 pt-1",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground text-[11px] block",
											children: "Observation & Notes:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1097,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-foreground/90 leading-relaxed bg-background/60 p-2 rounded border",
											children: incidentToSend.description
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1100,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1096,
										columnNumber: 17
									}, this),
									incidentToSend.action_taken && /* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] text-muted-foreground pt-1",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "font-semibold text-foreground",
											children: "Action taken: "
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1105,
											columnNumber: 21
										}, this), incidentToSend.action_taken]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1104,
										columnNumber: 49
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1074,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border p-3 bg-blue-50/50 dark:bg-blue-950/20 text-blue-950 dark:text-blue-200 space-y-1",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "font-semibold text-[11px] flex items-center gap-1.5 text-blue-700 dark:text-blue-300",
									children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1112,
										columnNumber: 19
									}, this), " What happens when you click Send:"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1111,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("ul", {
									className: "list-disc pl-4 text-[10px] space-y-0.5 text-blue-900/80 dark:text-blue-300/80",
									children: [
										/* @__PURE__ */ (void 0)("li", { children: "The notice appears in the parent's dedicated Discipline Report feed." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1115,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("li", { children: "An official notification record is created for parent review." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1116,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("li", { children: "The parent receives a direct prompt to review and sign acknowledgment." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1117,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1114,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1110,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1073,
							columnNumber: 30
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setShowSendModal(false);
									setIncidentToSend(null);
								},
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1123,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: () => {
									if (incidentToSend) sendToParentMutation.mutate(incidentToSend);
								},
								disabled: sendToParentMutation.isPending,
								size: "sm",
								className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1134,
									columnNumber: 15
								}, this), sendToParentMutation.isPending ? "Sending Notice..." : "Confirm & Send to Parent"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1129,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1122,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1061,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1060,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 464,
		columnNumber: 10
	}, this);
}
//#endregion
export { DisciplinePage as component };
