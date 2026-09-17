import { t as supabase } from "./client-CNmXIlzH.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/school-DlWa798h.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, icon: Icon, tone = "primary", hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex items-center gap-4 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid size-11 shrink-0 place-items-center rounded-xl", {
					primary: "bg-primary/10 text-primary",
					success: "bg-success/15 text-success",
					destructive: "bg-destructive/10 text-destructive",
					warning: "bg-warning/20 text-warning-foreground",
					info: "bg-info/15 text-info",
					muted: "bg-muted text-muted-foreground"
				}[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-bold leading-tight",
						children: value
					}),
					hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: hint
					})
				]
			})]
		})
	});
}
function PageHeader({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: description
		})] }), action]
	});
}
function StatusBadge({ status }) {
	const norm = (status || "").toLowerCase();
	if (norm === "present") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-bold leading-none",
			children: "✓"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Present" })]
	});
	if (norm === "absent") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-bold leading-none",
			children: "✕"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Absent" })]
	});
	if (norm === "sick") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sick / Excused" })]
	});
	if (norm === "approved") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-bold leading-none",
			children: "✓"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approved" })]
	});
	if (norm === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending" })]
	});
	if (norm === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-bold leading-none",
			children: "✕"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rejected" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "capitalize",
			children: status
		})]
	});
}
function ParentStatusBadge({ status }) {
	return status === "present" || status === "late" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-bold leading-none",
			children: "✓"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Present" })]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-bold leading-none",
			children: "✕"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Absent" })]
	});
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
