import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as fetchAttendance, d as todayISO, l as fmtTime, o as fetchClasses, s as fetchStudents, t as PageHeader } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { D as Printer, et as FileSpreadsheet, tt as FileDown } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-B8hQ2UGL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAFF_REPORTS = [
	{
		value: "daily",
		label: "Daily attendance report"
	},
	{
		value: "weekly",
		label: "Weekly attendance report"
	},
	{
		value: "monthly",
		label: "Monthly attendance report"
	},
	{
		value: "student",
		label: "Student attendance report"
	},
	{
		value: "class",
		label: "Class attendance report"
	},
	{
		value: "teacher",
		label: "Teacher attendance report"
	},
	{
		value: "absentees",
		label: "Absentee list"
	},
	{
		value: "sick",
		label: "Sick student list"
	},
	{
		value: "late",
		label: "Late student list"
	},
	{
		value: "percentage",
		label: "Attendance percentage report"
	},
	{
		value: "religion",
		label: "Students by religion & gender"
	}
];
var PARENT_REPORTS = [
	{
		value: "daily",
		label: "Attendance of the Day (Daily)"
	},
	{
		value: "weekly",
		label: "Attendance of the Week (Weekly)"
	},
	{
		value: "monthly",
		label: "Attendance of the Month (Monthly)"
	},
	{
		value: "tuition_daily",
		label: "Tuition Fees of the Day (Daily)"
	},
	{
		value: "tuition_weekly",
		label: "Tuition Fees of the Week (Weekly)"
	},
	{
		value: "tuition_monthly",
		label: "Tuition Fees of the Month (Monthly)"
	}
];
function ReportsPage() {
	const { role, user } = useAuth();
	const isParent = role === "parent";
	const [type, setType] = (0, import_react.useState)("daily");
	const [from, setFrom] = (0, import_react.useState)((/* @__PURE__ */ new Date(Date.now() - 29 * 864e5)).toISOString().slice(0, 10));
	const [to, setTo] = (0, import_react.useState)(todayISO());
	const [classFilter, setClassFilter] = (0, import_react.useState)("all");
	const [childFilter, setChildFilter] = (0, import_react.useState)("all");
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses,
		enabled: !isParent
	});
	const { data: students } = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents,
		enabled: !isParent
	});
	const { data: all } = useQuery({
		queryKey: [
			"attendance",
			from,
			to
		],
		queryFn: () => fetchAttendance({
			from,
			to
		})
	});
	const { data: myChildren } = useQuery({
		queryKey: ["parent-my-children-reports", user?.id],
		enabled: isParent && !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id, full_name, student_code, class_id").eq("parent_id", user.id).order("full_name");
			return data ?? [];
		}
	});
	const { data: myPayments } = useQuery({
		queryKey: [
			"parent-payments-reports",
			user?.id,
			from,
			to
		],
		enabled: isParent && !!user?.id,
		queryFn: async () => {
			const childIds = (myChildren ?? []).map((c) => c.id);
			if (!childIds.length) return [];
			const { data } = await supabase.from("payments").select("*, students(full_name, student_code)").in("student_id", childIds).gte("paid_on", from).lte("paid_on", to).order("paid_on", { ascending: false });
			return data ?? [];
		}
	});
	const records = (0, import_react.useMemo)(() => {
		let r = all ?? [];
		if (isParent) {
			const childIds = (myChildren ?? []).map((c) => c.id);
			r = r.filter((x) => childIds.includes(x.student_id));
			if (childFilter !== "all") r = r.filter((x) => x.student_id === childFilter);
		} else if (classFilter !== "all") r = r.filter((x) => x.class_id === classFilter);
		return r;
	}, [
		all,
		isParent,
		myChildren,
		childFilter,
		classFilter
	]);
	const feeRecords = (0, import_react.useMemo)(() => {
		if (!isParent) return [];
		let pList = myPayments ?? [];
		if (childFilter !== "all") pList = pList.filter((p) => p.student_id === childFilter);
		return pList;
	}, [
		isParent,
		myPayments,
		childFilter
	]);
	const { title, head, rows } = (0, import_react.useMemo)(() => {
		const toParentStatus = (s) => s === "present" || s === "late" ? "Present" : "Absent";
		if (isParent) switch (type) {
			case "daily": return {
				title: "Daily Attendance Report (My Children)",
				head: [
					"Student",
					"Student ID",
					"Date",
					"Status",
					"Arrival Time",
					"Departure Time"
				],
				rows: records.map((r) => [
					r.students?.full_name ?? "Child",
					r.students?.student_code ?? "—",
					r.attendance_date,
					toParentStatus(r.status),
					r.arrival_time ? fmtTime(r.arrival_time) : "—",
					r.departure_time ? fmtTime(r.departure_time) : "On campus"
				])
			};
			case "weekly": {
				const weekMap = /* @__PURE__ */ new Map();
				records.forEach((r) => {
					const d = new Date(r.attendance_date);
					const start = new Date(d);
					start.setDate(d.getDate() - d.getDay());
					const weekStr = `Week of ${start.toISOString().slice(0, 10)}`;
					const studentName = r.students?.full_name ?? "Child";
					const key = `${weekStr}|${studentName}`;
					const cur = weekMap.get(key) ?? {
						week: weekStr,
						student: studentName,
						present: 0,
						absent: 0
					};
					if (r.status === "present" || r.status === "late") cur.present += 1;
					else cur.absent += 1;
					weekMap.set(key, cur);
				});
				return {
					title: "Weekly Attendance Report (My Children)",
					head: [
						"Week",
						"Student",
						"Present Days",
						"Absent Days",
						"Total Records",
						"Rate %"
					],
					rows: [...weekMap.values()].map((v) => {
						const total = v.present + v.absent;
						return [
							v.week,
							v.student,
							v.present,
							v.absent,
							total,
							total ? Math.round(v.present / total * 100) : 0
						];
					})
				};
			}
			case "monthly": {
				const monthMap = /* @__PURE__ */ new Map();
				records.forEach((r) => {
					const monthStr = r.attendance_date.slice(0, 7);
					const studentName = r.students?.full_name ?? "Child";
					const key = `${monthStr}|${studentName}`;
					const cur = monthMap.get(key) ?? {
						month: monthStr,
						student: studentName,
						present: 0,
						absent: 0
					};
					if (r.status === "present" || r.status === "late") cur.present += 1;
					else cur.absent += 1;
					monthMap.set(key, cur);
				});
				return {
					title: "Monthly Attendance Report (My Children)",
					head: [
						"Month",
						"Student",
						"Present Days",
						"Absent Days",
						"Total Records",
						"Rate %"
					],
					rows: [...monthMap.values()].map((v) => {
						const total = v.present + v.absent;
						return [
							v.month,
							v.student,
							v.present,
							v.absent,
							total,
							total ? Math.round(v.present / total * 100) : 0
						];
					})
				};
			}
			case "tuition_daily": return {
				title: "Daily Tuition Fees Report (My Children)",
				head: [
					"Student",
					"Student ID",
					"Payment Date",
					"Category",
					"Term",
					"Amount",
					"Method",
					"Status",
					"Receipt / Reference"
				],
				rows: feeRecords.map((p) => [
					p.students?.full_name ?? "Child",
					p.students?.student_code ?? "—",
					p.paid_on,
					p.category,
					p.term,
					`${p.currency ?? "RWF"} ${Number(p.amount).toLocaleString()}`,
					p.method,
					(p.status ?? "paid").toUpperCase(),
					p.reference ?? "—"
				])
			};
			case "tuition_weekly": {
				const weekFeeMap = /* @__PURE__ */ new Map();
				feeRecords.forEach((p) => {
					const d = new Date(p.paid_on);
					const start = new Date(d);
					start.setDate(d.getDate() - d.getDay());
					const weekStr = `Week of ${start.toISOString().slice(0, 10)}`;
					const studentName = p.students?.full_name ?? "Child";
					const key = `${weekStr}|${studentName}|${p.category}`;
					const cur = weekFeeMap.get(key) ?? {
						week: weekStr,
						student: studentName,
						category: p.category,
						total: 0,
						count: 0
					};
					cur.total += Number(p.amount);
					cur.count += 1;
					weekFeeMap.set(key, cur);
				});
				return {
					title: "Weekly Tuition Fees Report (My Children)",
					head: [
						"Week",
						"Student",
						"Fee Category",
						"Total Paid",
						"Payments Count"
					],
					rows: [...weekFeeMap.values()].map((v) => [
						v.week,
						v.student,
						v.category,
						`RWF ${v.total.toLocaleString()}`,
						v.count
					])
				};
			}
			case "tuition_monthly": {
				const monthFeeMap = /* @__PURE__ */ new Map();
				feeRecords.forEach((p) => {
					const monthStr = p.paid_on.slice(0, 7);
					const studentName = p.students?.full_name ?? "Child";
					const key = `${monthStr}|${studentName}|${p.category}`;
					const cur = monthFeeMap.get(key) ?? {
						month: monthStr,
						student: studentName,
						category: p.category,
						total: 0,
						count: 0
					};
					cur.total += Number(p.amount);
					cur.count += 1;
					monthFeeMap.set(key, cur);
				});
				return {
					title: "Monthly Tuition Fees Report (My Children)",
					head: [
						"Month",
						"Student",
						"Fee Category",
						"Total Paid",
						"Payments Count"
					],
					rows: [...monthFeeMap.values()].map((v) => [
						v.month,
						v.student,
						v.category,
						`RWF ${v.total.toLocaleString()}`,
						v.count
					])
				};
			}
			default: return {
				title: "Daily Attendance Report (My Children)",
				head: [
					"Student",
					"Student ID",
					"Date",
					"Status",
					"Arrival Time",
					"Departure Time"
				],
				rows: records.map((r) => [
					r.students?.full_name ?? "Child",
					r.students?.student_code ?? "—",
					r.attendance_date,
					toParentStatus(r.status),
					r.arrival_time ? fmtTime(r.arrival_time) : "—",
					r.departure_time ? fmtTime(r.departure_time) : "On campus"
				])
			};
		}
		const dayFmt = (d) => d;
		const group = (keyFn, label) => {
			const map = /* @__PURE__ */ new Map();
			records.forEach((r) => {
				const k = keyFn(r);
				const cur = map.get(k) ?? {
					present: 0,
					absent: 0,
					sick: 0,
					late: 0
				};
				cur[r.status] += 1;
				map.set(k, cur);
			});
			return {
				head: [
					label,
					"Present",
					"Absent",
					"Sick",
					"Late",
					"Total",
					"Rate %"
				],
				rows: [...map.entries()].map(([k, v]) => {
					const total = v.present + v.absent + v.sick + v.late;
					return [
						k,
						v.present,
						v.absent,
						v.sick,
						v.late,
						total,
						total ? Math.round(v.present / total * 100) : 0
					];
				})
			};
		};
		const listOf = (status, label) => ({
			head: [
				"Student",
				"Student ID",
				"Class",
				"Date",
				"Teacher"
			],
			rows: records.filter((r) => r.status === status).map((r) => [
				r.students?.full_name ?? "",
				r.students?.student_code ?? "",
				r.classes?.name ?? "",
				r.attendance_date,
				r.recorded_by_name ?? ""
			]),
			title: label
		});
		if (type === "religion") {
			const list = (students ?? []).filter((s) => classFilter === "all" || s.class_id === classFilter);
			const key = (r, g) => `${r}|${g}`;
			const map = /* @__PURE__ */ new Map();
			list.forEach((s) => {
				const k = key((s.religion ?? "non-muslim").toLowerCase(), (s.gender ?? "").toLowerCase());
				map.set(k, (map.get(k) ?? 0) + 1);
			});
			const rows = ["muslim", "non-muslim"].map((r) => {
				const boys = map.get(key(r, "male")) ?? 0;
				const girls = map.get(key(r, "female")) ?? 0;
				return [
					r === "muslim" ? "Muslim" : "Non-Muslim",
					boys,
					girls,
					boys + girls
				];
			});
			rows.push([
				"Total",
				rows.reduce((a, b) => a + b[1], 0),
				rows.reduce((a, b) => a + b[2], 0),
				rows.reduce((a, b) => a + b[3], 0)
			]);
			return {
				title: "Students by Religion & Gender",
				head: [
					"Religion",
					"Boys",
					"Girls",
					"Total"
				],
				rows
			};
		}
		switch (type) {
			case "daily": return {
				title: "Daily Attendance Report",
				...group((r) => dayFmt(r.attendance_date), "Date")
			};
			case "weekly": return {
				title: "Weekly Attendance Report",
				...group((r) => {
					const d = new Date(r.attendance_date);
					const start = new Date(d);
					start.setDate(d.getDate() - d.getDay());
					return `Week of ${start.toISOString().slice(0, 10)}`;
				}, "Week")
			};
			case "monthly": return {
				title: "Monthly Attendance Report",
				...group((r) => r.attendance_date.slice(0, 7), "Month")
			};
			case "student": return {
				title: "Student Attendance Report",
				...group((r) => r.students?.full_name ?? "Unknown", "Student")
			};
			case "class": return {
				title: "Class Attendance Report",
				...group((r) => r.classes?.name ?? "Unassigned", "Class")
			};
			case "teacher": return {
				title: "Teacher Attendance Report",
				...group((r) => r.recorded_by_name ?? "Unknown", "Teacher")
			};
			case "absentees": return {
				...listOf("absent", "Absentee List"),
				title: "Absentee List"
			};
			case "sick": return {
				...listOf("sick", "Sick Student List"),
				title: "Sick Student List"
			};
			case "late": return {
				...listOf("late", "Late Student List"),
				title: "Late Student List"
			};
			default: return {
				title: "Attendance Percentage Report",
				head: [
					"Student",
					"Class",
					"Present",
					"Total records",
					"Attendance %"
				],
				rows: (students ?? []).filter((s) => classFilter === "all" || s.class_id === classFilter).map((s) => {
					const rs = records.filter((r) => r.student_id === s.id);
					const present = rs.filter((r) => r.status === "present").length;
					return [
						s.full_name,
						s.classes?.name ?? "—",
						present,
						rs.length,
						rs.length ? Math.round(present / rs.length * 100) : 0
					];
				})
			};
		}
	}, [
		type,
		records,
		students,
		classFilter,
		isParent,
		feeRecords
	]);
	const fileName = title.toLowerCase().replace(/\s+/g, "-");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: isParent ? "My Children Reports" : "Reports",
		description: isParent ? "Generate attendance and tuition fee reports for your children with PDF or Excel export." : "Generate attendance reports and export them to PDF or Excel.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => exportPdf(title, head, rows, fileName),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " PDF"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => exportExcel(head, rows, fileName),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), " Excel"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Print"]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "print-area",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Report type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: type,
								onValueChange: setType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (isParent ? PARENT_REPORTS : STAFF_REPORTS).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r.value,
									children: r.label
								}, r.value)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "From" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: from,
								onChange: (e) => setFrom(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "To" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: to,
								onChange: (e) => setTo(e.target.value)
							})]
						}),
						isParent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Child" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: childFilter,
								onValueChange: setChildFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All my children"
								}), (myChildren ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [
										c.full_name,
										" (",
										c.student_code,
										")"
									]
								}, c.id))] })]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classFilter,
								onValueChange: setClassFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All classes"
								}), (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id))] })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							from,
							" to ",
							to,
							isParent ? childFilter !== "all" ? ` · ${(myChildren ?? []).find((c) => c.id === childFilter)?.full_name ?? "Child"}` : " · All my children" : classFilter !== "all" ? ` · ${(classes ?? []).find((c) => c.id === classFilter)?.name ?? ""}` : " · All classes"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: head.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: r.map((cell, j) => {
						const isPresent = cell === "Present";
						if (isPresent || cell === "Absent") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("inline-flex items-center gap-1.5 text-xs font-semibold", isPresent ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", isPresent ? "bg-emerald-500" : "bg-rose-500") }), cell]
						}) }, j);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: cell }, j);
					}) }, i)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: head.length,
						className: "text-center text-muted-foreground",
						children: "No data for this period."
					}) })] })] })
				})
			]
		})
	})] });
}
//#endregion
export { ReportsPage as component };
