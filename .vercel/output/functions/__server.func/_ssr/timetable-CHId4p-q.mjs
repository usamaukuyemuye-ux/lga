import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { o as fetchClasses, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { f as Trash2, k as Plus } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as DAYS } from "./timetable-D6aNC_Sb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timetable-CHId4p-q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/timetable.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "Timetable",
		description: "Subject, time, class and room for every lesson. Administrators and secretaries set it up.",
		action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex gap-2",
			children: [role === "teacher" && /* @__PURE__ */ (void 0)(Button, {
				variant: "outline",
				onClick: () => setMine((m) => !m),
				children: mine ? "Show all lessons" : "Show only mine"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 116,
				columnNumber: 36
			}, this), canManage && /* @__PURE__ */ (void 0)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (void 0)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (void 0)(Button, { children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 21
					}, this), " Add lesson"] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 19
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 120,
					columnNumber: 17
				}, this), /* @__PURE__ */ (void 0)(DialogContent, { children: [
					/* @__PURE__ */ (void 0)(DialogHeader, { children: /* @__PURE__ */ (void 0)(DialogTitle, { children: "Add a lesson" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 127,
						columnNumber: 21
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Subject" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 131,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Input, {
									value: form.subject,
									onChange: (e) => setForm({
										...form,
										subject: e.target.value
									}),
									placeholder: "Mathematics"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 132,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 130,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Class" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Select, {
									value: form.class_id,
									onValueChange: (v) => setForm({
										...form,
										class_id: v
									}),
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Select class" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 144,
										columnNumber: 27
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 143,
										columnNumber: 25
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (void 0)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id, false, {
										fileName: _jsxFileName,
										lineNumber: 147,
										columnNumber: 53
									}, this)) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 146,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 139,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Teacher" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Select, {
									value: form.teacher_id,
									onValueChange: (v) => setForm({
										...form,
										teacher_id: v
									}),
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Select teacher" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 160,
										columnNumber: 27
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 159,
										columnNumber: 25
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: (teachers ?? []).map((t) => /* @__PURE__ */ (void 0)(SelectItem, {
										value: t.id,
										children: t.full_name
									}, t.id, false, {
										fileName: _jsxFileName,
										lineNumber: 163,
										columnNumber: 54
									}, this)) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 162,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 153,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Day" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 170,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Select, {
									value: form.day_of_week,
									onValueChange: (v) => setForm({
										...form,
										day_of_week: v
									}),
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 176,
										columnNumber: 27
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 175,
										columnNumber: 25
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: DAYS.map((d, i) => /* @__PURE__ */ (void 0)(SelectItem, {
										value: String(i),
										children: d
									}, d, false, {
										fileName: _jsxFileName,
										lineNumber: 179,
										columnNumber: 47
									}, this)) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 178,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 171,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 169,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Room" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 186,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Input, {
									value: form.room,
									onChange: (e) => setForm({
										...form,
										room: e.target.value
									}),
									placeholder: "Block A - 12"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 187,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 185,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Starts" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Input, {
									type: "time",
									value: form.start_time,
									onChange: (e) => setForm({
										...form,
										start_time: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 194,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 192,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Ends" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 200,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)(Input, {
									type: "time",
									value: form.end_time,
									onChange: (e) => setForm({
										...form,
										end_time: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 199,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (void 0)(DialogFooter, { children: /* @__PURE__ */ (void 0)(Button, {
						onClick: () => create.mutate(),
						disabled: create.isPending,
						children: "Save lesson"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 208,
						columnNumber: 21
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 207,
						columnNumber: 19
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 119,
				columnNumber: 27
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 115,
			columnNumber: 149
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 115,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
		className: "text-base",
		children: "Weekly schedule"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 218,
		columnNumber: 11
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 217,
		columnNumber: 9
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Day" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 224,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Time" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 225,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Subject" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 226,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 227,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Teacher" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 228,
				columnNumber: 17
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Room" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 229,
				columnNumber: 17
			}, this),
			canManage && /* @__PURE__ */ (void 0)(TableHead, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 230,
				columnNumber: 31
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 223,
			columnNumber: 15
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 222,
			columnNumber: 13
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [rows.map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: DAYS[l.day_of_week] ?? "—" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 235,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
				className: "font-mono text-xs",
				children: [
					String(l.start_time).slice(0, 5),
					" – ",
					String(l.end_time).slice(0, 5)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 236,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
				className: "font-medium",
				children: l.subject
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 239,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: l.classes?.name ?? "—" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 240,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: l.profiles?.full_name ?? "—" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 241,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: l.room ?? "—" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 242,
				columnNumber: 19
			}, this),
			canManage && /* @__PURE__ */ (void 0)(TableCell, { children: /* @__PURE__ */ (void 0)(Button, {
				variant: "ghost",
				size: "icon",
				onClick: () => remove.mutate(l.id),
				children: /* @__PURE__ */ (void 0)(Trash2, { className: "size-4 text-destructive" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 245,
					columnNumber: 25
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 244,
				columnNumber: 23
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 243,
				columnNumber: 33
			}, this)
		] }, l.id, true, {
			fileName: _jsxFileName,
			lineNumber: 234,
			columnNumber: 30
		}, this)), !rows.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
			colSpan: canManage ? 7 : 6,
			className: "text-center text-muted-foreground",
			children: "No lessons scheduled yet."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 250,
			columnNumber: 19
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 249,
			columnNumber: 32
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 233,
			columnNumber: 13
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 221,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 220,
		columnNumber: 9
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 216,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 114,
		columnNumber: 10
	}, this);
}
//#endregion
export { TimetablePage as component };
