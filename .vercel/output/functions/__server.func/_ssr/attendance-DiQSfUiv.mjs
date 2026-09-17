import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { a as fetchAttendance, c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, o as fetchClasses, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as Save, Ct as CalendarClock, St as Calendar, U as Lock, et as FileSpreadsheet, ft as Clock, ht as CircleAlert, nt as FileCheck, t as X, tt as FileDown, vt as Check, wt as CalendarCheck, y as Send, yt as CheckCheck } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-DiQSfUiv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getOffsetDate(days) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}
function AttendancePage() {
	const qc = useQueryClient();
	const { role, profile, user } = useAuth();
	const isTeacher = role === "teacher";
	const canAdminEdit = role === "admin" || role === "secretary" || role === "owner" || role === "head_of_studies";
	const todayStr = todayISO();
	const yesterdayStr = getOffsetDate(-1);
	const tomorrowStr = getOffsetDate(1);
	const lastWeekStr = getOffsetDate(-7);
	const nextWeekStr = getOffsetDate(7);
	const [registerDate, setRegisterDate] = (0, import_react.useState)(todayStr);
	const [registerClassId, setRegisterClassId] = (0, import_react.useState)("");
	const [selectedPermission, setSelectedPermission] = (0, import_react.useState)(null);
	const [showCorrectionDialog, setShowCorrectionDialog] = (0, import_react.useState)(false);
	const [correctionStudentId, setCorrectionStudentId] = (0, import_react.useState)("");
	const [correctionTargetStatus, setCorrectionTargetStatus] = (0, import_react.useState)("present");
	const [correctionReason, setCorrectionReason] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)((/* @__PURE__ */ new Date(Date.now() - 29 * 864e5)).toISOString().slice(0, 10));
	const [to, setTo] = (0, import_react.useState)(todayStr);
	const [classFilter, setClassFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: approvedClassAccess } = useQuery({
		queryKey: ["approved-class-access", user?.id],
		enabled: isTeacher && !!user?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("permission_requests").select("class_id").eq("type", "class_access").eq("teacher_id", user.id).eq("status", "approved");
			if (error) return [];
			return data ?? [];
		}
	});
	const availableClasses = (0, import_react.useMemo)(() => {
		if (!classes) return [];
		if (!isTeacher) return classes;
		const approvedIds = new Set((approvedClassAccess ?? []).map((p) => p.class_id));
		return classes.filter((c) => c.teacher_id === user?.id || approvedIds.has(c.id));
	}, [
		classes,
		isTeacher,
		user?.id,
		approvedClassAccess
	]);
	const hasNoAssignedClasses = isTeacher && availableClasses.length === 0;
	(0, import_react.useMemo)(() => {
		if (availableClasses.length > 0) {
			if (!registerClassId || !availableClasses.some((c) => c.id === registerClassId)) setRegisterClassId(availableClasses[0].id);
		} else if (hasNoAssignedClasses) setRegisterClassId("");
	}, [
		availableClasses,
		registerClassId,
		hasNoAssignedClasses
	]);
	const { data: classStudents, isLoading: loadingStudents } = useQuery({
		queryKey: ["register-students", registerClassId],
		enabled: !!registerClassId && !hasNoAssignedClasses,
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id, full_name, student_code, photo_url, class_id, parent_phone, parent_name, parent_email").eq("class_id", registerClassId).eq("active", true).order("full_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: dayAttendance, isLoading: loadingDayAttendance } = useQuery({
		queryKey: [
			"register-attendance",
			registerClassId,
			registerDate
		],
		enabled: !!registerClassId && !hasNoAssignedClasses,
		queryFn: async () => {
			const { data, error } = await supabase.from("attendance").select("*").eq("class_id", registerClassId).eq("attendance_date", registerDate);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: dayPermissions } = useQuery({
		queryKey: ["register-permissions", registerDate],
		queryFn: async () => {
			const { data, error } = await supabase.from("permission_requests").select("*").eq("permission_date", registerDate);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: records } = useQuery({
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
	const isToday = registerDate === todayStr;
	const isPastDate = registerDate < todayStr;
	const isFutureDate = registerDate > todayStr;
	const isDateLockedForTeacher = isTeacher && !isToday;
	const [localStatuses, setLocalStatuses] = (0, import_react.useState)({});
	const [hasUnsavedChanges, setHasUnsavedChanges] = (0, import_react.useState)(false);
	const [isSavingBatch, setIsSavingBatch] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (dayAttendance) {
			const initial = {};
			dayAttendance.forEach((a) => {
				if (a.status === "present" || a.status === "late") initial[a.student_id] = "present";
				else if (a.status === "absent") initial[a.student_id] = "absent";
			});
			setLocalStatuses(initial);
			setHasUnsavedChanges(false);
		}
	}, [
		dayAttendance,
		registerClassId,
		registerDate
	]);
	const handleToggleStatus = (studentId, targetStatus) => {
		if (isDateLockedForTeacher) {
			toast.error(isPastDate ? "Past attendance is locked. Submit a correction request." : "Future dates cannot be marked in advance. Only today's attendance can be marked.");
			return;
		}
		setLocalStatuses((prev) => {
			const next = { ...prev };
			if (next[studentId] === targetStatus) delete next[studentId];
			else next[studentId] = targetStatus;
			return next;
		});
		setHasUnsavedChanges(true);
	};
	const handleMarkAllPresent = () => {
		if (isDateLockedForTeacher) {
			toast.error("Attendance can only be marked for today.");
			return;
		}
		if (!classStudents?.length) return;
		const allPresent = {};
		classStudents.forEach((s) => {
			allPresent[s.id] = "present";
		});
		setLocalStatuses(allPresent);
		setHasUnsavedChanges(true);
		toast.info("All students marked present. Click 'Save Attendance' below to confirm.");
	};
	const saveAttendanceBatch = async () => {
		if (isDateLockedForTeacher) {
			toast.error("Attendance can only be saved for today.");
			return;
		}
		if (!registerClassId) {
			toast.error("Please select a class first.");
			return;
		}
		if (!classStudents?.length) {
			toast.error("No students in this class to save.");
			return;
		}
		setIsSavingBatch(true);
		try {
			const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour12: false });
			const currentAttendanceMap = new Map((dayAttendance ?? []).map((a) => [a.student_id, a]));
			for (const student of classStudents) {
				const status = localStatuses[student.id];
				if (!status) continue;
				const existing = currentAttendanceMap.get(student.id);
				if (existing) await supabase.from("attendance").update({
					status,
					recorded_by: user?.id ?? null,
					recorded_by_name: profile?.full_name ?? "Staff",
					arrival_time: status === "present" ? existing.arrival_time || nowTime : null
				}).eq("id", existing.id);
				else await supabase.from("attendance").insert({
					student_id: student.id,
					class_id: registerClassId,
					attendance_date: registerDate,
					status,
					arrival_time: status === "present" ? nowTime : null,
					recorded_by: user?.id ?? null,
					recorded_by_name: profile?.full_name ?? "Staff"
				});
			}
			const currentClassObj = availableClasses.find((c) => c.id === registerClassId);
			await logAudit("attendance.save_register", "attendance", {
				class_id: registerClassId,
				class_name: currentClassObj?.name,
				date: registerDate,
				marked_count: Object.keys(localStatuses).length
			});
			setHasUnsavedChanges(false);
			toast.success(`Attendance for ${currentClassObj?.name ?? "class"} saved!`, {
				description: "Records stored in database.",
				duration: 4e3
			});
			qc.invalidateQueries({ queryKey: ["register-attendance"] });
			qc.invalidateQueries({ queryKey: ["attendance"] });
		} catch (err) {
			toast.error(err.message || "Failed to save attendance.");
		} finally {
			setIsSavingBatch(false);
		}
	};
	const markStudent = useMutation({
		mutationFn: async (v) => {
			if (isDateLockedForTeacher) throw new Error("Attendance can only be marked for today. Direct editing of past/future dates is locked.");
			const existing = (dayAttendance ?? []).find((a) => a.student_id === v.studentId);
			const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour12: false });
			if (existing) {
				const { error } = await supabase.from("attendance").update({
					status: v.status,
					recorded_by: user?.id ?? null,
					recorded_by_name: profile?.full_name ?? "Staff",
					arrival_time: v.status === "present" ? existing.arrival_time || nowTime : null
				}).eq("id", existing.id);
				if (error) throw error;
				await logAudit("attendance.edit", "attendance", {
					id: existing.id,
					status: v.status
				});
			} else {
				const { error } = await supabase.from("attendance").insert({
					student_id: v.studentId,
					class_id: registerClassId,
					attendance_date: registerDate,
					status: v.status,
					arrival_time: v.status === "present" ? nowTime : null,
					recorded_by: user?.id ?? null,
					recorded_by_name: profile?.full_name ?? "Staff"
				});
				if (error) throw error;
				await logAudit("attendance.create", "attendance", {
					student_id: v.studentId,
					status: v.status
				});
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["register-attendance"] });
			qc.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	useMutation({
		mutationFn: async () => {
			if (isDateLockedForTeacher) throw new Error("Past attendance is locked for teachers.");
			if (!classStudents?.length) return;
			const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour12: false });
			const attendanceMap = new Map((dayAttendance ?? []).map((a) => [a.student_id, a]));
			for (const student of classStudents) {
				const existing = attendanceMap.get(student.id);
				if (existing) {
					if (existing.status !== "present") await supabase.from("attendance").update({
						status: "present",
						recorded_by: user?.id ?? null,
						recorded_by_name: profile?.full_name ?? "Staff",
						arrival_time: existing.arrival_time || nowTime
					}).eq("id", existing.id);
				} else await supabase.from("attendance").insert({
					student_id: student.id,
					class_id: registerClassId,
					attendance_date: registerDate,
					status: "present",
					arrival_time: nowTime,
					recorded_by: user?.id ?? null,
					recorded_by_name: profile?.full_name ?? "Staff"
				});
			}
			await logAudit("attendance.mark_all_present", "attendance", {
				class_id: registerClassId,
				date: registerDate
			});
		},
		onSuccess: () => {
			toast.success("All students marked present");
			qc.invalidateQueries({ queryKey: ["register-attendance"] });
			qc.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const decidePermission = useMutation({
		mutationFn: async (v) => {
			const { error } = await supabase.from("permission_requests").update({
				status: v.status,
				reviewed_by: user?.id ?? null,
				reviewed_by_name: profile?.full_name ?? "Administration",
				reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", v.id);
			if (error) throw error;
			if (v.status === "approved" && v.studentId && registerClassId) await markStudent.mutateAsync({
				studentId: v.studentId,
				status: "sick"
			});
		},
		onSuccess: (_, vars) => {
			toast.success(`Permission request ${vars.status}`);
			setSelectedPermission(null);
			qc.invalidateQueries({ queryKey: ["register-permissions"] });
			qc.invalidateQueries({ queryKey: ["register-attendance"] });
			qc.invalidateQueries({ queryKey: ["permission-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const submitCorrection = useMutation({
		mutationFn: async () => {
			if (!correctionStudentId) throw new Error("Select a student.");
			if (!correctionReason.trim()) throw new Error("Provide a reason for the correction.");
			const student = (classStudents ?? []).find((s) => s.id === correctionStudentId);
			const { error } = await supabase.from("permission_requests").insert({
				type: "attendance_correction",
				teacher_id: user.id,
				teacher_name: profile?.full_name ?? "Teacher",
				class_id: registerClassId,
				student_id: correctionStudentId,
				student_name: student?.full_name ?? "Student",
				permission_date: registerDate,
				title: `Attendance Correction for ${fmtDate(registerDate)}`,
				reason: `Request to change status to [${correctionTargetStatus.toUpperCase()}]. Reason: ${correctionReason.trim()}`,
				status: "pending"
			});
			if (error) throw error;
			await logAudit("attendance.correction_request", "permission_requests", {
				student_id: correctionStudentId,
				date: registerDate,
				targetStatus: correctionTargetStatus
			});
		},
		onSuccess: () => {
			toast.success("Attendance correction request sent to the Secretary.");
			setShowCorrectionDialog(false);
			setCorrectionReason("");
			qc.invalidateQueries({ queryKey: ["permission-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const rows = (0, import_react.useMemo)(() => (records ?? []).filter((r) => (classFilter === "all" || r.class_id === classFilter) && (statusFilter === "all" || r.status === statusFilter)), [
		records,
		classFilter,
		statusFilter
	]);
	const head = [
		"Student",
		"Student ID",
		"Class",
		"Status",
		"Date",
		"Arrival",
		"Departure",
		"Teacher"
	];
	const body = rows.map((r) => [
		r.students?.full_name ?? "",
		r.students?.student_code ?? "",
		r.classes?.name ?? "",
		r.status,
		r.attendance_date,
		r.arrival_time ? fmtTime(r.arrival_time) : "—",
		r.departure_time ? fmtTime(r.departure_time) : "—",
		r.recorded_by_name ?? ""
	]);
	const currentTally = (0, import_react.useMemo)(() => {
		const totalEnrolled = classStudents?.length ?? 0;
		let present = 0;
		let absent = 0;
		(classStudents ?? []).forEach((s) => {
			const st = localStatuses[s.id];
			if (st === "present") present++;
			else if (st === "absent") absent++;
		});
		const unmarked = Math.max(0, totalEnrolled - (present + absent));
		return {
			totalEnrolled,
			present,
			absent,
			unmarked
		};
	}, [classStudents, localStatuses]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Attendance & Register",
				description: "Mark live class attendance, review parent permission notes, and export comprehensive audit records.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportPdf("Attendance Records", head, body, "attendance-records"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " PDF"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportExcel(head, body, "attendance-records"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), " Excel"]
					})]
				})
			}),
			hasNoAssignedClasses ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 p-8 text-center shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md mx-auto space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 grid place-items-center mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-foreground",
							children: "No Classes Assigned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: "You do not have any classes assigned to your teacher account yet. As a teacher, you can only view and take attendance for classes assigned to you."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Please contact the school secretary or administrator to assign you to a class."
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-primary/20 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "border-b pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-5 text-primary" }), " Mark Class Attendance"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Live daily register. Select class and date to take roll call." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRegisterDate(lastWeekStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === lastWeekStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Last Week"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRegisterDate(yesterdayStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === yesterdayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Yesterday"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRegisterDate(todayStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === todayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Today"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRegisterDate(tomorrowStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === tomorrowStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Tomorrow"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRegisterDate(nextWeekStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === nextWeekStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Next Week"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1 pl-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: registerDate,
											onChange: (e) => setRegisterDate(e.target.value),
											className: "h-7 w-32 text-xs"
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Class:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-56",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: registerClassId,
											onValueChange: setRegisterClassId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 text-xs bg-background",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c.id,
												className: "text-xs",
												children: c.name
											}, c.id)) })]
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: fmtDate(registerDate)
										}),
										registerDate === todayStr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px] py-0 font-medium",
											children: "Today"
										}),
										isPastDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] py-0 text-muted-foreground",
											children: "Past Record"
										}),
										isFutureDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] py-0 text-sky-600 border-sky-300",
											children: "Upcoming Date"
										})
									]
								})]
							}), !isDateLockedForTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: handleMarkAllPresent,
									disabled: !classStudents?.length,
									className: "gap-1.5 text-xs h-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3.5 text-emerald-600" }), " Mark All Present"]
								})
							})]
						}),
						isDateLockedForTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between text-xs text-amber-800 dark:text-amber-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isPastDate ? `Past attendance records for ${fmtDate(registerDate)} are locked for teachers to preserve official school audit records. Only today's attendance can be marked directly.` : `Future dates (${fmtDate(registerDate)}) cannot be marked in advance. Teachers can only take roll call for today.` })]
							}), isPastDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 text-xs bg-white dark:bg-card border-amber-300 text-amber-900 dark:text-amber-200",
								onClick: () => setShowCorrectionDialog(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3 mr-1" }), " Request Correction"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs border-t pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Enrolled: "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: currentTally.totalEnrolled
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Present: "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-emerald-600",
									children: ["✓ ", currentTally.present]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Absent: "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-rose-600",
									children: ["✕ ", currentTally.absent]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Unmarked: "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-muted-foreground",
									children: currentTally.unmarked
								})] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-0 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student ID" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Permission Notes" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: isDateLockedForTeacher ? "Status" : "Mark Roll Call"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(classStudents ?? []).map((student) => {
						const effectiveStatus = localStatuses[student.id];
						const record = (dayAttendance ?? []).find((a) => a.student_id === student.id);
						const permission = (dayPermissions ?? []).find((p) => p.student_id === student.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
										children: student.full_name.charAt(0)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-sm leading-tight text-foreground",
										children: student.full_name
									}), record?.arrival_time && effectiveStatus === "present" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
											" In: ",
											fmtTime(record.arrival_time)
										]
									})] })]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs text-muted-foreground",
									children: student.student_code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: effectiveStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: effectiveStatus }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground italic",
									children: "Unmarked"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: permission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelectedPermission(permission),
									className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border", permission.status === "approved" ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800" : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-3" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate max-w-[130px]",
											children: permission.title || "Parent Permission"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] uppercase font-bold",
											children: [
												"(",
												permission.status,
												")"
											]
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "—"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: isDateLockedForTeacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Locked"
										}), isPastDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-7 text-xs text-muted-foreground",
											onClick: () => {
												setCorrectionStudentId(student.id);
												setShowCorrectionDialog(true);
											},
											children: "Request Edit"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											type: "button",
											variant: effectiveStatus === "present" ? "default" : "outline",
											className: cn("h-7 px-2.5 text-xs font-semibold gap-1 transition-colors", effectiveStatus === "present" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"),
											onClick: () => handleToggleStatus(student.id, "present"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm leading-none",
												children: "✓"
											}), " Present"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											type: "button",
											variant: effectiveStatus === "absent" ? "default" : "outline",
											className: cn("h-7 px-2.5 text-xs font-semibold gap-1 transition-colors", effectiveStatus === "absent" ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm" : "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/20"),
											onClick: () => handleToggleStatus(student.id, "absent"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm leading-none",
												children: "✕"
											}), " Absent"]
										})]
									})
								})
							]
						}, student.id);
					}), !classStudents?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "py-8 text-center text-xs text-muted-foreground",
						children: loadingStudents ? "Loading enrolled students..." : "No enrolled students found in this class."
					}) })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Class:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: availableClasses.find((c) => c.id === registerClassId)?.name || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-600 font-semibold",
									children: [
										"✓ ",
										currentTally.present,
										" Present"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-rose-600 font-semibold",
									children: [
										"✕ ",
										currentTally.absent,
										" Absent"
									]
								}),
								currentTally.unmarked > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "·"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [currentTally.unmarked, " Unmarked"]
								})] }),
								hasUnsavedChanges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-amber-600 border-amber-300 text-[10px] ml-2",
									children: "● Unsaved changes"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-3 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								onClick: saveAttendanceBatch,
								disabled: isDateLockedForTeacher || isSavingBatch || !classStudents?.length,
								className: "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm h-9 px-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), isSavingBatch ? "Saving Attendance..." : "Save Attendance"]
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-3 border-b",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4 text-primary" }), " Attendance Records & History"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Search historical attendance logs, filter by custom date range, and export to PDF/Excel." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-4 space-y-4",
				children: hasNoAssignedClasses ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-8 text-center text-xs text-muted-foreground",
					children: "No attendance records to display. No classes are assigned to your teacher account."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "From Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: from,
								onChange: (e) => setFrom(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "To Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: to,
								onChange: (e) => setTo(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classFilter,
								onValueChange: setClassFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: isTeacher ? "All my assigned classes" : "All classes"
								}), availableClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
									"all",
									"present",
									"absent",
									"sick"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									className: "capitalize",
									children: s === "all" ? "All statuses" : s === "present" ? "✓ Present" : s === "absent" ? "✕ Absent" : "Sick / Excused"
								}, s)) })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Arrival" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Departure" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Recorded By" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: r.students?.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs text-muted-foreground",
							children: r.students?.student_code
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.classes?.name ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: fmtDate(r.attendance_date) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.arrival_time ? fmtTime(r.arrival_time) : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.departure_time ? fmtTime(r.departure_time) : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.recorded_by_name ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: canAdminEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: r.status,
							onValueChange: (v) => supabase.from("attendance").update({ status: v }).eq("id", r.id).then(() => {
								toast.success("Updated");
								qc.invalidateQueries({ queryKey: ["attendance"] });
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-28 h-7 text-xs capitalize",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"present",
								"absent",
								"sick"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								className: "capitalize text-xs",
								children: s === "present" ? "✓ Present" : s === "absent" ? "✕ Absent" : "Sick"
							}, s)) })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status }) })
					] }, r.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 7,
						className: "text-center text-muted-foreground py-6",
						children: "No attendance records match your filter criteria."
					}) })] })] })
				})] })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedPermission,
				onOpenChange: (open) => !open && setSelectedPermission(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-md",
					children: selectedPermission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: selectedPermission.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["Date: ", fmtDate(selectedPermission.permission_date || registerDate)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold",
								children: selectedPermission.title || "Student Permission Request"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
								className: "text-xs",
								children: [
									"Submitted by",
									" ",
									selectedPermission.parent_name || selectedPermission.teacher_name || "Parent"
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-muted/60 p-3 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Student:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: selectedPermission.student_name || "Student"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Requested Date:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: selectedPermission.permission_date
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Submitted:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(selectedPermission.created_at) })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Reason & Parent Explanation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 rounded border p-2.5 leading-relaxed bg-background text-foreground text-xs",
								children: selectedPermission.reason || "No detailed reason provided."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: canAdminEdit && selectedPermission.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex w-full items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "text-rose-600 border-rose-200 hover:bg-rose-50 text-xs",
									onClick: () => decidePermission.mutate({
										id: selectedPermission.id,
										status: "rejected"
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5 mr-1" }), " Reject"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs",
									onClick: () => decidePermission.mutate({
										id: selectedPermission.id,
										status: "approved",
										studentId: selectedPermission.student_id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1" }), " Approve & Excuse"]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSelectedPermission(null),
								className: "w-full text-xs",
								children: "Close"
							})
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showCorrectionDialog,
				onOpenChange: setShowCorrectionDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 text-primary" }), " Request Attendance Correction"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs",
							children: [
								"Past attendance is locked. Submit a request to the Secretary/Administration to update the record for ",
								fmtDate(registerDate),
								"."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Select Student"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: correctionStudentId,
										onValueChange: setCorrectionStudentId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose student" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classStudents ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: s.id,
											className: "text-xs",
											children: [
												s.full_name,
												" (",
												s.student_code,
												")"
											]
										}, s.id)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Requested Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: correctionTargetStatus,
										onValueChange: setCorrectionTargetStatus,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "text-xs capitalize",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
											"present",
											"late",
											"sick",
											"absent"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											className: "capitalize text-xs",
											children: s
										}, s)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Reason for Correction"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										placeholder: "Explain why the record needs to be updated (e.g., student arrived late with permit, wrong button pressed)...",
										value: correctionReason,
										onChange: (e) => setCorrectionReason(e.target.value),
										className: "text-xs"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowCorrectionDialog(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => submitCorrection.mutate(),
							disabled: !correctionStudentId || !correctionReason.trim() || submitCorrection.isPending,
							children: "Send Request"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { AttendancePage as component };
