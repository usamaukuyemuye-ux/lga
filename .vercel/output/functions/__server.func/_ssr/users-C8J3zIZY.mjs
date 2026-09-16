import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { O as Power, b as Search, f as Trash2, o as UserPlus, q as KeyRound, r as Users } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as adminSetActive, i as adminResetPassword, n as adminDeleteUser, r as adminListUsers, t as adminCreateUser } from "./admin.functions-B7CmVUM2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-C8J3zIZY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/users.tsx?tsr-split=component";
function UsersPage() {
	const { role: currentRole } = useAuth();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		password: "",
		phone: "",
		role: "parent"
	});
	const { data: users, isError } = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => adminListUsers()
	});
	const filteredUsers = (0, import_react.useMemo)(() => {
		return (users ?? []).filter((u) => {
			const matchesRole = roleFilter === "all" || u.role === roleFilter;
			const term = searchTerm.toLowerCase();
			const matchesSearch = !term || u.full_name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.phone && u.phone.toLowerCase().includes(term);
			return matchesRole && matchesSearch;
		});
	}, [
		users,
		roleFilter,
		searchTerm
	]);
	const counts = (0, import_react.useMemo)(() => {
		const list = users ?? [];
		return {
			all: list.length,
			parent: list.filter((u) => u.role === "parent").length,
			teacher: list.filter((u) => u.role === "teacher").length,
			secretary: list.filter((u) => u.role === "secretary").length,
			admin: list.filter((u) => u.role === "admin").length
		};
	}, [users]);
	const create = useMutation({
		mutationFn: async () => {
			await adminCreateUser({ data: form });
			await logAudit("user.create", "users", {
				email: form.email,
				role: form.role
			});
		},
		onSuccess: () => {
			toast.success(`${form.role === "parent" ? "Parent" : "User"} account created`);
			setOpen(false);
			setForm({
				fullName: "",
				email: "",
				password: "",
				phone: "",
				role: "parent"
			});
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["students"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const reset = useMutation({
		mutationFn: async (userId) => {
			const password = prompt("New password (min 6 characters)");
			if (!password) return;
			await adminResetPassword({ data: {
				userId,
				password
			} });
			await logAudit("user.reset_password", "users", { userId });
		},
		onSuccess: () => toast.success("Password updated"),
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: async (v) => {
			await adminSetActive({ data: v });
			await logAudit("user.toggle_active", "users", v);
		},
		onSuccess: () => {
			toast.success("Account updated");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (userId) => {
			await adminDeleteUser({ data: { userId } });
			await logAudit("user.delete", "users", { userId });
		},
		onSuccess: () => {
			toast.success("User deleted");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Users & Roles",
			description: "Administrators and secretaries can create teacher, secretary, and parent accounts and manage access.",
			action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserPlus, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 17
						}, this), " Create account"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 143,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Create user account" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Create parent, teacher, or administrative accounts with immediate login access." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 151,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Role *" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 157,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.role,
									onValueChange: (v) => setForm({
										...form,
										role: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 163,
										columnNumber: 23
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 162,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "parent",
											children: "Parent (Family Portal)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 166,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "teacher",
											children: "Teacher (Class Rosters)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 167,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "secretary",
											children: "Secretary (Front Desk & Gate)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 168,
											columnNumber: 23
										}, this),
										currentRole === "admin" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(SelectItem, {
											value: "finance",
											children: "Finance Officer"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 170,
											columnNumber: 27
										}, this), /* @__PURE__ */ (void 0)(SelectItem, {
											value: "admin",
											children: "Administrator (Full Access)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 171,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 169,
											columnNumber: 51
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 165,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 158,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 156,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "fn",
									children: "Full name *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 177,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "fn",
									placeholder: "e.g. John Doe",
									value: form.fullName,
									onChange: (e) => setForm({
										...form,
										fullName: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 178,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 176,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "em",
									children: "Email address *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 184,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "em",
									type: "email",
									placeholder: "e.g. parent@example.com",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 185,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "pw",
									children: "Initial Password (min 6 characters) *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 191,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "pw",
									type: "text",
									placeholder: "e.g. Parent123",
									value: form.password,
									onChange: (e) => setForm({
										...form,
										password: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 190,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "ph",
									children: "Phone number (optional)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 198,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "ph",
									placeholder: "+250 788 123 456",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 199,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 197,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: () => create.mutate(),
						disabled: !form.email || form.password.length < 6 || !form.fullName || create.isPending,
						children: [
							"Create ",
							form.role,
							" account"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 206,
						columnNumber: 17
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 205,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 148,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 142,
				columnNumber: 164
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 142,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
			className: "p-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 218,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							placeholder: "Search by name, email, or phone...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							className: "pl-8 text-xs h-9"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 219,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 217,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: roleFilter === "all" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("all"),
								children: [
									"All (",
									counts.all,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 222,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: roleFilter === "parent" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("parent"),
								children: [
									"Parents (",
									counts.parent,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 225,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: roleFilter === "teacher" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("teacher"),
								children: [
									"Teachers (",
									counts.teacher,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 228,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: roleFilter === "secretary" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("secretary"),
								children: [
									"Secretaries (",
									counts.secretary,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 231,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: roleFilter === "admin" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("admin"),
								children: [
									"Admins (",
									counts.admin,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 234,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 221,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 216,
					columnNumber: 11
				}, this),
				isError && /* @__PURE__ */ (void 0)("p", {
					className: "text-sm text-destructive",
					children: "Only administrators and secretaries can view this page."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 240,
					columnNumber: 23
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Name" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 248,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Email" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 249,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Phone" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 250,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Role" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 251,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 252,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
							className: "text-right",
							children: "Actions"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 253,
							columnNumber: 19
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 247,
						columnNumber: 17
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 246,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: [filteredUsers.map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "font-medium text-sm",
							children: u.full_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 258,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-xs",
							children: u.email
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 259,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: u.phone || "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 260,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: u.role === "admin" ? "destructive" : u.role === "parent" ? "secondary" : "default",
							className: "text-xs capitalize",
							children: u.role ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 264,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 263,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: u.active ? "default" : "secondary",
							children: u.active ? "Active" : "Disabled"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 269,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 268,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Reset password",
									onClick: () => reset.mutate(u.id),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 275,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 274,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Activate / deactivate",
									onClick: () => toggle.mutate({
										userId: u.id,
										active: !u.active
									}),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Power, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 281,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 277,
									columnNumber: 23
								}, this),
								currentRole === "admin" && /* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Delete",
									onClick: () => del.mutate(u.id),
									children: /* @__PURE__ */ (void 0)(Trash2, { className: "size-4 text-destructive" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 284,
										columnNumber: 27
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 283,
									columnNumber: 51
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 273,
							columnNumber: 21
						}, this)
					] }, u.id, true, {
						fileName: _jsxFileName,
						lineNumber: 257,
						columnNumber: 41
					}, this)), !filteredUsers.length && /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
						colSpan: 6,
						className: "text-center py-8 text-muted-foreground text-sm",
						children: [/* @__PURE__ */ (void 0)(Users, { className: "mx-auto size-8 text-muted-foreground/50 mb-2" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 23
						}, this), "No user accounts found matching your filters."]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 289,
						columnNumber: 21
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 288,
						columnNumber: 43
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 256,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 245,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 244,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 214,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 213,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 141,
		columnNumber: 10
	}, this);
}
//#endregion
export { UsersPage as component };
