import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, n as ParentStatusBadge, r as StatCard, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { Ot as Baby, St as Calendar, _ as ShieldAlert, a as UserX, et as FileSpreadsheet, ft as Clock, k as Plus, l as Trophy, mt as CircleCheck, nt as FileCheck, tt as FileDown, u as TriangleAlert, vt as Check, wt as CalendarCheck, y as Send, z as MapPin } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/children-BKQJEifI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getOffsetDate(days) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}
function ChildrenPage() {
	const qc = useQueryClient();
	const { user, profile } = useAuth();
	const todayStr = todayISO();
	const yesterdayStr = getOffsetDate(-1);
	const tomorrowStr = getOffsetDate(1);
	const [selectedDay, setSelectedDay] = (0, import_react.useState)(todayStr);
	const [showPermissionDialog, setShowPermissionDialog] = (0, import_react.useState)(false);
	const [permissionStudentId, setPermissionStudentId] = (0, import_react.useState)("");
	const [permissionTitle, setPermissionTitle] = (0, import_react.useState)("");
	const [permissionDate, setPermissionDate] = (0, import_react.useState)(todayStr);
	const [permissionReason, setPermissionReason] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: ["my-children-full", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data: students } = await supabase.from("students").select("*, classes(name)").eq("parent_id", user.id).order("full_name");
			const ids = (students ?? []).map((s) => s.id);
			const [{ data: att }, { data: permissions }, { data: discipline }, { data: clubMemberships }, { data: clubsList }] = await Promise.all([
				ids.length ? supabase.from("attendance").select("*").in("student_id", ids).order("attendance_date", { ascending: false }).limit(500) : Promise.resolve({ data: [] }),
				ids.length ? supabase.from("permission_requests").select("*").in("student_id", ids).order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
				ids.length ? supabase.from("discipline_incidents").select("*").in("student_id", ids).order("incident_date", { ascending: false }) : Promise.resolve({ data: [] }),
				ids.length ? supabase.from("club_memberships").select("*").in("student_id", ids) : Promise.resolve({ data: [] }),
				supabase.from("clubs").select("*")
			]);
			return {
				students: students ?? [],
				attendance: att ?? [],
				permissions: permissions ?? [],
				discipline: discipline ?? [],
				clubMemberships: clubMemberships ?? [],
				clubs: clubsList ?? []
			};
		}
	});
	const acknowledgeDiscipline = useMutation({
		mutationFn: async (incidentId) => {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const { error } = await supabase.from("discipline_incidents").update({
				parent_acknowledged: true,
				parent_acknowledged_at: now
			}).eq("id", incidentId);
			if (error) throw error;
			await logAudit("discipline.parent_acknowledged", "discipline_incidents", {
				incident_id: incidentId,
				parent_id: user?.id
			});
		},
		onSuccess: () => {
			toast.success("Conduct notice acknowledged.");
			qc.invalidateQueries({ queryKey: ["my-children-full"] });
			qc.invalidateQueries({ queryKey: ["discipline-incidents"] });
			qc.invalidateQueries({ queryKey: ["pending-discipline-count"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const submitPermission = useMutation({
		mutationFn: async () => {
			if (!permissionStudentId) throw new Error("Please select your child.");
			if (!permissionTitle.trim()) throw new Error("Please enter a title for the permission.");
			if (!permissionReason.trim()) throw new Error("Please provide a reason for the absence.");
			const child = (data?.students ?? []).find((s) => s.id === permissionStudentId);
			const { error } = await supabase.from("permission_requests").insert({
				type: "student_leave",
				teacher_id: user.id,
				parent_id: user.id,
				teacher_name: profile?.full_name || "Parent",
				parent_name: profile?.full_name || "Parent",
				student_id: permissionStudentId,
				student_name: child?.full_name ?? "Student",
				class_id: child?.class_id ?? null,
				title: permissionTitle.trim(),
				permission_date: permissionDate,
				reason: permissionReason.trim(),
				status: "pending"
			});
			if (error) throw error;
			await logAudit("permission.student_leave_request", "permission_requests", {
				student_id: permissionStudentId,
				date: permissionDate
			});
		},
		onSuccess: () => {
			toast.success("Permission request sent to Secretary and Administration.");
			setShowPermissionDialog(false);
			setPermissionTitle("");
			setPermissionReason("");
			qc.invalidateQueries({ queryKey: ["my-children-full"] });
			qc.invalidateQueries({ queryKey: ["permission-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const handleExportChildPdf = (student, attRows) => {
		const head = [
			"Date",
			"Status",
			"Arrival Time",
			"Departure Time",
			"Notes"
		];
		const body = attRows.map((r) => [
			r.attendance_date,
			r.status === "present" || r.status === "late" ? "Present" : "Absent",
			r.arrival_time ? fmtTime(r.arrival_time) : "—",
			r.departure_time ? fmtTime(r.departure_time) : "—",
			r.note || "—"
		]);
		exportPdf(`Attendance Record - ${student.full_name}`, head, body, `attendance-${student.student_code}`);
	};
	const handleExportChildExcel = (student, attRows) => {
		exportExcel([
			"Date",
			"Status",
			"Arrival Time",
			"Departure Time",
			"Notes"
		], attRows.map((r) => [
			r.attendance_date,
			r.status === "present" || r.status === "late" ? "Present" : "Absent",
			r.arrival_time ? fmtTime(r.arrival_time) : "—",
			r.departure_time ? fmtTime(r.departure_time) : "—",
			r.note || "—"
		]), `attendance-${student.student_code}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My Children",
				description: "Monitor daily school attendance for yesterday, today, and tomorrow, and request leave permissions.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "gap-2 shadow-sm",
					onClick: () => {
						if (data?.students?.length) setPermissionStudentId(data.students[0].id);
						setShowPermissionDialog(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Request Leave / Permission"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-3 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "View Day Status:"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedDay(yesterdayStr),
							className: cn("rounded-lg px-3 py-1 text-xs font-medium border transition-colors", selectedDay === yesterdayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
							children: [
								"Yesterday (",
								fmtDate(yesterdayStr),
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedDay(todayStr),
							className: cn("rounded-lg px-3 py-1 text-xs font-medium border transition-colors", selectedDay === todayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
							children: [
								"Today (",
								fmtDate(todayStr),
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedDay(tomorrowStr),
							className: cn("rounded-lg px-3 py-1 text-xs font-medium border transition-colors", selectedDay === tomorrowStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
							children: [
								"Tomorrow (",
								fmtDate(tomorrowStr),
								")"
							]
						})
					]
				})]
			}),
			!data?.students.length && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-dashed py-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "mx-auto size-10 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-base",
							children: "No children linked to your account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto",
							children: "Please contact the school secretary with your child's student registration code to link their profile."
						})
					]
				})
			}),
			(data?.students ?? []).map((s) => {
				const rows = (data?.attendance ?? []).filter((a) => a.student_id === s.id);
				const permissions = (data?.permissions ?? []).filter((p) => p.student_id === s.id);
				const presentCount = rows.filter((r) => r.status === "present" || r.status === "late").length;
				const absentCount = rows.filter((r) => r.status === "absent" || r.status === "sick").length;
				const rate = rows.length ? Math.round(presentCount / rows.length * 100) : 0;
				const dayRecord = rows.find((r) => r.attendance_date === selectedDay);
				const dayPermission = permissions.find((p) => p.permission_date === selectedDay);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "border-b pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-lg font-bold",
									children: s.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "font-mono text-xs",
									children: s.student_code
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
								className: "text-xs mt-0.5",
								children: [
									"Class:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: s.classes?.name ?? "Assigned Class"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border bg-muted/40 px-3 py-1.5 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground",
										children: ["Status on ", fmtDate(selectedDay)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 flex items-center justify-end gap-1.5",
										children: dayRecord ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentStatusBadge, { status: dayRecord.status }) : dayPermission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 text-xs font-semibold text-amber-600",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-3" }),
												" Permission ",
												dayPermission.status
											]
										}) : selectedDay === tomorrowStr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Scheduled Day"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Not recorded"
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "gap-1 text-xs h-8",
									onClick: () => {
										setPermissionStudentId(s.id);
										setPermissionDate(selectedDay);
										setShowPermissionDialog(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), " Request Leave"]
								})]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-6 pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Attendance Rate",
										value: `${rate}%`,
										icon: CircleCheck,
										tone: "success",
										hint: "Calculated from gate logs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Days Present",
										value: presentCount,
										icon: CalendarCheck,
										tone: "info",
										hint: "Present & on-time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Days Absent",
										value: absentCount,
										icon: UserX,
										tone: "destructive",
										hint: "Excused & unexcused"
									})
								]
							}),
							permissions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-muted/20 p-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-3.5 text-primary" }), " Leave & Permission Requests"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2 sm:grid-cols-2",
									children: permissions.slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-card p-2.5 text-xs flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: p.title || "Absence Permission"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: ["Date: ", p.permission_date || fmtDate(p.created_at)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground line-clamp-1 mt-0.5",
												children: ["Reason: ", p.reason]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })]
									}, p.id))
								})]
							}),
							(() => {
								const childIncidents = (data?.discipline ?? []).filter((d) => d.student_id === s.id);
								const unacknowledgedCount = childIncidents.filter((d) => !d.parent_acknowledged).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border bg-muted/20 p-3 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5 text-primary" }),
												" Conduct & Discipline Records",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-normal text-muted-foreground ml-1",
													children: [
														"(",
														childIncidents.length,
														" ",
														childIncidents.length === 1 ? "record" : "records",
														")"
													]
												})
											]
										}), unacknowledgedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3 text-amber-600" }),
												unacknowledgedCount,
												" requires acknowledgement"
											]
										})]
									}), childIncidents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-card/60 p-3 text-xs text-muted-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Exemplary Standing:" }), " No discipline notices or conduct infractions have been recorded."] })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2",
										children: childIncidents.map((incident) => {
											const isPending = !incident.parent_acknowledged;
											const isMajor = incident.severity === "major";
											const isModerate = incident.severity === "moderate";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cn("rounded-md border p-3 text-xs space-y-2 transition-all", isPending ? isMajor ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20" : "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20" : "bg-card"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-start justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-0.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold text-foreground",
																	children: incident.category
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: cn("text-[10px] uppercase font-bold", isMajor ? "text-rose-700 bg-rose-500/10 border-rose-300" : isModerate ? "text-amber-700 bg-amber-500/10 border-amber-300" : "text-blue-700 bg-blue-500/10 border-blue-300"),
																	children: incident.severity
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-[11px] text-muted-foreground flex items-center gap-2",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(incident.incident_date) }),
																	incident.incident_time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", incident.incident_time] }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· Reported by ", incident.reported_by_name || "Teacher"] })
																]
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															className: "h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold",
															onClick: () => acknowledgeDiscipline.mutate(incident.id),
															disabled: acknowledgeDiscipline.isPending,
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Acknowledge & Sign"]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-medium border border-emerald-500/20",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }),
																" Acknowledged on",
																" ",
																fmtDate(incident.parent_acknowledged_at)
															]
														}) })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-foreground/90 leading-relaxed pt-0.5",
														children: incident.description
													}),
													incident.action_taken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[11px] text-muted-foreground bg-muted/40 rounded px-2.5 py-1 border",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-semibold text-foreground",
															children: ["Action taken by school:", " "]
														}), incident.action_taken]
													})
												]
											}, incident.id);
										})
									})]
								});
							})(),
							(() => {
								const childClubs = (data?.clubMemberships ?? []).filter((m) => m.student_id === s.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5 text-primary" }), "Extracurricular Clubs & Activities"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/activities",
											className: "text-xs text-primary hover:underline font-medium",
											children: "Browse All Clubs →"
										})]
									}), childClubs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-card/60 p-3 text-xs text-muted-foreground flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Not currently enrolled in any extracurricular clubs." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/activities",
											className: "text-xs font-semibold text-primary hover:underline",
											children: "View Club Schedules"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
										children: childClubs.map((m) => {
											const club = (data?.clubs ?? []).find((c) => c.id === m.club_id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-md border bg-card p-3 text-xs space-y-1.5 shadow-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-foreground",
														children: club?.name || "School Club"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[10px] bg-primary/10 text-primary border-primary/30",
														children: m.role_in_club
													})]
												}), club && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground space-y-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.schedule })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.venue })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex items-center gap-1.5 text-foreground/80",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Coach: ", club.coach_name] })
														})
													]
												})]
											}, m.id);
										})
									})]
								});
							})(),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
										children: [
											"Full Attendance History (",
											rows.length,
											" records)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 text-xs gap-1",
											onClick: () => handleExportChildPdf(s, rows),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-3.5" }), " PDF"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 text-xs gap-1",
											onClick: () => handleExportChildExcel(s, rows),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5" }), " Excel"]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto rounded-lg border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Arrival In" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Departure Out" })
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.slice(0, 20).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-medium text-xs",
											children: fmtDate(r.attendance_date)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentStatusBadge, { status: r.status }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs",
											children: r.arrival_time ? fmtTime(r.arrival_time) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs",
											children: r.departure_time ? fmtTime(r.departure_time) : "—"
										})
									] }, r.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										colSpan: 4,
										className: "text-center text-muted-foreground py-6 text-xs",
										children: "No attendance recorded yet for this student."
									}) })] })] })
								})]
							})
						]
					})]
				}, s.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showPermissionDialog,
				onOpenChange: setShowPermissionDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 text-primary" }), " Request Leave or Absence Permission"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Submit an official permission request to the school secretary and principal."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Select Child"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: permissionStudentId,
										onValueChange: setPermissionStudentId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose child" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (data?.students ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: c.id,
											className: "text-xs",
											children: [
												c.full_name,
												" (",
												c.student_code,
												")"
											]
										}, c.id)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Permission Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Doctor appointment, illness, bereavement...",
										value: permissionTitle,
										onChange: (e) => setPermissionTitle(e.target.value),
										className: "text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Date of Permission"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: permissionDate,
										onChange: (e) => setPermissionDate(e.target.value),
										className: "text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Reason & Explanation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										placeholder: "Please describe why your child will be absent...",
										value: permissionReason,
										onChange: (e) => setPermissionReason(e.target.value),
										className: "text-xs"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowPermissionDialog(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => submitPermission.mutate(),
							disabled: !permissionStudentId || !permissionTitle.trim() || !permissionReason.trim() || submitPermission.isPending,
							children: "Send Request"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { ChildrenPage as component };
