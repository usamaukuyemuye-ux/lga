import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, t as PageHeader } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { A as Pin, R as Megaphone, St as Calendar, W as LoaderCircle, at as ExternalLink, f as Trash2, k as Plus, t as X } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements-CpviGg49.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/announcements.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "School Announcements",
				description: "Official school circulars, notices, and administrative updates.",
				action: canManage && /* @__PURE__ */ (void 0)(Button, {
					onClick: () => setShowCreateForm((prev) => !prev),
					variant: showCreateForm ? "outline" : "default",
					size: "sm",
					className: "gap-1.5",
					children: showCreateForm ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(X, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 19
					}, this), " Close"] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 33
					}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 19
					}, this), " Post Announcement"] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 23
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 101,
					columnNumber: 147
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 101,
				columnNumber: 7
			}, this),
			canManage && showCreateForm && /* @__PURE__ */ (void 0)(Card, {
				className: "border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (void 0)(CardHeader, {
					className: "pb-3 border-b",
					children: /* @__PURE__ */ (void 0)(CardTitle, {
						className: "text-base font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (void 0)(Megaphone, { className: "size-4 text-primary" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 113,
							columnNumber: 15
						}, this), "New Announcement"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 112,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 111,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)(CardContent, {
					className: "space-y-4 pt-4",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (void 0)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: ["Title ", /* @__PURE__ */ (void 0)("span", {
									className: "text-destructive",
									children: "*"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 120,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)(Input, {
								placeholder: "e.g. End of Term Examination Schedule",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								className: "font-medium"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 122,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (void 0)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: ["Message Content ", /* @__PURE__ */ (void 0)("span", {
									className: "text-destructive",
									children: "*"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 127,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)(Textarea, {
								rows: 4,
								placeholder: "Write the announcement message details...",
								value: body,
								onChange: (e) => setBody(e.target.value),
								className: "leading-relaxed"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (void 0)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Action Button Label (Optional)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Input, {
									placeholder: "e.g. View Timetable",
									value: actionLabel,
									onChange: (e) => setActionLabel(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 137,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (void 0)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Action Link URL (Optional)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 140,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Input, {
									placeholder: "/timetable or https://...",
									value: actionUrl,
									onChange: (e) => setActionUrl(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 143,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "pt-1",
							children: /* @__PURE__ */ (void 0)("label", {
								className: "inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground",
								children: [
									/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: isPinned,
										onChange: (e) => setIsPinned(e.target.checked),
										className: "rounded border-input text-primary focus:ring-primary size-4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 149,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)(Pin, { className: "size-3.5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 150,
										columnNumber: 17
									}, this),
									"Pin to the top of noticeboard"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 148,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 147,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex justify-end gap-2 pt-2 border-t",
							children: [/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setShowCreateForm(false),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 156,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)(Button, {
								onClick: () => add.mutate(),
								disabled: !title.trim() || !body.trim() || add.isPending,
								size: "sm",
								className: "gap-2",
								children: [add.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 160,
									columnNumber: 35
								}, this), "Publish Announcement"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 110,
				columnNumber: 39
			}, this),
			isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-5 animate-spin text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Loading announcements..." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 170,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 168,
				columnNumber: 20
			}, this) : announcementsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "border-dashed py-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "flex flex-col items-center justify-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { className: "size-8 text-muted-foreground/50" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 173,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-semibold text-foreground",
							children: "No announcements posted yet"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground max-w-sm",
							children: "School circulars and announcements will appear here once published."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 175,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 172,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 171,
				columnNumber: 51
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: announcementsList.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: cn("transition-all", item.is_pinned && "border-primary/40 shadow-xs bg-card/60"),
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-foreground",
												children: item.author_name || "School Administration"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 185,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 188,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "size-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 190,
													columnNumber: 25
												}, this), fmtDate(item.created_at)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 189,
												columnNumber: 23
											}, this),
											item.is_pinned && /* @__PURE__ */ (void 0)("span", {
												className: "inline-flex items-center gap-1 text-[11px] font-semibold text-primary ml-1",
												children: [/* @__PURE__ */ (void 0)(Pin, { className: "size-3 fill-primary text-primary" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 194,
													columnNumber: 27
												}, this), " Pinned"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 193,
												columnNumber: 42
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 184,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-base font-bold text-foreground pt-0.5",
										children: item.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 197,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 183,
									columnNumber: 19
								}, this), canManage && /* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-7 text-muted-foreground hover:text-destructive shrink-0",
									title: "Delete announcement",
									onClick: () => remove.mutate(item.id),
									children: /* @__PURE__ */ (void 0)(Trash2, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 23
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 200,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 182,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed",
								children: item.body
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 205,
								columnNumber: 17
							}, this),
							item.action_label && item.action_url && /* @__PURE__ */ (void 0)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (void 0)(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									className: "text-xs h-8 gap-1.5",
									children: /* @__PURE__ */ (void 0)("a", {
										href: item.action_url,
										target: "_blank",
										rel: "noreferrer",
										children: [item.action_label, /* @__PURE__ */ (void 0)(ExternalLink, { className: "size-3 ml-0.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 213,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 211,
										columnNumber: 23
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 209,
								columnNumber: 58
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 181,
						columnNumber: 15
					}, this)
				}, item.id, false, {
					fileName: _jsxFileName,
					lineNumber: 180,
					columnNumber: 42
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 179,
				columnNumber: 19
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 100,
		columnNumber: 10
	}, this);
}
//#endregion
export { AnnouncementsPage as component };
