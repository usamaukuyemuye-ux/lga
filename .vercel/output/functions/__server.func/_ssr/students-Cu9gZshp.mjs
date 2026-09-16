import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn$1 } from "./utils-C_uf36nf.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { o as fetchClasses, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { B as Mail, D as Printer, E as QrCode, N as Pencil, U as Lock, Z as GraduationCap, _ as ShieldAlert, b as Search, f as Trash2, it as Eye, j as Phone, k as Plus, mt as CircleCheck, o as UserPlus, r as Users, s as UserCheck } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as StudentQrModal } from "./student-qr-modal-Bm-lPn7q.mjs";
import { n as DEFAULT_ACADEMIC_YEAR, t as ACADEMIC_YEARS } from "./students-BDsOcMHY.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-Cu9gZshp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/switch.tsx";
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch$1, {
	className: cn$1("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SwitchThumb, { className: cn$1("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") }, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 18,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 10,
	columnNumber: 3
}, void 0));
Switch.displayName = Switch$1.displayName;
var _jsxFileName = "/app/applet/src/routes/_authenticated/students.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Students & Parents",
				description: "Administrators and secretaries can register learners, create parent accounts, and assign classes.",
				action: canManage && /* @__PURE__ */ (void 0)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (void 0)(Dialog, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (void 0)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (void 0)(Button, {
								onClick: () => setForm({
									...empty,
									student_code: nextCode(),
									create_parent_account: true
								}),
								className: "gap-1.5",
								children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 381,
									columnNumber: 21
								}, this), " Register student"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 376,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 375,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)(DialogContent, {
							className: "max-h-[90vh] max-w-2xl overflow-y-auto",
							children: [
								/* @__PURE__ */ (void 0)(DialogHeader, { children: [/* @__PURE__ */ (void 0)(DialogTitle, { children: form.id ? "Edit student" : "Register new student" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 386,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(DialogDescription, { children: "Create student profile, assign grade/class, and link parent details." }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 387,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 385,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-4 py-2",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "rounded-lg border p-3 space-y-3 bg-muted/20",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (void 0)(GraduationCap, { className: "size-4 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 396,
												columnNumber: 25
											}, this), " Learner Details"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 395,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, {
														htmlFor: "student_code",
														children: "Student ID / Code *"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 400,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)(Input, {
														id: "student_code",
														value: form.student_code,
														onChange: (e) => setForm({
															...form,
															student_code: e.target.value
														})
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 401,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 399,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, {
														htmlFor: "full_name",
														children: "Full name *"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 407,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)(Input, {
														id: "full_name",
														placeholder: "e.g. Alice Uwase",
														value: form.full_name,
														onChange: (e) => setForm({
															...form,
															full_name: e.target.value
														})
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 408,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 406,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [
														/* @__PURE__ */ (void 0)(Label, { children: "Class / Grade" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 414,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("div", {
															className: "flex gap-1.5",
															children: [/* @__PURE__ */ (void 0)(Select, {
																value: form.class_id,
																onValueChange: (v) => setForm({
																	...form,
																	class_id: v
																}),
																children: [/* @__PURE__ */ (void 0)(SelectTrigger, {
																	className: "flex-1",
																	children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Select class" }, void 0, false, {
																		fileName: _jsxFileName,
																		lineNumber: 421,
																		columnNumber: 33
																	}, this)
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 420,
																	columnNumber: 31
																}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (void 0)(SelectItem, {
																	value: c.id,
																	children: c.name
																}, c.id, false, {
																	fileName: _jsxFileName,
																	lineNumber: 424,
																	columnNumber: 59
																}, this)) }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 423,
																	columnNumber: 31
																}, this)]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 416,
																columnNumber: 29
															}, this), /* @__PURE__ */ (void 0)(Button, {
																type: "button",
																variant: "outline",
																size: "sm",
																title: "Quick create class",
																className: "px-2 text-xs",
																onClick: () => setQuickClassOpen(!quickClassOpen),
																children: "+ Class"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 429,
																columnNumber: 29
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 415,
															columnNumber: 27
														}, this),
														quickClassOpen && /* @__PURE__ */ (void 0)("div", {
															className: "flex gap-1.5 pt-1",
															children: [/* @__PURE__ */ (void 0)(Input, {
																placeholder: "New class name (e.g. Primary 7)",
																value: quickClassName,
																onChange: (e) => setQuickClassName(e.target.value),
																className: "h-8 text-xs"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 434,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)(Button, {
																size: "sm",
																className: "h-8 px-2 text-xs",
																disabled: !quickClassName.trim() || createClassMutation.isPending,
																onClick: () => createClassMutation.mutate(quickClassName),
																children: "Save"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 435,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 433,
															columnNumber: 46
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 413,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, {
														htmlFor: "dob",
														children: "Date of birth"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 441,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)(Input, {
														id: "dob",
														type: "date",
														value: form.date_of_birth,
														onChange: (e) => setForm({
															...form,
															date_of_birth: e.target.value
														})
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 442,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 440,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, { children: "Gender" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 448,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)(Select, {
														value: form.gender,
														onValueChange: (v) => setForm({
															...form,
															gender: v
														}),
														children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 454,
															columnNumber: 31
														}, this) }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 453,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [/* @__PURE__ */ (void 0)(SelectItem, {
															value: "male",
															children: "Male"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 457,
															columnNumber: 31
														}, this), /* @__PURE__ */ (void 0)(SelectItem, {
															value: "female",
															children: "Female"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 458,
															columnNumber: 31
														}, this)] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 456,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 449,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 447,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, { children: "Religion" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 463,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)(Select, {
														value: form.religion,
														onValueChange: (v) => setForm({
															...form,
															religion: v
														}),
														children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 469,
															columnNumber: 31
														}, this) }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 468,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [/* @__PURE__ */ (void 0)(SelectItem, {
															value: "muslim",
															children: "Muslim"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 472,
															columnNumber: 31
														}, this), /* @__PURE__ */ (void 0)(SelectItem, {
															value: "non-muslim",
															children: "Non-Muslim"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 473,
															columnNumber: 31
														}, this)] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 471,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 464,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 462,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, { children: "Academic Year" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 478,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)(Select, {
														value: form.academic_year,
														onValueChange: (v) => setForm({
															...form,
															academic_year: v
														}),
														children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 484,
															columnNumber: 31
														}, this) }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 483,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: ACADEMIC_YEARS.map((yr) => /* @__PURE__ */ (void 0)(SelectItem, {
															value: yr,
															children: [
																yr,
																" ",
																yr === "2025-2026" ? "(Current)" : ""
															]
														}, yr, true, {
															fileName: _jsxFileName,
															lineNumber: 487,
															columnNumber: 57
														}, this)) }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 486,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 479,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 477,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 398,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 394,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "rounded-lg border p-3 space-y-3 bg-muted/20",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
													children: [/* @__PURE__ */ (void 0)(UserCheck, { className: "size-4 text-emerald-600" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 500,
														columnNumber: 27
													}, this), " Parent / Guardian Information"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 499,
													columnNumber: 25
												}, this), (registeredParents ?? []).length > 0 && /* @__PURE__ */ (void 0)(Select, {
													onValueChange: (val) => {
														const p = (registeredParents ?? []).find((x) => x.id === val);
														if (p) setForm((prev) => ({
															...prev,
															parent_name: p.full_name,
															parent_email: p.email,
															parent_phone: p.phone ?? ""
														}));
													},
													children: [/* @__PURE__ */ (void 0)(SelectTrigger, {
														className: "h-7 text-xs w-48",
														children: /* @__PURE__ */ (void 0)(SelectValue, { placeholder: "Pick existing parent…" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 515,
															columnNumber: 31
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 514,
														columnNumber: 29
													}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: (registeredParents ?? []).map((p) => /* @__PURE__ */ (void 0)(SelectItem, {
														value: p.id,
														children: [
															p.full_name,
															" (",
															p.email,
															")"
														]
													}, p.id, true, {
														fileName: _jsxFileName,
														lineNumber: 518,
														columnNumber: 67
													}, this)) }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 517,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 503,
													columnNumber: 66
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 498,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "grid gap-3 sm:grid-cols-2",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (void 0)(Label, {
															htmlFor: "parent_name",
															children: "Parent name"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 527,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)(Input, {
															id: "parent_name",
															placeholder: "e.g. Robert Smith",
															value: form.parent_name,
															onChange: (e) => setForm({
																...form,
																parent_name: e.target.value
															})
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 528,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 526,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (void 0)(Label, {
															htmlFor: "parent_email",
															children: "Parent email"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 534,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)(Input, {
															id: "parent_email",
															type: "email",
															placeholder: "e.g. robert.smith@example.com",
															value: form.parent_email,
															onChange: (e) => setForm({
																...form,
																parent_email: e.target.value
															})
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 535,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 533,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (void 0)(Label, {
															htmlFor: "parent_phone",
															children: "Parent phone (Gate alerts)"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 541,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)(Input, {
															id: "parent_phone",
															placeholder: "+250 788 123 456",
															value: form.parent_phone,
															onChange: (e) => setForm({
																...form,
																parent_phone: e.target.value
															})
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 542,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 540,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "space-y-1.5",
														children: [/* @__PURE__ */ (void 0)(Label, {
															htmlFor: "address",
															children: "Residential address"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 548,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)(Input, {
															id: "address",
															placeholder: "District / Sector / Cell",
															value: form.address,
															onChange: (e) => setForm({
																...form,
																address: e.target.value
															})
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 549,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 547,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 525,
												columnNumber: 23
											}, this),
											!form.id && /* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between rounded-lg bg-card p-2.5 border mt-2",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "space-y-0.5",
													children: [/* @__PURE__ */ (void 0)(Label, {
														className: "text-xs font-semibold cursor-pointer",
														children: "Auto-create Parent Portal account"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 558,
														columnNumber: 29
													}, this), /* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] text-muted-foreground",
														children: "Allows parent to log in immediately and receive gate notifications."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 561,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 557,
													columnNumber: 27
												}, this), /* @__PURE__ */ (void 0)(Switch, {
													checked: form.create_parent_account,
													onCheckedChange: (checked) => setForm({
														...form,
														create_parent_account: checked
													})
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 565,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 556,
												columnNumber: 36
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 497,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 392,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)(DialogFooter, { children: /* @__PURE__ */ (void 0)(Button, {
									onClick: () => save.mutate(form),
									disabled: !form.full_name || !form.student_code || save.isPending,
									className: "gap-1.5",
									children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 575,
										columnNumber: 23
									}, this), " Save student"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 574,
									columnNumber: 21
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 573,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 384,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 374,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Dialog, {
						open: parentDialogOpen,
						onOpenChange: setParentDialogOpen,
						children: [/* @__PURE__ */ (void 0)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								className: "gap-1.5",
								children: [/* @__PURE__ */ (void 0)(UserPlus, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 585,
									columnNumber: 21
								}, this), " Register parent"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 584,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 583,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)(DialogContent, {
							className: "max-w-md",
							children: [
								/* @__PURE__ */ (void 0)(DialogHeader, { children: [/* @__PURE__ */ (void 0)(DialogTitle, { children: "Register new parent" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 590,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(DialogDescription, { children: "Create a parent account and optionally link their children right away." }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 591,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 589,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-3 py-2",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (void 0)(Label, {
												htmlFor: "p_name",
												children: "Parent Full Name *"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 598,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)(Input, {
												id: "p_name",
												placeholder: "e.g. Grace Mukamana",
												value: parentForm.fullName,
												onChange: (e) => setParentForm({
													...parentForm,
													fullName: e.target.value
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 599,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 597,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (void 0)(Label, {
												htmlFor: "p_email",
												children: "Email Address (Login ID) *"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 605,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)(Input, {
												id: "p_email",
												type: "email",
												placeholder: "e.g. grace@example.com",
												value: parentForm.email,
												onChange: (e) => setParentForm({
													...parentForm,
													email: e.target.value
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 606,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 604,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (void 0)(Label, {
												htmlFor: "p_phone",
												children: "Phone Number"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 612,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)(Input, {
												id: "p_phone",
												placeholder: "+250 788 123 456",
												value: parentForm.phone,
												onChange: (e) => setParentForm({
													...parentForm,
													phone: e.target.value
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 613,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 611,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (void 0)(Label, {
												htmlFor: "p_pwd",
												children: "Initial Login Password"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 619,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)(Input, {
												id: "p_pwd",
												value: parentForm.password,
												onChange: (e) => setParentForm({
													...parentForm,
													password: e.target.value
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 620,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 618,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-1.5 pt-1",
											children: [/* @__PURE__ */ (void 0)(Label, { children: "Link Enrolled Students (Optional)" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 627,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "max-h-36 overflow-y-auto border rounded-md p-2 space-y-1 bg-muted/10",
												children: [(students ?? []).map((s) => {
													return /* @__PURE__ */ (void 0)("label", {
														className: "flex items-center gap-2 text-xs p-1 rounded hover:bg-muted cursor-pointer",
														children: [
															/* @__PURE__ */ (void 0)("input", {
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
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 632,
																columnNumber: 31
															}, this),
															/* @__PURE__ */ (void 0)("span", {
																className: "font-medium",
																children: s.full_name
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 645,
																columnNumber: 31
															}, this),
															/* @__PURE__ */ (void 0)("span", {
																className: "font-mono text-muted-foreground",
																children: [
																	"(",
																	s.student_code,
																	")"
																]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 646,
																columnNumber: 31
															}, this)
														]
													}, s.id, true, {
														fileName: _jsxFileName,
														lineNumber: 631,
														columnNumber: 26
													}, this);
												}), !(students ?? []).length && /* @__PURE__ */ (void 0)("div", {
													className: "text-xs text-muted-foreground py-2 text-center",
													children: "No students registered yet."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 651,
													columnNumber: 54
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 628,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 626,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 596,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)(DialogFooter, { children: /* @__PURE__ */ (void 0)(Button, {
									onClick: () => createParentMutation.mutate(parentForm),
									disabled: !parentForm.fullName.trim() || !parentForm.email.trim() || createParentMutation.isPending,
									children: "Create parent account"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 659,
									columnNumber: 21
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 658,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 588,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 582,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 372,
					columnNumber: 179
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 372,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between border-b pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: activeTab === "students" ? "default" : "ghost",
						size: "sm",
						className: "gap-2",
						onClick: () => setActiveTab("students"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 671,
								columnNumber: 13
							}, this),
							" Students (",
							visibleStudents.length,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 670,
						columnNumber: 11
					}, this), canManage && /* @__PURE__ */ (void 0)(Button, {
						variant: activeTab === "parents" ? "default" : "ghost",
						size: "sm",
						className: "gap-2",
						onClick: () => setActiveTab("parents"),
						children: [
							/* @__PURE__ */ (void 0)(Users, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 674,
								columnNumber: 15
							}, this),
							" Registered Parents (",
							registeredParents?.length ?? 0,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 673,
						columnNumber: 25
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 669,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-xs text-muted-foreground hidden sm:block",
					children: canManage ? "Admins & Secretaries have full management rights" : isTeacher ? "Teacher view · Scoped to your assigned classes" : "Read-only view"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 677,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 668,
				columnNumber: 7
			}, this),
			isTeacher && assignedClasses.length === 0 && /* @__PURE__ */ (void 0)("div", {
				className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "flex items-center gap-2 font-semibold",
					children: [/* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 684,
						columnNumber: 13
					}, this), " No Classes Assigned"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 683,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "You do not currently have any classes assigned to your teaching profile. Teachers are only permitted to view profiles of students in classes assigned to them. Please contact the school administration to assign your classroom roster."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 686,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 682,
				columnNumber: 53
			}, this),
			activeTab === "students" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative min-w-56 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 697,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									className: "pl-9 h-9 text-xs",
									placeholder: isTeacher ? "Search students in your classes by name or student ID…" : "Search students by name, ID, or class…",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 698,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 696,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: classFilter,
								onValueChange: setClassFilter,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
									className: "w-44 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 702,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 701,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "all",
									children: isTeacher ? "All my assigned classes" : "All classes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 705,
									columnNumber: 19
								}, this), (isTeacher ? assignedClasses : classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id, false, {
									fileName: _jsxFileName,
									lineNumber: 708,
									columnNumber: 75
								}, this))] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 704,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 700,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: academicYearFilter,
								onValueChange: setAcademicYearFilter,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
									className: "w-48 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Academic Year" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 716,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 715,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "all",
									children: "All Academic Years (2015–2030)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 719,
									columnNumber: 19
								}, this), ACADEMIC_YEARS.map((yr) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: yr,
									children: [
										yr,
										" ",
										yr === "2025-2026" ? "★ Current" : yr < "2025-2026" ? "· Past Year" : "· Future"
									]
								}, yr, true, {
									fileName: _jsxFileName,
									lineNumber: 720,
									columnNumber: 45
								}, this))] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 718,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 714,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 695,
						columnNumber: 13
					}, this),
					canManage && /* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-border/50 pt-1",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "text-muted-foreground whitespace-nowrap font-medium text-[11px] mr-1",
								children: "Secretary Archive (2015–2030):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 730,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(Badge, {
								variant: academicYearFilter === "all" ? "default" : "outline",
								className: "cursor-pointer text-[10px] whitespace-nowrap hover:bg-primary/20",
								onClick: () => setAcademicYearFilter("all"),
								children: "All Years"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 733,
								columnNumber: 17
							}, this),
							ACADEMIC_YEARS.map((yr) => /* @__PURE__ */ (void 0)(Badge, {
								variant: academicYearFilter === yr ? "default" : "outline",
								className: cn("cursor-pointer text-[10px] whitespace-nowrap hover:bg-primary/20 font-mono", yr === "2025-2026" && "border-primary/50 text-primary font-semibold", yr < "2025-2026" && "text-muted-foreground"),
								onClick: () => setAcademicYearFilter(yr),
								children: yr
							}, yr, false, {
								fileName: _jsxFileName,
								lineNumber: 736,
								columnNumber: 43
							}, this))
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 729,
						columnNumber: 27
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student ID" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 745,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Learner Name" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 746,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Class" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 747,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Academic Year" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 748,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Gender" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 749,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Religion" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 750,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Parent / Guardian" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 751,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
								className: "text-right",
								children: "Actions"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 752,
								columnNumber: 21
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 744,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 743,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredStudents.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "font-mono text-xs font-semibold text-primary",
								children: s.student_code
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 757,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: "font-medium text-left hover:text-primary transition-colors cursor-pointer",
								onClick: () => {
									setSelectedStudent(s);
									setProfileDialogOpen(true);
								},
								children: s.full_name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 761,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 760,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: s.classes?.name ?? "Unassigned"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 769,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 768,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								className: cn("text-[10px] font-mono", getStudentAcademicYear(s) === "2025-2026" ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300" : getStudentAcademicYear(s) < "2025-2026" ? "border-muted-foreground/30 text-muted-foreground bg-muted/30" : "border-blue-500/40 text-blue-700 dark:text-blue-300"),
								children: getStudentAcademicYear(s)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 774,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 773,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "capitalize text-xs",
								children: s.gender
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 778,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "capitalize text-xs",
								children: s.religion
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 779,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs font-medium",
								children: s.parent_name ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 782,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 780,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-end gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: "ghost",
											size: "icon",
											title: "View student profile",
											onClick: () => {
												setSelectedStudent(s);
												setProfileDialogOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "size-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 790,
												columnNumber: 29
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 786,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/discipline",
											className: "inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors",
											title: "Discipline & Conduct Records",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "size-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 793,
												columnNumber: 29
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 792,
											columnNumber: 27
										}, this),
										canManage && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Button, {
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
											children: /* @__PURE__ */ (void 0)(Pencil, { className: "size-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 815,
												columnNumber: 33
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 796,
											columnNumber: 31
										}, this), /* @__PURE__ */ (void 0)(Button, {
											variant: "ghost",
											size: "icon",
											title: "Remove student",
											onClick: () => {
												if (confirm(`Are you sure you want to remove ${s.full_name}?`)) remove.mutate(s.id);
											},
											children: /* @__PURE__ */ (void 0)(Trash2, { className: "size-4 text-destructive" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 822,
												columnNumber: 33
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 817,
											columnNumber: 31
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 795,
											columnNumber: 41
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 785,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 784,
								columnNumber: 23
							}, this)
						] }, s.id, true, {
							fileName: _jsxFileName,
							lineNumber: 756,
							columnNumber: 46
						}, this)), !filteredStudents.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
							colSpan: 7,
							className: "text-center py-8 text-muted-foreground text-sm",
							children: [
								isTeacher && assignedClasses.length === 0 ? "No assigned classes available." : "No students found.",
								" ",
								canManage ? "Click 'Register student' above to add one." : ""
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 829,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 828,
							columnNumber: 48
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 755,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 742,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 741,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 694,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 693,
				columnNumber: 35
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative min-w-56 flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 843,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							className: "pl-9 h-9 text-xs",
							placeholder: "Search parents by name, email, or phone…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 844,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 842,
						columnNumber: 15
					}, this), canManage && /* @__PURE__ */ (void 0)(Button, {
						size: "sm",
						onClick: () => setParentDialogOpen(true),
						className: "gap-1 text-xs",
						children: [/* @__PURE__ */ (void 0)(Plus, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 847,
							columnNumber: 19
						}, this), " Add parent"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 846,
						columnNumber: 29
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 841,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Parent Name" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 855,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Login Email" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 856,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Phone" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 857,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Linked Learners" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 858,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Portal Status" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 859,
							columnNumber: 21
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 854,
						columnNumber: 19
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 853,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredParents.map((p) => {
						const children = (students ?? []).filter((s) => s.parent_id === p.id || s.parent_email && s.parent_email.toLowerCase() === p.email.toLowerCase());
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "font-medium text-sm",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "size-7 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs",
										children: p.full_name.charAt(0)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 868,
										columnNumber: 29
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p.full_name }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 871,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 867,
									columnNumber: 27
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 866,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mail, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 876,
											columnNumber: 29
										}, this),
										" ",
										p.email
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 875,
									columnNumber: 27
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 874,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
								className: "text-xs",
								children: p.phone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 881,
											columnNumber: 31
										}, this),
										" ",
										p.phone
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 880,
									columnNumber: 38
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 882,
									columnNumber: 39
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 879,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap gap-1",
								children: [children.map((child) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "secondary",
									className: "text-xs",
									children: [
										child.full_name,
										" (",
										child.classes?.name ?? "No class",
										")"
									]
								}, child.id, true, {
									fileName: _jsxFileName,
									lineNumber: 886,
									columnNumber: 52
								}, this)), !children.length && /* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground italic",
									children: "No children linked yet"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 889,
									columnNumber: 50
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 885,
								columnNumber: 27
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 884,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: p.active ? "default" : "secondary",
								className: "text-xs",
								children: p.active ? "Active" : "Disabled"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 895,
								columnNumber: 27
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 894,
								columnNumber: 25
							}, this)
						] }, p.id, true, {
							fileName: _jsxFileName,
							lineNumber: 865,
							columnNumber: 24
						}, this);
					}), !filteredParents.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
						colSpan: 5,
						className: "text-center py-8 text-muted-foreground text-sm",
						children: [
							"No parents found.",
							" ",
							canManage ? "Use the 'Register parent' button above to create one." : ""
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 902,
						columnNumber: 23
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 901,
						columnNumber: 47
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 862,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 852,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 851,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 840,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 839,
				columnNumber: 5
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: profileDialogOpen,
				onOpenChange: setProfileDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "size-5 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 917,
								columnNumber: 15
							}, this), "Student Profile"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 916,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: isTeacher ? "Classroom learner profile (Privacy protected)" : "Comprehensive student information & academic record" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 920,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 915,
							columnNumber: 11
						}, this),
						selectedStudent && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-4 pt-2",
							children: isTeacher && (!selectedStudent.class_id || !assignedClassIds.has(selectedStudent.class_id)) ? /* @__PURE__ */ (void 0)("div", {
								className: "rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-2",
								children: [/* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-4 shrink-0 mt-0.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 927,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold",
									children: "Access Restricted:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 929,
									columnNumber: 21
								}, this), " You are not assigned to this student's class. Teachers may only inspect profiles of learners on their active class roster."] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 928,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 926,
								columnNumber: 110
							}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-3 p-3 rounded-lg bg-muted/40 border",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base",
										children: selectedStudent.full_name?.charAt(0) ?? "S"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 935,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "font-semibold text-sm truncate",
											children: selectedStudent.full_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 939,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5",
											children: [
												/* @__PURE__ */ (void 0)("span", {
													className: "font-mono font-medium text-primary",
													children: ["ID: ", selectedStudent.student_code]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 943,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("span", { children: "·" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 946,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)(Badge, {
													variant: "outline",
													className: "text-[10px] h-4 px-1.5",
													children: selectedStudent.classes?.name ?? "No class"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 947,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("span", { children: "·" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 950,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)(Badge, {
													variant: "secondary",
													className: cn("text-[10px] font-mono", getStudentAcademicYear(selectedStudent) === "2025-2026" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"),
													children: [
														"Year: ",
														getStudentAcademicYear(selectedStudent),
														getStudentAcademicYear(selectedStudent) < "2025-2026" && " (Past Archive)"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 951,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 942,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 938,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 934,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Academic Year"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 961,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-semibold font-mono text-primary mt-0.5 block",
												children: getStudentAcademicYear(selectedStudent)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 962,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 960,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Gender"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 967,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium capitalize mt-0.5 block",
												children: selectedStudent.gender || "—"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 968,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 966,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Religion"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 973,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium capitalize mt-0.5 block",
												children: selectedStudent.religion || "—"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 974,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 972,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Date of Birth"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 979,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium mt-0.5 block",
												children: selectedStudent.date_of_birth || "—"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 980,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 978,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "p-2.5 rounded-md border bg-card",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Classroom"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 985,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium mt-0.5 block",
												children: selectedStudent.classes?.name || "Unassigned"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 986,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 984,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 959,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-lg border p-3 bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
											children: [/* @__PURE__ */ (void 0)(Users, { className: "size-3.5 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 995,
												columnNumber: 23
											}, this), "Parent / Guardian Information"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 994,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "text-xs",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-muted-foreground",
												children: "Name: "
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 999,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-medium",
												children: selectedStudent.parent_name || "Not provided"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1e3,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 998,
											columnNumber: 21
										}, this),
										isTeacher ? /* @__PURE__ */ (void 0)("div", {
											className: "rounded bg-muted/60 px-2.5 py-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5 border border-muted",
											children: [/* @__PURE__ */ (void 0)(Lock, { className: "size-3 text-muted-foreground/80 shrink-0" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1007,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Contact information (phone & email) is hidden for learner privacy." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1008,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1006,
											columnNumber: 34
										}, this) : canManage ? /* @__PURE__ */ (void 0)("div", {
											className: "space-y-1 pt-1 text-xs border-t border-muted",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (void 0)(Mail, { className: "size-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1013,
													columnNumber: 27
												}, this), /* @__PURE__ */ (void 0)("span", { children: selectedStudent.parent_email || "No email on record" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1014,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1012,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (void 0)(Phone, { className: "size-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1017,
													columnNumber: 27
												}, this), /* @__PURE__ */ (void 0)("span", { children: selectedStudent.parent_phone || "No phone on record" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1018,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1016,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1011,
											columnNumber: 44
										}, this) : null
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 993,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-lg border p-3 bg-muted/20 space-y-2",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "text-xs font-semibold flex items-center gap-1.5 text-foreground",
												children: [/* @__PURE__ */ (void 0)(ShieldAlert, { className: "size-3.5 text-primary" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1027,
													columnNumber: 25
												}, this), "Conduct & Disciplinary Record"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1026,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)(Badge, {
												variant: "outline",
												className: "text-[10px] font-normal",
												children: [
													(studentDiscipline ?? []).length,
													" ",
													(studentDiscipline ?? []).length === 1 ? "Incident" : "Incidents"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1030,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1025,
											columnNumber: 21
										}, this),
										!(studentDiscipline ?? []).length ? /* @__PURE__ */ (void 0)("div", {
											className: "rounded bg-muted/40 p-2.5 text-xs text-muted-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-3.5 text-emerald-600 shrink-0" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1037,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Exemplary record. No behavioral incidents logged." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1038,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1036,
											columnNumber: 58
										}, this) : /* @__PURE__ */ (void 0)("div", {
											className: "space-y-1.5 max-h-44 overflow-y-auto",
											children: (studentDiscipline ?? []).slice(0, 5).map((inc) => /* @__PURE__ */ (void 0)("div", {
												className: "rounded border bg-card p-2 text-xs space-y-1",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "flex items-center justify-between text-[11px]",
														children: [/* @__PURE__ */ (void 0)("span", {
															className: "font-semibold text-foreground",
															children: [
																inc.category,
																" (",
																inc.severity,
																")"
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1042,
															columnNumber: 31
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-muted-foreground",
															children: inc.incident_date
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1045,
															columnNumber: 31
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1041,
														columnNumber: 29
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-muted-foreground text-[11px] line-clamp-2",
														children: inc.description
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1047,
														columnNumber: 29
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground",
														children: [/* @__PURE__ */ (void 0)("span", { children: ["Action: ", inc.action_taken || "Noted"] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1051,
															columnNumber: 31
														}, this), /* @__PURE__ */ (void 0)("span", { children: inc.parent_acknowledged ? "✓ Acknowledged by parent" : "⏳ Pending parent review" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1052,
															columnNumber: 31
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1050,
														columnNumber: 29
													}, this)
												]
											}, inc.id, true, {
												fileName: _jsxFileName,
												lineNumber: 1040,
												columnNumber: 82
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1039,
											columnNumber: 32
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "pt-1",
											children: /* @__PURE__ */ (void 0)(Link, {
												to: "/discipline",
												className: "text-xs font-medium text-primary hover:underline flex items-center gap-1",
												onClick: () => setProfileDialogOpen(false),
												children: "Go to Student Discipline module →"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1060,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1059,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1024,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 933,
								columnNumber: 26
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 925,
							columnNumber: 31
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
							className: "gap-2 sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer",
								onClick: () => {
									setQrStudent(selectedStudent);
									setQrModalOpen(true);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1072,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1073,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Print QR Pass" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1074,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1068,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setProfileDialogOpen(false);
									setSelectedStudent(null);
								},
								children: "Close"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1076,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1067,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 914,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 913,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StudentQrModal, {
				open: qrModalOpen,
				onOpenChange: setQrModalOpen,
				student: qrStudent
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1087,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 371,
		columnNumber: 10
	}, this);
}
//#endregion
export { StudentsPage as component, getStudentAcademicYear };
