import { t as supabase } from "./client-CNmXIlzH.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, l as fmtTime, t as PageHeader } from "./school-DlWa798h.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-Bnxr3pA9.js
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const { data } = useQuery({
		queryKey: ["audit"],
		queryFn: async () => {
			const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(300);
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "System activity logs",
		description: "Who did what, and when."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "overflow-x-auto p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "When" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "User" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Action" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Entity" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Details" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				className: "whitespace-nowrap text-sm",
				children: [
					fmtDate(l.created_at),
					" ",
					fmtTime(l.created_at)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: l.user_name ?? "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: l.action
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: l.entity ?? "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "max-w-xs truncate text-xs text-muted-foreground",
				children: JSON.stringify(l.details)
			})
		] }, l.id)), !data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 5,
			className: "text-center text-muted-foreground",
			children: "No activity recorded yet."
		}) })] })] })
	}) })] });
}
//#endregion
export { AuditPage as component };
