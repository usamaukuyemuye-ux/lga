import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, t as PageHeader } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { A as Pin, R as Megaphone, St as Calendar, W as LoaderCircle, at as ExternalLink, f as Trash2, k as Plus, t as X } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements-CGDdYKdq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnnouncementsPage() {
	const { role, profile, user } = useAuth();
	const qc = useQueryClient();
	const canManage = role === "admin" || role === "secretary" || role === "owner" || role === "head_of_studies";
	const [showCreateForm, setShowCreateForm] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [isPinned, setIsPinned] = (0, import_react.useState)(false);
	const [actionLabel, setActionLabel] = (0, import_react.useState)("");
	const [actionUrl, setActionUrl] = (0, import_react.useState)("");
	const { data: rawAnnouncements, isLoading } = useQuery({
		queryKey: ["announcements"],
		queryFn: async () => {
			const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const add = useMutation({
		mutationFn: async () => {
			const { error, data } = await supabase.from("announcements").insert({
				title: title.trim(),
				body: body.trim(),
				is_pinned: isPinned,
				action_label: actionLabel.trim() || null,
				action_url: actionUrl.trim() || null,
				created_by: user?.id ?? null,
				author_name: profile?.full_name || "School Administration",
				author_role: role || "Staff"
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			setTitle("");
			setBody("");
			setActionLabel("");
			setActionUrl("");
			setIsPinned(false);
			setShowCreateForm(false);
			toast.success("Announcement posted successfully");
			qc.invalidateQueries({ queryKey: ["announcements"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("announcements").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Announcement removed");
			qc.invalidateQueries({ queryKey: ["announcements"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const announcementsList = (0, import_react.useMemo)(() => {
		return [...rawAnnouncements ?? []].sort((a, b) => {
			const aPinned = a.is_pinned ? 1 : 0;
			const bPinned = b.is_pinned ? 1 : 0;
			if (aPinned !== bPinned) return bPinned - aPinned;
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});
	}, [rawAnnouncements]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "School Announcements",
				description: "Official school circulars, notices, and administrative updates.",
				action: canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setShowCreateForm((prev) => !prev),
					variant: showCreateForm ? "outline" : "default",
					size: "sm",
					className: "gap-1.5",
					children: showCreateForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Close"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Post Announcement"] })
				})
			}),
			canManage && showCreateForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3 border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4 text-primary" }), "New Announcement"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: ["Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "e.g. End of Term Examination Schedule",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								className: "font-medium"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: ["Message Content ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								placeholder: "Write the announcement message details...",
								value: body,
								onChange: (e) => setBody(e.target.value),
								className: "leading-relaxed"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Action Button Label (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. View Timetable",
									value: actionLabel,
									onChange: (e) => setActionLabel(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Action Link URL (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "/timetable or https://...",
									value: actionUrl,
									onChange: (e) => setActionUrl(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: isPinned,
										onChange: (e) => setIsPinned(e.target.checked),
										className: "rounded border-input text-primary focus:ring-primary size-4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5 text-primary" }),
									"Pin to the top of noticeboard"
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setShowCreateForm(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => add.mutate(),
								disabled: !title.trim() || !body.trim() || add.isPending,
								size: "sm",
								className: "gap-2",
								children: [add.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Publish Announcement"]
							})]
						})
					]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading announcements..." })]
			}) : announcementsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-dashed py-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col items-center justify-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-8 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "No announcements posted yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm",
							children: "School circulars and announcements will appear here once published."
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: announcementsList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: cn("transition-all", item.is_pinned && "border-primary/40 shadow-xs bg-card/60"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: item.author_name || "School Administration"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }), fmtDate(item.created_at)]
											}),
											item.is_pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-[11px] font-semibold text-primary ml-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3 fill-primary text-primary" }), " Pinned"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-foreground pt-0.5",
										children: item.title
									})]
								}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-7 text-muted-foreground hover:text-destructive shrink-0",
									title: "Delete announcement",
									onClick: () => remove.mutate(item.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed",
								children: item.body
							}),
							item.action_label && item.action_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									className: "text-xs h-8 gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: item.action_url,
										target: "_blank",
										rel: "noreferrer",
										children: [item.action_label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3 ml-0.5" })]
									})
								})
							})
						]
					})
				}, item.id))
			})
		]
	});
}
//#endregion
export { AnnouncementsPage as component };
