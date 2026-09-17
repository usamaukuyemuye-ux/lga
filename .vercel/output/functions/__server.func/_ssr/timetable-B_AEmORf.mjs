import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { o as fetchClasses, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { f as Trash2, k as Plus } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DAYS } from "./timetable--Hv8MyTv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timetable-B_AEmORf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TimetablePage() {
	const qc = useQueryClient();
	const { role, user } = useAuth();
	const canManage = role === "admin" || role === "secretary" || role === "head_of_studies";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mine, setMine] = (0, import_react.useState)(role === "teacher");
	const [form, setForm] = (0, import_react.useState)({
		class_id: "",
		teacher_id: "",
		subject: "",
		day_of_week: "1",
		start_time: "08:00",
		end_time: "09:00",
		room: ""
	});
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: teachers } = useQuery({
		queryKey: ["teacher-profiles"],
		queryFn: async () => {
			const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
			const ids = (roles ?? []).map((r) => r.user_id);
			if (!ids.length) return [];
			const { data } = await supabase.from("profiles").select("id, full_name").in("id", ids).order("full_name");
			return data ?? [];
		}
	});
	const { data: lessons } = useQuery({
		queryKey: ["timetable"],
		queryFn: async () => {
			const { data, error } = await supabase.from("timetable").select("*, classes(name), profiles(full_name)").order("day_of_week").order("start_time");
			if (error) throw error;
			return data;
		}
	});
	const rows = (lessons ?? []).filter((l) => !mine || l.teacher_id === user?.id);
	const create = useMutation({
		mutationFn: async () => {
			if (!form.subject.trim()) throw new Error("Subject is required");
			const { error } = await supabase.from("timetable").insert({
				class_id: form.class_id || null,
				teacher_id: form.teacher_id || null,
				subject: form.subject.trim(),
				day_of_week: Number(form.day_of_week),
				start_time: form.start_time,
				end_time: form.end_time,
				room: form.room || null
			});
			if (error) throw error;
			await logAudit("timetable.create", "timetable", { subject: form.subject });
		},
		onSuccess: () => {
			toast.success("Lesson added to the timetable");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["timetable"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("timetable").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Lesson removed");
			qc.invalidateQueries({ queryKey: ["timetable"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Timetable",
		description: "Subject, time, class and room for every lesson. Administrators and secretaries set it up.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [role === "teacher" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setMine((m) => !m),
				children: mine ? "Show all lessons" : "Show only mine"
			}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add lesson"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add a lesson" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.subject,
									onChange: (e) => setForm({
										...form,
										subject: e.target.value
									}),
									placeholder: "Mathematics"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.class_id,
									onValueChange: (v) => setForm({
										...form,
										class_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Teacher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.teacher_id,
									onValueChange: (v) => setForm({
										...form,
										teacher_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select teacher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (teachers ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t.id,
										children: t.full_name
									}, t.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Day" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.day_of_week,
									onValueChange: (v) => setForm({
										...form,
										day_of_week: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DAYS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: String(i),
										children: d
									}, d)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Room" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.room,
									onChange: (e) => setForm({
										...form,
										room: e.target.value
									}),
									placeholder: "Block A - 12"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Starts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: form.start_time,
									onChange: (e) => setForm({
										...form,
										start_time: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ends" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: form.end_time,
									onChange: (e) => setForm({
										...form,
										end_time: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => create.mutate(),
						disabled: create.isPending,
						children: "Save lesson"
					}) })
				] })]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Weekly schedule"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Day" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Time" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Subject" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Teacher" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Room" }),
			canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: DAYS[l.day_of_week] ?? "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				className: "font-mono text-xs",
				children: [
					String(l.start_time).slice(0, 5),
					" – ",
					String(l.end_time).slice(0, 5)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: l.subject
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: l.classes?.name ?? "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: l.profiles?.full_name ?? "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: l.room ?? "—" }),
			canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				onClick: () => remove.mutate(l.id),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
			}) })
		] }, l.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: canManage ? 7 : 6,
			className: "text-center text-muted-foreground",
			children: "No lessons scheduled yet."
		}) })] })] })
	})] })] });
}
//#endregion
export { TimetablePage as component };
