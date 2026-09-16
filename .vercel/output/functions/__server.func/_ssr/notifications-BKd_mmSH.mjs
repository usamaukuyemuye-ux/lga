import { t as supabase } from "./client-CNmXIlzH.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, l as fmtTime, t as PageHeader } from "./school-D7opOoI2.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { B as Mail } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-BKd_mmSH.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/notifications.tsx?tsr-split=component";
function NotificationsPage() {
	const { data: emailData, isLoading: loadingEmail } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const { data } = await supabase.from("notifications").select("*, students(full_name)").order("created_at", { ascending: false }).limit(200);
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 max-w-4xl",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Notifications Log",
			description: "Review attendance alert emails dispatched to parents."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 24,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-3",
			children: [(emailData ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-semibold text-sm",
						children: n.subject
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 19
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"To ",
							n.recipient_email,
							" · ",
							n.students?.full_name ?? "—"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 32,
						columnNumber: 19
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 30,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: n.status === "sent" ? "default" : "secondary",
							className: "capitalize text-[10px]",
							children: n.status
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 37,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								fmtDate(n.created_at),
								" · ",
								fmtTime(n.created_at)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 40,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 36,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", {
					className: "mt-3 whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs",
					children: n.body
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 45,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 28,
				columnNumber: 13
			}, this) }, n.id, false, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 37
			}, this)), !emailData?.length && !loadingEmail && /* @__PURE__ */ (void 0)(Card, {
				className: "p-8 text-center border-dashed",
				children: [
					/* @__PURE__ */ (void 0)(Mail, { className: "size-8 mx-auto text-muted-foreground mb-2" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("p", {
						className: "text-sm font-medium",
						children: "No email notifications dispatched yet."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
						children: "When attendance alerts are sent to parents, records will appear here."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 53,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 50,
				columnNumber: 49
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 23,
		columnNumber: 10
	}, this);
}
//#endregion
export { NotificationsPage as component };
