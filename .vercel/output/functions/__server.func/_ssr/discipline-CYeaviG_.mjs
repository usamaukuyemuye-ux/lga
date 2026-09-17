import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, d as todayISO, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { $ as FileText, D as Printer, G as ListFilter, J as Info, St as Calendar, Z as GraduationCap, _ as ShieldAlert, b as Search, et as FileSpreadsheet, f as Trash2, ft as Clock, ht as CircleAlert, i as User, k as Plus, m as Sparkles, mt as CircleCheck, s as UserCheck, st as Download, u as TriangleAlert, vt as Check, y as Send } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as dispatchLocalNotification } from "./device-notifications-BMIcetfI.mjs";
import { t as Route } from "./discipline-CegHUKG_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discipline-CYeaviG_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }), isParentView ? "Select Child's Discipline Report" : "Student Discipline Record"]
					}), students.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-2 pt-1",
						children: students.map((s) => {
							const isSelected = s.id === currentStudent?.id;
							const childPending = incidents.filter((inc) => inc.student_id === s.id && !inc.parent_acknowledged).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSelectStudent(s.id),
								className: cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer", isSelected ? "bg-primary text-primary-foreground border-primary shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border-border"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.full_name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-[10px] px-1 rounded", isSelected ? "bg-primary-foreground/20 text-white" : "text-muted-foreground"),
										children: s.classes?.name || s.class_name || "Class"
									}),
									childPending > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-amber-400 animate-pulse" })
								]
							}, s.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-bold text-base text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentStudent?.full_name || "Student" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs font-normal text-muted-foreground",
							children: [
								"(",
								currentStudent?.student_code,
								")"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleExportReportPdf,
						disabled: !currentStudent,
						className: "gap-1.5 text-xs h-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export PDF Report"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => window.print(),
						className: "gap-1.5 text-xs h-8 hidden sm:inline-flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " Print"]
					})]
				})]
			}),
			currentStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-t-4 border-t-primary shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20",
								children: currentStudent.full_name.charAt(0).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-base text-foreground",
										children: currentStudent.full_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] font-mono",
										children: currentStudent.student_code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: currentStudent.classes?.name || currentStudent.class_name || "Assigned Class"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Guardian:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: currentStudent.parent_name || currentStudent.parent_email || "Registered Parent"
									})
								] }), currentStudent.parent_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· Phone: ", currentStudent.parent_phone] })]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: cn("text-xs font-semibold px-2.5 py-1", standingMeta.badgeClass),
								children: [
									standingMeta.color === "emerald" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 mr-1" }),
									standingMeta.color === "amber" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3 mr-1" }),
									standingMeta.color === "rose" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3 mr-1" }),
									standingMeta.label
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground mt-1 max-w-xs md:text-right",
								children: standingMeta.description
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-muted/20 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground block",
										children: "Total Disciplinary Actions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-bold mt-0.5 text-foreground",
										children: studentAllIncidents.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: severityCounts.pending > 0 ? `${severityCounts.pending} awaiting parent review` : "All notices acknowledged"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-500/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-semibold text-purple-700 dark:text-purple-300",
											children: "Conduct Actions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5 text-purple-600 dark:text-purple-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-bold mt-0.5 text-purple-700 dark:text-purple-300",
										children: categoryCounts.Conduct
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Behavior & classroom respect"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-semibold text-amber-700 dark:text-amber-300",
											children: "Punctuality Notices"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-amber-600 dark:text-amber-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-bold mt-0.5 text-amber-700 dark:text-amber-300",
										children: categoryCounts.Punctuality
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Arrival time & attendance"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-500/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-semibold text-slate-700 dark:text-slate-300",
											children: "Other Notices"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-slate-600 dark:text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-bold mt-0.5 text-slate-700 dark:text-slate-300",
										children: categoryCounts.Other
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Uniform, materials, homework"
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0",
						children: [
							"All",
							"Conduct",
							"Punctuality",
							"Other"
						].map((cat) => {
							const isSelected = selectedCategory === cat;
							const count = categoryCounts[cat];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedCategory(cat),
								className: cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer", isSelected ? "bg-foreground text-background shadow-xs" : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"),
								children: [
									cat === "Conduct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5" }),
									cat === "Punctuality" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
									cat === "Other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat === "All" ? "All Categories" : cat }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: cn("text-[10px] px-1.5 py-0 rounded-full h-4", isSelected ? "bg-background/20 text-background font-bold" : "bg-muted text-foreground"),
										children: count
									})
								]
							}, cat);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-44",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Search notes...",
								value: feedSearch,
								onChange: (e) => setFeedSearch(e.target.value),
								className: "w-full pl-8 pr-2.5 py-1 text-xs rounded-md border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedSeverity,
							onValueChange: setSelectedSeverity,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 text-xs w-36",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Severity" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Severities"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "minor",
									children: "Minor Notice"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "moderate",
									children: "Moderate Warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "major",
									children: "Major Infraction"
								})
							] })]
						})]
					})]
				}), filteredFeed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-dashed py-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-sm text-foreground",
									children: studentAllIncidents.length === 0 ? "Exemplary Conduct Standing" : "No Records in this Filter"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-md mx-auto",
									children: studentAllIncidents.length === 0 ? `${currentStudent?.full_name || "Student"} has zero disciplinary actions recorded on their profile. Keep up the wonderful conduct!` : `No disciplinary entries found matching category "${selectedCategory}" with selected filters.`
								})]
							}),
							studentAllIncidents.length > 0 && selectedCategory !== "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setSelectedCategory("All");
									setSelectedSeverity("all");
									setFeedSearch("");
								},
								className: "text-xs h-8",
								children: "Clear Filters"
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs font-semibold text-muted-foreground px-1 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Showing ",
							filteredFeed.length,
							" ",
							filteredFeed.length === 1 ? "Disciplinary Action" : "Disciplinary Actions"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-normal",
							children: ["Category: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedCategory })]
						})]
					}), filteredFeed.map((incident) => {
						const primaryCat = normalizeToPrimaryCategory(incident.category);
						const severityMeta = SEVERITY_CONFIG$1[incident.severity] || SEVERITY_CONFIG$1.minor;
						const isPending = !incident.parent_acknowledged;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("rounded-xl border p-4 text-xs transition-all space-y-3", isPending ? incident.severity === "major" ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs" : "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs" : "bg-card shadow-xs"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-2 border-b pb-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "secondary",
													className: cn("text-[11px] font-semibold gap-1", primaryCat === "Conduct" && "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300", primaryCat === "Punctuality" && "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300", primaryCat === "Other" && "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300"),
													children: [
														primaryCat === "Conduct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3" }),
														primaryCat === "Punctuality" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
														primaryCat === "Other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3" }),
														incident.category
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: cn("text-[10px] font-semibold uppercase", severityMeta.badgeColor),
													children: severityMeta.label
												}),
												incident.parent_notified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-emerald-700 dark:text-emerald-300 font-medium inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-2.5" }), " Dispatched to Parent"]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 font-medium text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3 text-muted-foreground" }), fmtDate(incident.incident_date)]
												}),
												incident.incident_time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["at ", incident.incident_time] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"· Logged by ",
													incident.reported_by_name || "Teacher",
													" (",
													incident.reported_by_role || "Staff",
													")"
												] })
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isPending ? onAcknowledge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs",
										onClick: () => onAcknowledge(incident),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Acknowledge & Sign"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-[11px] font-semibold border border-emerald-500/30",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-600" }), " Acknowledged by Parent"]
										}), incident.parent_acknowledged_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: fmtDate(incident.parent_acknowledged_at)
										})]
									}) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block",
										children: "Teacher Notes & Incident Observation:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground leading-relaxed bg-background/60 p-2.5 rounded-lg border text-xs",
										children: incident.description
									})]
								}),
								incident.action_taken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block",
										children: "Corrective Guidance & Action Taken:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-foreground bg-muted/40 p-2.5 rounded-lg border border-border/80 flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: incident.action_taken })]
									})]
								}),
								incident.parent_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-dashed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Parent Response Note: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "italic",
										children: [
											"\"",
											incident.parent_notes,
											"\""
										]
									})]
								}),
								isPending && isParentView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-950 dark:text-amber-200 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Please review the teacher's note above and confirm you have addressed it with ",
											incident.student_name,
											"."
										] })]
									}), onAcknowledge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-6 text-[10px] font-semibold border-amber-400 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20",
										onClick: () => onAcknowledge(incident),
										children: "Sign Now"
									})]
								})
							]
						}, incident.id);
					})]
				})]
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: isParent ? "Student Conduct & Behavior Notices" : "Student Discipline & Conduct",
				description: isParent ? "View your child's conduct record, punctuality reports, and acknowledge school notices." : "Log behavioral incidents, conduct notes, punctuality warnings, and track parent acknowledgments.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportPdf,
							disabled: !filteredIncidents.length,
							className: "gap-1.5 text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportExcel,
							disabled: !filteredIncidents.length,
							className: "gap-1.5 text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5" }), " Excel"]
						}),
						canLog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								setFormDate(todayISO());
								setFormTimeVal(getCurrentTimeStr());
								setShowLogDialog(true);
							},
							size: "sm",
							className: "gap-1.5 text-xs h-9 font-semibold shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Log Incident"]
						})
					]
				})
			}),
			!isParent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 bg-card p-2 rounded-xl border shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveView("report"),
						className: cn("flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer", activeView === "report" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Student Discipline Report" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveView("register"),
						className: cn("flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer", activeView === "register" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, { className: "size-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discipline Register & Actions" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: cn("text-[10px] px-1.5 py-0 h-4", activeView === "register" ? "bg-primary-foreground/20 text-white" : ""),
								children: stats.total
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground hidden sm:block",
					children: activeView === "report" ? "Dedicated student conduct feed & printable report cards" : "Complete register with teacher notification actions & mobile scroll"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card p-3 rounded-xl border shadow-xs flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official Conduct & Guidance Notices for Your Children" })]
				}), stats.pendingAck > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "destructive",
					className: "text-xs px-2 py-0.5",
					children: [stats.pendingAck, " Pending Acknowledgment"]
				})]
			}),
			isParent || activeView === "report" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisciplineReport, {
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
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					isParent && stats.pendingAck > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-200 shadow-sm flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-semibold text-sm",
								children: [
									"Action Needed: ",
									stats.pendingAck,
									" Unreviewed Conduct",
									" ",
									stats.pendingAck === 1 ? "Notice" : "Notices"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80",
								children: [
									"The school has shared conduct or punctuality notes regarding your child. Please review the entries below and tap ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Acknowledge & Sign\"" }),
									" to confirm you have discussed them at home."
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 grid-cols-2 lg:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground block",
										children: "Total Incidents"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-bold mt-1 text-foreground",
										children: stats.total
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Cumulative logged records"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3.5 border-l-4 border-l-blue-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-blue-700 dark:text-blue-300 block",
										children: "Minor Notices"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-bold mt-1 text-blue-700 dark:text-blue-400",
										children: stats.minor
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Verbal reminders & advice"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3.5 border-l-4 border-l-amber-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-amber-700 dark:text-amber-300 block",
										children: "Moderate Warnings"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-bold mt-1 text-amber-700 dark:text-amber-400",
										children: stats.moderate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Punctuality & uniform issues"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3.5 border-l-4 border-l-rose-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-rose-700 dark:text-rose-300 block",
										children: "Major Infractions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-bold mt-1 text-rose-700 dark:text-rose-400",
										children: stats.major
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: "Requires disciplinary meeting"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3.5 border-l-4 border-l-emerald-500 col-span-2 lg:col-span-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-emerald-700 dark:text-emerald-300 block",
										children: "Parent Reviewed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl font-bold mt-1 text-emerald-700 dark:text-emerald-400",
										children: [stats.acknowledged, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground font-normal ml-1.5",
											children: [
												"(",
												stats.total ? Math.round(stats.acknowledged / stats.total * 100) : 100,
												"%)"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5 block",
										children: [stats.pendingAck, " pending acknowledgment"]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3 border-b bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-primary" }), isParent ? "My Children's Conduct Log" : "Schoolwide Disciplinary Register"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
								className: "text-xs",
								children: [
									filteredIncidents.length,
									" ",
									filteredIncidents.length === 1 ? "entry" : "entries",
									" found"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full md:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search student, description, code...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "pl-8 h-8 text-xs"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 pt-3 sm:grid-cols-2 md:grid-cols-4",
							children: [
								!isParent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filterClass,
									onValueChange: setFilterClass,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by class" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Classes"
									}), (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filterSeverity,
									onValueChange: setFilterSeverity,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by severity" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Severities"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "minor",
											children: "Minor Notices"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "moderate",
											children: "Moderate Warnings"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "major",
											children: "Major Infractions"
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filterCategory,
									onValueChange: setFilterCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by category" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Categories"
									}), CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: cat,
										children: cat
									}, cat))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filterAck,
									onValueChange: setFilterAck,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Parent review status" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pending",
											children: "Awaiting Parent Review"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "acknowledged",
											children: "Acknowledged by Parent"
										})
									] })]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-16 text-center text-xs text-muted-foreground",
							children: "Loading discipline register..."
						}) : filteredIncidents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-14 text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-9 text-emerald-500 mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-sm",
									children: "No Incidents Found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-sm mx-auto",
									children: search || filterCategory !== "all" || filterSeverity !== "all" ? "No conduct records match the applied search filters." : "All students are in good standing with exemplary conduct."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border overflow-hidden bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:hidden flex items-center justify-between px-3.5 py-2.5 bg-primary/10 border-b border-primary/20 text-xs text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Swipe table horizontally to reach the ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Send to Parent" }),
										" button"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground font-semibold shrink-0",
									children: "Scroll →"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto touch-pan-x scrollbar-thin",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
									className: "w-full min-w-[1080px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[120px]",
												children: "Date / Time"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[150px]",
												children: "Student"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[90px]",
												children: "Class"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[140px]",
												children: "Category & Severity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "min-w-[220px]",
												children: "Description & Action"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[120px]",
												children: "Reported By"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[130px]",
												children: "Parent Status"
											}),
											!isParent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[150px] whitespace-nowrap font-bold text-primary",
												children: "Send to Parent"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "text-right w-[80px]",
												children: "Action"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredIncidents.map((incident) => {
										const severityMeta = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.minor;
										isParent && parentChildIds.has(incident.student_id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "text-xs hover:bg-muted/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
													className: "whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-foreground",
														children: fmtDate(incident.incident_date)
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[11px] text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), incident.incident_time || "—"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-foreground",
													children: incident.student_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-[10px] text-primary",
													children: incident.student_code
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] font-normal",
													children: incident.class_name || "Unassigned"
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: cn("text-[10px] font-semibold", severityMeta.badgeColor),
														children: severityMeta.label
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] font-medium text-foreground",
														children: incident.category
													})]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1 text-xs max-w-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "leading-relaxed text-foreground",
														children: incident.description
													}), incident.action_taken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[11px] text-muted-foreground bg-muted/40 rounded px-2 py-1 border",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-semibold text-foreground",
															children: ["Action taken:", " "]
														}), incident.action_taken]
													})]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
													className: "whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-foreground",
														children: incident.reported_by_name || "Staff"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground capitalize",
														children: incident.reported_by_role || "Teacher"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: incident.parent_acknowledged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-600 dark:text-emerald-400" }), "Acknowledged"]
														}),
														incident.parent_acknowledged_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-muted-foreground",
															children: fmtDate(incident.parent_acknowledged_at)
														}),
														incident.parent_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-[10px] text-muted-foreground italic border-l-2 pl-1.5 mt-0.5",
															children: [
																"\"",
																incident.parent_notes,
																"\""
															]
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] font-normal border-amber-400 text-amber-700 dark:text-amber-300 bg-amber-500/10",
													children: "Awaiting Review"
												}) }),
												!isParent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "whitespace-nowrap",
													children: incident.parent_notified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col gap-1 items-start",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "outline",
															className: "text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 gap-1 py-0.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-emerald-600 dark:text-emerald-400" }), "Sent to Parent"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-[10px] text-muted-foreground flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: incident.last_sent_at ? fmtDate(incident.last_sent_at) : "Delivered" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																className: "text-[10px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-medium",
																title: "Resend disciplinary notice to parent",
																onClick: () => {
																	setIncidentToSend(incident);
																	setShowSendModal(true);
																},
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-2.5" }), " Resend"]
															})]
														})]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														className: "h-7 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs",
														onClick: () => {
															setIncidentToSend(incident);
															setShowSendModal(true);
														},
														disabled: sendToParentMutation.isPending && sendingIncidentId === incident.id,
														title: "Send disciplinary notice to parent",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), sendToParentMutation.isPending && sendingIncidentId === incident.id ? "Sending..." : "Send to Parent"]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "ghost",
															size: "sm",
															className: "h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground",
															onClick: () => {
																setSelectedReportStudentId(incident.student_id);
																setActiveView("report");
															},
															title: "Open student-specific Discipline Report",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }), " Report"]
														}), isParent && !incident.parent_acknowledged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "default",
															className: "h-7 text-xs font-semibold px-2.5 gap-1 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white",
															onClick: () => {
																setSelectedIncidentForAck(incident);
																setParentComment("");
																setShowAcknowledgeDialog(true);
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Acknowledge & Sign"]
														}) : canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "icon",
															className: "size-7 text-muted-foreground hover:text-destructive",
															title: "Delete entry",
															onClick: () => {
																if (confirm(`Remove incident record for ${incident.student_name}?`)) deleteMutation.mutate(incident.id);
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[11px] text-muted-foreground",
															children: "—"
														})]
													})
												})
											]
										}, incident.id);
									}) })]
								})
							})]
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showLogDialog,
				onOpenChange: setShowLogDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-primary" }), "Log Student Conduct Incident"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Record behavioral issues, punctuality warnings, or discipline notes for student profile and parent communication."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "1. Filter by Class (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedClassId,
											onValueChange: setSelectedClassId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All classes" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All Classes"
											}), (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c.id,
												children: c.name
											}, c.id))] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "2. Select Student *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formStudentId,
											onValueChange: setFormStudentId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs font-medium",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose student..." })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
												className: "max-h-56",
												children: [availableStudentsForForm.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: s.id,
													children: [
														s.full_name,
														" (",
														s.student_code,
														")"
													]
												}, s.id)), !availableStudentsForForm.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "none",
													disabled: true,
													children: "No students found in this class"
												})]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Category *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formCategory,
											onValueChange: setFormCategory,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: cat,
												children: cat
											}, cat)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Severity Level *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formSeverity,
											onValueChange: (v) => setFormSeverity(v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs font-semibold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "minor",
													children: "Minor Notice (Reminder)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "moderate",
													children: "Moderate Warning (Rule Break)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "major",
													children: "Major Infraction (Urgent)"
												})
											] })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Incident Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: formDate,
											onChange: (e) => setFormDate(e.target.value),
											className: "h-9 text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
											children: "Approximate Time"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "time",
											value: formTimeVal,
											onChange: (e) => setFormTimeVal(e.target.value),
											className: "h-9 text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
										children: "Incident Description *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										placeholder: "Detail what occurred, circumstances, or specific behavior observed...",
										value: formDescription,
										onChange: (e) => setFormDescription(e.target.value),
										className: "text-xs leading-relaxed"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
										children: "Action Taken by Staff"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Verbal guidance, counseling session, detention, parent conference requested...",
										value: formActionTaken,
										onChange: (e) => setFormActionTaken(e.target.value),
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border p-3 bg-muted/20 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-medium text-xs text-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 text-primary" }), "Notify Parent & Require Acknowledgement"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: "Sends an automated notification to the parent portal and parent email."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: formNotifyParent,
										onChange: (e) => setFormNotifyParent(e.target.checked),
										className: "size-4 rounded accent-primary cursor-pointer"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setShowLogDialog(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => logIncidentMutation.mutate(),
								disabled: !formStudentId || !formDescription.trim() || logIncidentMutation.isPending,
								size: "sm",
								className: "gap-1.5 font-semibold",
								children: logIncidentMutation.isPending ? "Recording..." : "Record Incident"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showAcknowledgeDialog,
				onOpenChange: setShowAcknowledgeDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-emerald-600 dark:text-emerald-400" }), "Acknowledge Conduct Notice"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Confirm you have reviewed this record and addressed the matter with your child."
						})] }),
						selectedIncidentForAck && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3 bg-muted/30 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: selectedIncidentForAck.student_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: selectedIncidentForAck.category
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-foreground/90 leading-relaxed",
										children: selectedIncidentForAck.description
									}),
									selectedIncidentForAck.action_taken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground pt-1 border-t",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Action: "
										}), selectedIncidentForAck.action_taken]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-muted-foreground uppercase tracking-wider text-[10px]",
									children: "Parent Response / Note (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									placeholder: "e.g. Discussed with child at home, agreed on behavior improvements...",
									value: parentComment,
									onChange: (e) => setParentComment(e.target.value),
									className: "text-xs leading-relaxed"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setShowAcknowledgeDialog(false);
									setSelectedIncidentForAck(null);
								},
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showSendModal,
				onOpenChange: setShowSendModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 text-primary" }), "Send Disciplinary Notice to Parent"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "This will dispatch an official notification directly to the parent's portal and email address requesting acknowledgment."
						})] }),
						incidentToSend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3 bg-muted/30 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground text-[11px]",
											children: "Student"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [
												incidentToSend.student_name,
												" (",
												incidentToSend.student_code,
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground text-[11px]",
											children: "Category & Severity"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: incidentToSend.category
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: cn("text-[10px] font-semibold", SEVERITY_CONFIG[incidentToSend.severity]?.badgeColor),
												children: SEVERITY_CONFIG[incidentToSend.severity]?.label || incidentToSend.severity
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground text-[11px]",
											children: "Date of Incident"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: [
												fmtDate(incidentToSend.incident_date),
												" at ",
												incidentToSend.incident_time || "—"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground text-[11px] block",
											children: "Observation & Notes:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-foreground/90 leading-relaxed bg-background/60 p-2 rounded border",
											children: incidentToSend.description
										})]
									}),
									incidentToSend.action_taken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Action taken: "
										}), incidentToSend.action_taken]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3 bg-blue-50/50 dark:bg-blue-950/20 text-blue-950 dark:text-blue-200 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-[11px] flex items-center gap-1.5 text-blue-700 dark:text-blue-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " What happens when you click Send:"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc pl-4 text-[10px] space-y-0.5 text-blue-900/80 dark:text-blue-300/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The notice appears in the parent's dedicated Discipline Report feed." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "An official notification record is created for parent review." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The parent receives a direct prompt to review and sign acknowledgment." })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setShowSendModal(false);
									setIncidentToSend(null);
								},
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									if (incidentToSend) sendToParentMutation.mutate(incidentToSend);
								},
								disabled: sendToParentMutation.isPending,
								size: "sm",
								className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), sendToParentMutation.isPending ? "Sending Notice..." : "Confirm & Send to Parent"]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { DisciplinePage as component };
