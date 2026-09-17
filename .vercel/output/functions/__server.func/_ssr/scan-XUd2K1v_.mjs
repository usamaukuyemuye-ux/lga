import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, l as fmtTime, o as fetchClasses, r as StatCard, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { E as QrCode, H as LogIn, V as LogOut, a as UserX, b as Search, bt as Camera, ft as Clock, mt as CircleCheck, p as Thermometer, r as Users, s as UserCheck, xt as CameraOff } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D3O6XtEq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-4Ko9UcMs.mjs";
import { t as Route } from "./scan-9UtquTUw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-XUd2K1v_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "QR Scanner",
			description: "Scan student ID cards, and record teacher & staff arrival and departure."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: tab === "students" ? "default" : "outline",
				onClick: () => setTab("students"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4" }), " Students"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: tab === "staff" ? "default" : "outline",
				onClick: () => setTab("staff"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), " Teachers & staff"]
			})]
		}),
		tab === "staff" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Teacher & staff attendance"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Only the secretary records staff arrival and departure." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-56 flex-1 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "staff-search",
						children: "Search staff"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "staff-search",
						value: staffQuery,
						placeholder: "Name or email",
						onChange: (e) => setStaffQuery(e.target.value)
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Staff member" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "In" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Out" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Record"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(staff ?? []).filter((p) => {
					const q = staffQuery.trim().toLowerCase();
					if (!q) return true;
					return p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
				}).map((p) => {
					const rec = (staffToday ?? []).find((r) => r.staff_id === p.id);
					const permission = (staffPermissions ?? []).find((r) => r.teacher_id === p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.full_name || "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: p.email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: rec?.arrival_time ? fmtTime(rec.arrival_time) : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: rec?.departure_time ? fmtTime(rec.departure_time) : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [rec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: rec.status }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Not scanned"
						}), permission && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 inline-flex rounded-full bg-warning/25 px-2 py-0.5 text-[11px] font-medium text-warning-foreground",
							children: "Permission requested"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									disabled: savingStaff === p.id,
									onClick: () => void recordStaff(p.id, p.full_name, "arrival"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), " Arrival"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									disabled: savingStaff === p.id,
									onClick: () => void recordStaff(p.id, p.full_name, "departure"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Departure"]
								})]
							})
						})
					] }, p.id);
				}), !(staff ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "text-center text-muted-foreground",
					children: "No staff profiles found."
				}) })] })] })
			})]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Today's attendance",
					value: todayStats?.length ?? 0,
					icon: CircleCheck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Present",
					value: c("present"),
					icon: UserCheck,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Absent",
					value: c("absent"),
					icon: UserX,
					tone: "destructive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Sick",
					value: c("sick"),
					icon: Thermometer,
					tone: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Late",
					value: c("late"),
					icon: Clock,
					tone: "info"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "1. Select class & scan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Point the camera at the QR code on the student's ID card." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classId,
								onValueChange: setClassId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All classes"
								}), (classes ?? []).map((cl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: cl.id,
									children: cl.name
								}, cl.id))] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Scan type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: mode === "arrival" ? "default" : "outline",
									className: "flex-1",
									onClick: () => setMode("arrival"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), " Arrival"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: mode === "departure" ? "default" : "outline",
									className: "flex-1",
									onClick: () => setMode("departure"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Departure"]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "qr-reader",
						className: "overflow-hidden rounded-xl border bg-muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: () => void stopScanner(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-4" }), " Stop camera"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1",
							onClick: () => setScanning(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), " Start camera"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "manual",
							children: "Or enter the student ID / QR code manually"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "manual",
								value: manual,
								placeholder: "STD-0001",
								onChange: (e) => setManual(e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => void lookup(manual),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), " Find"]
							})]
						})]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "2. Student profile & status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "The parent is notified as soon as you submit." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !student ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "Scan or search a student to continue."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-xl border bg-muted/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xl font-bold text-primary",
							children: student.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: student.photo_url,
								alt: student.full_name,
								className: "size-full object-cover"
							}) : student.full_name.charAt(0)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-lg font-semibold",
									children: student.full_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										student.student_code,
										" · ",
										student.classes?.name ?? "No class",
										" ·",
										" ",
										student.gender
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm text-muted-foreground",
									children: ["Parent: ", student.parent_email ?? "—"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStatus(s.value),
							className: `flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-semibold transition-all ${status === s.value ? `${s.tone} border-transparent` : "bg-card hover:bg-accent"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-5" }), s.label]
						}, s.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "Note (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Any remark for this record"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-muted p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Recording"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								mode === "arrival" ? "Arrival" : "Departure",
								" · ",
								fmtDate(/* @__PURE__ */ new Date()),
								" ·",
								" ",
								fmtTime(/* @__PURE__ */ new Date())
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "ml-auto",
								onClick: () => void submit(),
								disabled: saving,
								children: saving ? "Saving…" : "Submit attendance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setStudent(null),
								children: "Cancel"
							})
						]
					})
				]
			}) })] })]
		})] })
	] });
}
//#endregion
export { ScanPage as component };
