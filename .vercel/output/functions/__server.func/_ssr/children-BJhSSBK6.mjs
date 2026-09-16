import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, n as ParentStatusBadge, r as StatCard, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { Ot as Baby, St as Calendar, _ as ShieldAlert, a as UserX, et as FileSpreadsheet, ft as Clock, k as Plus, l as Trophy, mt as CircleCheck, nt as FileCheck, tt as FileDown, u as TriangleAlert, vt as Check, wt as CalendarCheck, y as Send, z as MapPin } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/children-BJhSSBK6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/children.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "My Children",
				description: "Monitor daily school attendance for yesterday, today, and tomorrow, and request leave permissions.",
				action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "gap-2 shadow-sm",
					onClick: () => {
						if (data?.students?.length) setPermissionStudentId(data.students[0].id);
						setShowPermissionDialog(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 185,
						columnNumber: 13
					}, this), " Request Leave / Permission"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 179,
					columnNumber: 160
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 179,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-3 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "size-4 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 191,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "View Day Status:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 192,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 190,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setSelectedDay(yesterdayStr),
							className: cn("rounded-lg px-3 py-1 text-xs font-medium border transition-colors", selectedDay === yesterdayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
							children: [
								"Yesterday (",
								fmtDate(yesterdayStr),
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 198,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setSelectedDay(todayStr),
							className: cn("rounded-lg px-3 py-1 text-xs font-medium border transition-colors", selectedDay === todayStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
							children: [
								"Today (",
								fmtDate(todayStr),
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 201,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setSelectedDay(tomorrowStr),
							className: cn("rounded-lg px-3 py-1 text-xs font-medium border transition-colors", selectedDay === tomorrowStr ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"),
							children: [
								"Tomorrow (",
								fmtDate(tomorrowStr),
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 204,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 197,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 189,
				columnNumber: 7
			}, this),
			!data?.students.length && !isLoading && /* @__PURE__ */ (void 0)(Card, {
				className: "border-dashed py-12 text-center",
				children: /* @__PURE__ */ (void 0)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (void 0)(Baby, { className: "mx-auto size-10 text-muted-foreground/50" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 212,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "font-semibold text-base",
							children: "No children linked to your account"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 213,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto",
							children: "Please contact the school secretary with your child's student registration code to link their profile."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 214,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 211,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 210,
				columnNumber: 48
			}, this),
			(data?.students ?? []).map((s) => {
				const rows = (data?.attendance ?? []).filter((a) => a.student_id === s.id);
				const permissions = (data?.permissions ?? []).filter((p) => p.student_id === s.id);
				const presentCount = rows.filter((r) => r.status === "present" || r.status === "late").length;
				const absentCount = rows.filter((r) => r.status === "absent" || r.status === "sick").length;
				const rate = rows.length ? Math.round(presentCount / rows.length * 100) : 0;
				const dayRecord = rows.find((r) => r.attendance_date === selectedDay);
				const dayPermission = permissions.find((p) => p.permission_date === selectedDay);
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "shadow-sm border",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "border-b pb-4",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
									className: "text-lg font-bold",
									children: s.full_name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 237,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									className: "font-mono text-xs",
									children: s.student_code
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 238,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
								className: "text-xs mt-0.5",
								children: [
									"Class:",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-semibold text-foreground",
										children: s.classes?.name ?? "Assigned Class"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 244,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 242,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 235,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-lg border bg-muted/40 px-3 py-1.5 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground",
										children: ["Status on ", fmtDate(selectedDay)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 253,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-0.5 flex items-center justify-end gap-1.5",
										children: dayRecord ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParentStatusBadge, { status: dayRecord.status }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 257,
											columnNumber: 36
										}, this) : dayPermission ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "inline-flex items-center gap-1 text-xs font-semibold text-amber-600",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileCheck, { className: "size-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 258,
													columnNumber: 27
												}, this),
												" Permission ",
												dayPermission.status
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 257,
											columnNumber: 102
										}, this) : selectedDay === tomorrowStr ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground",
											children: "Scheduled Day"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 259,
											columnNumber: 65
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground",
											children: "Not recorded"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 259,
											columnNumber: 136
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 256,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 252,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "outline",
									className: "gap-1 text-xs h-8",
									onClick: () => {
										setPermissionStudentId(s.id);
										setPermissionDate(selectedDay);
										setShowPermissionDialog(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 268,
										columnNumber: 21
									}, this), " Request Leave"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 263,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 234,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 233,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "space-y-6 pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
										label: "Attendance Rate",
										value: `${rate}%`,
										icon: CircleCheck,
										tone: "success",
										hint: "Calculated from gate logs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 277,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
										label: "Days Present",
										value: presentCount,
										icon: CalendarCheck,
										tone: "info",
										hint: "Present & on-time"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 278,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
										label: "Days Absent",
										value: absentCount,
										icon: UserX,
										tone: "destructive",
										hint: "Excused & unexcused"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 279,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 276,
								columnNumber: 15
							}, this),
							permissions.length > 0 && /* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border bg-muted/20 p-3 space-y-2",
								children: [/* @__PURE__ */ (void 0)("p", {
									className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
									children: [/* @__PURE__ */ (void 0)(FileCheck, { className: "size-3.5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 285,
										columnNumber: 21
									}, this), " Leave & Permission Requests"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 284,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "grid gap-2 sm:grid-cols-2",
									children: permissions.slice(0, 4).map((p) => /* @__PURE__ */ (void 0)("div", {
										className: "rounded-md border bg-card p-2.5 text-xs flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (void 0)("div", { children: [
											/* @__PURE__ */ (void 0)("p", {
												className: "font-semibold",
												children: p.title || "Absence Permission"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 290,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-[11px] text-muted-foreground",
												children: ["Date: ", p.permission_date || fmtDate(p.created_at)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 291,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-[11px] text-muted-foreground line-clamp-1 mt-0.5",
												children: ["Reason: ", p.reason]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 294,
												columnNumber: 27
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 289,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)(StatusBadge, { status: p.status }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 298,
											columnNumber: 25
										}, this)]
									}, p.id, true, {
										fileName: _jsxFileName,
										lineNumber: 288,
										columnNumber: 55
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 287,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 283,
								columnNumber: 42
							}, this),
							(() => {
								const childIncidents = (data?.discipline ?? []).filter((d) => d.student_id === s.id);
								const unacknowledgedCount = childIncidents.filter((d) => !d.parent_acknowledged).length;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-lg border bg-muted/20 p-3 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "size-3.5 text-primary" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 310,
													columnNumber: 25
												}, this),
												" Conduct & Discipline Records",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[11px] font-normal text-muted-foreground ml-1",
													children: [
														"(",
														childIncidents.length,
														" ",
														childIncidents.length === 1 ? "record" : "records",
														")"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 312,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 309,
											columnNumber: 23
										}, this), unacknowledgedCount > 0 && /* @__PURE__ */ (void 0)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300",
											children: [
												/* @__PURE__ */ (void 0)(TriangleAlert, { className: "size-3 text-amber-600" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 318,
													columnNumber: 27
												}, this),
												unacknowledgedCount,
												" requires acknowledgement"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 317,
											columnNumber: 51
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 308,
										columnNumber: 21
									}, this), childIncidents.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-md border bg-card/60 p-3 text-xs text-muted-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 324,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Exemplary Standing:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 326,
											columnNumber: 27
										}, this), " No discipline notices or conduct infractions have been recorded."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 325,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 323,
										columnNumber: 52
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-2",
										children: childIncidents.map((incident) => {
											const isPending = !incident.parent_acknowledged;
											const isMajor = incident.severity === "major";
											const isModerate = incident.severity === "moderate";
											return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: cn("rounded-md border p-3 text-xs space-y-2 transition-all", isPending ? isMajor ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20" : "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20" : "bg-card"),
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex flex-wrap items-start justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "space-y-0.5",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
																className: "flex items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																	className: "font-semibold text-foreground",
																	children: incident.category
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 338,
																	columnNumber: 37
																}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
																	variant: "outline",
																	className: cn("text-[10px] uppercase font-bold", isMajor ? "text-rose-700 bg-rose-500/10 border-rose-300" : isModerate ? "text-amber-700 bg-amber-500/10 border-amber-300" : "text-blue-700 bg-blue-500/10 border-blue-300"),
																	children: incident.severity
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 341,
																	columnNumber: 37
																}, this)]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 337,
																columnNumber: 35
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
																className: "text-[11px] text-muted-foreground flex items-center gap-2",
																children: [
																	/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: fmtDate(incident.incident_date) }, void 0, false, {
																		fileName: _jsxFileName,
																		lineNumber: 346,
																		columnNumber: 37
																	}, this),
																	incident.incident_time && /* @__PURE__ */ (void 0)("span", { children: ["· ", incident.incident_time] }, void 0, true, {
																		fileName: _jsxFileName,
																		lineNumber: 347,
																		columnNumber: 64
																	}, this),
																	/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["· Reported by ", incident.reported_by_name || "Teacher"] }, void 0, true, {
																		fileName: _jsxFileName,
																		lineNumber: 348,
																		columnNumber: 37
																	}, this)
																]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 345,
																columnNumber: 35
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 336,
															columnNumber: 33
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: isPending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															size: "sm",
															className: "h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold",
															onClick: () => acknowledgeDiscipline.mutate(incident.id),
															disabled: acknowledgeDiscipline.isPending,
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 356,
																columnNumber: 39
															}, this), " Acknowledge & Sign"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 355,
															columnNumber: 48
														}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-medium border border-emerald-500/20",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3" }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 358,
																	columnNumber: 39
																}, this),
																" Acknowledged on",
																" ",
																fmtDate(incident.parent_acknowledged_at)
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 357,
															columnNumber: 49
														}, this) }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 354,
															columnNumber: 33
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 335,
														columnNumber: 31
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: "text-foreground/90 leading-relaxed pt-0.5",
														children: incident.description
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 364,
														columnNumber: 31
													}, this),
													incident.action_taken && /* @__PURE__ */ (void 0)("div", {
														className: "text-[11px] text-muted-foreground bg-muted/40 rounded px-2.5 py-1 border",
														children: [/* @__PURE__ */ (void 0)("span", {
															className: "font-semibold text-foreground",
															children: ["Action taken by school:", " "]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 369,
															columnNumber: 35
														}, this), incident.action_taken]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 368,
														columnNumber: 57
													}, this)
												]
											}, incident.id, true, {
												fileName: _jsxFileName,
												lineNumber: 334,
												columnNumber: 26
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 329,
										columnNumber: 32
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 307,
									columnNumber: 20
								}, this);
							})(),
							(() => {
								const childClubs = (data?.clubMemberships ?? []).filter((m) => m.student_id === s.id);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "size-3.5 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 386,
												columnNumber: 25
											}, this), "Extracurricular Clubs & Activities"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 385,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/activities",
											className: "text-xs text-primary hover:underline font-medium",
											children: "Browse All Clubs →"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 389,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 384,
										columnNumber: 21
									}, this), childClubs.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-md border bg-card/60 p-3 text-xs text-muted-foreground flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Not currently enrolled in any extracurricular clubs." }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 395,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/activities",
											className: "text-xs font-semibold text-primary hover:underline",
											children: "View Club Schedules"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 396,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 394,
										columnNumber: 48
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
										children: childClubs.map((m) => {
											const club = (data?.clubs ?? []).find((c) => c.id === m.club_id);
											return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "rounded-md border bg-card p-3 text-xs space-y-1.5 shadow-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-start justify-between gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-bold text-foreground",
														children: club?.name || "School Club"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 404,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
														variant: "outline",
														className: "text-[10px] bg-primary/10 text-primary border-primary/30",
														children: m.role_in_club
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 407,
														columnNumber: 33
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 403,
													columnNumber: 31
												}, this), club && /* @__PURE__ */ (void 0)("div", {
													className: "text-[11px] text-muted-foreground space-y-0.5",
													children: [
														/* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (void 0)(Clock, { className: "size-3 shrink-0" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 413,
																columnNumber: 37
															}, this), /* @__PURE__ */ (void 0)("span", { children: club.schedule }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 414,
																columnNumber: 37
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 412,
															columnNumber: 35
														}, this),
														/* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (void 0)(MapPin, { className: "size-3 shrink-0" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 417,
																columnNumber: 37
															}, this), /* @__PURE__ */ (void 0)("span", { children: club.venue }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 418,
																columnNumber: 37
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 416,
															columnNumber: 35
														}, this),
														/* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-1.5 text-foreground/80",
															children: /* @__PURE__ */ (void 0)("span", { children: ["Coach: ", club.coach_name] }, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 421,
																columnNumber: 37
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 420,
															columnNumber: 35
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 411,
													columnNumber: 40
												}, this)]
											}, m.id, true, {
												fileName: _jsxFileName,
												lineNumber: 402,
												columnNumber: 26
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 399,
										columnNumber: 32
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 383,
									columnNumber: 20
								}, this);
							})(),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
										children: [
											"Full Attendance History (",
											rows.length,
											" records)"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 433,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 text-xs gap-1",
											onClick: () => handleExportChildPdf(s, rows),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileDown, { className: "size-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 439,
												columnNumber: 23
											}, this), " PDF"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 438,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 text-xs gap-1",
											onClick: () => handleExportChildExcel(s, rows),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileSpreadsheet, { className: "size-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 442,
												columnNumber: 23
											}, this), " Excel"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 441,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 437,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 432,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "overflow-x-auto rounded-lg border",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Date" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 451,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 452,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Arrival In" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 453,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure Out" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 454,
											columnNumber: 25
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 450,
										columnNumber: 23
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 449,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [rows.slice(0, 20).map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "font-medium text-xs",
											children: fmtDate(r.attendance_date)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 459,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParentStatusBadge, { status: r.status }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 463,
											columnNumber: 29
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 462,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: r.arrival_time ? fmtTime(r.arrival_time) : "—"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 465,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: r.departure_time ? fmtTime(r.departure_time) : "—"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 468,
											columnNumber: 27
										}, this)
									] }, r.id, true, {
										fileName: _jsxFileName,
										lineNumber: 458,
										columnNumber: 51
									}, this)), !rows.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
										colSpan: 4,
										className: "text-center text-muted-foreground py-6 text-xs",
										children: "No attendance recorded yet for this student."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 473,
										columnNumber: 27
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 472,
										columnNumber: 40
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 457,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 448,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 447,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 431,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 274,
						columnNumber: 13
					}, this)]
				}, s.id, true, {
					fileName: _jsxFileName,
					lineNumber: 232,
					columnNumber: 14
				}, this);
			}),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: showPermissionDialog,
				onOpenChange: setShowPermissionDialog,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 490,
								columnNumber: 15
							}, this), " Request Leave or Absence Permission"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 489,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "text-xs",
							children: "Submit an official permission request to the school secretary and principal."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 492,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 488,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Select Child"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 499,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: permissionStudentId,
										onValueChange: setPermissionStudentId,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Choose child" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 502,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 501,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: (data?.students ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: c.id,
											className: "text-xs",
											children: [
												c.full_name,
												" (",
												c.student_code,
												")"
											]
										}, c.id, true, {
											fileName: _jsxFileName,
											lineNumber: 505,
											columnNumber: 52
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 504,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 500,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 498,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Permission Title"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 513,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Doctor appointment, illness, bereavement...",
										value: permissionTitle,
										onChange: (e) => setPermissionTitle(e.target.value),
										className: "text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 514,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 512,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Date of Permission"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 518,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: "date",
										value: permissionDate,
										onChange: (e) => setPermissionDate(e.target.value),
										className: "text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 519,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 517,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Reason & Explanation"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 523,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 3,
										placeholder: "Please describe why your child will be absent...",
										value: permissionReason,
										onChange: (e) => setPermissionReason(e.target.value),
										className: "text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 524,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 522,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 497,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowPermissionDialog(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 529,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							onClick: () => submitPermission.mutate(),
							disabled: !permissionStudentId || !permissionTitle.trim() || !permissionReason.trim() || submitPermission.isPending,
							children: "Send Request"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 532,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 528,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 487,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 486,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 178,
		columnNumber: 10
	}, this);
}
//#endregion
export { ChildrenPage as component };
