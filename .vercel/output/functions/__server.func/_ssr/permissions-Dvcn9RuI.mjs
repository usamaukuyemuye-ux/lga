import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, o as fetchClasses, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { St as Calendar, g as ShieldCheck, nt as FileCheck, t as X, vt as Check, y as Send } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions-Dvcn9RuI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/permissions.tsx?tsr-split=component";
function PermissionsPage() {
	const qc = useQueryClient();
	const { role, profile, user } = useAuth();
	const isTeacher = role === "teacher";
	const isParent = role === "parent";
	const canReview = role === "admin" || role === "secretary" || role === "owner";
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [selectedChildId, setSelectedChildId] = (0, import_react.useState)("");
	const [permissionTitle, setPermissionTitle] = (0, import_react.useState)("");
	const [permissionDate, setPermissionDate] = (0, import_react.useState)(todayISO());
	const [permissionReason, setPermissionReason] = (0, import_react.useState)("");
	const [teacherClassId, setTeacherClassId] = (0, import_react.useState)("");
	const [teacherReason, setTeacherReason] = (0, import_react.useState)("");
	const [inspectedRequest, setInspectedRequest] = (0, import_react.useState)(null);
	const [decisionNote, setDecisionNote] = (0, import_react.useState)("");
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: myChildren } = useQuery({
		queryKey: ["parent-children-permissions", user?.id],
		enabled: isParent && !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id, full_name, student_code, class_id, classes(name)").eq("parent_id", user.id).order("full_name");
			return data ?? [];
		}
	});
	const { data: rawRequests, isLoading } = useQuery({
		queryKey: ["permission-requests"],
		queryFn: async () => {
			const { data, error } = await supabase.from("permission_requests").select("*, classes(name)").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const submitParentPermission = useMutation({
		mutationFn: async () => {
			if (!selectedChildId) throw new Error("Please select which child this permission is for.");
			if (!permissionTitle.trim()) throw new Error("Please enter a title for the permission.");
			if (!permissionReason.trim()) throw new Error("Please provide a reason for the absence/leave.");
			const child = (myChildren ?? []).find((c) => c.id === selectedChildId);
			const { error } = await supabase.from("permission_requests").insert({
				type: "student_leave",
				teacher_id: user.id,
				parent_id: user.id,
				teacher_name: profile?.full_name || "Parent",
				parent_name: profile?.full_name || "Parent",
				student_id: selectedChildId,
				student_name: child?.full_name ?? "Student",
				class_id: child?.class_id ?? null,
				title: permissionTitle.trim(),
				permission_date: permissionDate,
				reason: permissionReason.trim(),
				status: "pending"
			});
			if (error) throw error;
			await logAudit("permission.student_leave_request", "permission_requests", {
				student_id: selectedChildId,
				date: permissionDate
			});
		},
		onSuccess: () => {
			toast.success("Permission request submitted to the school administration.");
			setPermissionTitle("");
			setPermissionReason("");
			qc.invalidateQueries({ queryKey: ["permission-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const submitTeacherClassRequest = useMutation({
		mutationFn: async () => {
			if (!teacherClassId) throw new Error("Select the class you need access to.");
			const { error } = await supabase.from("permission_requests").insert({
				type: "class_access",
				teacher_id: user.id,
				teacher_name: profile?.full_name ?? "",
				class_id: teacherClassId,
				reason: teacherReason.trim(),
				status: "pending"
			});
			if (error) throw error;
			await logAudit("permission.request", "permission_requests", { teacherClassId });
		},
		onSuccess: () => {
			toast.success("Class access request sent to the secretary.");
			setTeacherReason("");
			setTeacherClassId("");
			qc.invalidateQueries({ queryKey: ["permission-requests"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const decide = useMutation({
		mutationFn: async (v) => {
			const { error } = await supabase.from("permission_requests").update({
				status: v.status,
				decision_note: v.note || null,
				reviewed_by: user?.id ?? null,
				reviewed_by_name: profile?.full_name ?? "Administration",
				reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", v.id);
			if (error) throw error;
			await logAudit(`permission.${v.status}`, "permission_requests", v);
		},
		onSuccess: (_, vars) => {
			toast.success(`Request marked as ${vars.status}`);
			setInspectedRequest(null);
			setDecisionNote("");
			qc.invalidateQueries({ queryKey: ["permission-requests"] });
			qc.invalidateQueries({ queryKey: ["teacher-dashboard"] });
			qc.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filteredRequests = (0, import_react.useMemo)(() => {
		let list = rawRequests ?? [];
		if (isParent) list = list.filter((r) => r.parent_id === user?.id || r.teacher_id === user?.id || (myChildren ?? []).some((c) => c.id === r.student_id));
		else if (isTeacher) list = list.filter((r) => r.teacher_id === user?.id);
		if (filterType !== "all") list = list.filter((r) => (r.type || "class_access") === filterType);
		if (filterStatus !== "all") list = list.filter((r) => r.status === filterStatus);
		return list;
	}, [
		rawRequests,
		isParent,
		isTeacher,
		user?.id,
		myChildren,
		filterType,
		filterStatus
	]);
	const pendingCount = (0, import_react.useMemo)(() => {
		return (rawRequests ?? []).filter((r) => r.status === "pending").length;
	}, [rawRequests]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: isParent ? "Leave & Permission Requests" : "Permissions & Requests",
				description: isParent ? "Submit leave and permission requests for your child. The school administration and secretary review all requests." : isTeacher ? "Submit class access requests or view your permission statuses." : "Review and approve student leave requests from parents and access requests from teachers."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 215,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [
					isParent && /* @__PURE__ */ (void 0)(Card, {
						className: "lg:col-span-1 shadow-sm",
						children: [/* @__PURE__ */ (void 0)(CardHeader, { children: [/* @__PURE__ */ (void 0)(CardTitle, {
							className: "text-base font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(Send, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 222,
								columnNumber: 17
							}, this), " Request Leave for Child"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 221,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(CardDescription, { children: "Submit absence notices or medical leave. The secretary reviews and excuses attendance." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 224,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 220,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, { children: "Select Child" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 231,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)(Select, {
										value: selectedChildId,
										onValueChange: setSelectedChildId,
										children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Choose student" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 234,
											columnNumber: 21
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 233,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: (myChildren ?? []).map((c) => /* @__PURE__ */ (void 0)(SelectItem, {
											value: c.id,
											children: [
												c.full_name,
												" (",
												c.student_code,
												")"
											]
										}, c.id, true, {
											fileName: _jsxFileName,
											lineNumber: 237,
											columnNumber: 50
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 236,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 232,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 230,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, { children: "Permission Title" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 245,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)(Input, {
										placeholder: "e.g. Medical Appointment / Sick Leave / Family Travel",
										value: permissionTitle,
										onChange: (e) => setPermissionTitle(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 246,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 244,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, { children: "Permission Date" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 250,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)(Input, {
										type: "date",
										value: permissionDate,
										onChange: (e) => setPermissionDate(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 251,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, { children: "Reason & Details" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 255,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)(Textarea, {
										rows: 3,
										value: permissionReason,
										onChange: (e) => setPermissionReason(e.target.value),
										placeholder: "Explain the reason for absence..."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 256,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 254,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)(Button, {
									className: "w-full gap-2",
									onClick: () => submitParentPermission.mutate(),
									disabled: !selectedChildId || !permissionTitle.trim() || !permissionReason.trim() || submitParentPermission.isPending,
									children: [/* @__PURE__ */ (void 0)(Send, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 260,
										columnNumber: 17
									}, this), " Send Request"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 259,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 229,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 219,
						columnNumber: 22
					}, this),
					isTeacher && /* @__PURE__ */ (void 0)(Card, {
						className: "lg:col-span-1 shadow-sm",
						children: [/* @__PURE__ */ (void 0)(CardHeader, { children: [/* @__PURE__ */ (void 0)(CardTitle, {
							className: "text-base font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(ShieldCheck, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 269,
								columnNumber: 17
							}, this), " Request Class Access"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 268,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(CardDescription, { children: "Ask the secretary for access to a class. Once approved, that class appears on your dashboard." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 271,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 267,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, { children: "Class" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 278,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)(Select, {
										value: teacherClassId,
										onValueChange: setTeacherClassId,
										children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Select class" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 281,
											columnNumber: 21
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 280,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (void 0)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id, false, {
											fileName: _jsxFileName,
											lineNumber: 284,
											columnNumber: 47
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 283,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 279,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 277,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (void 0)(Label, { children: "Reason" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 291,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)(Textarea, {
										rows: 3,
										value: teacherReason,
										onChange: (e) => setTeacherReason(e.target.value),
										placeholder: "e.g. I teach Mathematics and Science in this class."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 292,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 290,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)(Button, {
									className: "w-full gap-2",
									onClick: () => submitTeacherClassRequest.mutate(),
									disabled: !teacherClassId || submitTeacherClassRequest.isPending,
									children: [/* @__PURE__ */ (void 0)(Send, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 295,
										columnNumber: 17
									}, this), " Send Access Request"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 294,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 276,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 266,
						columnNumber: 23
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: cn(isParent || isTeacher ? "lg:col-span-2" : "lg:col-span-3"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
									className: "text-base font-semibold flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileCheck, { className: "size-4 text-primary" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 306,
											columnNumber: 19
										}, this),
										isParent ? "Submitted Leave Requests" : "Requests & Permissions",
										canReview && pendingCount > 0 && /* @__PURE__ */ (void 0)(Badge, {
											variant: "secondary",
											className: "ml-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400",
											children: [pendingCount, " Pending"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 308,
											columnNumber: 53
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 305,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: isParent ? "Track your child's leave permissions and administrative approval." : "Requests sent by parents and teachers awaiting approval." }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 312,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 304,
									columnNumber: 15
								}, this), canReview && /* @__PURE__ */ (void 0)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (void 0)(Select, {
										value: filterType,
										onValueChange: (v) => setFilterType(v),
										children: [/* @__PURE__ */ (void 0)(SelectTrigger, {
											className: "h-8 text-xs w-36",
											children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "All types" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 321,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 320,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "all",
												children: "All Types"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 324,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "student_leave",
												children: "Student Leave"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 325,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "class_access",
												children: "Class Access"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 326,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 323,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 319,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)(Select, {
										value: filterStatus,
										onValueChange: (v) => setFilterStatus(v),
										children: [/* @__PURE__ */ (void 0)(SelectTrigger, {
											className: "h-8 text-xs w-28",
											children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Status" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 332,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 331,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "all",
												children: "All Status"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 335,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "pending",
												children: "Pending"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 336,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "approved",
												children: "Approved"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 337,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)(SelectItem, {
												value: "rejected",
												children: "Rejected"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 338,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 334,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 330,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 318,
									columnNumber: 29
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 303,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 302,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "overflow-x-auto p-0",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Type / Title" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 349,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: isParent ? "Child" : "Requester" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 350,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Target Date / Class" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 351,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Reason" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 352,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 353,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-right",
									children: "Action"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 354,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 348,
								columnNumber: 17
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 347,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredRequests.map((r) => {
								const isStudentLeave = r.type === "student_leave";
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-semibold text-sm",
											children: isStudentLeave ? r.title || "Student Leave" : "Class Access"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 362,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5",
											children: [isStudentLeave ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: "outline",
												className: "text-[10px] py-0 h-4",
												children: "Leave"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 366,
												columnNumber: 45
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: "outline",
												className: "text-[10px] py-0 h-4",
												children: "Access"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 368,
												columnNumber: 40
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: fmtDate(r.created_at) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 371,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 365,
											columnNumber: 25
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 361,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: isStudentLeave ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "font-medium text-sm text-foreground",
											children: r.student_name || "Student"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 377,
											columnNumber: 29
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[11px] text-muted-foreground",
											children: ["Parent: ", r.parent_name || r.teacher_name]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 380,
											columnNumber: 29
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 376,
											columnNumber: 43
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "font-medium text-sm text-foreground",
											children: r.teacher_name || "Teacher"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 384,
											columnNumber: 29
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Staff Access"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 387,
											columnNumber: 29
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 383,
											columnNumber: 36
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 375,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: isStudentLeave ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-1.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "size-3.5 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 393,
												columnNumber: 29
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: r.permission_date || fmtDate(r.created_at) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 394,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 392,
											columnNumber: 43
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-xs font-medium",
											children: r.classes?.name ?? "Class"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 395,
											columnNumber: 36
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "max-w-[200px]",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: r.reason || "—"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 399,
												columnNumber: 25
											}, this), r.decision_note && /* @__PURE__ */ (void 0)("p", {
												className: "truncate text-[10px] text-primary italic mt-0.5",
												children: ["Note: ", r.decision_note]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 400,
												columnNumber: 45
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 398,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: r.status }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 406,
											columnNumber: 25
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 405,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													variant: "ghost",
													size: "sm",
													className: "h-7 text-xs px-2",
													onClick: () => {
														setInspectedRequest(r);
														setDecisionNote(r.decision_note || "");
													},
													children: "Details"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 411,
													columnNumber: 27
												}, this), canReview && r.status === "pending" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Button, {
													size: "sm",
													className: "h-7 text-xs px-2 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white",
													onClick: () => decide.mutate({
														id: r.id,
														status: "approved"
													}),
													children: [/* @__PURE__ */ (void 0)(Check, { className: "size-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 423,
														columnNumber: 33
													}, this), " Approve"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 419,
													columnNumber: 31
												}, this), /* @__PURE__ */ (void 0)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-7 text-xs px-2 gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30",
													onClick: () => decide.mutate({
														id: r.id,
														status: "rejected"
													}),
													children: [/* @__PURE__ */ (void 0)(X, { className: "size-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 429,
														columnNumber: 33
													}, this), " Reject"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 425,
													columnNumber: 31
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 418,
													columnNumber: 67
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 410,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 409,
											columnNumber: 23
										}, this)
									]
								}, r.id, true, {
									fileName: _jsxFileName,
									lineNumber: 360,
									columnNumber: 24
								}, this);
							}), !filteredRequests.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
								colSpan: 6,
								className: "py-8 text-center text-xs text-muted-foreground",
								children: "No permission requests found."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 438,
								columnNumber: 21
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 437,
								columnNumber: 46
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 357,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 346,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 345,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 301,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 217,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: !!inspectedRequest,
				onOpenChange: (open) => !open && setInspectedRequest(null),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: inspectedRequest && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (void 0)(DialogHeader, { children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (void 0)(StatusBadge, { status: inspectedRequest.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 454,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground",
									children: ["Submitted ", fmtDate(inspectedRequest.created_at)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 455,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 453,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(DialogTitle, {
								className: "text-lg font-bold",
								children: inspectedRequest.type === "student_leave" ? inspectedRequest.title || "Student Leave Permission" : "Class Access Request"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 459,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(DialogDescription, {
								className: "text-xs",
								children: inspectedRequest.type === "student_leave" ? `Request for student ${inspectedRequest.student_name}` : `Teacher access request for ${inspectedRequest.classes?.name || "Class"}`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 462,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 452,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-lg bg-muted/50 p-3 space-y-1.5 text-xs",
									children: [inspectedRequest.type === "student_leave" ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground",
												children: "Student:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 471,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-semibold text-foreground",
												children: inspectedRequest.student_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 472,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 470,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground",
												children: "Parent:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 477,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium text-foreground",
												children: inspectedRequest.parent_name || inspectedRequest.teacher_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 478,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 476,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground",
												children: "Permission Date:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 483,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-semibold text-primary",
												children: inspectedRequest.permission_date || fmtDate(inspectedRequest.created_at)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 484,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 482,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 469,
										columnNumber: 64
									}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground",
											children: "Teacher:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 490,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-semibold text-foreground",
											children: inspectedRequest.teacher_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 491,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 489,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground",
											children: "Class:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 496,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-medium text-foreground",
											children: inspectedRequest.classes?.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 497,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 495,
										columnNumber: 23
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 488,
										columnNumber: 27
									}, this), inspectedRequest.reviewed_by_name && /* @__PURE__ */ (void 0)("div", {
										className: "flex justify-between border-t pt-1.5 mt-1.5",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-muted-foreground",
											children: "Reviewed by:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 504,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-medium",
											children: [
												inspectedRequest.reviewed_by_name,
												" (",
												fmtDate(inspectedRequest.reviewed_at),
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 505,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 503,
										columnNumber: 57
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 468,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Reason stated by requester"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 513,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "mt-1 rounded border p-2.5 text-xs leading-relaxed bg-background",
									children: inspectedRequest.reason || "No detailed reason provided."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 516,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 512,
									columnNumber: 17
								}, this),
								canReview && inspectedRequest.status === "pending" && /* @__PURE__ */ (void 0)("div", {
									className: "space-y-1.5 pt-1",
									children: [/* @__PURE__ */ (void 0)(Label, {
										className: "text-xs",
										children: "Decision Note (Optional)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 522,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(Input, {
										placeholder: "e.g. Approved with medical certificate / Class access granted",
										value: decisionNote,
										onChange: (e) => setDecisionNote(e.target.value),
										className: "text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 523,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 521,
									columnNumber: 72
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 467,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: canReview && inspectedRequest.status === "pending" ? /* @__PURE__ */ (void 0)("div", {
								className: "flex w-full items-center justify-between gap-2",
								children: [/* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									className: "text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 text-xs",
									onClick: () => decide.mutate({
										id: inspectedRequest.id,
										status: "rejected",
										note: decisionNote
									}),
									children: [/* @__PURE__ */ (void 0)(X, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 534,
										columnNumber: 23
									}, this), " Reject Request"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 529,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(Button, {
									className: "bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs",
									onClick: () => decide.mutate({
										id: inspectedRequest.id,
										status: "approved",
										note: decisionNote
									}),
									children: [/* @__PURE__ */ (void 0)(Check, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 541,
										columnNumber: 23
									}, this), " Approve Permission"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 536,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 528,
								columnNumber: 71
							}, this) : /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								onClick: () => setInspectedRequest(null),
								className: "w-full",
								children: "Close"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 543,
								columnNumber: 28
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 527,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 451,
						columnNumber: 32
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 450,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 449,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 214,
		columnNumber: 10
	}, this);
}
//#endregion
export { PermissionsPage as component };
