import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, d as todayISO, o as fetchClasses, r as StatCard, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { T as Receipt, f as Trash2, k as Plus, n as Wallet, r as Users, tt as FileDown } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as exportPdf } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-BsoDVcb6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"School fees",
	"Uniform",
	"Transport",
	"Meals",
	"Books",
	"Other"
];
var METHODS = [
	"cash",
	"bank",
	"mobile money",
	"cheque"
];
function FinancePage() {
	const qc = useQueryClient();
	const { role, profile, user } = useAuth();
	const canManage = role === "admin" || role === "finance";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [pickerClass, setPickerClass] = (0, import_react.useState)("all");
	const [pickerSearch, setPickerSearch] = (0, import_react.useState)("");
	const [browseClass, setBrowseClass] = (0, import_react.useState)("all");
	const [browseSearch, setBrowseSearch] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		student_id: "",
		amount: "",
		category: CATEGORIES[0],
		term: "Term 1",
		method: METHODS[0],
		reference: "",
		description: "",
		status: "paid",
		paid_on: todayISO()
	});
	const { data: students } = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents
	});
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: payments } = useQuery({
		queryKey: ["payments"],
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("*, students(full_name, student_code, classes(name))").order("paid_on", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const rows = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return (payments ?? []).filter((p) => !q || p.students?.full_name?.toLowerCase().includes(q) || p.students?.student_code?.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
	}, [payments, search]);
	const total = rows.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
	const pending = rows.filter((p) => p.status !== "paid").reduce((s, p) => s + Number(p.amount), 0);
	const pickerStudents = (0, import_react.useMemo)(() => {
		const q = pickerSearch.trim().toLowerCase();
		return (students ?? []).filter((s) => (pickerClass === "all" || s.class_id === pickerClass) && (!q || s.full_name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)));
	}, [
		students,
		pickerClass,
		pickerSearch
	]);
	const browseStudents = (0, import_react.useMemo)(() => {
		const q = browseSearch.trim().toLowerCase();
		return (students ?? []).filter((s) => (browseClass === "all" || s.class_id === browseClass) && (!q || s.full_name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)));
	}, [
		students,
		browseClass,
		browseSearch
	]);
	const paidByStudent = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of payments ?? []) {
			if (p.status !== "paid") continue;
			map.set(p.student_id, (map.get(p.student_id) ?? 0) + Number(p.amount));
		}
		return map;
	}, [payments]);
	const create = useMutation({
		mutationFn: async () => {
			if (!form.student_id) throw new Error("Select a student");
			const { error } = await supabase.from("payments").insert({
				student_id: form.student_id,
				amount: Number(form.amount || 0),
				category: form.category,
				term: form.term,
				method: form.method,
				reference: form.reference || null,
				description: form.description,
				status: form.status,
				paid_on: form.paid_on,
				recorded_by: user?.id ?? null,
				recorded_by_name: profile?.full_name ?? ""
			});
			if (error) throw error;
			await logAudit("payment.create", "payments", {
				student: form.student_id,
				amount: form.amount
			});
		},
		onSuccess: () => {
			toast.success("Payment recorded");
			setOpen(false);
			setForm({
				...form,
				amount: "",
				reference: "",
				description: ""
			});
			qc.invalidateQueries({ queryKey: ["payments"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("payments").delete().eq("id", id);
			if (error) throw error;
			await logAudit("payment.delete", "payments", { id });
		},
		onSuccess: () => {
			toast.success("Payment removed");
			qc.invalidateQueries({ queryKey: ["payments"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const head = [
		"Student",
		"Student ID",
		"Class",
		"Category",
		"Term",
		"Amount",
		"Method",
		"Status",
		"Date"
	];
	const body = rows.map((p) => [
		p.students?.full_name ?? "",
		p.students?.student_code ?? "",
		p.students?.classes?.name ?? "",
		p.category,
		p.term,
		`${p.currency} ${Number(p.amount).toLocaleString()}`,
		p.method,
		p.status,
		p.paid_on
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Finance & fees",
			description: "Record every payment made by parents. Parents see their own child's receipts instantly.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => exportPdf("School Payments", head, body, "payments"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " PDF"]
				}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Record payment"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-h-[85vh] max-w-2xl overflow-y-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Record a payment" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: pickerClass,
											onValueChange: (v) => {
												setPickerClass(v);
												setForm({
													...form,
													student_id: ""
												});
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All classes"
											}), (classes ?? []).map((cl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: cl.id,
												children: cl.name
											}, cl.id))] })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Find student" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Name or student number…",
											value: pickerSearch,
											onChange: (e) => setPickerSearch(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
											"Student (",
											pickerStudents.length,
											" found)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.student_id,
											onValueChange: (v) => setForm({
												...form,
												student_id: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a student" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: pickerStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: s.id,
												children: [
													s.full_name,
													" · ",
													s.student_code,
													" · ",
													s.classes?.name ?? "No class"
												]
											}, s.id)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (RWF)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: form.amount,
											onChange: (e) => setForm({
												...form,
												amount: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Paid on" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.paid_on,
											onChange: (e) => setForm({
												...form,
												paid_on: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.category,
											onValueChange: (v) => setForm({
												...form,
												category: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c,
												children: c
											}, c)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Term" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.term,
											onValueChange: (v) => setForm({
												...form,
												term: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
												"Term 1",
												"Term 2",
												"Term 3"
											].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: t,
												children: t
											}, t)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.method,
											onValueChange: (v) => setForm({
												...form,
												method: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: m,
												className: "capitalize",
												children: m
											}, m)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.status,
											onValueChange: (v) => setForm({
												...form,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
												"paid",
												"partial",
												"pending"
											].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												className: "capitalize",
												children: s
											}, s)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reference / receipt no." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.reference,
											onChange: (e) => setForm({
												...form,
												reference: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: form.description,
											onChange: (e) => setForm({
												...form,
												description: e.target.value
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => create.mutate(),
								disabled: create.isPending,
								children: "Save payment"
							}) })
						]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total collected",
					value: `RWF ${total.toLocaleString()}`,
					icon: Wallet,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Outstanding",
					value: `RWF ${pending.toLocaleString()}`,
					icon: Receipt,
					tone: "destructive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Payments recorded",
					value: rows.length,
					icon: Receipt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Students",
					value: students?.length ?? 0,
					icon: Users,
					tone: "info"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Students"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: browseClass,
						onValueChange: setBrowseClass,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All classes"
						}), (classes ?? []).map((cl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: cl.id,
							children: cl.name
						}, cl.id))] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "w-56",
						placeholder: "Name or student number…",
						value: browseSearch,
						onChange: (e) => setBrowseSearch(e.target.value)
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student number" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total paid" }),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [browseStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: s.full_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: s.student_code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.classes?.name ?? "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-semibold",
						children: ["RWF ", (paidByStudent.get(s.id) ?? 0).toLocaleString()]
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								setForm({
									...form,
									student_id: s.id
								});
								setPickerClass(s.class_id ?? "all");
								setPickerSearch("");
								setOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Payment"]
						})
					})
				] }, s.id)), !browseStudents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: canManage ? 5 : 4,
					className: "text-center text-muted-foreground",
					children: "No students match this class or search."
				}) })] })] })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Payment history"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "max-w-xs",
					placeholder: "Search student or category…",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Term" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Amount" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: p.students?.full_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs text-muted-foreground",
						children: p.students?.student_code
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.students?.classes?.name ?? "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.term }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-semibold",
						children: [
							p.currency,
							" ",
							Number(p.amount).toLocaleString()
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "capitalize",
						children: p.method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "capitalize",
						children: p.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: fmtDate(p.paid_on) }),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => remove.mutate(p.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
					}) })
				] }, p.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: canManage ? 9 : 8,
					className: "text-center text-muted-foreground",
					children: "No payments recorded yet."
				}) })] })] })
			})]
		})
	] });
}
//#endregion
export { FinancePage as component };
