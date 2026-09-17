import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn$1 } from "./utils-C_uf36nf.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { o as fetchClasses, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { B as Mail, D as Printer, E as QrCode, N as Pencil, U as Lock, Z as GraduationCap, _ as ShieldAlert, b as Search, f as Trash2, it as Eye, j as Phone, k as Plus, mt as CircleCheck, o as UserPlus, r as Users, s as UserCheck } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as StudentQrModal } from "./student-qr-modal-Df1TaQ-t.mjs";
import { n as DEFAULT_ACADEMIC_YEAR, t as ACADEMIC_YEARS } from "./students-CF6vgHGt.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-CfsmO1zn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn$1("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn$1("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function getStudentAcademicYear(s) {
	if (!s) return DEFAULT_ACADEMIC_YEAR;
	if (s.academic_year) return s.academic_year;
	if (s.created_at) {
		const yr = new Date(s.created_at).getFullYear();
		if (!isNaN(yr) && yr >= 2015 && yr <= 2030) return `${yr}-${yr + 1}`;
	}
	return DEFAULT_ACADEMIC_YEAR;
}
var empty = {
	student_code: "",
	full_name: "",
	gender: "male",
	religion: "non-muslim",
	academic_year: DEFAULT_ACADEMIC_YEAR,
	date_of_birth: "",
	class_id: "",
	parent_name: "",
	parent_email: "",
	parent_phone: "",
	address: "",
	photo_url: "",
	create_parent_account: true
};
function StudentsPage() {
	const { role, profile, user } = useAuth();
	const qc = useQueryClient();
	const canManage = role === "admin" || role === "secretary";
	const isTeacher = role === "teacher";
	const [activeTab, setActiveTab] = (0, import_react.useState)("students");
	const [search, setSearch] = (0, import_react.useState)("");
	const [classFilter, setClassFilter] = (0, import_react.useState)("all");
	const [academicYearFilter, setAcademicYearFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [profileDialogOpen, setProfileDialogOpen] = (0, import_react.useState)(false);
	const [selectedStudent, setSelectedStudent] = (0, import_react.useState)(null);
	const [qrModalOpen, setQrModalOpen] = (0, import_react.useState)(false);
	const [qrStudent, setQrStudent] = (0, import_react.useState)(null);
	const [parentDialogOpen, setParentDialogOpen] = (0, import_react.useState)(false);
	const [quickClassOpen, setQuickClassOpen] = (0, import_react.useState)(false);
	const [quickClassName, setQuickClassName] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)(empty);
	const [parentForm, setParentForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		password: "Parent123",
		studentIds: []
	});
	const { data: students } = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents
	});
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: approvedClassAccess } = useQuery({
		queryKey: ["teacher-class-access-students", profile?.id],
		enabled: isTeacher,
		queryFn: async () => {
			const { data } = await supabase.from("permission_requests").select("request_details").eq("teacher_id", profile?.id ?? "").eq("status", "approved").eq("request_type", "class_access");
			return (data ?? []).map((r) => r.request_details?.class_id).filter(Boolean);
		}
	});
	const assignedClasses = (0, import_react.useMemo)(() => {
		if (!classes) return [];
		if (!isTeacher) return classes;
		return classes.filter((c) => c.teacher_id === profile?.id || c.teacher_id === user?.id || approvedClassAccess?.includes(c.id));
	}, [
		classes,
		isTeacher,
		profile?.id,
		user?.id,
		approvedClassAccess
	]);
	const assignedClassIds = (0, import_react.useMemo)(() => new Set(assignedClasses.map((c) => c.id)), [assignedClasses]);
	const { data: registeredParents } = useQuery({
		queryKey: ["registered-parents"],
		enabled: canManage,
		queryFn: async () => {
			const { data: roles } = await supabase.from("user_roles").select("user_id, role").eq("role", "parent");
			const parentUserIds = (roles ?? []).map((r) => r.user_id);
			if (!parentUserIds.length) return [];
			const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone, active").in("id", parentUserIds);
			return profiles ?? [];
		}
	});
	const { data: studentDiscipline } = useQuery({
		queryKey: ["student-discipline-history", selectedStudent?.id],
		enabled: !!selectedStudent?.id && profileDialogOpen,
		queryFn: async () => {
			const { data, error } = await supabase.from("discipline_incidents").select("*").eq("student_id", selectedStudent.id).order("incident_date", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const visibleStudents = (0, import_react.useMemo)(() => {
		const list = students ?? [];
		if (!isTeacher) return list;
		return list.filter((s) => s.class_id && assignedClassIds.has(s.class_id));
	}, [
		students,
		isTeacher,
		assignedClassIds
	]);
	const filteredStudents = (0, import_react.useMemo)(() => visibleStudents.filter((s) => {
		const matchesClass = classFilter === "all" || s.class_id === classFilter;
		const studentYear = getStudentAcademicYear(s);
		const matchesYear = academicYearFilter === "all" || studentYear === academicYearFilter;
		const matchesSearch = `${s.full_name} ${s.student_code} ${s.classes?.name ?? ""} ${studentYear} ${s.parent_name ?? ""}`.toLowerCase().includes(search.toLowerCase());
		return matchesClass && matchesYear && matchesSearch;
	}), [
		visibleStudents,
		search,
		classFilter,
		academicYearFilter
	]);
	const filteredParents = (0, import_react.useMemo)(() => {
		return (registeredParents ?? []).filter((p) => `${p.full_name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(search.toLowerCase()));
	}, [registeredParents, search]);
	const createClassMutation = useMutation({
		mutationFn: async (className) => {
			const trimmed = className.trim();
			if (!trimmed) throw new Error("Class name is required");
			const { data, error } = await supabase.from("classes").insert({ name: trimmed }).select("id").single();
			if (error) throw error;
			await logAudit("class.create", "classes", { name: trimmed });
			return data;
		},
		onSuccess: (data) => {
			toast.success("New class created");
			setQuickClassName("");
			setQuickClassOpen(false);
			if (data?.id) setForm((prev) => ({
				...prev,
				class_id: data.id
			}));
			qc.invalidateQueries({ queryKey: ["classes"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const save = useMutation({
		mutationFn: async (f) => {
			let parentId = null;
			if (f.parent_email.trim()) {
				const { data: existingParent } = await supabase.from("profiles").select("id").eq("email", f.parent_email.trim().toLowerCase()).maybeSingle();
				if (existingParent?.id) parentId = existingParent.id;
				else if (f.create_parent_account && f.parent_name.trim()) {
					const newParentId = `user-${Date.now()}`;
					await supabase.from("profiles").upsert({
						id: newParentId,
						full_name: f.parent_name.trim(),
						email: f.parent_email.trim().toLowerCase(),
						phone: f.parent_phone.trim() || null,
						active: true
					});
					await supabase.from("user_roles").upsert({
						user_id: newParentId,
						role: "parent"
					});
					parentId = newParentId;
					await logAudit("parent.create_auto", "users", {
						email: f.parent_email,
						name: f.parent_name
					});
				}
			}
			const row = {
				student_code: f.student_code.trim(),
				full_name: f.full_name.trim(),
				gender: f.gender,
				religion: f.religion,
				academic_year: f.academic_year || "2025-2026",
				date_of_birth: f.date_of_birth || null,
				class_id: f.class_id || null,
				parent_name: f.parent_name.trim() || null,
				parent_email: f.parent_email.trim().toLowerCase() || null,
				parent_phone: f.parent_phone.trim() || null,
				address: f.address.trim() || null,
				photo_url: f.photo_url.trim() || null,
				parent_id: parentId
			};
			const res = f.id ? await supabase.from("students").update(row).eq("id", f.id) : await supabase.from("students").insert(row);
			if (res.error) throw res.error;
			await logAudit(f.id ? "student.update" : "student.create", "students", { name: f.full_name });
		},
		onSuccess: () => {
			toast.success("Student registered successfully");
			setOpen(false);
			setForm(empty);
			qc.invalidateQueries({ queryKey: ["students"] });
			qc.invalidateQueries({ queryKey: ["registered-parents"] });
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const createParentMutation = useMutation({
		mutationFn: async (pf) => {
			if (!pf.fullName.trim() || !pf.email.trim()) throw new Error("Parent full name and email are required.");
			const parentId = `user-${Date.now()}`;
			const email = pf.email.trim().toLowerCase();
			const profRes = await supabase.from("profiles").upsert({
				id: parentId,
				full_name: pf.fullName.trim(),
				email,
				phone: pf.phone.trim() || null,
				active: true
			});
			if (profRes.error) throw profRes.error;
			const roleRes = await supabase.from("user_roles").upsert({
				user_id: parentId,
				role: "parent"
			});
			if (roleRes.error) throw roleRes.error;
			if (pf.studentIds.length > 0) {
				const updateRes = await supabase.from("students").update({
					parent_id: parentId,
					parent_name: pf.fullName.trim(),
					parent_email: email,
					parent_phone: pf.phone.trim() || null
				}).in("id", pf.studentIds);
				if (updateRes.error) throw updateRes.error;
			}
			await logAudit("parent.create", "users", {
				name: pf.fullName,
				email,
				linkedStudents: pf.studentIds.length
			});
		},
		onSuccess: () => {
			toast.success("Parent account registered and linked successfully");
			setParentDialogOpen(false);
			setParentForm({
				fullName: "",
				email: "",
				phone: "",
				address: "",
				password: "Parent123",
				studentIds: []
			});
			qc.invalidateQueries({ queryKey: ["registered-parents"] });
			qc.invalidateQueries({ queryKey: ["students"] });
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("students").delete().eq("id", id);
			if (error) throw error;
			await logAudit("student.delete", "students", { id });
		},
		onSuccess: () => {
			toast.success("Student removed");
			qc.invalidateQueries({ queryKey: ["students"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const nextCode = () => `STD-${String((students?.length ?? 0) + 1).padStart(4, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Students & Parents",
				description: "Administrators and secretaries can register learners, create parent accounts, and assign classes.",
				action: canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setForm({
									...empty,
									student_code: nextCode(),
									create_parent_account: true
								}),
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Register student"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "max-h-[90vh] max-w-2xl overflow-y-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Edit student" : "Register new student" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create student profile, assign grade/class, and link parent details." })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-3 space-y-3 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }), " Learner Details"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "student_code",
														children: "Student ID / Code *"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "student_code",
														value: form.student_code,
														onChange: (e) => setForm({
															...form,
															student_code: e.target.value
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "full_name",
														children: "Full name *"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "full_name",
														placeholder: "e.g. Alice Uwase",
														value: form.full_name,
														onChange: (e) => setForm({
															...form,
															full_name: e.target.value
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class / Grade" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
																value: form.class_id,
																onValueChange: (v) => setForm({
																	...form,
																	class_id: v
																}),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
																	className: "flex-1",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" })
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: c.id,
																	children: c.name
																}, c.id)) })]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																type: "button",
																variant: "outline",
																size: "sm",
																title: "Quick create class",
																className: "px-2 text-xs",
																onClick: () => setQuickClassOpen(!quickClassOpen),
																children: "+ Class"
															})]
														}),
														quickClassOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex gap-1.5 pt-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																placeholder: "New class name (e.g. Primary 7)",
																value: quickClassName,
																onChange: (e) => setQuickClassName(e.target.value),
																className: "h-8 text-xs"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "sm",
																className: "h-8 px-2 text-xs",
																disabled: !quickClassName.trim() || createClassMutation.isPending,
																onClick: () => createClassMutation.mutate(quickClassName),
																children: "Save"
															})]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "dob",
														children: "Date of birth"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "dob",
														type: "date",
														value: form.date_of_birth,
														onChange: (e) => setForm({
															...form,
															date_of_birth: e.target.value
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: form.gender,
														onValueChange: (v) => setForm({
															...form,
															gender: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "male",
															children: "Male"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "female",
															children: "Female"
														})] })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Religion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: form.religion,
														onValueChange: (v) => setForm({
															...form,
															religion: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "muslim",
															children: "Muslim"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "non-muslim",
															children: "Non-Muslim"
														})] })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Academic Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: form.academic_year,
														onValueChange: (v) => setForm({
															...form,
															academic_year: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ACADEMIC_YEARS.map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
															value: yr,
															children: [
																yr,
																" ",
																yr === "2025-2026" ? "(Current)" : ""
															]
														}, yr)) })]
													})]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-3 space-y-3 bg-muted/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4 text-emerald-600" }), " Parent / Guardian Information"]
												}), (registeredParents ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													onValueChange: (val) => {
														const p = (registeredParents ?? []).find((x) => x.id === val);
														if (p) setForm((prev) => ({
															...prev,
															parent_name: p.full_name,
															parent_email: p.email,
															parent_phone: p.phone ?? ""
														}));
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-7 text-xs w-48",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick existing parent…" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (registeredParents ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: p.id,
														children: [
															p.full_name,
															" (",
															p.email,
															")"
														]
													}, p.id)) })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-3 sm:grid-cols-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "parent_name",
															children: "Parent name"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "parent_name",
															placeholder: "e.g. Robert Smith",
															value: form.parent_name,
															onChange: (e) => setForm({
																...form,
																parent_name: e.target.value
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "parent_email",
															children: "Parent email"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "parent_email",
															type: "email",
															placeholder: "e.g. robert.smith@example.com",
															value: form.parent_email,
															onChange: (e) => setForm({
																...form,
																parent_email: e.target.value
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "parent_phone",
															children: "Parent phone (Gate alerts)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "parent_phone",
															placeholder: "+250 788 123 456",
															value: form.parent_phone,
															onChange: (e) => setForm({
																...form,
																parent_phone: e.target.value
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "address",
															children: "Residential address"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "address",
															placeholder: "District / Sector / Cell",
															value: form.address,
															onChange: (e) => setForm({
																...form,
																address: e.target.value
															})
														})]
													})
												]
											}),
											!form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-lg bg-card p-2.5 border mt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs font-semibold cursor-pointer",
														children: "Auto-create Parent Portal account"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground",
														children: "Allows parent to log in immediately and receive gate notifications."
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													checked: form.create_parent_account,
													onCheckedChange: (checked) => setForm({
														...form,
														create_parent_account: checked
													})
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => save.mutate(form),
									disabled: !form.full_name || !form.student_code || save.isPending,
									className: "gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), " Save student"]
								}) })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: parentDialogOpen,
						onOpenChange: setParentDialogOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), " Register parent"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "max-w-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Register new parent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create a parent account and optionally link their children right away." })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "p_name",
												children: "Parent Full Name *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "p_name",
												placeholder: "e.g. Grace Mukamana",
												value: parentForm.fullName,
												onChange: (e) => setParentForm({
													...parentForm,
													fullName: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "p_email",
												children: "Email Address (Login ID) *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "p_email",
												type: "email",
												placeholder: "e.g. grace@example.com",
												value: parentForm.email,
												onChange: (e) => setParentForm({
													...parentForm,
													email: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "p_phone",
												children: "Phone Number"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "p_phone",
												placeholder: "+250 788 123 456",
												value: parentForm.phone,
												onChange: (e) => setParentForm({
													...parentForm,
													phone: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "p_pwd",
												children: "Initial Login Password"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "p_pwd",
												value: parentForm.password,
												onChange: (e) => setParentForm({
													...parentForm,
													password: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link Enrolled Students (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "max-h-36 overflow-y-auto border rounded-md p-2 space-y-1 bg-muted/10",
												children: [(students ?? []).map((s) => {
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "flex items-center gap-2 text-xs p-1 rounded hover:bg-muted cursor-pointer",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: "checkbox",
																checked: parentForm.studentIds.includes(s.id),
																onChange: (e) => {
																	if (e.target.checked) setParentForm({
																		...parentForm,
																		studentIds: [...parentForm.studentIds, s.id]
																	});
																	else setParentForm({
																		...parentForm,
																		studentIds: parentForm.studentIds.filter((id) => id !== s.id)
																	});
																},
																className: "rounded border-gray-300 text-primary"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-medium",
																children: s.full_name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-mono text-muted-foreground",
																children: [
																	"(",
																	s.student_code,
																	")"
																]
															})
														]
													}, s.id);
												}), !(students ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground py-2 text-center",
													children: "No students registered yet."
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => createParentMutation.mutate(parentForm),
									disabled: !parentForm.fullName.trim() || !parentForm.email.trim() || createParentMutation.isPending,
									children: "Create parent account"
								}) })
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: activeTab === "students" ? "default" : "ghost",
						size: "sm",
						className: "gap-2",
						onClick: () => setActiveTab("students"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }),
							" Students (",
							visibleStudents.length,
							")"
						]
					}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: activeTab === "parents" ? "default" : "ghost",
						size: "sm",
						className: "gap-2",
						onClick: () => setActiveTab("parents"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
							" Registered Parents (",
							registeredParents?.length ?? 0,
							")"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground hidden sm:block",
					children: canManage ? "Admins & Secretaries have full management rights" : isTeacher ? "Teacher view · Scoped to your assigned classes" : "Read-only view"
				})]
			}),
			isTeacher && assignedClasses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }), " No Classes Assigned"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "You do not currently have any classes assigned to your teaching profile. Teachers are only permitted to view profiles of students in classes assigned to them. Please contact the school administration to assign your classroom roster."
				})]
			}),
			activeTab === "students" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-56 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "pl-9 h-9 text-xs",
									placeholder: isTeacher ? "Search students in your classes by name or student ID…" : "Search students by name, ID, or class…",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classFilter,
								onValueChange: setClassFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-44 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: isTeacher ? "All my assigned classes" : "All classes"
								}), (isTeacher ? assignedClasses : classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id))] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: academicYearFilter,
								onValueChange: setAcademicYearFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-48 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Academic Year" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Academic Years (2015–2030)"
								}), ACADEMIC_YEARS.map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: yr,
									children: [
										yr,
										" ",
										yr === "2025-2026" ? "★ Current" : yr < "2025-2026" ? "· Past Year" : "· Future"
									]
								}, yr))] })]
							})
						]
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-border/50 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground whitespace-nowrap font-medium text-[11px] mr-1",
								children: "Secretary Archive (2015–2030):"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: academicYearFilter === "all" ? "default" : "outline",
								className: "cursor-pointer text-[10px] whitespace-nowrap hover:bg-primary/20",
								onClick: () => setAcademicYearFilter("all"),
								children: "All Years"
							}),
							ACADEMIC_YEARS.map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: academicYearFilter === yr ? "default" : "outline",
								className: cn("cursor-pointer text-[10px] whitespace-nowrap hover:bg-primary/20 font-mono", yr === "2025-2026" && "border-primary/50 text-primary font-semibold", yr < "2025-2026" && "text-muted-foreground"),
								onClick: () => setAcademicYearFilter(yr),
								children: yr
							}, yr))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student ID" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Learner Name" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Academic Year" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Gender" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Religion" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Parent / Guardian" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Actions"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono text-xs font-semibold text-primary",
								children: s.student_code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-medium text-left hover:text-primary transition-colors cursor-pointer",
								onClick: () => {
									setSelectedStudent(s);
									setProfileDialogOpen(true);
								},
								children: s.full_name
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: s.classes?.name ?? "Unassigned"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: cn("text-[10px] font-mono", getStudentAcademicYear(s) === "2025-2026" ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300" : getStudentAcademicYear(s) < "2025-2026" ? "border-muted-foreground/30 text-muted-foreground bg-muted/30" : "border-blue-500/40 text-blue-700 dark:text-blue-300"),
								children: getStudentAcademicYear(s)
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "capitalize text-xs",
								children: s.gender
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "capitalize text-xs",
								children: s.religion
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium",
								children: s.parent_name ?? "—"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											title: "View student profile",
											onClick: () => {
												setSelectedStudent(s);
												setProfileDialogOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/discipline",
											className: "inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors",
											title: "Discipline & Conduct Records",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" })
										}),
										canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											title: "Edit student",
											onClick: () => {
												setForm({
													id: s.id,
													student_code: s.student_code,
													full_name: s.full_name,
													gender: s.gender,
													religion: s.religion ?? "non-muslim",
													academic_year: getStudentAcademicYear(s),
													date_of_birth: s.date_of_birth ?? "",
													class_id: s.class_id ?? "",
													parent_name: s.parent_name ?? "",
													parent_email: s.parent_email ?? "",
													parent_phone: s.parent_phone ?? "",
													address: s.address ?? "",
													photo_url: s.photo_url ?? "",
													create_parent_account: false
												});
												setOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											title: "Remove student",
											onClick: () => {
												if (confirm(`Are you sure you want to remove ${s.full_name}?`)) remove.mutate(s.id);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
										})] })
									]
								})
							})
						] }, s.id)), !filteredStudents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							colSpan: 7,
							className: "text-center py-8 text-muted-foreground text-sm",
							children: [
								isTeacher && assignedClasses.length === 0 ? "No assigned classes available." : "No students found.",
								" ",
								canManage ? "Click 'Register student' above to add one." : ""
							]
						}) })] })] })
					})
				]
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-56 flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9 h-9 text-xs",
							placeholder: "Search parents by name, email, or phone…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setParentDialogOpen(true),
						className: "gap-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add parent"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Parent Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Login Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Phone" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Linked Learners" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Portal Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredParents.map((p) => {
						const children = (students ?? []).filter((s) => s.parent_id === p.id || s.parent_email && s.parent_email.toLowerCase() === p.email.toLowerCase());
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-7 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs",
										children: p.full_name.charAt(0)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.full_name })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5" }),
										" ",
										p.email
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs",
								children: p.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }),
										" ",
										p.phone
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "—"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1",
								children: [children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-xs",
									children: [
										child.full_name,
										" (",
										child.classes?.name ?? "No class",
										")"
									]
								}, child.id)), !children.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground italic",
									children: "No children linked yet"
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: p.active ? "default" : "secondary",
								className: "text-xs",
								children: p.active ? "Active" : "Disabled"
							}) })
						] }, p.id);
					}), !filteredParents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: 5,
						className: "text-center py-8 text-muted-foreground text-sm",
						children: [
							"No parents found.",
							" ",
							canManage ? "Use the 'Register parent' button above to create one." : ""
						]
					}) })] })] })
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: profileDialogOpen,
				onOpenChange: setProfileDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-5 text-primary" }), "Student Profile"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: isTeacher ? "Classroom learner profile (Privacy protected)" : "Comprehensive student information & academic record" })] }),
						selectedStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 pt-2",
							children: isTeacher && (!selectedStudent.class_id || !assignedClassIds.has(selectedStudent.class_id)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Access Restricted:"
								}), " You are not assigned to this student's class. Teachers may only inspect profiles of learners on their active class roster."] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 p-3 rounded-lg bg-muted/40 border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base",
										children: selectedStudent.full_name?.charAt(0) ?? "S"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm truncate",
											children: selectedStudent.full_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-medium text-primary",
													children: ["ID: ", selectedStudent.student_code]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] h-4 px-1.5",
													children: selectedStudent.classes?.name ?? "No class"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "secondary",
													className: cn("text-[10px] font-mono", getStudentAcademicYear(selectedStudent) === "2025-2026" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"),
													children: [
														"Year: ",
														getStudentAcademicYear(selectedStudent),
														getStudentAcademicYear(selectedStudent) < "2025-2026" && " (Past Archive)"
													]
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Academic Year"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold font-mono text-primary mt-0.5 block",
												children: getStudentAcademicYear(selectedStudent)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Gender"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium capitalize mt-0.5 block",
												children: selectedStudent.gender || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Religion"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium capitalize mt-0.5 block",
												children: selectedStudent.religion || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Date of Birth"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium mt-0.5 block",
												children: selectedStudent.date_of_birth || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Classroom"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium mt-0.5 block",
												children: selectedStudent.classes?.name || "Unassigned"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border p-3 bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5 text-primary" }), "Parent / Guardian Information"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Name: "
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: selectedStudent.parent_name || "Not provided"
											})]
										}),
										isTeacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded bg-muted/60 px-2.5 py-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5 border border-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3 text-muted-foreground/80 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contact information (phone & email) is hidden for learner privacy." })]
										}) : canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 pt-1 text-xs border-t border-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedStudent.parent_email || "No email on record" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedStudent.parent_phone || "No phone on record" })]
											})]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border p-3 bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5 text-primary" }), "Conduct & Disciplinary Record"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "text-[10px] font-normal",
												children: [
													(studentDiscipline ?? []).length,
													" ",
													(studentDiscipline ?? []).length === 1 ? "Incident" : "Incidents"
												]
											})]
										}),
										!(studentDiscipline ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded bg-muted/40 p-2.5 text-xs text-muted-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Exemplary record. No behavioral incidents logged." })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5 max-h-44 overflow-y-auto",
											children: (studentDiscipline ?? []).slice(0, 5).map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border bg-card p-2 text-xs space-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-semibold text-foreground",
															children: [
																inc.category,
																" (",
																inc.severity,
																")"
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: inc.incident_date
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground text-[11px] line-clamp-2",
														children: inc.description
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Action: ", inc.action_taken || "Noted"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inc.parent_acknowledged ? "✓ Acknowledged by parent" : "⏳ Pending parent review" })]
													})
												]
											}, inc.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/discipline",
												className: "text-xs font-medium text-primary hover:underline flex items-center gap-1",
												onClick: () => setProfileDialogOpen(false),
												children: "Go to Student Discipline module →"
											})
										})
									]
								})
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer",
								onClick: () => {
									setQrStudent(selectedStudent);
									setQrModalOpen(true);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print QR Pass" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setProfileDialogOpen(false);
									setSelectedStudent(null);
								},
								children: "Close"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentQrModal, {
				open: qrModalOpen,
				onOpenChange: setQrModalOpen,
				student: qrStudent
			})
		]
	});
}
//#endregion
export { StudentsPage as component, getStudentAcademicYear };
