import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as roleLabel, r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, n as ParentStatusBadge, r as StatCard, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { D as Printer, E as QrCode, M as Percent, Ot as Baby, R as Megaphone, S as School, T as Receipt, W as LoaderCircle, Z as GraduationCap, _ as ShieldAlert, a as UserX, b as Search, ct as DollarSign, d as TrendingUp, ft as Clock, g as ShieldCheck, k as Plus, mt as CircleCheck, p as Thermometer, pt as CircleX, r as Users, rt as FileChartColumnIncreasing, s as UserCheck, ut as CreditCard, v as Settings, wt as CalendarCheck, y as Send } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TabsTrigger, n as Tabs, r as TabsList, t as StudentQrModal } from "./student-qr-modal-Df1TaQ-t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Bh5bp9Zp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Administrator"}`,
				description: `School Administration & Gate Operations · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5 border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-medium cursor-pointer",
							onClick: () => {
								setActiveTab("profiles");
								if (studentsList.length > 0 && !selectedStudentForQr) setSelectedStudentForQr(studentsList[0]);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Student QR Passes" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/students",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Register Student / Parent"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/classes",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "size-4" }), " Manage Classes"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/scan",
								search: { tab: "students" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4" }), " Scan Student QR"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/settings",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), " Settings"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Students",
						value: totalStudents,
						icon: GraduationCap,
						tone: "primary",
						hint: "Enrolled active learners"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Attendance Rate Today",
						value: `${rate}%`,
						icon: Percent,
						tone: "success",
						hint: `${presentStudents} of ${totalStudents} present`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active Classes",
						value: adminData?.totalClasses ?? 0,
						icon: School,
						tone: "info",
						hint: "All grade levels"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Teaching Staff",
						value: adminData?.teacherCount ?? 0,
						icon: Users,
						tone: "primary",
						hint: `${adminData?.staffToday.length ?? 0} checked in today`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Present on Time",
						value: attToday.filter((a) => a.status === "present").length,
						icon: UserCheck,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Late Scans",
						value: attToday.filter((a) => a.status === "late").length,
						icon: Clock,
						tone: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Sick Leave",
						value: attToday.filter((a) => a.status === "sick").length,
						icon: Thermometer,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Unscanned / Absent",
						value: Math.max(0, totalStudents - presentStudents),
						icon: UserX,
						tone: "destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gate Operations & Student Credentials" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Live gate attendance scans & printable student QR code passes" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
								value: activeTab,
								onValueChange: (v) => setActiveTab(v),
								className: "w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "h-8 p-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "gate",
										className: "text-xs px-3 h-7 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Gate Activity" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "profiles",
										className: "text-xs px-3 h-7 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Student Profiles & QR" })]
									})]
								})
							})
						})]
					}), activeTab === "gate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-0 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Arrival In" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Departure Out" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "QR Pass"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(adminData?.recentAtt ?? []).map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs text-muted-foreground",
								children: rec.students?.student_code ?? "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: rec.classes?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: rec.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: rec.arrival_time ? fmtTime(rec.arrival_time) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: rec.departure_time ? fmtTime(rec.departure_time) : "On campus"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "QR Pass"
									})]
								})
							})
						] }, rec.id)), !(adminData?.recentAtt ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "text-center py-6 text-muted-foreground text-xs",
							children: isLoading ? "Loading live gate scans…" : "No gate scans recorded yet today."
						}) })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Showing latest real-time gate attendance events." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								asChild: true,
								className: "h-7 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/reports",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-1.5 size-3.5" }), " View full attendance log"]
								})
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Search student name, ID code (e.g. STD-0001)...",
										value: studentSearch,
										onChange: (e) => setStudentSearch(e.target.value),
										className: "pl-8 h-9 text-xs"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full sm:w-48",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: classFilter,
										onValueChange: setClassFilter,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All classes" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Classes"
										}), classesList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id))] })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2.5 sm:grid-cols-2 max-h-[420px] overflow-y-auto pr-1",
								children: [filteredStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0",
											children: s.full_name ? s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("") : "ST"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 space-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-xs truncate text-foreground",
												children: s.full_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono",
														children: s.student_code
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: s.classes?.name || "No Class"
													})
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 px-2 text-xs gap-1.5 shrink-0 hover:border-primary hover:text-primary cursor-pointer",
										onClick: () => {
											setSelectedStudentForQr(s);
											setQrModalOpen(true);
										},
										title: "Preview and print official QR pass",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden md:inline",
												children: "Print Pass"
											})
										]
									})]
								}, s.id)), filteredStudents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-full py-8 text-center text-xs text-muted-foreground",
									children: "No students match your search filter."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-2 border-t text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Showing ",
									filteredStudents.length,
									" of ",
									studentsList.length,
									" students"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									asChild: true,
									className: "h-7 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/students",
										children: "Manage all students in directory →"
									})
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Administration Tools"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Quick access to school management" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "w-full justify-start text-xs h-9 cursor-pointer border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium",
								onClick: () => {
									setActiveTab("profiles");
									if (studentsList.length > 0) {
										setSelectedStudentForQr(studentsList[0]);
										setQrModalOpen(true);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-2 size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preview & Print Student QR Passes" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cards",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 size-3.5" }), " Printable QR ID Cards"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/users",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 size-3.5" }), " Manage User Accounts & Roles"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/classes",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "mr-2 size-3.5" }), " Manage Classes & Grade Levels"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/reports",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "mr-2 size-3.5" }), " Attendance & Export Reports"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/audit",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 size-3.5" }), " Security & Audit Trail"]
								})
							})
						]
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentQrModal, {
				open: qrModalOpen,
				onOpenChange: setQrModalOpen,
				student: selectedStudentForQr
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Mary Uwase"}`,
				description: `Secretary Front Desk & Gate Operations · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/students",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Register Student / Parent"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/classes",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "size-4" }), " Manage Classes"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/scan",
								search: { tab: "students" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4" }), " Scan Student Gate Card"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/scan",
								search: { tab: "staff" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), " Scan Staff Check-in"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Students Scanned In",
						value: presentStudents,
						icon: UserCheck,
						tone: "success",
						hint: `Out of ${gateData?.totalStudents ?? 0} enrolled`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Unscanned / Absent",
						value: absentStudents,
						icon: UserX,
						tone: "destructive",
						hint: "Not scanned at gate today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Late Arrivals",
						value: lateStudents,
						icon: Clock,
						tone: "info",
						hint: "Scanned after gate cutoff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Staff Checked In",
						value: gateData?.staffToday.length ?? 0,
						icon: CalendarCheck,
						tone: "primary",
						hint: "Teachers & admin staff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Access Requests",
						value: pendingRequests.length,
						icon: ShieldAlert,
						tone: pendingRequests.length > 0 ? "warning" : "muted",
						hint: pendingRequests.length > 0 ? "Requires secretary review" : "All cleared"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 lg:col-span-2",
					children: [pendingRequests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-warning/40 bg-warning/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base",
										children: "Pending Teacher Class Access Requests"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "border-warning text-warning-foreground font-semibold",
									children: [pendingRequests.length, " action required"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Teachers requesting permission to manage attendance for specific classes." })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-3",
							children: pendingRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold text-sm",
										children: [
											req.teacher_name || "Teacher",
											" →",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-bold",
												children: req.classes?.name ?? "Class"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: ["Reason: ", req.reason || "Class substitution / attendance access"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: ["Requested ", fmtTime(req.created_at)]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 gap-1 bg-success hover:bg-success/90 text-white",
										disabled: actionBusyId === req.id,
										onClick: () => void handleApproveRequest(req.id, req.class_id, req.teacher_id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Approve"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 gap-1 text-destructive hover:bg-destructive/10",
										disabled: actionBusyId === req.id,
										onClick: () => void handleRejectRequest(req.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), " Reject"]
									})]
								})]
							}, req.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Today's Gate Stream"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Live scans recorded at school entry/exit points" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-48 sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Filter student or code…",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								className: "pl-8 h-9 text-xs"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Arrival In" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Departure Out" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredGate.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-sm",
								children: rec.students?.full_name ?? "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs text-muted-foreground",
								children: rec.students?.student_code ?? "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: rec.classes?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: rec.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: rec.arrival_time ? fmtTime(rec.arrival_time) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: rec.departure_time ? fmtTime(rec.departure_time) : "On campus"
							})
						] }, rec.id)), !filteredGate.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 5,
							className: "text-center py-6 text-muted-foreground text-sm",
							children: isLoading ? "Loading gate scans…" : "No student scans recorded yet today."
						}) })] })] })
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Staff Attendance Today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: [gateData?.staffToday.length ?? 0, " scanned"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Teachers and staff scanned at arrival" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Staff Name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Time" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(gateData?.staffToday ?? []).slice(0, 8).map((staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium text-xs",
									children: staff.staff_name || "Staff Member"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: staff.arrival_time ? fmtTime(staff.arrival_time) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: staff.status }) })
							] }, staff.id)), !(gateData?.staffToday ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 3,
								className: "text-center py-4 text-xs text-muted-foreground",
								children: "No staff check-ins recorded yet today."
							}) })] })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							asChild: true,
							className: "w-full text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/scan",
								search: { tab: "staff" },
								children: "Scan Staff Attendance"
							})
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Front-Desk Quick Tools"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/students",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mr-2 size-3.5" }), " Register Students & Parents"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/classes",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "mr-2 size-3.5" }), " Manage & Create Classes"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cards",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-2 size-3.5" }), " Print Student ID Cards"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/permissions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mr-2 size-3.5" }), " View All Teacher Permissions"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								className: "w-full justify-start text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/reports",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-2 size-3.5" }), " Generate Attendance Reports"]
								})
							})
						]
					})] })]
				})]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Teacher"}`,
				description: `Teacher Portal · Class attendance, daily rosters & operations · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/attendance",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-1.5 size-4" }), " Mark Class Attendance"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/reports",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "mr-1.5 size-4" }), " Attendance Reports"]
						})
					})]
				})
			}),
			teacherData?.teacherAtt?.status === "present" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-800 dark:text-emerald-300 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 shrink-0 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs sm:text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Welcome back to school! 👋"
						}),
						" You are marked",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold uppercase",
							children: "Present"
						}),
						" today",
						" ",
						teacherData.teacherAtt.arrival_time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"(Arrival: ",
							fmtTime(teacherData.teacherAtt.arrival_time),
							")"
						] }),
						". Have a productive teaching day!"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Class Roster",
						value: totalRoster,
						icon: Users,
						tone: "primary",
						hint: "Enrolled learners"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Present in Class",
						value: presentCount,
						icon: UserCheck,
						tone: "success",
						hint: "Checked in on time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Late Arrival",
						value: lateCount,
						icon: Clock,
						tone: "warning",
						hint: "Arrived after bell"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Absent / Sick",
						value: absentCount + sickCount,
						icon: UserX,
						tone: "danger",
						hint: `${absentCount} absent · ${sickCount} sick`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Attendance Rate",
						value: `${rate}%`,
						icon: Percent,
						tone: "primary",
						hint: `${markedCount} of ${totalRoster} logged`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base font-semibold",
								children: "Today's Class Roster"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: "Live gate status and classroom attendance check"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedClassId,
									onValueChange: (val) => setSelectedClassId(val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 w-[160px] text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by class" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Classes"
									}), effectiveClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id))] })]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search by student name or code…",
									value: searchTerm,
									onChange: (e) => setSearchTerm(e.target.value),
									className: "h-8 pl-8 text-xs"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 overflow-x-auto",
								children: [
									"all",
									"present",
									"late",
									"absent",
									"sick",
									"unmarked"
								].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: statusFilter === st ? "default" : "outline",
									size: "sm",
									className: "h-8 text-xs capitalize px-2.5",
									onClick: () => setStatusFilter(st),
									children: st
								}, st))
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs",
								children: "Student"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs",
								children: "Code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs",
								children: "Class"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs",
								children: "Gate / Today Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs",
								children: "Arrival In"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-xs text-right",
								children: "Quick Action"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredStudents.map((s) => {
							const rec = attMap.get(s.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium text-xs",
									children: s.full_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs font-mono text-muted-foreground",
									children: s.student_code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: s.classes?.name ?? "Assigned Class"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: rec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: rec.status }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] text-muted-foreground",
									children: "Not recorded"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: rec?.arrival_time ? fmtTime(rec.arrival_time) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-7 text-xs px-2 text-primary",
										onClick: () => {
											setMarkingStudent(s);
											setMarkStatus(rec?.status ?? "present");
											setMarkNotes(rec?.notes ?? "");
										},
										children: "Update"
									})
								})
							] }, s.id);
						}), !filteredStudents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "text-center py-8 text-muted-foreground text-xs",
							children: isLoading ? "Loading class roster…" : "No students matching the selected criteria."
						}) })] })] })
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base font-semibold",
								children: "My Gate Check-In"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: "Your personal gate arrival record today"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: teacherData?.teacherAtt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-emerald-800 dark:text-emerald-300 block",
								children: "Gate Arrival Recorded"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground text-[11px]",
								children: [
									"Time:",
									" ",
									teacherData.teacherAtt.arrival_time ? fmtTime(teacherData.teacherAtt.arrival_time) : "On record"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								className: "bg-emerald-600 text-xs",
								children: teacherData.teacherAtt.status
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-3 rounded-lg border bg-amber-50 dark:bg-amber-950/20 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-amber-800 dark:text-amber-300 block",
								children: "Gate Scan Pending"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px]",
								children: "Check in at the security gate terminal"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: "Pending"
							})]
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4 text-primary" }), " School Bulletins"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: "Administrative updates"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-3",
							children: [(teacherData?.announcements ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3 text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-sm",
										children: n.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: n.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground/70 pt-1",
										children: fmtDate(n.created_at)
									})
								]
							}, n.id)), !(teacherData?.announcements ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No recent notices published."
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base font-semibold",
								children: "Quick Actions"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									className: "w-full justify-start text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/attendance",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-2 size-3.5" }), " Mark Class Attendance"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									className: "w-full justify-start text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/students",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mr-2 size-3.5" }), " View Student Profiles"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									className: "w-full justify-start text-xs h-9",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/reports",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "mr-2 size-3.5" }), " Generate Attendance Reports"]
									})
								})
							]
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!markingStudent,
				onOpenChange: (open) => {
					if (!open) setMarkingStudent(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Update Student Attendance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Record or revise today's attendance status for ",
						markingStudent?.full_name,
						" (",
						markingStudent?.student_code,
						")."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveAttendance,
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-4 gap-2",
									children: [
										"present",
										"late",
										"sick",
										"absent"
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: markStatus === s ? "default" : "outline",
										size: "sm",
										className: "capitalize text-xs",
										onClick: () => setMarkStatus(s),
										children: s
									}, s))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Teacher Notes (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. Excused for clinic or doctor appointment",
									value: markNotes,
									onChange: (e) => setMarkNotes(e.target.value),
									className: "text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									className: "text-xs",
									onClick: () => setMarkingStudent(null),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "sm",
									className: "text-xs",
									disabled: isSubmittingMark,
									children: [isSubmittingMark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-3.5 animate-spin" }) : null, "Save Attendance"]
								})]
							})
						]
					})]
				})
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Parent"}`,
				description: `Parent Portal · Real-time attendance tracking for your children · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/permissions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 size-4" }), " Request Permission"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/children",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "mr-1.5 size-4" }), " My Children"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/payments",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1.5 size-4" }), " View Fees & Receipts"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Attendance Rate",
						value: `${att.length ? pct : 0}%`,
						icon: Percent,
						tone: "primary",
						hint: "Overall gate check-ins"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Present Days",
						value: present,
						icon: UserCheck,
						tone: "success",
						hint: "Attended school"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Absent Days",
						value: absent,
						icon: UserX,
						tone: "destructive",
						hint: "Missed school days"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "My Children"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: [parentData?.children.length ?? 0, " enrolled"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-1 rounded-lg bg-muted/60 p-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveDateFocus(yesterday),
									className: cn("flex-1 rounded-md py-1 text-center font-medium transition-all", activeDateFocus === yesterday ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
									children: "Yesterday"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveDateFocus(today),
									className: cn("flex-1 rounded-md py-1 text-center font-medium transition-all", activeDateFocus === today ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveDateFocus(tomorrow),
									className: cn("flex-1 rounded-md py-1 text-center font-medium transition-all", activeDateFocus === tomorrow ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
									children: "Tomorrow"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [(parentData?.children ?? []).map((c) => {
							const dayRec = focusAttMap.get(c.id);
							const dayPerm = focusPermMap.get(c.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-base",
										children: c.full_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-0.5 font-mono",
										children: [
											c.student_code,
											" · ",
											c.classes?.name ?? "Assigned Class"
										]
									})] }), dayRec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentStatusBadge, { status: dayRec.status }) : dayPerm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-semibold text-amber-600 dark:text-amber-400",
										children: ["Permission ", dayPerm.status]
									}) : activeDateFocus === tomorrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: "Scheduled Day"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: activeDateFocus === today ? "Not scanned yet" : "No record"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 rounded-lg bg-muted/40 p-2.5 text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Arrival at Gate:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: dayRec?.arrival_time ? fmtTime(dayRec.arrival_time) : "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Departure:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: dayRec?.departure_time ? fmtTime(dayRec.departure_time) : dayRec ? "On campus" : "—"
											})]
										}),
										dayPerm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-muted-foreground pt-1 border-t",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Leave Note:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-primary truncate max-w-[150px]",
												children: [
													dayPerm.title,
													" (",
													dayPerm.status,
													")"
												]
											})]
										})
									]
								})]
							}, c.id);
						}), !(parentData?.children ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: isLoading ? "Loading your children…" : "No children registered under this account yet."
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "School Announcements"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [(parentData?.news ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border p-3 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground/70 pt-1",
									children: fmtDate(n.created_at)
								})
							]
						}, n.id)), !(parentData?.news ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No announcements right now."
						})]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Recent Attendance Timeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Daily check-in and departure log" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							className: "text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/reports",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-1.5 size-3.5" }), " Full History"]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Arrival In" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Departure Out" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Recorded By" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [att.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium text-xs",
								children: a.students?.full_name ?? "Child"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: fmtDate(a.attendance_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: a.arrival_time ? fmtTime(a.arrival_time) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: a.departure_time ? fmtTime(a.departure_time) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentStatusBadge, { status: a.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: a.recorded_by_name ?? "Gate Staff"
							})
						] }, a.id)), !att.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "text-center py-8 text-muted-foreground text-xs",
							children: isLoading ? "Loading attendance records…" : "No attendance records logged yet."
						}) })] })] })
					})] })
				})]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "Finance Officer"}`,
				description: `School Finance & Tuition Collection Center · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/reports",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "mr-1.5 size-4" }), " Financial Reports"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/finance",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1.5 size-4" }), " Record New Payment"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Collected",
						value: `$${collected.toLocaleString()}`,
						icon: TrendingUp,
						tone: "success",
						hint: "Verified paid transactions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Balances",
						value: `$${pending.toLocaleString()}`,
						icon: DollarSign,
						tone: "destructive",
						hint: "Uncollected student dues"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Collection Rate",
						value: `${collectionRate}%`,
						icon: CircleCheck,
						tone: "primary",
						hint: `${payments.length} transactions processed`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Enrolled Students",
						value: financeData?.totalStudents ?? 0,
						icon: GraduationCap,
						tone: "info",
						hint: "Eligible for term billing"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Tuition & Fee Payment Logs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Recent payments recorded across all grades" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-48 sm:w-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search student or ref…",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								className: "pl-8 h-9 text-xs"
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-2 border-b flex gap-1.5 overflow-x-auto text-xs",
					children: [
						"all",
						"Tuition",
						"Uniform",
						"Meals",
						"Transport",
						"Books"
					].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelectedCategory(cat),
						className: `rounded-full px-3 py-1 capitalize transition-colors ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"}`,
						children: cat
					}, cat))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "overflow-x-auto p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Amount" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredPayments.slice(0, 15).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-sm",
							children: p.students?.full_name ?? "Student"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs text-muted-foreground",
							children: p.students?.student_code ?? "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs",
							children: p.category || "Tuition"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-xs font-semibold",
							children: [
								p.currency || "$",
								" ",
								Number(p.amount || 0).toLocaleString()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: p.method || "Cash"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs",
							children: fmtDate(p.paid_on || p.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: p.status === "paid" || p.status === "completed" ? "default" : "destructive",
							className: "text-[11px] capitalize font-medium",
							children: p.status || "paid"
						}) })
					] }, p.id)), !filteredPayments.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 6,
						className: "text-center py-8 text-muted-foreground text-xs",
						children: isLoading ? "Loading payments…" : "No payment records found matching criteria."
					}) })] })] })
				})
			] })
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Welcome, ${profile?.full_name ?? "School Owner"}`,
				description: `Executive Overview & Operational Metrics · ${fmtDate(/* @__PURE__ */ new Date())}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/reports",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "mr-1.5 size-4" }), " Full Institutional Reports"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Enrollment",
						value: totalStudents,
						icon: GraduationCap,
						tone: "primary",
						hint: `${ownerData?.classes.length ?? 0} active classes`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Student Attendance Today",
						value: `${attRate}%`,
						icon: Percent,
						tone: "success",
						hint: `${presentStudents} students on campus`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Revenue Collected",
						value: `$${collected.toLocaleString()}`,
						icon: TrendingUp,
						tone: "success",
						hint: `Pending: $${outstanding.toLocaleString()}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Staff on Duty Today",
						value: ownerData?.staffToday.length ?? 0,
						icon: Users,
						tone: "info",
						hint: "Teachers and administrators"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Present Students",
						value: (ownerData?.attToday ?? []).filter((a) => a.status === "present").length,
						icon: UserCheck,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Late Arrivals",
						value: (ownerData?.attToday ?? []).filter((a) => a.status === "late").length,
						icon: Clock,
						tone: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Sick Leave",
						value: (ownerData?.attToday ?? []).filter((a) => a.status === "sick").length,
						icon: Thermometer,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Unscanned / Absent",
						value: Math.max(0, totalStudents - presentStudents),
						icon: UserX,
						tone: "destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Staff Attendance Today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Teacher and staff check-ins logged at the gate" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-xs font-mono",
								children: [ownerData?.staffToday.length ?? 0, " scanned"]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Staff Member" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Arrival In" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Departure Out" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(ownerData?.staffToday ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium text-xs",
								children: s.staff_name || "Staff"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: s.arrival_time ? fmtTime(s.arrival_time) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: s.departure_time ? fmtTime(s.departure_time) : "On campus"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status }) })
						] }, s.id)), !(ownerData?.staffToday ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 4,
							className: "text-center py-6 text-muted-foreground text-xs",
							children: isLoading ? "Loading staff records…" : "No staff attendance recorded yet today."
						}) })] })] })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "School Announcements"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [(ownerData?.news ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border p-3 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground/70",
									children: fmtDate(n.created_at)
								})
							]
						}, n.id)), !(ownerData?.news ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No recent announcements."
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Executive Shortcuts"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "w-full justify-start text-xs h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/classes",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "mr-2 size-3.5" }), " View All Classes & Teachers"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "w-full justify-start text-xs h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/audit",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "mr-2 size-3.5" }), " Security & System Audit Logs"]
							})
						})]
					})] })]
				})]
			})
		]
	});
}
function DashboardDispatcher() {
	const { role, loading } = useAuth();
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-64 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary" })
	});
	switch (role) {
		case "parent": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentDashboard, {});
		case "teacher": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherDashboard, {});
		case "secretary": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretaryDashboard, {});
		case "finance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceDashboard, {});
		case "owner": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerDashboard, {});
		case "admin": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "m-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Welcome to SchoolTrack"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["Your account role is currently: ", role ? roleLabel[role] : "Standard User"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {})
					})
				]
			})
		});
	}
}
//#endregion
export { AdminDashboard, FinanceDashboard, OwnerDashboard, ParentDashboard, SecretaryDashboard, TeacherDashboard, DashboardDispatcher as component };
