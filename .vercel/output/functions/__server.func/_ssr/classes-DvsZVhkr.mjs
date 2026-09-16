import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { o as fetchClasses, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { S as School, Z as GraduationCap, b as Search, f as Trash2, k as Plus, r as Users } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/classes-DvsZVhkr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/classes.tsx?tsr-split=component";
function ClassesPage() {
	const qc = useQueryClient();
	const { role } = useAuth();
	const canManage = role === "admin" || role === "secretary";
	const [name, setName] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [newClassName, setNewClassName] = (0, import_react.useState)("");
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: students } = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents
	});
	const add = useMutation({
		mutationFn: async (className) => {
			const trimmed = className.trim();
			if (!trimmed) throw new Error("Please enter a class name");
			const { error } = await supabase.from("classes").insert({ name: trimmed });
			if (error) throw error;
			await logAudit("class.create", "classes", { name: trimmed });
		},
		onSuccess: () => {
			setName("");
			setNewClassName("");
			setDialogOpen(false);
			toast.success("Class created successfully");
			qc.invalidateQueries({ queryKey: ["classes"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const studentCount = (students ?? []).filter((s) => s.class_id === id).length;
			if (studentCount > 0) {
				if (!confirm(`This class has ${studentCount} student(s) enrolled. Delete anyway?`)) return;
			}
			const { error } = await supabase.from("classes").delete().eq("id", id);
			if (error) throw error;
			await logAudit("class.delete", "classes", { id });
		},
		onSuccess: () => {
			toast.success("Class deleted");
			qc.invalidateQueries({ queryKey: ["classes"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filteredClasses = (0, import_react.useMemo)(() => {
		return (classes ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
	}, [classes, search]);
	const totalLearners = students?.length ?? 0;
	const avgClassSize = (classes?.length ?? 0) > 0 ? Math.round(totalLearners / (classes?.length || 1)) : 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Classes & Grades",
				description: "Administrators and secretaries can add new grade levels, nursery, primary, or secondary classes.",
				action: canManage && /* @__PURE__ */ (void 0)(Dialog, {
					open: dialogOpen,
					onOpenChange: setDialogOpen,
					children: [/* @__PURE__ */ (void 0)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (void 0)(Button, {
							className: "gap-2",
							children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 19
							}, this), " Create new class"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(DialogContent, {
						className: "sm:max-w-md",
						children: [
							/* @__PURE__ */ (void 0)(DialogHeader, { children: [/* @__PURE__ */ (void 0)(DialogTitle, { children: "Create new class" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 102,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)(DialogDescription, { children: "Add a new grade or class section (e.g. Nursery 1, Primary 7, Senior 1)." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 103,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-3 py-2",
								children: /* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, {
										htmlFor: "class-name",
										children: "Class or Grade Name *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 109,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(Input, {
										id: "class-name",
										placeholder: "e.g. Primary 7, Baby Class, Grade 4B",
										value: newClassName,
										onChange: (e) => setNewClassName(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && newClassName.trim()) add.mutate(newClassName);
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 110,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 108,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 107,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(DialogFooter, { children: /* @__PURE__ */ (void 0)(Button, {
								onClick: () => add.mutate(newClassName),
								disabled: !newClassName.trim() || add.isPending,
								children: "Save class"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 118,
								columnNumber: 19
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 117,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 176
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 94,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "p-4 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "size-6" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-2xl font-bold",
							children: classes?.length ?? 0
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: "Active classes created"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 133,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 127,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "p-4 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "size-6" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-2xl font-bold",
							children: totalLearners
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total enrolled students"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 142,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 140,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 136,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "p-4 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "size-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "size-6" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 147,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 146,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-2xl font-bold",
							children: avgClassSize
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: "Average students per class"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 151,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 149,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 145,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 126,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 160,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							placeholder: "Search classes...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-8 text-xs h-9"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 161,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 159,
						columnNumber: 13
					}, this), canManage && /* @__PURE__ */ (void 0)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (void 0)(Input, {
							placeholder: "Quick add: e.g. Primary 7",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-9 text-xs w-48",
							onKeyDown: (e) => {
								if (e.key === "Enter" && name.trim()) add.mutate(name);
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 164,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)(Button, {
							size: "sm",
							className: "h-9 gap-1",
							onClick: () => add.mutate(name),
							disabled: !name.trim() || add.isPending,
							children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 170,
								columnNumber: 19
							}, this), " Add"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 169,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 163,
						columnNumber: 27
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 158,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class Name" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Enrolled Students" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 180,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Allocation" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 181,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
							className: "text-right",
							children: "Actions"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 19
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 17
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 177,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredClasses.map((c) => {
						const classStudents = (students ?? []).filter((s) => s.class_id === c.id);
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "font-semibold text-sm",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "size-4 text-muted-foreground" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 191,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: c.name }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 192,
										columnNumber: 27
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 189,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: classStudents.length > 0 ? "secondary" : "outline",
								className: "text-xs",
								children: [
									classStudents.length,
									" student",
									classStudents.length === 1 ? "" : "s"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 196,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "link",
									size: "sm",
									asChild: true,
									className: "p-0 h-auto text-xs",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/students",
										children: "View roster"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 202,
										columnNumber: 27
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 200,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-right",
								children: canManage ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Delete class",
									onClick: () => remove.mutate(c.id),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-4 text-destructive" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 29
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 206,
									columnNumber: 38
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground",
									children: "View only"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 208,
									columnNumber: 39
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 205,
								columnNumber: 23
							}, this)
						] }, c.id, true, {
							fileName: _jsxFileName,
							lineNumber: 188,
							columnNumber: 24
						}, this);
					}), !filteredClasses.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
						colSpan: 4,
						className: "text-center py-8 text-muted-foreground text-sm",
						children: [
							"No classes found.",
							" ",
							canManage ? "Use the 'Create new class' button above to add one." : ""
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 213,
						columnNumber: 21
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 212,
						columnNumber: 45
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 185,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 176,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 175,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 157,
				columnNumber: 9
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 156,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 93,
		columnNumber: 10
	}, this);
}
//#endregion
export { ClassesPage as component };
