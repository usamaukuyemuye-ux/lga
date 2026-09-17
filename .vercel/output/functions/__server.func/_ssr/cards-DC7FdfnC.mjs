import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { o as fetchClasses, s as fetchStudents, t as PageHeader } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { D as Printer } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as SchoolLogo } from "./logo-BzveDTdy.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-DC7FdfnC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var _jsxFileName = "/app/applet/src/routes/_authenticated/cards.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Student ID Cards & QR codes",
			description: "Every student has a unique QR code. Print the cards and hand them out.",
			action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				onClick: () => window.print(),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 13
				}, this), " Print cards"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 45,
				columnNumber: 148
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 45,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mb-4 print:hidden",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
				value: classFilter,
				onValueChange: setClassFilter,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
					className: "w-56",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
					value: "all",
					children: "All classes"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 13
				}, this), (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
					value: c.id,
					children: c.name
				}, c.id, false, {
					fileName: _jsxFileName,
					lineNumber: 56,
					columnNumber: 39
				}, this))] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 50,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 49,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [list.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2.5 px-4 py-2.5 text-primary-foreground",
					style: { background: "var(--gradient-brand)" },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, { size: "sm" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs font-bold tracking-tight uppercase",
						children: "Little Gems Academy"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 65,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "flex gap-4 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-lg font-bold",
							children: s.full_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 75,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", {
							className: "mt-2 space-y-1 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
										className: "font-medium text-foreground",
										children: "ID:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 78,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
										className: "font-mono",
										children: s.student_code
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 79,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 77,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
										className: "font-medium text-foreground",
										children: "Class:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 82,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", { children: s.classes?.name ?? "—" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 83,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 81,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
										className: "font-medium text-foreground",
										children: "Gender:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 86,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
										className: "capitalize",
										children: s.gender
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 87,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 15
					}, this), qrs[s.id] ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: qrs[s.id],
						alt: `QR code for ${s.full_name}`,
						className: "size-28 rounded-lg border bg-card p-1"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 28
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "size-28 animate-pulse rounded-lg bg-muted" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 139
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 73,
					columnNumber: 13
				}, this)]
			}, s.id, true, {
				fileName: _jsxFileName,
				lineNumber: 64,
				columnNumber: 24
			}, this)), !list.length && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm text-muted-foreground",
				children: "No students in this class yet."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 94,
				columnNumber: 26
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 63,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 44,
		columnNumber: 10
	}, this);
}
//#endregion
export { CardsPage as component };
