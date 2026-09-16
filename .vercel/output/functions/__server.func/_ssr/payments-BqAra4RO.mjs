import { t as supabase } from "./client-CNmXIlzH.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, r as StatCard, t as PageHeader } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { T as Receipt, n as Wallet, tt as FileDown } from "../_libs/lucide-react.mjs";
import { n as exportPdf } from "./export-OxObhwWT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-BqAra4RO.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/payments.tsx?tsr-split=component";
function MyPaymentsPage() {
	const { user } = useAuth();
	const { data } = useQuery({
		queryKey: ["my-payments", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data: children } = await supabase.from("students").select("id, full_name, student_code").eq("parent_id", user.id);
			const ids = (children ?? []).map((c) => c.id);
			if (!ids.length) return {
				children: children ?? [],
				payments: []
			};
			const { data: payments } = await supabase.from("payments").select("*, students(full_name, student_code)").in("student_id", ids).order("paid_on", { ascending: false });
			return {
				children: children ?? [],
				payments: payments ?? []
			};
		}
	});
	const payments = data?.payments ?? [];
	const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
	const due = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + Number(p.amount), 0);
	const head = [
		"Student",
		"Category",
		"Term",
		"Amount",
		"Method",
		"Status",
		"Date",
		"Receipt"
	];
	const body = payments.map((p) => [
		p.students?.full_name ?? "",
		p.category,
		p.term,
		`${p.currency} ${Number(p.amount).toLocaleString()}`,
		p.method,
		p.status,
		p.paid_on,
		p.reference ?? "—"
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "My payments",
			description: "Every fee payment the school finance office has recorded for your children.",
			action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				onClick: () => exportPdf("My Payments", head, body, "my-payments"),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileDown, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 13
				}, this), " PDF"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 46,
				columnNumber: 137
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Total paid",
					value: `RWF ${paid.toLocaleString()}`,
					icon: Wallet,
					tone: "success"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Outstanding",
					value: `RWF ${due.toLocaleString()}`,
					icon: Receipt,
					tone: "destructive"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Receipts",
					value: payments.length,
					icon: Receipt
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 50,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "text-base",
				children: "Payment history"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 58,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 57,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Category" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Term" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Amount" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Method" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Date" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Receipt" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 17
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 63,
					columnNumber: 15
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [payments.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-medium",
						children: p.students?.full_name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: p.category }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: p.term }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 78,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-semibold",
						children: [
							p.currency,
							" ",
							Number(p.amount).toLocaleString()
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "capitalize",
						children: p.method
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "capitalize",
						children: p.status
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: fmtDate(p.paid_on) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 84,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-mono text-xs",
						children: p.reference ?? "—"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 19
					}, this)
				] }, p.id, true, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 34
				}, this)), !payments.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
					colSpan: 8,
					className: "text-center text-muted-foreground",
					children: "No payments recorded yet."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 19
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 36
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 56,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 10
	}, this);
}
//#endregion
export { MyPaymentsPage as component };
