import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, d as todayISO, i as StatusBadge, o as fetchClasses, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { St as Calendar, g as ShieldCheck, nt as FileCheck, t as X, vt as Check, y as Send } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions-DFiUnngV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: isParent ? "Leave & Permission Requests" : "Permissions & Requests",
				description: isParent ? "Submit leave and permission requests for your child. The school administration and secretary review all requests." : isTeacher ? "Submit class access requests or view your permission statuses." : "Review and approve student leave requests from parents and access requests from teachers."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [
					isParent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "lg:col-span-1 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 text-primary" }), " Request Leave for Child"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Submit absence notices or medical leave. The secretary reviews and excuses attendance." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Select Child" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedChildId,
										onValueChange: setSelectedChildId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose student" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (myChildren ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: c.id,
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
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Permission Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Medical Appointment / Sick Leave / Family Travel",
										value: permissionTitle,
										onChange: (e) => setPermissionTitle(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Permission Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: permissionDate,
										onChange: (e) => setPermissionDate(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason & Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										value: permissionReason,
										onChange: (e) => setPermissionReason(e.target.value),
										placeholder: "Explain the reason for absence..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full gap-2",
									onClick: () => submitParentPermission.mutate(),
									disabled: !selectedChildId || !permissionTitle.trim() || !permissionReason.trim() || submitParentPermission.isPending,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), " Send Request"]
								})
							]
						})]
					}),
					isTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "lg:col-span-1 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), " Request Class Access"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Ask the secretary for access to a class. Once approved, that class appears on your dashboard." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: teacherClassId,
										onValueChange: setTeacherClassId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										value: teacherReason,
										onChange: (e) => setTeacherReason(e.target.value),
										placeholder: "e.g. I teach Mathematics and Science in this class."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full gap-2",
									onClick: () => submitTeacherClassRequest.mutate(),
									disabled: !teacherClassId || submitTeacherClassRequest.isPending,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), " Send Access Request"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: cn(isParent || isTeacher ? "lg:col-span-2" : "lg:col-span-3"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base font-semibold flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-4 text-primary" }),
										isParent ? "Submitted Leave Requests" : "Requests & Permissions",
										canReview && pendingCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "ml-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400",
											children: [pendingCount, " Pending"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: isParent ? "Track your child's leave permissions and administrative approval." : "Requests sent by parents and teachers awaiting approval." })] }), canReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: filterType,
										onValueChange: (v) => setFilterType(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 text-xs w-36",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All types" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All Types"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "student_leave",
												children: "Student Leave"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "class_access",
												children: "Class Access"
											})
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: filterStatus,
										onValueChange: (v) => setFilterStatus(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 text-xs w-28",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pending",
												children: "Pending"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "approved",
												children: "Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "rejected",
												children: "Rejected"
											})
										] })]
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "overflow-x-auto p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Type / Title" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: isParent ? "Child" : "Requester" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Target Date / Class" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Action"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredRequests.map((r) => {
								const isStudentLeave = r.type === "student_leave";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "hover:bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm",
											children: isStudentLeave ? r.title || "Student Leave" : "Class Access"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5",
											children: [isStudentLeave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] py-0 h-4",
												children: "Leave"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] py-0 h-4",
												children: "Access"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(r.created_at) })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: isStudentLeave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-sm text-foreground",
											children: r.student_name || "Student"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: ["Parent: ", r.parent_name || r.teacher_name]
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-sm text-foreground",
											children: r.teacher_name || "Teacher"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Staff Access"
										})] }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: isStudentLeave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.permission_date || fmtDate(r.created_at) })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-medium",
											children: r.classes?.name ?? "Class"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
											className: "max-w-[200px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: r.reason || "—"
											}), r.decision_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-[10px] text-primary italic mt-0.5",
												children: ["Note: ", r.decision_note]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "sm",
													className: "h-7 text-xs px-2",
													onClick: () => {
														setInspectedRequest(r);
														setDecisionNote(r.decision_note || "");
													},
													children: "Details"
												}), canReview && r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													className: "h-7 text-xs px-2 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white",
													onClick: () => decide.mutate({
														id: r.id,
														status: "approved"
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Approve"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-7 text-xs px-2 gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30",
													onClick: () => decide.mutate({
														id: r.id,
														status: "rejected"
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" }), " Reject"]
												})] })]
											})
										})
									]
								}, r.id);
							}), !filteredRequests.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 6,
								className: "py-8 text-center text-xs text-muted-foreground",
								children: "No permission requests found."
							}) })] })] })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!inspectedRequest,
				onOpenChange: (open) => !open && setInspectedRequest(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-md",
					children: inspectedRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: inspectedRequest.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["Submitted ", fmtDate(inspectedRequest.created_at)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg font-bold",
								children: inspectedRequest.type === "student_leave" ? inspectedRequest.title || "Student Leave Permission" : "Class Access Request"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs",
								children: inspectedRequest.type === "student_leave" ? `Request for student ${inspectedRequest.student_name}` : `Teacher access request for ${inspectedRequest.classes?.name || "Class"}`
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/50 p-3 space-y-1.5 text-xs",
									children: [inspectedRequest.type === "student_leave" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Student:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: inspectedRequest.student_name
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Parent:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: inspectedRequest.parent_name || inspectedRequest.teacher_name
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Permission Date:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-primary",
												children: inspectedRequest.permission_date || fmtDate(inspectedRequest.created_at)
											})]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Teacher:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: inspectedRequest.teacher_name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Class:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: inspectedRequest.classes?.name
										})]
									})] }), inspectedRequest.reviewed_by_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between border-t pt-1.5 mt-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Reviewed by:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium",
											children: [
												inspectedRequest.reviewed_by_name,
												" (",
												fmtDate(inspectedRequest.reviewed_at),
												")"
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Reason stated by requester"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 rounded border p-2.5 text-xs leading-relaxed bg-background",
									children: inspectedRequest.reason || "No detailed reason provided."
								})] }),
								canReview && inspectedRequest.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Decision Note (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Approved with medical certificate / Class access granted",
										value: decisionNote,
										onChange: (e) => setDecisionNote(e.target.value),
										className: "text-xs"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: canReview && inspectedRequest.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex w-full items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 text-xs",
									onClick: () => decide.mutate({
										id: inspectedRequest.id,
										status: "rejected",
										note: decisionNote
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), " Reject Request"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs",
									onClick: () => decide.mutate({
										id: inspectedRequest.id,
										status: "approved",
										note: decisionNote
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Approve Permission"]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setInspectedRequest(null),
								className: "w-full",
								children: "Close"
							})
						})
					] })
				})
			})
		]
	});
}
//#endregion
export { PermissionsPage as component };
