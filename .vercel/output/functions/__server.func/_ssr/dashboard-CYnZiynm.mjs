import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as roleLabel, r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, n as ParentStatusBadge, r as StatCard, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { D as Printer, E as QrCode, M as Percent, Ot as Baby, R as Megaphone, S as School, T as Receipt, W as LoaderCircle, Z as GraduationCap, _ as ShieldAlert, a as UserX, b as Search, ct as DollarSign, d as TrendingUp, ft as Clock, g as ShieldCheck, k as Plus, mt as CircleCheck, p as Thermometer, pt as CircleX, r as Users, rt as FileChartColumnIncreasing, s as UserCheck, ut as CreditCard, v as Settings, wt as CalendarCheck, y as Send } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TabsTrigger, n as Tabs, r as TabsList, t as StudentQrModal } from "./student-qr-modal-Bm-lPn7q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CYnZiynm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/dashboard.tsx?tsr-split=component";
function AdminDashboard() {
	const { profile, user } = useAuth();
	useQueryClient();
	const today = todayISO();
	const [selectedStudentForQr, setSelectedStudentForQr] = (0, import_react.useState)(null);
	const [qrModalOpen, setQrModalOpen] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("gate");
	const [studentSearch, setStudentSearch] = (0, import_react.useState)("");
	const [classFilter, setClassFilter] = (0, import_react.useState)("all");
	const { data: adminData, isLoading } = useQuery({
		queryKey: ["admin-dashboard-data", today],
		queryFn: async () => {
			const [studentsRes, classesRes, rolesRes, attTodayRes, recentAttRes, staffTodayRes] = await Promise.all([
				supabase.from("students").select("id, full_name, student_code, class_id, gender, religion, date_of_birth, parent_name, parent_email, parent_phone, address, photo_url, qr_token, classes(name)").order("full_name", { ascending: true }),
				supabase.from("classes").select("id, name").order("name", { ascending: true }),
				supabase.from("user_roles").select("role"),
				supabase.from("attendance").select("id, status, student_id, arrival_time, departure_time").eq("attendance_date", today),
				supabase.from("attendance").select("id, status, arrival_time, departure_time, student_id, students(id, full_name, student_code, class_id, gender, religion, date_of_birth, parent_name, parent_email, parent_phone, address, photo_url, qr_token, classes(name)), classes(name)").eq("attendance_date", today).order("created_at", { ascending: false }).limit(10),
				supabase.from("staff_attendance").select("id, staff_name, status, arrival_time").eq("attendance_date", today)
			]);
			const totalStudents = studentsRes.data?.length ?? 0;
			const roles = rolesRes.data ?? [];
			const teacherCount = roles.filter((r) => r.role === "teacher").length;
			const parentCount = roles.filter((r) => r.role === "parent").length;
			return {
				totalStudents,
				students: studentsRes.data ?? [],
				classes: classesRes.data ?? [],
				totalClasses: classesRes.data?.length ?? 0,
				teacherCount,
				parentCount,
				attToday: attTodayRes.data ?? [],
				recentAtt: recentAttRes.data ?? [],
				staffToday: staffTodayRes.data ?? []
			};
		}
	});
	const totalStudents = adminData?.totalStudents ?? 0;
	const attToday = adminData?.attToday ?? [];
	const presentStudents = attToday.filter((a) => a.status === "present" || a.status === "late").length;
	const rate = totalStudents > 0 ? Math.round(presentStudents / totalStudents * 100) : 0;
	const studentsList = adminData?.students ?? [];
	const classesList = adminData?.classes ?? [];
	const filteredStudents = studentsList.filter((s) => {
		const matchesSearch = !studentSearch.trim() || s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.student_code?.toLowerCase().includes(studentSearch.toLowerCase()) || s.classes?.name?.toLowerCase().includes(studentSearch.toLowerCase());
		const matchesClass = classFilter === "all" || s.class_id === classFilter;
		return matchesSearch && matchesClass;
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Administrator"}`,
				description: `School Administration & Gate Operations · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5 border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-medium cursor-pointer",
							onClick: () => {
								setActiveTab("profiles");
								if (studentsList.length > 0 && !selectedStudentForQr) setSelectedStudentForQr(studentsList[0]);
							},
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Student QR Passes" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 84,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 77,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/students",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 88,
									columnNumber: 17
								}, this), " Register Student / Parent"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 87,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 86,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/classes",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 93,
									columnNumber: 17
								}, this), " Manage Classes"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/scan",
								search: { tab: "students" },
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 100,
									columnNumber: 17
								}, this), " Scan Student QR"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/settings",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 105,
									columnNumber: 17
								}, this), " Settings"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 104,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 76,
					columnNumber: 168
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 76,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Total Students",
						value: totalStudents,
						icon: GraduationCap,
						tone: "primary",
						hint: "Enrolled active learners"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 112,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Attendance Rate Today",
						value: `${rate}%`,
						icon: Percent,
						tone: "success",
						hint: `${presentStudents} of ${totalStudents} present`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 113,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Active Classes",
						value: adminData?.totalClasses ?? 0,
						icon: School,
						tone: "info",
						hint: "All grade levels"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Teaching Staff",
						value: adminData?.teacherCount ?? 0,
						icon: Users,
						tone: "primary",
						hint: `${adminData?.staffToday.length ?? 0} checked in today`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 111,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Present on Time",
						value: attToday.filter((a) => a.status === "present").length,
						icon: UserCheck,
						tone: "success"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 120,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Late Scans",
						value: attToday.filter((a) => a.status === "late").length,
						icon: Clock,
						tone: "info"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Sick Leave",
						value: attToday.filter((a) => a.status === "sick").length,
						icon: Thermometer,
						tone: "warning"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Unscanned / Absent",
						value: Math.max(0, totalStudents - presentStudents),
						icon: UserX,
						tone: "destructive"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 123,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 119,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Gate Operations & Student Credentials" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Live gate attendance scans & printable student QR code passes" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 134,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
								value: activeTab,
								onValueChange: (v) => setActiveTab(v),
								className: "w-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, {
									className: "h-8 p-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "gate",
										className: "text-xs px-3 h-7 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 142,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Live Gate Activity" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 143,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 141,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "profiles",
										className: "text-xs px-3 h-7 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 146,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Student Profiles & QR" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 147,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 145,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 140,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 11
					}, this), activeTab === "gate" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "p-0 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Arrival In" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure Out" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 162,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-right",
								children: "QR Pass"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 163,
								columnNumber: 21
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 157,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 156,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [(adminData?.recentAtt ?? []).map((rec) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: "text-left font-medium text-sm hover:text-primary transition-colors cursor-pointer hover:underline",
								onClick: () => {
									if (rec.students) {
										setSelectedStudentForQr(rec.students);
										setQrModalOpen(true);
									}
								},
								title: "Click to preview & print student QR pass",
								children: rec.students?.full_name ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 169,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-mono text-xs text-muted-foreground",
								children: rec.students?.student_code ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 177,
								columnNumber: 25
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 168,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: rec.classes?.name ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 181,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: rec.status }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 182,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: rec.arrival_time ? fmtTime(rec.arrival_time) : "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 185,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: rec.departure_time ? fmtTime(rec.departure_time) : "On campus"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7 px-2 text-xs gap-1 hover:border-primary hover:text-primary cursor-pointer",
									onClick: () => {
										if (rec.students) {
											setSelectedStudentForQr(rec.students);
											setQrModalOpen(true);
										}
									},
									title: "Preview & print QR pass",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-3.5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 198,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "hidden sm:inline",
										children: "QR Pass"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 199,
										columnNumber: 27
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 191,
								columnNumber: 23
							}, this)
						] }, rec.id, true, {
							fileName: _jsxFileName,
							lineNumber: 167,
							columnNumber: 60
						}, this)), !(adminData?.recentAtt ?? []).length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
							colSpan: 6,
							className: "text-center py-6 text-muted-foreground text-xs",
							children: isLoading ? "Loading live gate scans…" : "No gate scans recorded yet today."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 204,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 203,
							columnNumber: 60
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 166,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-3 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Showing latest real-time gate attendance events." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 211,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								size: "sm",
								asChild: true,
								className: "h-7 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/reports",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "mr-1.5 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 214,
										columnNumber: 21
									}, this), " View full attendance log"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 213,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 212,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 210,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 154,
						columnNumber: 35
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "p-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col sm:flex-row items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "relative flex-1 w-full",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 222,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "Search student name, ID code (e.g. STD-0001)...",
										value: studentSearch,
										onChange: (e) => setStudentSearch(e.target.value),
										className: "pl-8 h-9 text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 223,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 221,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-full sm:w-48",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: classFilter,
										onValueChange: setClassFilter,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "All classes" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 228,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 227,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "all",
											children: "All Classes"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 231,
											columnNumber: 23
										}, this), classesList.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id, false, {
											fileName: _jsxFileName,
											lineNumber: 232,
											columnNumber: 45
										}, this))] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 230,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 226,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 225,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 220,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-2.5 sm:grid-cols-2 max-h-[420px] overflow-y-auto pr-1",
								children: [filteredStudents.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0",
											children: s.full_name ? s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("") : "ST"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 244,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0 space-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "font-semibold text-xs truncate text-foreground",
												children: s.full_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 248,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-mono",
														children: s.student_code
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 252,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 253,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "truncate",
														children: s.classes?.name || "No Class"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 254,
														columnNumber: 27
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 251,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 247,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 243,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 px-2 text-xs gap-1.5 shrink-0 hover:border-primary hover:text-primary cursor-pointer",
										onClick: () => {
											setSelectedStudentForQr(s);
											setQrModalOpen(true);
										},
										title: "Preview and print official QR pass",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-3.5 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 263,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "size-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 264,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "hidden md:inline",
												children: "Print Pass"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 265,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 259,
										columnNumber: 21
									}, this)]
								}, s.id, true, {
									fileName: _jsxFileName,
									lineNumber: 242,
									columnNumber: 44
								}, this)), filteredStudents.length === 0 && /* @__PURE__ */ (void 0)("div", {
									className: "col-span-full py-8 text-center text-xs text-muted-foreground",
									children: "No students match your search filter."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 268,
									columnNumber: 51
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 241,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between pt-2 border-t text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
									"Showing ",
									filteredStudents.length,
									" of ",
									studentsList.length,
									" students"
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 274,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									size: "sm",
									asChild: true,
									className: "h-7 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/students",
										children: "Manage all students in directory →"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 278,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 277,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 273,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 218,
						columnNumber: 30
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 128,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base",
							children: "Administration Tools"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 288,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Quick access to school management" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 289,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 287,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								className: "w-full justify-start text-xs h-9 cursor-pointer border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium",
								onClick: () => {
									setActiveTab("profiles");
									if (studentsList.length > 0) {
										setSelectedStudentForQr(studentsList[0]);
										setQrModalOpen(true);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "mr-2 size-3.5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 299,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Preview & Print Student QR Passes" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 300,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 292,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/cards",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CreditCard, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 304,
										columnNumber: 19
									}, this), " Printable QR ID Cards"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 303,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 302,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/users",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 309,
										columnNumber: 19
									}, this), " Manage User Accounts & Roles"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 308,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 307,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/classes",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 314,
										columnNumber: 19
									}, this), " Manage Classes & Grade Levels"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 313,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 312,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/reports",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileChartColumnIncreasing, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 319,
										columnNumber: 19
									}, this), " Attendance & Export Reports"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 318,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 317,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/audit",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 324,
										columnNumber: 19
									}, this), " Security & Audit Trail"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 323,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 322,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 291,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 286,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 285,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 127,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StudentQrModal, {
				open: qrModalOpen,
				onOpenChange: setQrModalOpen,
				student: selectedStudentForQr
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 333,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 75,
		columnNumber: 10
	}, this);
}
function SecretaryDashboard() {
	const { profile } = useAuth();
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [actionBusyId, setActionBusyId] = (0, import_react.useState)(null);
	const today = todayISO();
	const { data: gateData, isLoading } = useQuery({
		queryKey: ["secretary-dashboard", today],
		queryFn: async () => {
			const [studentsRes, attTodayRes, staffTodayRes, requestsRes, recentRes] = await Promise.all([
				supabase.from("students").select("id, full_name, student_code, class_id"),
				supabase.from("attendance").select("id, status, student_id, arrival_time, departure_time, class_id").eq("attendance_date", today),
				supabase.from("staff_attendance").select("id, staff_id, staff_name, status, arrival_time, departure_time").eq("attendance_date", today),
				supabase.from("permission_requests").select("id, teacher_id, teacher_name, class_id, reason, status, created_at, classes(name)").order("created_at", { ascending: false }).limit(10),
				supabase.from("attendance").select("id, status, student_id, arrival_time, departure_time, created_at, students(full_name, student_code), classes(name)").eq("attendance_date", today).order("created_at", { ascending: false }).limit(12)
			]);
			return {
				totalStudents: studentsRes.data?.length ?? 0,
				attToday: attTodayRes.data ?? [],
				staffToday: staffTodayRes.data ?? [],
				requests: requestsRes.data ?? [],
				recentGate: recentRes.data ?? []
			};
		}
	});
	const handleApproveRequest = async (reqId, classId, teacherId) => {
		setActionBusyId(reqId);
		try {
			const { error } = await supabase.from("permission_requests").update({ status: "approved" }).eq("id", reqId);
			if (error) {
				toast.error(error.message);
				return;
			}
			await logAudit("permission.approve", "permission_requests", {
				request_id: reqId,
				class_id: classId,
				teacher_id: teacherId
			});
			toast.success("Teacher granted class access.");
			queryClient.invalidateQueries({ queryKey: ["secretary-dashboard"] });
		} catch {
			toast.error("Failed to approve request.");
		} finally {
			setActionBusyId(null);
		}
	};
	const handleRejectRequest = async (reqId) => {
		setActionBusyId(reqId);
		try {
			const { error } = await supabase.from("permission_requests").update({ status: "rejected" }).eq("id", reqId);
			if (error) {
				toast.error(error.message);
				return;
			}
			await logAudit("permission.reject", "permission_requests", { request_id: reqId });
			toast.info("Teacher request rejected.");
			queryClient.invalidateQueries({ queryKey: ["secretary-dashboard"] });
		} catch {
			toast.error("Failed to reject request.");
		} finally {
			setActionBusyId(null);
		}
	};
	const presentStudents = gateData?.attToday.filter((a) => a.status === "present" || a.status === "late").length ?? 0;
	const lateStudents = gateData?.attToday.filter((a) => a.status === "late").length ?? 0;
	const absentStudents = Math.max(0, (gateData?.totalStudents ?? 0) - presentStudents);
	const pendingRequests = (gateData?.requests ?? []).filter((r) => r.status === "pending");
	const filteredGate = (gateData?.recentGate ?? []).filter((r) => {
		if (!searchTerm) return true;
		const term = searchTerm.toLowerCase();
		return r.students?.full_name?.toLowerCase().includes(term) || r.students?.student_code?.toLowerCase().includes(term);
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Mary Uwase"}`,
				description: `Secretary Front Desk & Gate Operations · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/students",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 431,
									columnNumber: 17
								}, this), " Register Student / Parent"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 430,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 429,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/classes",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 436,
									columnNumber: 17
								}, this), " Manage Classes"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 435,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 434,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/scan",
								search: { tab: "students" },
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 443,
									columnNumber: 17
								}, this), " Scan Student Gate Card"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 440,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 439,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/scan",
								search: { tab: "staff" },
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 450,
									columnNumber: 17
								}, this), " Scan Staff Check-in"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 447,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 446,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 428,
					columnNumber: 164
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 428,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Students Scanned In",
						value: presentStudents,
						icon: UserCheck,
						tone: "success",
						hint: `Out of ${gateData?.totalStudents ?? 0} enrolled`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 457,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Unscanned / Absent",
						value: absentStudents,
						icon: UserX,
						tone: "destructive",
						hint: "Not scanned at gate today"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 458,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Late Arrivals",
						value: lateStudents,
						icon: Clock,
						tone: "info",
						hint: "Scanned after gate cutoff"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 459,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Staff Checked In",
						value: gateData?.staffToday.length ?? 0,
						icon: CalendarCheck,
						tone: "primary",
						hint: "Teachers & admin staff"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 460,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Pending Access Requests",
						value: pendingRequests.length,
						icon: ShieldAlert,
						tone: pendingRequests.length > 0 ? "warning" : "muted",
						hint: pendingRequests.length > 0 ? "Requires secretary review" : "All cleared"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 461,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 456,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6 lg:col-span-2",
					children: [pendingRequests.length > 0 && /* @__PURE__ */ (void 0)(Card, {
						className: "border-warning/40 bg-warning/5",
						children: [/* @__PURE__ */ (void 0)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-5 text-warning" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 472,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(CardTitle, {
										className: "text-base",
										children: "Pending Teacher Class Access Requests"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 473,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 471,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)(Badge, {
									variant: "outline",
									className: "border-warning text-warning-foreground font-semibold",
									children: [pendingRequests.length, " action required"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 477,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 470,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(CardDescription, { children: "Teachers requesting permission to manage attendance for specific classes." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 481,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 469,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(CardContent, {
							className: "space-y-3",
							children: pendingRequests.map((req) => /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-col justify-between gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ (void 0)("div", { children: [
									/* @__PURE__ */ (void 0)("p", {
										className: "font-semibold text-sm",
										children: [
											req.teacher_name || "Teacher",
											" →",
											" ",
											/* @__PURE__ */ (void 0)("span", {
												className: "text-primary font-bold",
												children: req.classes?.name ?? "Class"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 490,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 488,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: ["Reason: ", req.reason || "Class substitution / attendance access"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 494,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: ["Requested ", fmtTime(req.created_at)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 497,
										columnNumber: 23
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 487,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (void 0)(Button, {
										size: "sm",
										className: "h-8 gap-1 bg-success hover:bg-success/90 text-white",
										disabled: actionBusyId === req.id,
										onClick: () => void handleApproveRequest(req.id, req.class_id, req.teacher_id),
										children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 503,
											columnNumber: 25
										}, this), " Approve"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 502,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 gap-1 text-destructive hover:bg-destructive/10",
										disabled: actionBusyId === req.id,
										onClick: () => void handleRejectRequest(req.id),
										children: [/* @__PURE__ */ (void 0)(CircleX, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 506,
											columnNumber: 25
										}, this), " Reject"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 505,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 501,
									columnNumber: 21
								}, this)]
							}, req.id, true, {
								fileName: _jsxFileName,
								lineNumber: 486,
								columnNumber: 45
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 485,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 468,
						columnNumber: 42
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base",
							children: "Today's Gate Stream"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 517,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Live scans recorded at school entry/exit points" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 518,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 516,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative w-48 sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 521,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								placeholder: "Filter student or code…",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								className: "pl-8 h-9 text-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 522,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 520,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 515,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 529,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 530,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 531,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Arrival In" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure Out" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 21
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 528,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 527,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredGate.map((rec) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-medium text-sm",
								children: rec.students?.full_name ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 539,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-mono text-xs text-muted-foreground",
								children: rec.students?.student_code ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 540,
								columnNumber: 25
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 538,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: rec.classes?.name ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 544,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: rec.status }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 546,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 545,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: rec.arrival_time ? fmtTime(rec.arrival_time) : "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 548,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: rec.departure_time ? fmtTime(rec.departure_time) : "On campus"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 551,
								columnNumber: 23
							}, this)
						] }, rec.id, true, {
							fileName: _jsxFileName,
							lineNumber: 537,
							columnNumber: 44
						}, this)), !filteredGate.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
							colSpan: 5,
							className: "text-center py-6 text-muted-foreground text-sm",
							children: isLoading ? "Loading gate scans…" : "No student scans recorded yet today."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 556,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 555,
							columnNumber: 44
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 536,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 526,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 525,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 514,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 466,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base",
								children: "Staff Attendance Today"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 572,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: [gateData?.staffToday.length ?? 0, " scanned"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 573,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 571,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Teachers and staff scanned at arrival" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 577,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 570,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Staff Name" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 584,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Time" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 585,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 586,
									columnNumber: 23
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 583,
								columnNumber: 21
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 582,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [(gateData?.staffToday ?? []).slice(0, 8).map((staff) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "font-medium text-xs",
									children: staff.staff_name || "Staff Member"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 591,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "text-xs",
									children: staff.arrival_time ? fmtTime(staff.arrival_time) : "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 594,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: staff.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 598,
									columnNumber: 27
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 597,
									columnNumber: 25
								}, this)
							] }, staff.id, true, {
								fileName: _jsxFileName,
								lineNumber: 590,
								columnNumber: 76
							}, this)), !(gateData?.staffToday ?? []).length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
								colSpan: 3,
								className: "text-center py-4 text-xs text-muted-foreground",
								children: "No staff check-ins recorded yet today."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 602,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 601,
								columnNumber: 62
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 589,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 581,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 580,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							asChild: true,
							className: "w-full text-xs",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/scan",
								search: { tab: "staff" },
								children: "Scan Staff Attendance"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 610,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 609,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 579,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 569,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base",
							children: "Front-Desk Quick Tools"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 622,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 621,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/students",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 627,
										columnNumber: 19
									}, this), " Register Students & Parents"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 626,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 625,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/classes",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 632,
										columnNumber: 19
									}, this), " Manage & Create Classes"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 631,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 630,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/cards",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 637,
										columnNumber: 19
									}, this), " Print Student ID Cards"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 636,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 635,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/permissions",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 642,
										columnNumber: 19
									}, this), " View All Teacher Permissions"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 641,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 640,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/reports",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "mr-2 size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 647,
										columnNumber: 19
									}, this), " Generate Attendance Reports"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 646,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 645,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 624,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 620,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 567,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 464,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 427,
		columnNumber: 10
	}, this);
}
function TeacherDashboard() {
	const { profile, user } = useAuth();
	const queryClient = useQueryClient();
	const today = todayISO();
	const [selectedClassId, setSelectedClassId] = (0, import_react.useState)("all");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [markingStudent, setMarkingStudent] = (0, import_react.useState)(null);
	const [markStatus, setMarkStatus] = (0, import_react.useState)("present");
	const [markNotes, setMarkNotes] = (0, import_react.useState)("");
	const [isSubmittingMark, setIsSubmittingMark] = (0, import_react.useState)(false);
	const { data: teacherData, isLoading } = useQuery({
		queryKey: [
			"teacher-dashboard-main",
			user?.id,
			today
		],
		queryFn: async () => {
			const [classesRes, studentsRes, attTodayRes, teacherAttRes, newsRes] = await Promise.all([
				supabase.from("classes").select("id, name, teacher_id").order("name"),
				supabase.from("students").select("id, full_name, student_code, class_id, classes(name)").order("full_name"),
				supabase.from("attendance").select("id, student_id, status, arrival_time, departure_time, notes").eq("attendance_date", today),
				user?.id ? supabase.from("staff_attendance").select("id, status, arrival_time").eq("staff_id", user.id).eq("attendance_date", today).maybeSingle() : Promise.resolve({ data: null }),
				supabase.from("announcements").select("id, title, body, created_at").order("created_at", { ascending: false }).limit(3)
			]);
			return {
				classes: classesRes.data ?? [],
				students: studentsRes.data ?? [],
				attendanceToday: attTodayRes.data ?? [],
				teacherAtt: teacherAttRes.data ?? null,
				announcements: newsRes.data ?? []
			};
		}
	});
	const allClasses = teacherData?.classes ?? [];
	const myAssignedClasses = allClasses.filter((c) => c.teacher_id === user?.id);
	const effectiveClasses = myAssignedClasses.length > 0 ? myAssignedClasses : allClasses;
	const attMap = /* @__PURE__ */ new Map();
	(teacherData?.attendanceToday ?? []).forEach((a) => {
		attMap.set(a.student_id, a);
	});
	const classStudents = (teacherData?.students ?? []).filter((s) => {
		if (selectedClassId === "all") {
			if (myAssignedClasses.length > 0) return myAssignedClasses.some((c) => c.id === s.class_id);
			return true;
		}
		return s.class_id === selectedClassId;
	});
	const filteredStudents = classStudents.filter((s) => {
		const status = attMap.get(s.id)?.status ?? "unmarked";
		if (statusFilter !== "all" && status !== statusFilter) return false;
		if (searchTerm.trim()) {
			const q = searchTerm.toLowerCase();
			return s.full_name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q);
		}
		return true;
	});
	const totalRoster = classStudents.length;
	const presentCount = classStudents.filter((s) => attMap.get(s.id)?.status === "present").length;
	const lateCount = classStudents.filter((s) => attMap.get(s.id)?.status === "late").length;
	const sickCount = classStudents.filter((s) => attMap.get(s.id)?.status === "sick").length;
	const absentCount = classStudents.filter((s) => attMap.get(s.id)?.status === "absent").length;
	const markedCount = presentCount + lateCount + sickCount + absentCount;
	const rate = totalRoster > 0 ? Math.round((presentCount + lateCount) / totalRoster * 100) : 0;
	const handleSaveAttendance = async (e) => {
		if (e) e.preventDefault();
		if (!markingStudent) return;
		setIsSubmittingMark(true);
		try {
			const existing = attMap.get(markingStudent.id);
			const payload = {
				student_id: markingStudent.id,
				attendance_date: today,
				status: markStatus,
				notes: markNotes.trim() || null,
				recorded_by: user?.id ?? "teacher",
				recorded_by_name: profile?.full_name ?? "Teacher"
			};
			if (markStatus === "present" || markStatus === "late") {
				if (!existing?.arrival_time) payload.arrival_time = (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8);
			}
			if (existing?.id) {
				const { error } = await supabase.from("attendance").update(payload).eq("id", existing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("attendance").insert(payload);
				if (error) throw error;
			}
			await logAudit("attendance.manual_mark", "attendance", {
				student_id: markingStudent.id,
				status: markStatus,
				date: today
			});
			toast.success(`Updated attendance for ${markingStudent.full_name}`);
			setMarkingStudent(null);
			setMarkNotes("");
			queryClient.invalidateQueries({ queryKey: ["teacher-dashboard-main"] });
		} catch (err) {
			toast.error(err?.message ?? "Failed to save attendance.");
		} finally {
			setIsSubmittingMark(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Teacher"}`,
				description: `Teacher Portal · Class attendance, daily rosters & operations · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/attendance",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "mr-1.5 size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 781,
								columnNumber: 17
							}, this), " Mark Class Attendance"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 780,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 779,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/reports",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileChartColumnIncreasing, { className: "mr-1.5 size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 786,
								columnNumber: 17
							}, this), " Attendance Reports"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 785,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 784,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 778,
					columnNumber: 184
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 778,
				columnNumber: 7
			}, this),
			teacherData?.teacherAtt?.status === "present" && /* @__PURE__ */ (void 0)("div", {
				className: "flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-800 dark:text-emerald-300 shadow-sm",
				children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-5 shrink-0 text-emerald-600 dark:text-emerald-400" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 792,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "text-xs sm:text-sm",
					children: [
						/* @__PURE__ */ (void 0)("span", {
							className: "font-semibold",
							children: "Welcome back to school! 👋"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 794,
							columnNumber: 13
						}, this),
						" You are marked",
						" ",
						/* @__PURE__ */ (void 0)("span", {
							className: "font-semibold uppercase",
							children: "Present"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 795,
							columnNumber: 13
						}, this),
						" today",
						" ",
						teacherData.teacherAtt.arrival_time && /* @__PURE__ */ (void 0)("span", { children: [
							"(Arrival: ",
							fmtTime(teacherData.teacherAtt.arrival_time),
							")"
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 796,
							columnNumber: 53
						}, this),
						". Have a productive teaching day!"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 793,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 791,
				columnNumber: 57
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Class Roster",
						value: totalRoster,
						icon: Users,
						tone: "primary",
						hint: "Enrolled learners"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 803,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Present in Class",
						value: presentCount,
						icon: UserCheck,
						tone: "success",
						hint: "Checked in on time"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 804,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Late Arrival",
						value: lateCount,
						icon: Clock,
						tone: "warning",
						hint: "Arrived after bell"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 805,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Absent / Sick",
						value: absentCount + sickCount,
						icon: UserX,
						tone: "danger",
						hint: `${absentCount} absent · ${sickCount} sick`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 806,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Attendance Rate",
						value: `${rate}%`,
						icon: Percent,
						tone: "primary",
						hint: `${markedCount} of ${totalRoster} logged`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 807,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 802,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-semibold",
								children: "Today's Class Roster"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 818,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
								className: "text-xs",
								children: "Live gate status and classroom attendance check"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 819,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 817,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: selectedClassId,
									onValueChange: (val) => setSelectedClassId(val),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
										className: "h-8 w-[160px] text-xs",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Filter by class" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 826,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 825,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: "all",
										children: "All Classes"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 829,
										columnNumber: 23
									}, this), effectiveClasses.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id, false, {
										fileName: _jsxFileName,
										lineNumber: 830,
										columnNumber: 50
									}, this))] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 828,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 824,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 823,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 816,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 841,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "Search by student name or code…",
									value: searchTerm,
									onChange: (e) => setSearchTerm(e.target.value),
									className: "h-8 pl-8 text-xs"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 842,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 840,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1 overflow-x-auto",
								children: [
									"all",
									"present",
									"late",
									"absent",
									"sick",
									"unmarked"
								].map((st) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: statusFilter === st ? "default" : "outline",
									size: "sm",
									className: "h-8 text-xs capitalize px-2.5",
									onClick: () => setStatusFilter(st),
									children: st
								}, st, false, {
									fileName: _jsxFileName,
									lineNumber: 845,
									columnNumber: 98
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 844,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 839,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 815,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-xs",
								children: "Student"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 855,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-xs",
								children: "Code"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 856,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-xs",
								children: "Class"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 857,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-xs",
								children: "Gate / Today Status"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 858,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-xs",
								children: "Arrival In"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 859,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-xs text-right",
								children: "Quick Action"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 860,
								columnNumber: 21
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 854,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 853,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredStudents.map((s) => {
							const rec = attMap.get(s.id);
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "font-medium text-xs",
									children: s.full_name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 867,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "text-xs font-mono text-muted-foreground",
									children: s.student_code
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 868,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "text-xs",
									children: s.classes?.name ?? "Assigned Class"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 871,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: rec ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: rec.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 875,
									columnNumber: 34
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									className: "text-[10px] text-muted-foreground",
									children: "Not recorded"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 875,
									columnNumber: 72
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 874,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "text-xs",
									children: rec?.arrival_time ? fmtTime(rec.arrival_time) : "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 879,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-7 text-xs px-2 text-primary",
										onClick: () => {
											setMarkingStudent(s);
											setMarkStatus(rec?.status ?? "present");
											setMarkNotes(rec?.notes ?? "");
										},
										children: "Update"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 883,
										columnNumber: 27
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 882,
									columnNumber: 25
								}, this)
							] }, s.id, true, {
								fileName: _jsxFileName,
								lineNumber: 866,
								columnNumber: 26
							}, this);
						}), !filteredStudents.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
							colSpan: 6,
							className: "text-center py-8 text-muted-foreground text-xs",
							children: isLoading ? "Loading class roster…" : "No students matching the selected criteria."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 894,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 893,
							columnNumber: 48
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 863,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 852,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 851,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 814,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 813,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6 lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-semibold",
								children: "My Gate Check-In"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 909,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
								className: "text-xs",
								children: "Your personal gate arrival record today"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 910,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 908,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: teacherData?.teacherAtt ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold text-emerald-800 dark:text-emerald-300 block",
								children: "Gate Arrival Recorded"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 917,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground text-[11px]",
								children: [
									"Time:",
									" ",
									teacherData.teacherAtt.arrival_time ? fmtTime(teacherData.teacherAtt.arrival_time) : "On record"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 920,
								columnNumber: 21
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 916,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "default",
								className: "bg-emerald-600 text-xs",
								children: teacherData.teacherAtt.status
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 925,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 915,
							columnNumber: 42
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between p-3 rounded-lg border bg-amber-50 dark:bg-amber-950/20 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold text-amber-800 dark:text-amber-300 block",
								children: "Gate Scan Pending"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 930,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground text-[11px]",
								children: "Check in at the security gate terminal"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 933,
								columnNumber: 21
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 929,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: "Pending"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 937,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 928,
							columnNumber: 26
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 914,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 907,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { className: "size-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 948,
									columnNumber: 17
								}, this), " School Bulletins"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 947,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
								className: "text-xs",
								children: "Administrative updates"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 950,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 946,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "space-y-3",
							children: [(teacherData?.announcements ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border p-3 text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-sm",
										children: n.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 954,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: n.body
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 955,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] text-muted-foreground/70 pt-1",
										children: fmtDate(n.created_at)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 956,
										columnNumber: 19
									}, this)
								]
							}, n.id, true, {
								fileName: _jsxFileName,
								lineNumber: 953,
								columnNumber: 60
							}, this)), !(teacherData?.announcements ?? []).length && /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: "No recent notices published."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 960,
								columnNumber: 62
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 952,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 945,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-semibold",
								children: "Quick Actions"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 967,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 966,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									asChild: true,
									className: "w-full justify-start text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/attendance",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "mr-2 size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 972,
											columnNumber: 19
										}, this), " Mark Class Attendance"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 971,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 970,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									asChild: true,
									className: "w-full justify-start text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/students",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "mr-2 size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 977,
											columnNumber: 19
										}, this), " View Student Profiles"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 976,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 975,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									asChild: true,
									className: "w-full justify-start text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/reports",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileChartColumnIncreasing, { className: "mr-2 size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 982,
											columnNumber: 19
										}, this), " Generate Attendance Reports"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 981,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 980,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 969,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 965,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 905,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 811,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: !!markingStudent,
				onOpenChange: (open) => {
					if (!open) setMarkingStudent(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Update Student Attendance" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 996,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: [
						"Record or revise today's attendance status for ",
						markingStudent?.full_name,
						" (",
						markingStudent?.student_code,
						")."
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 997,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 995,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit: handleSaveAttendance,
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Status"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1005,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-4 gap-2",
									children: [
										"present",
										"late",
										"sick",
										"absent"
									].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "button",
										variant: markStatus === s ? "default" : "outline",
										size: "sm",
										className: "capitalize text-xs",
										onClick: () => setMarkStatus(s),
										children: s
									}, s, false, {
										fileName: _jsxFileName,
										lineNumber: 1007,
										columnNumber: 76
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1006,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1004,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Teacher Notes (Optional)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1014,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "e.g. Excused for clinic or doctor appointment",
									value: markNotes,
									onChange: (e) => setMarkNotes(e.target.value),
									className: "text-xs"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1015,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1013,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									className: "text-xs",
									onClick: () => setMarkingStudent(null),
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1019,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "submit",
									size: "sm",
									className: "text-xs",
									disabled: isSubmittingMark,
									children: [isSubmittingMark ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "mr-1.5 size-3.5 animate-spin" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1023,
										columnNumber: 37
									}, this) : null, "Save Attendance"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1022,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1018,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1003,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 994,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 991,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 777,
		columnNumber: 10
	}, this);
}
function ParentDashboard() {
	const { profile, user } = useAuth();
	const today = todayISO();
	const yesterday = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10);
	const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
	const [activeDateFocus, setActiveDateFocus] = (0, import_react.useState)(today);
	const { data: parentData, isLoading } = useQuery({
		queryKey: [
			"parent-dashboard",
			user?.id,
			today
		],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data: children } = await supabase.from("students").select("id, full_name, student_code, class_id, qr_token, classes(name)").eq("parent_id", user.id);
			const childIds = (children ?? []).map((c) => c.id);
			const [{ data: attHistory }, { data: news }, { data: payments }, { data: permissions }] = await Promise.all([
				childIds.length ? supabase.from("attendance").select("*, students(full_name, student_code), classes(name)").in("student_id", childIds).order("attendance_date", { ascending: false }).limit(60) : Promise.resolve({ data: [] }),
				supabase.from("announcements").select("id, title, body, created_at, action_label, action_url").order("created_at", { ascending: false }).limit(3),
				childIds.length ? supabase.from("payments").select("amount, status, category, paid_on").in("student_id", childIds) : Promise.resolve({ data: [] }),
				childIds.length ? supabase.from("permission_requests").select("*").in("student_id", childIds).order("created_at", { ascending: false }) : Promise.resolve({ data: [] })
			]);
			return {
				children: children ?? [],
				attendance: attHistory ?? [],
				news: news ?? [],
				payments: payments ?? [],
				permissions: permissions ?? []
			};
		}
	});
	const att = parentData?.attendance ?? [];
	const total = att.length || 1;
	const present = att.filter((a) => a.status === "present" || a.status === "late").length;
	const absent = att.filter((a) => a.status === "absent" || a.status === "sick").length;
	const pct = Math.round(present / total * 100);
	const focusAttMap = /* @__PURE__ */ new Map();
	att.filter((a) => a.attendance_date === activeDateFocus).forEach((a) => focusAttMap.set(a.student_id, a));
	const focusPermMap = /* @__PURE__ */ new Map();
	(parentData?.permissions ?? []).filter((p) => p.permission_date === activeDateFocus).forEach((p) => focusPermMap.set(p.student_id, p));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Parent"}`,
				description: `Parent Portal · Real-time attendance tracking for your children · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/permissions",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "mr-1.5 size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1102,
									columnNumber: 17
								}, this), " Request Permission"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1101,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1100,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/children",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Baby, { className: "mr-1.5 size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1107,
									columnNumber: 17
								}, this), " My Children"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1106,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1105,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/payments",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Receipt, { className: "mr-1.5 size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1112,
									columnNumber: 17
								}, this), " View Fees & Receipts"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1111,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1110,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1099,
					columnNumber: 185
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1099,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Attendance Rate",
						value: `${att.length ? pct : 0}%`,
						icon: Percent,
						tone: "primary",
						hint: "Overall gate check-ins"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1119,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Present Days",
						value: present,
						icon: UserCheck,
						tone: "success",
						hint: "Attended school"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1120,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Absent Days",
						value: absent,
						icon: UserX,
						tone: "destructive",
						hint: "Missed school days"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1121,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1118,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6 lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base",
								children: "My Children"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1131,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: [parentData?.children.length ?? 0, " enrolled"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1132,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1130,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-2 flex items-center gap-1 rounded-lg bg-muted/60 p-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setActiveDateFocus(yesterday),
									className: cn("flex-1 rounded-md py-1 text-center font-medium transition-all", activeDateFocus === yesterday ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
									children: "Yesterday"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1139,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setActiveDateFocus(today),
									className: cn("flex-1 rounded-md py-1 text-center font-medium transition-all", activeDateFocus === today ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
									children: "Today"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1142,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setActiveDateFocus(tomorrow),
									className: cn("flex-1 rounded-md py-1 text-center font-medium transition-all", activeDateFocus === tomorrow ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
									children: "Tomorrow"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1145,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1138,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1129,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-3",
						children: [(parentData?.children ?? []).map((c) => {
							const dayRec = focusAttMap.get(c.id);
							const dayPerm = focusPermMap.get(c.id);
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-base",
										children: c.full_name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1157,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground mt-0.5 font-mono",
										children: [
											c.student_code,
											" · ",
											c.classes?.name ?? "Assigned Class"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1158,
										columnNumber: 25
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1156,
										columnNumber: 23
									}, this), dayRec ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParentStatusBadge, { status: dayRec.status }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1162,
										columnNumber: 33
									}, this) : dayPerm ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-semibold text-amber-600 dark:text-amber-400",
										children: ["Permission ", dayPerm.status]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1162,
										columnNumber: 90
									}, this) : activeDateFocus === tomorrow ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: "Scheduled Day"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1164,
										columnNumber: 66
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: activeDateFocus === today ? "Not scanned yet" : "No record"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1166,
										columnNumber: 35
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1155,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-3 rounded-lg bg-muted/40 p-2.5 text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Arrival at Gate:" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1173,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: dayRec?.arrival_time ? fmtTime(dayRec.arrival_time) : "—"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1174,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1172,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Departure:" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1179,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: dayRec?.departure_time ? fmtTime(dayRec.departure_time) : dayRec ? "On campus" : "—"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1180,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1178,
											columnNumber: 23
										}, this),
										dayPerm && /* @__PURE__ */ (void 0)("div", {
											className: "flex justify-between text-muted-foreground pt-1 border-t",
											children: [/* @__PURE__ */ (void 0)("span", { children: "Leave Note:" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1185,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium text-primary truncate max-w-[150px]",
												children: [
													dayPerm.title,
													" (",
													dayPerm.status,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1186,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1184,
											columnNumber: 35
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1171,
									columnNumber: 21
								}, this)]
							}, c.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1154,
								columnNumber: 22
							}, this);
						}), !(parentData?.children ?? []).length && /* @__PURE__ */ (void 0)("div", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: isLoading ? "Loading your children…" : "No children registered under this account yet."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1194,
							columnNumber: 56
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1150,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1128,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1204,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base",
								children: "School Announcements"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1205,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1203,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1202,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-3",
						children: [(parentData?.news ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-lg border p-3 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-semibold text-sm",
									children: n.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1210,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: n.body
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1211,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] text-muted-foreground/70 pt-1",
									children: fmtDate(n.created_at)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1212,
									columnNumber: 19
								}, this)
							]
						}, n.id, true, {
							fileName: _jsxFileName,
							lineNumber: 1209,
							columnNumber: 50
						}, this)), !(parentData?.news ?? []).length && /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-muted-foreground",
							children: "No announcements right now."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1216,
							columnNumber: 52
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1208,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1201,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1127,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base",
							children: "Recent Attendance Timeline"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1227,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Daily check-in and departure log" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1228,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1226,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							className: "text-xs",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/reports",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "mr-1.5 size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1232,
									columnNumber: 19
								}, this), " Full History"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1231,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1230,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1225,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1240,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Date" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1241,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Arrival In" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1242,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure Out" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1243,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1244,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Recorded By" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1245,
								columnNumber: 21
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1239,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1238,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [att.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "font-medium text-xs",
								children: a.students?.full_name ?? "Child"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1250,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: fmtDate(a.attendance_date)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1253,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: a.arrival_time ? fmtTime(a.arrival_time) : "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1254,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: a.departure_time ? fmtTime(a.departure_time) : "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1257,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParentStatusBadge, { status: a.status }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1261,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1260,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: a.recorded_by_name ?? "Gate Staff"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1263,
								columnNumber: 23
							}, this)
						] }, a.id, true, {
							fileName: _jsxFileName,
							lineNumber: 1249,
							columnNumber: 46
						}, this)), !att.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
							colSpan: 6,
							className: "text-center py-8 text-muted-foreground text-xs",
							children: isLoading ? "Loading attendance records…" : "No attendance records logged yet."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1268,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1267,
							columnNumber: 35
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1248,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1237,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1236,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1224,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1222,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1125,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1098,
		columnNumber: 10
	}, this);
}
function FinanceDashboard() {
	const { profile } = useAuth();
	const today = todayISO();
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const { data: financeData, isLoading } = useQuery({
		queryKey: ["finance-dashboard", today],
		queryFn: async () => {
			const [paymentsRes, studentsRes] = await Promise.all([supabase.from("payments").select("*, students(full_name, student_code)").order("paid_on", { ascending: false }).limit(100), supabase.from("students").select("id, full_name, class_id")]);
			return {
				payments: paymentsRes.data ?? [],
				totalStudents: studentsRes.data?.length ?? 0
			};
		}
	});
	const payments = financeData?.payments ?? [];
	const collected = payments.filter((p) => p.status === "paid" || p.status === "completed").reduce((sum, p) => sum + Number(p.amount || 0), 0);
	const pending = payments.filter((p) => p.status !== "paid" && p.status !== "completed").reduce((sum, p) => sum + Number(p.amount || 0), 0);
	const totalBilled = collected + pending;
	const collectionRate = totalBilled > 0 ? Math.round(collected / totalBilled * 100) : 100;
	const filteredPayments = payments.filter((p) => {
		const matchesSearch = !searchTerm || p.students?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.students?.student_code?.toLowerCase().includes(searchTerm.toLowerCase()) || p.reference?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCat = selectedCategory === "all" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
		return matchesSearch && matchesCat;
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Finance Officer"}`,
				description: `School Finance & Tuition Collection Center · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/reports",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileChartColumnIncreasing, { className: "mr-1.5 size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1321,
								columnNumber: 17
							}, this), " Financial Reports"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1320,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1319,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/finance",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Receipt, { className: "mr-1.5 size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1326,
								columnNumber: 17
							}, this), " Record New Payment"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1325,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1324,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1318,
					columnNumber: 173
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1318,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Total Collected",
						value: `$${collected.toLocaleString()}`,
						icon: TrendingUp,
						tone: "success",
						hint: "Verified paid transactions"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1333,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Pending Balances",
						value: `$${pending.toLocaleString()}`,
						icon: DollarSign,
						tone: "destructive",
						hint: "Uncollected student dues"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1334,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Collection Rate",
						value: `${collectionRate}%`,
						icon: CircleCheck,
						tone: "primary",
						hint: `${payments.length} transactions processed`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1335,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Enrolled Students",
						value: financeData?.totalStudents ?? 0,
						icon: GraduationCap,
						tone: "info",
						hint: "Eligible for term billing"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1336,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1332,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
						className: "text-base",
						children: "Tuition & Fee Payment Logs"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1343,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Recent payments recorded across all grades" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1344,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1342,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative w-48 sm:w-60",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1348,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								placeholder: "Search student or ref…",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								className: "pl-8 h-9 text-xs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1349,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1347,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1346,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1341,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "px-6 py-2 border-b flex gap-1.5 overflow-x-auto text-xs",
					children: [
						"all",
						"Tuition",
						"Uniform",
						"Meals",
						"Transport",
						"Books"
					].map((cat) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setSelectedCategory(cat),
						className: `rounded-full px-3 py-1 capitalize transition-colors ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"}`,
						children: cat
					}, cat, false, {
						fileName: _jsxFileName,
						lineNumber: 1356,
						columnNumber: 34
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1355,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "overflow-x-auto p-0",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1365,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Category" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1366,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Amount" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1367,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Method" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1368,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Date" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1369,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1370,
							columnNumber: 17
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1364,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1363,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredPayments.slice(0, 15).map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-medium text-sm",
							children: p.students?.full_name ?? "Student"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1376,
							columnNumber: 21
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-mono text-xs text-muted-foreground",
							children: p.students?.student_code ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1377,
							columnNumber: 21
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1375,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-xs",
							children: p.category || "Tuition"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1381,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-xs font-semibold",
							children: [
								p.currency || "$",
								" ",
								Number(p.amount || 0).toLocaleString()
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1382,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: p.method || "Cash"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1385,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-xs",
							children: fmtDate(p.paid_on || p.created_at)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1388,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: p.status === "paid" || p.status === "completed" ? "default" : "destructive",
							className: "text-[11px] capitalize font-medium",
							children: p.status || "paid"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1390,
							columnNumber: 21
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1389,
							columnNumber: 19
						}, this)
					] }, p.id, true, {
						fileName: _jsxFileName,
						lineNumber: 1374,
						columnNumber: 55
					}, this)), !filteredPayments.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
						colSpan: 6,
						className: "text-center py-8 text-muted-foreground text-xs",
						children: isLoading ? "Loading payments…" : "No payment records found matching criteria."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1396,
						columnNumber: 19
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1395,
						columnNumber: 44
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1373,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1362,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1361,
					columnNumber: 9
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1340,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1317,
		columnNumber: 10
	}, this);
}
function OwnerDashboard() {
	const { profile } = useAuth();
	const today = todayISO();
	const { data: ownerData, isLoading } = useQuery({
		queryKey: ["owner-dashboard-data", today],
		queryFn: async () => {
			const [studentsRes, classesRes, staffRes, attRes, paymentsRes, newsRes] = await Promise.all([
				supabase.from("students").select("id, full_name, class_id"),
				supabase.from("classes").select("id, name"),
				supabase.from("staff_attendance").select("id, staff_name, status, arrival_time, departure_time").eq("attendance_date", today),
				supabase.from("attendance").select("id, status, arrival_time, departure_time, students(full_name), classes(name)").eq("attendance_date", today),
				supabase.from("payments").select("amount, status, category"),
				supabase.from("announcements").select("id, title, body, created_at").order("created_at", { ascending: false }).limit(3)
			]);
			return {
				students: studentsRes.data ?? [],
				classes: classesRes.data ?? [],
				staffToday: staffRes.data ?? [],
				attToday: attRes.data ?? [],
				payments: paymentsRes.data ?? [],
				news: newsRes.data ?? []
			};
		}
	});
	const totalStudents = ownerData?.students.length ?? 0;
	const presentStudents = (ownerData?.attToday ?? []).filter((a) => a.status === "present" || a.status === "late").length;
	const attRate = totalStudents > 0 ? Math.round(presentStudents / totalStudents * 100) : 0;
	const payments = ownerData?.payments ?? [];
	const collected = payments.filter((p) => p.status === "paid" || p.status === "completed").reduce((sum, p) => sum + Number(p.amount || 0), 0);
	const outstanding = payments.filter((p) => p.status !== "paid" && p.status !== "completed").reduce((sum, p) => sum + Number(p.amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "School Owner"}`,
				description: `Executive Overview & Operational Metrics · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/reports",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileChartColumnIncreasing, { className: "mr-1.5 size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1439,
							columnNumber: 15
						}, this), " Full Institutional Reports"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1438,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1437,
					columnNumber: 168
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1437,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Total Enrollment",
						value: totalStudents,
						icon: GraduationCap,
						tone: "primary",
						hint: `${ownerData?.classes.length ?? 0} active classes`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1445,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Student Attendance Today",
						value: `${attRate}%`,
						icon: Percent,
						tone: "success",
						hint: `${presentStudents} students on campus`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1446,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Revenue Collected",
						value: `$${collected.toLocaleString()}`,
						icon: TrendingUp,
						tone: "success",
						hint: `Pending: $${outstanding.toLocaleString()}`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1447,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Staff on Duty Today",
						value: ownerData?.staffToday.length ?? 0,
						icon: Users,
						tone: "info",
						hint: "Teachers and administrators"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1448,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1444,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Present Students",
						value: (ownerData?.attToday ?? []).filter((a) => a.status === "present").length,
						icon: UserCheck,
						tone: "success"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1453,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Late Arrivals",
						value: (ownerData?.attToday ?? []).filter((a) => a.status === "late").length,
						icon: Clock,
						tone: "info"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1454,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Sick Leave",
						value: (ownerData?.attToday ?? []).filter((a) => a.status === "sick").length,
						icon: Thermometer,
						tone: "warning"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1455,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
						label: "Unscanned / Absent",
						value: Math.max(0, totalStudents - presentStudents),
						icon: UserX,
						tone: "destructive"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1456,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1452,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base",
								children: "Staff Attendance Today"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1465,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Teacher and staff check-ins logged at the gate" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1466,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1464,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								className: "text-xs font-mono",
								children: [ownerData?.staffToday.length ?? 0, " scanned"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1468,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1463,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1462,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Staff Member" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1477,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Arrival In" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1478,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure Out" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1479,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1480,
								columnNumber: 19
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1476,
							columnNumber: 17
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1475,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [(ownerData?.staffToday ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "font-medium text-xs",
								children: s.staff_name || "Staff"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1485,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: s.arrival_time ? fmtTime(s.arrival_time) : "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1486,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: s.departure_time ? fmtTime(s.departure_time) : "On campus"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1489,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: s.status }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1493,
								columnNumber: 23
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1492,
								columnNumber: 21
							}, this)
						] }, s.id, true, {
							fileName: _jsxFileName,
							lineNumber: 1484,
							columnNumber: 57
						}, this)), !(ownerData?.staffToday ?? []).length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
							colSpan: 4,
							className: "text-center py-6 text-muted-foreground text-xs",
							children: isLoading ? "Loading staff records…" : "No staff attendance recorded yet today."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1497,
							columnNumber: 21
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1496,
							columnNumber: 59
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1483,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1474,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1473,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1461,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1511,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base",
								children: "School Announcements"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1512,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1510,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1509,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-3",
						children: [(ownerData?.news ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-lg border p-3 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-semibold text-sm",
									children: n.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1517,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-muted-foreground",
									children: n.body
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1518,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] text-muted-foreground/70",
									children: fmtDate(n.created_at)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1519,
									columnNumber: 19
								}, this)
							]
						}, n.id, true, {
							fileName: _jsxFileName,
							lineNumber: 1516,
							columnNumber: 49
						}, this)), !(ownerData?.news ?? []).length && /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-muted-foreground",
							children: "No recent announcements."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1521,
							columnNumber: 51
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1515,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1508,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base",
							children: "Executive Shortcuts"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1527,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1526,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "w-full justify-start text-xs h-9",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/classes",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(School, { className: "mr-2 size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1532,
									columnNumber: 19
								}, this), " View All Classes & Teachers"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1531,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1530,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							asChild: true,
							className: "w-full justify-start text-xs h-9",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/audit",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileChartColumnIncreasing, { className: "mr-2 size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1537,
									columnNumber: 19
								}, this), " Security & System Audit Logs"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1536,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1535,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1529,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1525,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1507,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1460,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1436,
		columnNumber: 10
	}, this);
}
function DashboardDispatcher() {
	const { role, loading } = useAuth();
	if (loading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex h-64 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-8 animate-spin text-primary" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1553,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1552,
		columnNumber: 12
	}, this);
	switch (role) {
		case "parent": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParentDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1558,
			columnNumber: 14
		}, this);
		case "teacher": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TeacherDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1560,
			columnNumber: 14
		}, this);
		case "secretary": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SecretaryDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1562,
			columnNumber: 14
		}, this);
		case "finance": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FinanceDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1564,
			columnNumber: 14
		}, this);
		case "owner": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OwnerDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1566,
			columnNumber: 14
		}, this);
		case "admin": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdminDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1568,
			columnNumber: 14
		}, this);
		default: return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "m-4",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-xl font-bold",
						children: "Welcome to SchoolTrack"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1572,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["Your account role is currently: ", role ? roleLabel[role] : "Standard User"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1573,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdminDashboard, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1577,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1576,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1571,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1570,
			columnNumber: 14
		}, this);
	}
}
//#endregion
export { AdminDashboard, FinanceDashboard, OwnerDashboard, ParentDashboard, SecretaryDashboard, TeacherDashboard, DashboardDispatcher as component };
