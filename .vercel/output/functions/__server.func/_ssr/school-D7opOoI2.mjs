import { t as supabase } from "./client-CNmXIlzH.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/school-D7opOoI2.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/school/ui.tsx";
function StatCard({ label, value, icon: Icon, tone = "primary", hint }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
		className: "shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
			className: "flex items-center gap-4 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: cn("grid size-11 shrink-0 place-items-center rounded-xl", {
					primary: "bg-primary/10 text-primary",
					success: "bg-success/15 text-success",
					destructive: "bg-destructive/10 text-destructive",
					warning: "bg-warning/20 text-warning-foreground",
					info: "bg-info/15 text-info",
					muted: "bg-muted text-muted-foreground"
				}[tone]),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 30,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-2xl font-bold leading-tight",
						children: value
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 34,
						columnNumber: 11
					}, this),
					hint && /* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-muted-foreground",
						children: hint
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 20
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 28,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 27,
		columnNumber: 5
	}, this);
}
function PageHeader({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: title
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 54,
			columnNumber: 9
		}, this), description && /* @__PURE__ */ (void 0)("p", {
			className: "text-sm text-muted-foreground",
			children: description
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 55,
			columnNumber: 25
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 53,
			columnNumber: 7
		}, this), action]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 52,
		columnNumber: 5
	}, this);
}
function StatusBadge({ status }) {
	const norm = (status || "").toLowerCase();
	if (norm === "present") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm font-bold leading-none",
			children: "✓"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 68,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Present" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 69,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 67,
		columnNumber: 7
	}, this);
	if (norm === "absent") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm font-bold leading-none",
			children: "✕"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 77,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Absent" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 78,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 76,
		columnNumber: 7
	}, this);
	if (norm === "sick") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "size-1.5 rounded-full bg-amber-500 shrink-0" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 86,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Sick / Excused" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 87,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 85,
		columnNumber: 7
	}, this);
	if (norm === "approved") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm font-bold leading-none",
			children: "✓"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 95,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Approved" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 96,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 94,
		columnNumber: 7
	}, this);
	if (norm === "pending") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "size-1.5 rounded-full bg-amber-500 shrink-0" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 104,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Pending" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 105,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 103,
		columnNumber: 7
	}, this);
	if (norm === "rejected") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm font-bold leading-none",
			children: "✕"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 113,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Rejected" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 114,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 112,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "size-1.5 rounded-full bg-muted-foreground shrink-0" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 121,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "capitalize",
			children: status
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 122,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 120,
		columnNumber: 5
	}, this);
}
function ParentStatusBadge({ status }) {
	return status === "present" || status === "late" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm font-bold leading-none",
			children: "✓"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 132,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Present" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 133,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 131,
		columnNumber: 5
	}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm font-bold leading-none",
			children: "✕"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 137,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Absent" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 138,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 136,
		columnNumber: 5
	}, this);
}
var todayISO = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", {
	day: "2-digit",
	month: "long",
	year: "numeric"
});
var fmtTime = (d) => new Date(d).toLocaleTimeString("en-GB", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: true
});
async function fetchClasses() {
	const { data, error } = await supabase.from("classes").select("id, name, teacher_id").order("name");
	if (error) throw error;
	return data;
}
async function fetchStudents() {
	const { data, error } = await supabase.from("students").select("*, classes(name)").order("full_name");
	if (error) throw error;
	return data;
}
async function fetchAttendance(range) {
	let q = supabase.from("attendance").select("*, students(full_name, student_code, parent_email), classes(name)").order("attendance_date", { ascending: false }).order("created_at", { ascending: false }).limit(1e3);
	if (range?.from) q = q.gte("attendance_date", range.from);
	if (range?.to) q = q.lte("attendance_date", range.to);
	const { data, error } = await q;
	if (error) throw error;
	return data;
}
async function logAudit(action, entity, details = {}) {
	const { data } = await supabase.auth.getUser();
	const uid = data.user?.id;
	if (!uid) return;
	const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle();
	await supabase.from("audit_logs").insert({
		user_id: uid,
		user_name: prof?.full_name ?? data.user?.email ?? "",
		action,
		entity,
		details
	});
}
//#endregion
export { fetchAttendance as a, fmtDate as c, todayISO as d, StatusBadge as i, fmtTime as l, ParentStatusBadge as n, fetchClasses as o, StatCard as r, fetchStudents as s, PageHeader as t, logAudit as u };
