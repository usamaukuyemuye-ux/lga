import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, d as todayISO, o as fetchClasses, r as StatCard, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { T as Receipt, f as Trash2, k as Plus, n as Wallet, r as Users, tt as FileDown } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { n as exportPdf } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-lmmhk3pu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/finance.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Finance & fees",
			description: "Record every payment made by parents. Parents see their own child's receipts instantly.",
			action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => exportPdf("School Payments", head, body, "payments"),
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileDown, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 15
					}, this), " PDF"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 155,
					columnNumber: 13
				}, this), canManage && /* @__PURE__ */ (void 0)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (void 0)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (void 0)(Button, { children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 161,
							columnNumber: 21
						}, this), " Record payment"] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 160,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 159,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)(DialogContent, {
						className: "max-h-[85vh] max-w-2xl overflow-y-auto",
						children: [
							/* @__PURE__ */ (void 0)(DialogHeader, { children: /* @__PURE__ */ (void 0)(DialogTitle, { children: "Record a payment" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 21
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 165,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Class" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 170,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Select, {
											value: pickerClass,
											onValueChange: (v) => {
												setPickerClass(v);
												setForm({
													...form,
													student_id: ""
												});
											},
											children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 179,
												columnNumber: 27
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 178,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [/* @__PURE__ */ (void 0)(SelectItem, {
												value: "all",
												children: "All classes"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 182,
												columnNumber: 27
											}, this), (classes ?? []).map((cl) => /* @__PURE__ */ (void 0)(SelectItem, {
												value: cl.id,
												children: cl.name
											}, cl.id, false, {
												fileName: _jsxFileName,
												lineNumber: 183,
												columnNumber: 54
											}, this))] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 181,
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
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Find student" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 190,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Input, {
											placeholder: "Name or student number…",
											value: pickerSearch,
											onChange: (e) => setPickerSearch(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 191,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 189,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: [
											"Student (",
											pickerStudents.length,
											" found)"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 194,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Select, {
											value: form.student_id,
											onValueChange: (v) => setForm({
												...form,
												student_id: v
											}),
											children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Select a student" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 200,
												columnNumber: 27
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 199,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: pickerStudents.map((s) => /* @__PURE__ */ (void 0)(SelectItem, {
												value: s.id,
												children: [
													s.full_name,
													" · ",
													s.student_code,
													" · ",
													s.classes?.name ?? "No class"
												]
											}, s.id, true, {
												fileName: _jsxFileName,
												lineNumber: 203,
												columnNumber: 52
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 202,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 195,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 193,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Amount (RWF)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 210,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Input, {
											type: "number",
											value: form.amount,
											onChange: (e) => setForm({
												...form,
												amount: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 211,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 209,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Paid on" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 217,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Input, {
											type: "date",
											value: form.paid_on,
											onChange: (e) => setForm({
												...form,
												paid_on: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 218,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 216,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Category" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 224,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Select, {
											value: form.category,
											onValueChange: (v) => setForm({
												...form,
												category: v
											}),
											children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 230,
												columnNumber: 27
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 229,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (void 0)(SelectItem, {
												value: c,
												children: c
											}, c, false, {
												fileName: _jsxFileName,
												lineNumber: 233,
												columnNumber: 48
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 232,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 225,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 223,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Term" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 240,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Select, {
											value: form.term,
											onValueChange: (v) => setForm({
												...form,
												term: v
											}),
											children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 246,
												columnNumber: 27
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 245,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [
												"Term 1",
												"Term 2",
												"Term 3"
											].map((t) => /* @__PURE__ */ (void 0)(SelectItem, {
												value: t,
												children: t
											}, t, false, {
												fileName: _jsxFileName,
												lineNumber: 249,
												columnNumber: 68
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 248,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 241,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 239,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Method" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 256,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Select, {
											value: form.method,
											onValueChange: (v) => setForm({
												...form,
												method: v
											}),
											children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 262,
												columnNumber: 27
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 261,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: METHODS.map((m) => /* @__PURE__ */ (void 0)(SelectItem, {
												value: m,
												className: "capitalize",
												children: m
											}, m, false, {
												fileName: _jsxFileName,
												lineNumber: 265,
												columnNumber: 45
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 264,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 257,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 255,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 272,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Select, {
											value: form.status,
											onValueChange: (v) => setForm({
												...form,
												status: v
											}),
											children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 278,
												columnNumber: 27
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 277,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [
												"paid",
												"partial",
												"pending"
											].map((s) => /* @__PURE__ */ (void 0)(SelectItem, {
												value: s,
												className: "capitalize",
												children: s
											}, s, false, {
												fileName: _jsxFileName,
												lineNumber: 281,
												columnNumber: 68
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 280,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 273,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 271,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Reference / receipt no." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 288,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Input, {
											value: form.reference,
											onChange: (e) => setForm({
												...form,
												reference: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 289,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 287,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (void 0)(Label, { children: "Description" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 295,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Textarea, {
											value: form.description,
											onChange: (e) => setForm({
												...form,
												description: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 296,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 294,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 168,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)(DialogFooter, { children: /* @__PURE__ */ (void 0)(Button, {
								onClick: () => create.mutate(),
								disabled: create.isPending,
								children: "Save payment"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 303,
								columnNumber: 21
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 302,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 164,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 158,
					columnNumber: 27
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 154,
				columnNumber: 152
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 154,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Total collected",
					value: `RWF ${total.toLocaleString()}`,
					icon: Wallet,
					tone: "success"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 312,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Outstanding",
					value: `RWF ${pending.toLocaleString()}`,
					icon: Receipt,
					tone: "destructive"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 313,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Payments recorded",
					value: rows.length,
					icon: Receipt
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 314,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Students",
					value: students?.length ?? 0,
					icon: Users,
					tone: "info"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 315,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 311,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
				className: "flex-row flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
					className: "text-base",
					children: "Students"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 320,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
						value: browseClass,
						onValueChange: setBrowseClass,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 324,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 323,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
							value: "all",
							children: "All classes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 327,
							columnNumber: 17
						}, this), (classes ?? []).map((cl) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
							value: cl.id,
							children: cl.name
						}, cl.id, false, {
							fileName: _jsxFileName,
							lineNumber: 328,
							columnNumber: 44
						}, this))] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 326,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 322,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						className: "w-56",
						placeholder: "Name or student number…",
						value: browseSearch,
						onChange: (e) => setBrowseSearch(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 333,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 321,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 319,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 340,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student number" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 341,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 342,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Total paid" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 343,
						columnNumber: 17
					}, this),
					canManage && /* @__PURE__ */ (void 0)(TableHead, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 344,
						columnNumber: 31
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 339,
					columnNumber: 15
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 338,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [browseStudents.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-medium",
						children: s.full_name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 349,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-mono text-xs",
						children: s.student_code
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 350,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: s.classes?.name ?? "—" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 351,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-semibold",
						children: ["RWF ", (paidByStudent.get(s.id) ?? 0).toLocaleString()]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 352,
						columnNumber: 19
					}, this),
					canManage && /* @__PURE__ */ (void 0)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (void 0)(Button, {
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
							children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 365,
								columnNumber: 25
							}, this), " Payment"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 356,
							columnNumber: 23
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 355,
						columnNumber: 33
					}, this)
				] }, s.id, true, {
					fileName: _jsxFileName,
					lineNumber: 348,
					columnNumber: 40
				}, this)), !browseStudents.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
					colSpan: canManage ? 5 : 4,
					className: "text-center text-muted-foreground",
					children: "No students match this class or search."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 370,
					columnNumber: 19
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 369,
					columnNumber: 42
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 347,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 337,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 336,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 318,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
				className: "flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
					className: "text-base",
					children: "Payment history"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 381,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					className: "max-w-xs",
					placeholder: "Search student or category…",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 382,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 380,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 388,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 389,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Category" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 390,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Term" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 391,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Amount" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 392,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Method" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 393,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 394,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Date" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 395,
						columnNumber: 17
					}, this),
					canManage && /* @__PURE__ */ (void 0)(TableHead, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 396,
						columnNumber: 31
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 387,
					columnNumber: 15
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 386,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [rows.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-medium",
						children: p.students?.full_name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 402,
						columnNumber: 21
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-mono text-xs text-muted-foreground",
						children: p.students?.student_code
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 403,
						columnNumber: 21
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 401,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: p.students?.classes?.name ?? "—" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 407,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: p.category }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 408,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: p.term }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 409,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "font-semibold",
						children: [
							p.currency,
							" ",
							Number(p.amount).toLocaleString()
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 410,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "capitalize",
						children: p.method
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 413,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
						className: "capitalize",
						children: p.status
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 414,
						columnNumber: 19
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: fmtDate(p.paid_on) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 415,
						columnNumber: 19
					}, this),
					canManage && /* @__PURE__ */ (void 0)(TableCell, { children: /* @__PURE__ */ (void 0)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => remove.mutate(p.id),
						children: /* @__PURE__ */ (void 0)(Trash2, { className: "size-4 text-destructive" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 418,
							columnNumber: 25
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 417,
						columnNumber: 23
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 416,
						columnNumber: 33
					}, this)
				] }, p.id, true, {
					fileName: _jsxFileName,
					lineNumber: 400,
					columnNumber: 30
				}, this)), !rows.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
					colSpan: canManage ? 9 : 8,
					className: "text-center text-muted-foreground",
					children: "No payments recorded yet."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 423,
					columnNumber: 19
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 422,
					columnNumber: 32
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 399,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 385,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 384,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 379,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 153,
		columnNumber: 10
	}, this);
}
//#endregion
export { FinancePage as component };
