import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { a as fetchAttendance, c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, o as fetchClasses, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { C as Save, Ct as CalendarClock, St as Calendar, U as Lock, et as FileSpreadsheet, ft as Clock, ht as CircleAlert, nt as FileCheck, t as X, tt as FileDown, vt as Check, wt as CalendarCheck, y as Send, yt as CheckCheck } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-N19aM3ZT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/attendance.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Attendance & Register",
				description: "Mark live class attendance, review parent permission notes, and export comprehensive audit records.",
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportPdf("Attendance Records", head, body, "attendance-records"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileDown, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 499,
							columnNumber: 15
						}, this), " PDF"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 498,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportExcel(head, body, "attendance-records"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileSpreadsheet, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 502,
							columnNumber: 15
						}, this), " Excel"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 501,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 497,
					columnNumber: 171
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 497,
				columnNumber: 7
			}, this),
			hasNoAssignedClasses ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 p-8 text-center shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-md mx-auto space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "size-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 grid place-items-center mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleAlert, { className: "size-6" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 510,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 509,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-base font-semibold text-foreground",
							children: "No Classes Assigned"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 512,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: "You do not have any classes assigned to your teacher account yet. As a teacher, you can only view and take attendance for classes assigned to you."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 513,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Please contact the school secretary or administrator to assign you to a class."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 517,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 508,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 507,
				columnNumber: 31
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "border-primary/20 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
					className: "border-b pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarCheck, { className: "size-5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 526,
									columnNumber: 19
								}, this), " Mark Class Attendance"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 525,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Live daily register. Select class and date to take roll call." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 528,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 524,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setRegisterDate(lastWeekStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === lastWeekStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Last Week"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 535,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setRegisterDate(yesterdayStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === yesterdayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Yesterday"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 538,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setRegisterDate(todayStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === todayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Today"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 541,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setRegisterDate(tomorrowStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === tomorrowStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Tomorrow"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 544,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: () => setRegisterDate(nextWeekStr),
										className: cn("rounded-md px-2.5 py-1 text-xs font-medium border transition-colors", registerDate === nextWeekStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
										children: "Next Week"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 547,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1 pl-2",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											type: "date",
											value: registerDate,
											onChange: (e) => setRegisterDate(e.target.value),
											className: "h-7 w-32 text-xs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 552,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 551,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 534,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 523,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Class:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 561,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "w-56",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: registerClassId,
											onValueChange: setRegisterClassId,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
												className: "h-8 text-xs bg-background",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Select class" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 565,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 564,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: availableClasses.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: c.id,
												className: "text-xs",
												children: c.name
											}, c.id, false, {
												fileName: _jsxFileName,
												lineNumber: 568,
												columnNumber: 52
											}, this)) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 567,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 563,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 562,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 560,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 577,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-semibold text-foreground",
											children: fmtDate(registerDate)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 578,
											columnNumber: 19
										}, this),
										registerDate === todayStr && /* @__PURE__ */ (void 0)(Badge, {
											variant: "secondary",
											className: "text-[10px] py-0 font-medium",
											children: "Today"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 579,
											columnNumber: 49
										}, this),
										isPastDate && /* @__PURE__ */ (void 0)(Badge, {
											variant: "outline",
											className: "text-[10px] py-0 text-muted-foreground",
											children: "Past Record"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 582,
											columnNumber: 34
										}, this),
										isFutureDate && /* @__PURE__ */ (void 0)(Badge, {
											variant: "outline",
											className: "text-[10px] py-0 text-sky-600 border-sky-300",
											children: "Upcoming Date"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 585,
											columnNumber: 36
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 576,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 559,
								columnNumber: 15
							}, this), !isDateLockedForTeacher && /* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (void 0)(Button, {
									size: "sm",
									variant: "outline",
									onClick: handleMarkAllPresent,
									disabled: !classStudents?.length,
									className: "gap-1.5 text-xs h-8",
									children: [/* @__PURE__ */ (void 0)(CheckCheck, { className: "size-3.5 text-emerald-600" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 594,
										columnNumber: 21
									}, this), " Mark All Present"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 593,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 592,
								columnNumber: 43
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 558,
							columnNumber: 13
						}, this),
						isDateLockedForTeacher && /* @__PURE__ */ (void 0)("div", {
							className: "mt-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between text-xs text-amber-800 dark:text-amber-300",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)(Lock, { className: "size-4 shrink-0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 602,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", { children: isPastDate ? `Past attendance records for ${fmtDate(registerDate)} are locked for teachers to preserve official school audit records. Only today's attendance can be marked directly.` : `Future dates (${fmtDate(registerDate)}) cannot be marked in advance. Teachers can only take roll call for today.` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 603,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 601,
								columnNumber: 17
							}, this), isPastDate && /* @__PURE__ */ (void 0)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 text-xs bg-white dark:bg-card border-amber-300 text-amber-900 dark:text-amber-200",
								onClick: () => setShowCorrectionDialog(true),
								children: [/* @__PURE__ */ (void 0)(Send, { className: "size-3 mr-1" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 608,
									columnNumber: 21
								}, this), " Request Correction"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 607,
								columnNumber: 32
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 600,
							columnNumber: 40
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs border-t pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "Enrolled: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 615,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold",
									children: currentTally.totalEnrolled
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 616,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 614,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "Present: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 619,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-emerald-600",
									children: ["✓ ", currentTally.present]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 620,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 618,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "Absent: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 623,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-rose-600",
									children: ["✕ ", currentTally.absent]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 624,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 622,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "Unmarked: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 627,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-muted-foreground",
									children: currentTally.unmarked
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 628,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 626,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 613,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 522,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "p-0 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 638,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student ID" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 639,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 640,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Permission Notes" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 641,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
							className: "text-right",
							children: isDateLockedForTeacher ? "Status" : "Mark Roll Call"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 642,
							columnNumber: 19
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 637,
						columnNumber: 17
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 636,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [(classStudents ?? []).map((student) => {
						const effectiveStatus = localStatuses[student.id];
						const record = (dayAttendance ?? []).find((a) => a.student_id === student.id);
						const permission = (dayPermissions ?? []).find((p) => p.student_id === student.id);
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
										children: student.full_name.charAt(0)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 655,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-medium text-sm leading-tight text-foreground",
										children: student.full_name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 659,
										columnNumber: 29
									}, this), record?.arrival_time && effectiveStatus === "present" && /* @__PURE__ */ (void 0)("p", {
										className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5",
										children: [
											/* @__PURE__ */ (void 0)(Clock, { className: "size-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 663,
												columnNumber: 33
											}, this),
											" In: ",
											fmtTime(record.arrival_time)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 662,
										columnNumber: 87
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 658,
										columnNumber: 27
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 654,
									columnNumber: 25
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 653,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "font-mono text-xs text-muted-foreground",
									children: student.student_code
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 669,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: effectiveStatus ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: effectiveStatus }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 674,
									columnNumber: 44
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground italic",
									children: "Unmarked"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 674,
									columnNumber: 87
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 673,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: permission ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									onClick: () => setSelectedPermission(permission),
									className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border", permission.status === "approved" ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800" : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"),
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileCheck, { className: "size-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 680,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "truncate max-w-[130px]",
											children: permission.title || "Parent Permission"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 681,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] uppercase font-bold",
											children: [
												"(",
												permission.status,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 684,
											columnNumber: 29
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 679,
									columnNumber: 39
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground",
									children: "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 687,
									columnNumber: 39
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 678,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									className: "text-right",
									children: isDateLockedForTeacher ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground",
											children: "Locked"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 693,
											columnNumber: 29
										}, this), isPastDate && /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-7 text-xs text-muted-foreground",
											onClick: () => {
												setCorrectionStudentId(student.id);
												setShowCorrectionDialog(true);
											},
											children: "Request Edit"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 694,
											columnNumber: 44
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 692,
										columnNumber: 51
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-end gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											size: "sm",
											type: "button",
											variant: effectiveStatus === "present" ? "default" : "outline",
											className: cn("h-7 px-2.5 text-xs font-semibold gap-1 transition-colors", effectiveStatus === "present" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"),
											onClick: () => handleToggleStatus(student.id, "present"),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-bold text-sm leading-none",
												children: "✓"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 702,
												columnNumber: 31
											}, this), " Present"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 701,
											columnNumber: 29
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											size: "sm",
											type: "button",
											variant: effectiveStatus === "absent" ? "default" : "outline",
											className: cn("h-7 px-2.5 text-xs font-semibold gap-1 transition-colors", effectiveStatus === "absent" ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm" : "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/20"),
											onClick: () => handleToggleStatus(student.id, "absent"),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-bold text-sm leading-none",
												children: "✕"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 705,
												columnNumber: 31
											}, this), " Absent"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 704,
											columnNumber: 29
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 700,
										columnNumber: 36
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 691,
									columnNumber: 23
								}, this)
							]
						}, student.id, true, {
							fileName: _jsxFileName,
							lineNumber: 652,
							columnNumber: 22
						}, this);
					}), !classStudents?.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
						colSpan: 5,
						className: "py-8 text-center text-xs text-muted-foreground",
						children: loadingStudents ? "Loading enrolled students..." : "No enrolled students found in this class."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 713,
						columnNumber: 21
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 712,
						columnNumber: 44
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 647,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 635,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "Class:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 723,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-foreground",
									children: availableClasses.find((c) => c.id === registerClassId)?.name || "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 724,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "·"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 727,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-emerald-600 font-semibold",
									children: [
										"✓ ",
										currentTally.present,
										" Present"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 728,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "·"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 731,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-rose-600 font-semibold",
									children: [
										"✕ ",
										currentTally.absent,
										" Absent"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 732,
									columnNumber: 17
								}, this),
								currentTally.unmarked > 0 && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground",
									children: "·"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 734,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground",
									children: [currentTally.unmarked, " Unmarked"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 735,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 733,
									columnNumber: 47
								}, this),
								hasUnsavedChanges && /* @__PURE__ */ (void 0)(Badge, {
									variant: "outline",
									className: "text-amber-600 border-amber-300 text-[10px] ml-2",
									children: "● Unsaved changes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 737,
									columnNumber: 39
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 722,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-3 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								size: "sm",
								onClick: saveAttendanceBatch,
								disabled: isDateLockedForTeacher || isSavingBatch || !classStudents?.length,
								className: "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm h-9 px-5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 744,
									columnNumber: 19
								}, this), isSavingBatch ? "Saving Attendance..." : "Save Attendance"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 743,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 742,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 721,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 634,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 521,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
				className: "pb-3 border-b",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
					className: "text-base font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarClock, { className: "size-4 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 756,
						columnNumber: 13
					}, this), " Attendance Records & History"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 755,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Search historical attendance logs, filter by custom date range, and export to PDF/Excel." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 758,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 754,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "p-4 space-y-4",
				children: hasNoAssignedClasses ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "py-8 text-center text-xs text-muted-foreground",
					children: "No attendance records to display. No classes are assigned to your teacher account."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 763,
					columnNumber: 35
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "From Date" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 768,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "date",
								value: from,
								onChange: (e) => setFrom(e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 769,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 767,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "To Date" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 772,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "date",
								value: to,
								onChange: (e) => setTo(e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 773,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 771,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Class" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 776,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: classFilter,
								onValueChange: setClassFilter,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 779,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 778,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "all",
									children: isTeacher ? "All my assigned classes" : "All classes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 782,
									columnNumber: 23
								}, this), availableClasses.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id, false, {
									fileName: _jsxFileName,
									lineNumber: 785,
									columnNumber: 50
								}, this))] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 781,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 777,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 775,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Status" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 792,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 795,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 794,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
									"all",
									"present",
									"absent",
									"sick"
								].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: s,
									className: "capitalize",
									children: s === "all" ? "All statuses" : s === "present" ? "✓ Present" : s === "absent" ? "✕ Absent" : "Sick / Excused"
								}, s, false, {
									fileName: _jsxFileName,
									lineNumber: 798,
									columnNumber: 70
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 797,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 793,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 791,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 766,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 810,
							columnNumber: 23
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 811,
							columnNumber: 23
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Date" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 812,
							columnNumber: 23
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Arrival" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 813,
							columnNumber: 23
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 814,
							columnNumber: 23
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Recorded By" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 815,
							columnNumber: 23
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 816,
							columnNumber: 23
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 809,
						columnNumber: 21
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 808,
						columnNumber: 19
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-medium",
							children: r.students?.full_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 822,
							columnNumber: 27
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-mono text-xs text-muted-foreground",
							children: r.students?.student_code
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 823,
							columnNumber: 27
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 821,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: r.classes?.name ?? "—" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 827,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: fmtDate(r.attendance_date) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 828,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: r.arrival_time ? fmtTime(r.arrival_time) : "—" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 829,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: r.departure_time ? fmtTime(r.departure_time) : "—" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 830,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: r.recorded_by_name ?? "—" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 831,
							columnNumber: 25
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: canAdminEdit ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
							value: r.status,
							onValueChange: (v) => supabase.from("attendance").update({ status: v }).eq("id", r.id).then(() => {
								toast.success("Updated");
								qc.invalidateQueries({ queryKey: ["attendance"] });
							}),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
								className: "w-28 h-7 text-xs capitalize",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 843,
									columnNumber: 33
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 842,
								columnNumber: 31
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
								"present",
								"absent",
								"sick"
							].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: s,
								className: "capitalize text-xs",
								children: s === "present" ? "✓ Present" : s === "absent" ? "✕ Absent" : "Sick"
							}, s, false, {
								fileName: _jsxFileName,
								lineNumber: 846,
								columnNumber: 73
							}, this)) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 845,
								columnNumber: 31
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 834,
							columnNumber: 43
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: r.status }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 850,
							columnNumber: 41
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 832,
							columnNumber: 25
						}, this)
					] }, r.id, true, {
						fileName: _jsxFileName,
						lineNumber: 820,
						columnNumber: 36
					}, this)), !rows.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
						colSpan: 7,
						className: "text-center text-muted-foreground py-6",
						children: "No attendance records match your filter criteria."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 854,
						columnNumber: 25
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 853,
						columnNumber: 38
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 819,
						columnNumber: 19
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 807,
						columnNumber: 17
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 806,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 765,
					columnNumber: 22
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 762,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 753,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: !!selectedPermission,
				onOpenChange: (open) => !open && setSelectedPermission(null),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: selectedPermission && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (void 0)(DialogHeader, { children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (void 0)(StatusBadge, { status: selectedPermission.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 871,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground",
									children: ["Date: ", fmtDate(selectedPermission.permission_date || registerDate)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 872,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 870,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(DialogTitle, {
								className: "text-base font-bold",
								children: selectedPermission.title || "Student Permission Request"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 876,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(DialogDescription, {
								className: "text-xs",
								children: [
									"Submitted by",
									" ",
									selectedPermission.parent_name || selectedPermission.teacher_name || "Parent"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 879,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 869,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "rounded-md bg-muted/60 p-3 space-y-1",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground",
											children: "Student:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 888,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-semibold",
											children: selectedPermission.student_name || "Student"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 889,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 887,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground",
											children: "Requested Date:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 894,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-medium",
											children: selectedPermission.permission_date
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 895,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 893,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground",
											children: "Submitted:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 898,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: fmtDate(selectedPermission.created_at) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 899,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 897,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 886,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Reason & Parent Explanation"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 904,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "mt-1 rounded border p-2.5 leading-relaxed bg-background text-foreground text-xs",
								children: selectedPermission.reason || "No detailed reason provided."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 907,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 903,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 885,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: canAdminEdit && selectedPermission.status === "pending" ? /* @__PURE__ */ (void 0)("div", {
								className: "flex w-full items-center justify-between gap-2",
								children: [/* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									size: "sm",
									className: "text-rose-600 border-rose-200 hover:bg-rose-50 text-xs",
									onClick: () => decidePermission.mutate({
										id: selectedPermission.id,
										status: "rejected"
									}),
									children: [/* @__PURE__ */ (void 0)(X, { className: "size-3.5 mr-1" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 919,
										columnNumber: 23
									}, this), " Reject"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 915,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(Button, {
									size: "sm",
									className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs",
									onClick: () => decidePermission.mutate({
										id: selectedPermission.id,
										status: "approved",
										studentId: selectedPermission.student_id
									}),
									children: [/* @__PURE__ */ (void 0)(Check, { className: "size-3.5 mr-1" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 926,
										columnNumber: 23
									}, this), " Approve & Excuse"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 921,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 914,
								columnNumber: 76
							}, this) : /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSelectedPermission(null),
								className: "w-full text-xs",
								children: "Close"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 928,
								columnNumber: 28
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 913,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 868,
						columnNumber: 34
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 867,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 866,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: showCorrectionDialog,
				onOpenChange: setShowCorrectionDialog,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 941,
								columnNumber: 15
							}, this), " Request Attendance Correction"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 940,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "text-xs",
							children: [
								"Past attendance is locked. Submit a request to the Secretary/Administration to update the record for ",
								fmtDate(registerDate),
								"."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 943,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 939,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Select Student"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 951,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: correctionStudentId,
										onValueChange: setCorrectionStudentId,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Choose student" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 954,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 953,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: (classStudents ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: s.id,
											className: "text-xs",
											children: [
												s.full_name,
												" (",
												s.student_code,
												")"
											]
										}, s.id, true, {
											fileName: _jsxFileName,
											lineNumber: 957,
											columnNumber: 51
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 956,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 952,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 950,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Requested Status"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 965,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: correctionTargetStatus,
										onValueChange: setCorrectionTargetStatus,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "text-xs capitalize",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 968,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 967,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											"present",
											"late",
											"sick",
											"absent"
										].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: s,
											className: "capitalize text-xs",
											children: s
										}, s, false, {
											fileName: _jsxFileName,
											lineNumber: 971,
											columnNumber: 67
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 970,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 966,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 964,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Reason for Correction"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 979,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 3,
										placeholder: "Explain why the record needs to be updated (e.g., student arrived late with permit, wrong button pressed)...",
										value: correctionReason,
										onChange: (e) => setCorrectionReason(e.target.value),
										className: "text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 980,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 978,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 949,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowCorrectionDialog(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 985,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							onClick: () => submitCorrection.mutate(),
							disabled: !correctionStudentId || !correctionReason.trim() || submitCorrection.isPending,
							children: "Send Request"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 988,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 984,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 938,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 937,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 496,
		columnNumber: 10
	}, this);
}
//#endregion
export { AttendancePage as component };
