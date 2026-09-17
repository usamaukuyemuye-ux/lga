import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { o as fetchClasses, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { S as School, Z as GraduationCap, b as Search, f as Trash2, k as Plus, r as Users } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/classes-CA_hZgnb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Classes & Grades",
				description: "Administrators and secretaries can add new grade levels, nursery, primary, or secondary classes.",
				action: canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: dialogOpen,
					onOpenChange: setDialogOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Create new class"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "sm:max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create new class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Add a new grade or class section (e.g. Nursery 1, Primary 7, Senior 1)." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "class-name",
										children: "Class or Grade Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "class-name",
										placeholder: "e.g. Primary 7, Baby Class, Grade 4B",
										value: newClassName,
										onChange: (e) => setNewClassName(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && newClassName.trim()) add.mutate(newClassName);
										}
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => add.mutate(newClassName),
								disabled: !newClassName.trim() || add.isPending,
								children: "Save class"
							}) })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: classes?.length ?? 0
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Active classes created"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: totalLearners
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total enrolled students"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: avgClassSize
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Average students per class"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search classes...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-8 text-xs h-9"
						})]
					}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Quick add: e.g. Primary 7",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-9 text-xs w-48",
							onKeyDown: (e) => {
								if (e.key === "Enter" && name.trim()) add.mutate(name);
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "h-9 gap-1",
							onClick: () => add.mutate(name),
							disabled: !name.trim() || add.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Enrolled Students" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Allocation" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredClasses.map((c) => {
						const classStudents = (students ?? []).filter((s) => s.class_id === c.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-semibold text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: classStudents.length > 0 ? "secondary" : "outline",
								className: "text-xs",
								children: [
									classStudents.length,
									" student",
									classStudents.length === 1 ? "" : "s"
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "link",
									size: "sm",
									asChild: true,
									className: "p-0 h-auto text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/students",
										children: "View roster"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Delete class",
									onClick: () => remove.mutate(c.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "View only"
								})
							})
						] }, c.id);
					}), !filteredClasses.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: 4,
						className: "text-center py-8 text-muted-foreground text-sm",
						children: [
							"No classes found.",
							" ",
							canManage ? "Use the 'Create new class' button above to add one." : ""
						]
					}) })] })] })
				})]
			}) })
		]
	});
}
//#endregion
export { ClassesPage as component };
