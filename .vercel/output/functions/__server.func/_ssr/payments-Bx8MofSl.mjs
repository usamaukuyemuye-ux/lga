import { t as supabase } from "./client-CNmXIlzH.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, r as StatCard, t as PageHeader } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { T as Receipt, n as Wallet, tt as FileDown } from "../_libs/lucide-react.mjs";
import { n as exportPdf } from "./export-OxObhwWT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-Bx8MofSl.js
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My payments",
			description: "Every fee payment the school finance office has recorded for your children.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => exportPdf("My Payments", head, body, "my-payments"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " PDF"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total paid",
					value: `RWF ${paid.toLocaleString()}`,
					icon: Wallet,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Outstanding",
					value: `RWF ${due.toLocaleString()}`,
					icon: Receipt,
					tone: "destructive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Receipts",
					value: payments.length,
					icon: Receipt
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Payment history"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Term" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Amount" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Receipt" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: p.students?.full_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.term }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-semibold",
						children: [
							p.currency,
							" ",
							Number(p.amount).toLocaleString()
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "capitalize",
						children: p.method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "capitalize",
						children: p.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: fmtDate(p.paid_on) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: p.reference ?? "—"
					})
				] }, p.id)), !payments.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 8,
					className: "text-center text-muted-foreground",
					children: "No payments recorded yet."
				}) })] })] })
			})]
		})
	] });
}
//#endregion
export { MyPaymentsPage as component };
