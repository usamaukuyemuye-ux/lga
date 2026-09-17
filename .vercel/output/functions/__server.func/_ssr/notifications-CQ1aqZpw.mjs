import { t as supabase } from "./client-CNmXIlzH.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, l as fmtTime, t as PageHeader } from "./school-DlWa798h.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { B as Mail } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CQ1aqZpw.js
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const { data: emailData, isLoading: loadingEmail } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const { data } = await supabase.from("notifications").select("*, students(full_name)").order("created_at", { ascending: false }).limit(200);
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Notifications Log",
			description: "Review attendance alert emails dispatched to parents."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [(emailData ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-sm",
						children: n.subject
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"To ",
							n.recipient_email,
							" · ",
							n.students?.full_name ?? "—"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: n.status === "sent" ? "default" : "secondary",
							className: "capitalize text-[10px]",
							children: n.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								fmtDate(n.created_at),
								" · ",
								fmtTime(n.created_at)
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs",
					children: n.body
				})]
			}) }, n.id)), !emailData?.length && !loadingEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8 text-center border-dashed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-8 mx-auto text-muted-foreground mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "No email notifications dispatched yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
						children: "When attendance alerts are sent to parents, records will appear here."
					})
				]
			})]
		})]
	});
}
//#endregion
export { NotificationsPage as component };
