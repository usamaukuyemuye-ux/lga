import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { o as fetchClasses, s as fetchStudents, t as PageHeader } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { D as Printer } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as SchoolLogo } from "./logo-DWjWTi6G.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-3K9cxMoz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function CardsPage() {
	const [classFilter, setClassFilter] = (0, import_react.useState)("all");
	const [qrs, setQrs] = (0, import_react.useState)({});
	const { data: students } = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents
	});
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const list = (students ?? []).filter((s) => classFilter === "all" || s.class_id === classFilter);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const out = {};
			for (const s of list) out[s.id] = await import_lib.toDataURL(s.qr_token, {
				margin: 1,
				width: 220
			});
			if (active) setQrs(out);
		})();
		return () => {
			active = false;
		};
	}, [students, classFilter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Student ID Cards & QR codes",
			description: "Every student has a unique QR code. Print the cards and hand them out.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => window.print(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Print cards"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 print:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: classFilter,
				onValueChange: setClassFilter,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All classes"
				}), (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: c.id,
					children: c.name
				}, c.id))] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 px-4 py-2.5 text-primary-foreground",
					style: { background: "var(--gradient-brand)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold tracking-tight uppercase",
						children: "Little Gems Academy"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex gap-4 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-lg font-bold",
							children: s.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-2 space-y-1 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "font-medium text-foreground",
										children: "ID:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono",
										children: s.student_code
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "font-medium text-foreground",
										children: "Class:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: s.classes?.name ?? "—" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "font-medium text-foreground",
										children: "Gender:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "capitalize",
										children: s.gender
									})]
								})
							]
						})]
					}), qrs[s.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qrs[s.id],
						alt: `QR code for ${s.full_name}`,
						className: "size-28 rounded-lg border bg-card p-1"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-28 animate-pulse rounded-lg bg-muted" })]
				})]
			}, s.id)), !list.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No students in this class yet."
			})]
		})
	] });
}
//#endregion
export { CardsPage as component };
