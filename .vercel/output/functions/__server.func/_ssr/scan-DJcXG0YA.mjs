import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, o as fetchClasses, r as StatCard, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { E as QrCode, H as LogIn, V as LogOut, a as UserX, b as Search, bt as Camera, ft as Clock, mt as CircleCheck, p as Thermometer, r as Users, s as UserCheck, xt as CameraOff } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D3O6XtEq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-4Ko9UcMs.mjs";
import { t as Route } from "./scan-CoObJ7-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-DJcXG0YA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function buildMessage(opts) {
	const s = opts.status.toUpperCase();
	return {
		subject: "Attendance Notification",
		body: [
			"Dear Parent,",
			"",
			{
				present: `Your child ${opts.studentName} has arrived at school on ${opts.date} at ${opts.time}.`,
				absent: `Your child ${opts.studentName} has been marked ABSENT on ${opts.date}.`,
				sick: `Your child ${opts.studentName} has been marked SICK on ${opts.date}.`,
				late: `Your child ${opts.studentName} has been marked LATE on ${opts.date} at ${opts.time}.`
			}[opts.status],
			"",
			`Status: ${s}`,
			`Class: ${opts.className}`,
			`Recorded By: Teacher ${opts.teacher}`,
			"",
			"Thank you.",
			opts.schoolName
		].join("\n")
	};
}
/** Records the parent notification for an attendance entry. */
var queueAttendanceNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("7112ee1cf0cbede9015f0e18a2217611f7bdbf6ab36f0fccbe3aef15d408c6df"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/scan.tsx?tsr-split=component";
var STATUSES = [
	{
		value: "present",
		label: "Present",
		icon: UserCheck,
		tone: "bg-success text-success-foreground"
	},
	{
		value: "absent",
		label: "Absent",
		icon: UserX,
		tone: "bg-destructive text-destructive-foreground"
	},
	{
		value: "sick",
		label: "Sick",
		icon: Thermometer,
		tone: "bg-warning text-warning-foreground"
	},
	{
		value: "late",
		label: "Late",
		icon: Clock,
		tone: "bg-info text-info-foreground"
	}
];
function ScanPage() {
	const { profile, user } = useAuth();
	const [classId, setClassId] = (0, import_react.useState)("all");
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [manual, setManual] = (0, import_react.useState)("");
	const [student, setStudent] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("present");
	const [mode, setMode] = (0, import_react.useState)("arrival");
	const [note, setNote] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const scannerRef = (0, import_react.useRef)(null);
	const { tab: initialTab } = Route.useSearch();
	const [tab, setTab] = (0, import_react.useState)(initialTab);
	const [staffQuery, setStaffQuery] = (0, import_react.useState)("");
	const [savingStaff, setSavingStaff] = (0, import_react.useState)(null);
	const { data: staffPermissions } = useQuery({
		queryKey: ["staff-permissions-pending"],
		queryFn: async () => {
			const { data } = await supabase.from("permission_requests").select("teacher_id, status").in("status", ["pending", "approved"]);
			return data ?? [];
		}
	});
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: staff } = useQuery({
		queryKey: ["staff-profiles"],
		queryFn: async () => {
			const { data } = await supabase.from("profiles").select("id, full_name, email, phone, active").order("full_name");
			return data ?? [];
		}
	});
	const { data: staffToday, refetch: refetchStaffToday } = useQuery({
		queryKey: ["staff-attendance-today"],
		queryFn: async () => {
			const { data } = await supabase.from("staff_attendance").select("*").eq("attendance_date", todayISO());
			return data ?? [];
		}
	});
	const recordStaff = async (staffId, staffName, kind) => {
		setSavingStaff(staffId);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = (staffToday ?? []).find((r) => r.staff_id === staffId);
		const patch = {
			staff_id: staffId,
			staff_name: staffName,
			status: "present",
			attendance_date: todayISO(),
			recorded_by: user?.id ?? null,
			recorded_by_name: profile?.full_name ?? "",
			arrival_time: kind === "arrival" ? now : existing?.arrival_time ?? null,
			departure_time: kind === "departure" ? now : existing?.departure_time ?? null
		};
		const { error } = existing ? await supabase.from("staff_attendance").update(patch).eq("id", existing.id) : await supabase.from("staff_attendance").insert(patch);
		setSavingStaff(null);
		if (error) {
			toast.error(error.message);
			return;
		}
		await logAudit("staff_attendance.record", "staff_attendance", {
			staff: staffName,
			kind
		});
		if (kind === "arrival") {
			toast.success("Welcome back to school! 👋", {
				description: `${staffName} marked PRESENT · Arrival ${fmtTime(now)}`,
				duration: 5e3
			});
			const staffMember = (staff ?? []).find((s) => s.id === staffId);
			if (staffMember?.email) await supabase.from("parent_notifications").insert({
				student_id: null,
				parent_id: staffId,
				recipient_email: staffMember.email,
				subject: "Welcome back to school!",
				body: `Welcome back to school, ${staffName}! Your arrival was recorded at ${fmtTime(now)}. Have a great teaching day!`,
				status: "sent"
			}).select().maybeSingle();
		} else toast.success(`${staffName} departure recorded at ${fmtTime(now)}`);
		refetchStaffToday();
	};
	const { data: todayStats, refetch: refetchStats } = useQuery({
		queryKey: ["scan-today"],
		queryFn: async () => {
			const { data } = await supabase.from("attendance").select("status").eq("attendance_date", todayISO());
			return data ?? [];
		}
	});
	const lookup = async (code) => {
		const value = code.trim();
		if (!value) return;
		const staffMatch = (staff ?? []).find((s) => s.id === value || s.email.toLowerCase() === value.toLowerCase());
		if (staffMatch) {
			await recordStaff(staffMatch.id, staffMatch.full_name, "arrival");
			return;
		}
		const { data, error } = await supabase.from("students").select("*, classes(name)").or(`qr_token.eq.${value},student_code.eq.${value}`).maybeSingle();
		if (error || !data) {
			toast.error("No student or staff member found for this code");
			return;
		}
		if (classId !== "all" && data.class_id !== classId) {
			toast.error(`${data.full_name} is not in the selected class`);
			return;
		}
		setStudent(data);
		setStatus("present");
		setNote("");
	};
	const stopScanner = async () => {
		try {
			await scannerRef.current?.stop();
			scannerRef.current?.clear();
		} catch {}
		scannerRef.current = null;
		setScanning(false);
	};
	(0, import_react.useEffect)(() => {
		if (!scanning) return;
		let cancelled = false;
		(async () => {
			const { Html5Qrcode } = await import("../_libs/html5-qrcode.mjs").then((n) => n.t);
			if (cancelled) return;
			const instance = new Html5Qrcode("qr-reader");
			scannerRef.current = instance;
			try {
				await instance.start({ facingMode: "environment" }, {
					fps: 10,
					qrbox: {
						width: 240,
						height: 240
					}
				}, (decoded) => {
					instance.stop().then(() => {
						scannerRef.current = null;
						setScanning(false);
						lookup(decoded);
					});
				}, () => void 0);
			} catch {
				toast.error("Unable to access the camera. Use the manual code box instead.");
				setScanning(false);
			}
		})();
		return () => {
			cancelled = true;
			stopScanner();
		};
	}, [scanning]);
	const submit = async () => {
		if (!student) return;
		setSaving(true);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const payload = {
			student_id: student.id,
			class_id: student.class_id,
			status,
			attendance_date: todayISO(),
			recorded_by: user?.id ?? null,
			recorded_by_name: profile?.full_name ?? "",
			note: note || null
		};
		if (mode === "arrival") payload.arrival_time = status === "absent" ? null : now;
		else payload.departure_time = now;
		const { error } = await supabase.from("attendance").upsert(payload, { onConflict: "student_id,attendance_date" });
		if (error) {
			setSaving(false);
			toast.error(error.message);
			return;
		}
		const { subject, body } = buildMessage({
			studentName: student.full_name,
			status,
			date: fmtDate(/* @__PURE__ */ new Date()),
			time: fmtTime(/* @__PURE__ */ new Date()),
			className: student.classes?.name ?? "—",
			teacher: profile?.full_name ?? "",
			schoolName: "SchoolTrack Primary School"
		});
		const finalBody = mode === "departure" ? `${body}\n\nDeparture time: ${fmtTime(/* @__PURE__ */ new Date())}` : body;
		if (student.parent_email) await queueAttendanceNotification({ data: {
			studentId: student.id,
			parentId: student.parent_id,
			recipientEmail: student.parent_email,
			subject,
			body: finalBody
		} }).catch(() => toast.warning("Attendance saved, but the parent notification could not be recorded."));
		await logAudit("attendance.record", "attendance", {
			student: student.full_name,
			status,
			mode
		});
		setSaving(false);
		toast.success(`${student.full_name} marked ${status.toUpperCase()}`);
		setStudent(null);
		setManual("");
		refetchStats();
	};
	const c = (s) => (todayStats ?? []).filter((a) => a.status === s).length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "QR Scanner",
			description: "Scan student ID cards, and record teacher & staff arrival and departure."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 330,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mb-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: tab === "students" ? "default" : "outline",
				onClick: () => setTab("students"),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 334,
					columnNumber: 11
				}, this), " Students"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 333,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: tab === "staff" ? "default" : "outline",
				onClick: () => setTab("staff"),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 337,
					columnNumber: 11
				}, this), " Teachers & staff"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 336,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 332,
			columnNumber: 7
		}, this),
		tab === "staff" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
			className: "text-base",
			children: "Teacher & staff attendance"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 343,
			columnNumber: 13
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Only the secretary records staff arrival and departure." }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 344,
			columnNumber: 13
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 342,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "min-w-56 flex-1 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: "staff-search",
						children: "Search staff"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 351,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						id: "staff-search",
						value: staffQuery,
						placeholder: "Name or email",
						onChange: (e) => setStaffQuery(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 352,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 350,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 349,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Staff member" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 360,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "In" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 361,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Out" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 362,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 363,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
						className: "text-right",
						children: "Record"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 364,
						columnNumber: 21
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 359,
					columnNumber: 19
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 358,
					columnNumber: 17
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [(staff ?? []).filter((p) => {
					const q = staffQuery.trim().toLowerCase();
					if (!q) return true;
					return p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
				}).map((p) => {
					const rec = (staffToday ?? []).find((r) => r.staff_id === p.id);
					const permission = (staffPermissions ?? []).find((r) => r.teacher_id === p.id);
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-medium",
							children: p.full_name || "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 377,
							columnNumber: 29
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: p.email
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 378,
							columnNumber: 29
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 376,
							columnNumber: 27
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: rec?.arrival_time ? fmtTime(rec.arrival_time) : "—" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 380,
							columnNumber: 27
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: rec?.departure_time ? fmtTime(rec.departure_time) : "—" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 383,
							columnNumber: 27
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [rec ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: rec.status }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 387,
							columnNumber: 36
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs text-muted-foreground",
							children: "Not scanned"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 387,
							columnNumber: 74
						}, this), permission && /* @__PURE__ */ (void 0)("div", {
							className: "mt-1 inline-flex rounded-full bg-warning/25 px-2 py-0.5 text-[11px] font-medium text-warning-foreground",
							children: "Permission requested"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 388,
							columnNumber: 44
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 386,
							columnNumber: 27
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									disabled: savingStaff === p.id,
									onClick: () => void recordStaff(p.id, p.full_name, "arrival"),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogIn, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 395,
										columnNumber: 33
									}, this), " Arrival"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 394,
									columnNumber: 31
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "outline",
									disabled: savingStaff === p.id,
									onClick: () => void recordStaff(p.id, p.full_name, "departure"),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 398,
										columnNumber: 33
									}, this), " Departure"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 397,
									columnNumber: 31
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 393,
								columnNumber: 29
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 392,
							columnNumber: 27
						}, this)
					] }, p.id, true, {
						fileName: _jsxFileName,
						lineNumber: 375,
						columnNumber: 24
					}, this);
				}), !(staff ?? []).length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
					colSpan: 5,
					className: "text-center text-muted-foreground",
					children: "No staff profiles found."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 405,
					columnNumber: 23
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 404,
					columnNumber: 45
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 367,
					columnNumber: 17
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 357,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 356,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 348,
			columnNumber: 11
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 341,
			columnNumber: 26
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Today's attendance",
					value: todayStats?.length ?? 0,
					icon: CircleCheck
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 415,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Present",
					value: c("present"),
					icon: UserCheck,
					tone: "success"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 416,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Absent",
					value: c("absent"),
					icon: UserX,
					tone: "destructive"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 417,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Sick",
					value: c("sick"),
					icon: Thermometer,
					tone: "warning"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 418,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Late",
					value: c("late"),
					icon: Clock,
					tone: "info"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 419,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 414,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "text-base",
				children: "1. Select class & scan"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 425,
				columnNumber: 17
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Point the camera at the QR code on the student's ID card." }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 426,
				columnNumber: 17
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 424,
				columnNumber: 15
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Class" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 433,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: classId,
								onValueChange: setClassId,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 436,
									columnNumber: 25
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 435,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "all",
									children: "All classes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 439,
									columnNumber: 25
								}, this), (classes ?? []).map((cl) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: cl.id,
									children: cl.name
								}, cl.id, false, {
									fileName: _jsxFileName,
									lineNumber: 440,
									columnNumber: 52
								}, this))] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 438,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 434,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 432,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Scan type" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 447,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: mode === "arrival" ? "default" : "outline",
									className: "flex-1",
									onClick: () => setMode("arrival"),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogIn, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 450,
										columnNumber: 25
									}, this), " Arrival"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 449,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: mode === "departure" ? "default" : "outline",
									className: "flex-1",
									onClick: () => setMode("departure"),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 453,
										columnNumber: 25
									}, this), " Departure"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 452,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 448,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 446,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 431,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						id: "qr-reader",
						className: "overflow-hidden rounded-xl border bg-muted"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 459,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: scanning ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: () => void stopScanner(),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CameraOff, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 463,
								columnNumber: 23
							}, this), " Stop camera"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 462,
							columnNumber: 31
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							className: "flex-1",
							onClick: () => setScanning(true),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 465,
								columnNumber: 23
							}, this), " Start camera"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 464,
							columnNumber: 33
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 461,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "manual",
							children: "Or enter the student ID / QR code manually"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 470,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "manual",
								value: manual,
								placeholder: "STD-0001",
								onChange: (e) => setManual(e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 472,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "secondary",
								onClick: () => void lookup(manual),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 474,
									columnNumber: 23
								}, this), " Find"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 473,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 471,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 469,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 430,
				columnNumber: 15
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 423,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "text-base",
				children: "2. Student profile & status"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 483,
				columnNumber: 17
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "The parent is notified as soon as you submit." }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 484,
				columnNumber: 17
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 482,
				columnNumber: 15
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: !student ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "Scan or search a student to continue."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 487,
				columnNumber: 29
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-4 rounded-xl border bg-muted/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xl font-bold text-primary",
							children: student.photo_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: student.photo_url,
								alt: student.full_name,
								className: "size-full object-cover"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 492,
								columnNumber: 46
							}, this) : student.full_name.charAt(0)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 491,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "truncate text-lg font-semibold",
									children: student.full_name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 495,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										student.student_code,
										" · ",
										student.classes?.name ?? "No class",
										" ·",
										" ",
										student.gender
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 496,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "truncate text-sm text-muted-foreground",
									children: ["Parent: ", student.parent_email ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 500,
									columnNumber: 25
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 494,
							columnNumber: 23
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 490,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setStatus(s.value),
							className: `flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-semibold transition-all ${status === s.value ? `${s.tone} border-transparent` : "bg-card hover:bg-accent"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(s.icon, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 508,
								columnNumber: 27
							}, this), s.label]
						}, s.value, true, {
							fileName: _jsxFileName,
							lineNumber: 507,
							columnNumber: 42
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 506,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "note",
							children: "Note (optional)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 514,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							id: "note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Any remark for this record"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 515,
							columnNumber: 23
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 513,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between rounded-lg bg-muted p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-muted-foreground",
							children: "Recording"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 519,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-medium",
							children: [
								mode === "arrival" ? "Arrival" : "Departure",
								" · ",
								fmtDate(/* @__PURE__ */ new Date()),
								" ·",
								" ",
								fmtTime(/* @__PURE__ */ new Date())
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 520,
							columnNumber: 23
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 518,
						columnNumber: 21
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 527,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								className: "ml-auto",
								onClick: () => void submit(),
								disabled: saving,
								children: saving ? "Saving…" : "Submit attendance"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 528,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								onClick: () => setStudent(null),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 531,
								columnNumber: 23
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 526,
						columnNumber: 21
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 489,
				columnNumber: 26
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 486,
				columnNumber: 15
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 481,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 422,
			columnNumber: 11
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 413,
			columnNumber: 19
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 329,
		columnNumber: 10
	}, this);
}
//#endregion
export { ScanPage as component };
