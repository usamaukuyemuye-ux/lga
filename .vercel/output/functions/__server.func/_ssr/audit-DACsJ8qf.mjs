import { t as supabase } from "./client-CNmXIlzH.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, l as fmtTime, t as PageHeader } from "./school-D7opOoI2.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-DACsJ8qf.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/audit.tsx?tsr-split=component";
function AuditPage() {
	const { data } = useQuery({
		queryKey: ["audit"],
		queryFn: async () => {
			const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(300);
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "System activity logs",
		description: "Who did what, and when."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 22,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
		className: "overflow-x-auto p-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "When" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 28,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "User" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Action" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 30,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Entity" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 31,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Details" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 17
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 15
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 13
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [(data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
				className: "whitespace-nowrap text-sm",
				children: [
					fmtDate(l.created_at),
					" ",
					fmtTime(l.created_at)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 37,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: l.user_name ?? "—" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 40,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
				className: "font-mono text-xs",
				children: l.action
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 41,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: l.entity ?? "—" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
				className: "max-w-xs truncate text-xs text-muted-foreground",
				children: JSON.stringify(l.details)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 43,
				columnNumber: 19
			}, this)
		] }, l.id, true, {
			fileName: _jsxFileName,
			lineNumber: 36,
			columnNumber: 38
		}, this)), !data?.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
			colSpan: 5,
			className: "text-center text-muted-foreground",
			children: "No activity recorded yet."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 19
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 47,
			columnNumber: 33
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 35,
			columnNumber: 13
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 25,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 24,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 23,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 21,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuditPage as component };
