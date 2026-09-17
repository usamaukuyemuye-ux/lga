import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { O as Power, b as Search, f as Trash2, o as UserPlus, q as KeyRound, r as Users } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as adminSetActive, i as adminResetPassword, n as adminDeleteUser, r as adminListUsers, t as adminCreateUser } from "./admin.functions-B7CmVUM2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-BbyDmpMu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Users & Roles",
			description: "Administrators and secretaries can create teacher, secretary, and parent accounts and manage access.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), " Create account"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create user account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create parent, teacher, or administrative accounts with immediate login access." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.role,
									onValueChange: (v) => setForm({
										...form,
										role: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "parent",
											children: "Parent (Family Portal)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "teacher",
											children: "Teacher (Class Rosters)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "secretary",
											children: "Secretary (Front Desk & Gate)"
										}),
										currentRole === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "finance",
											children: "Finance Officer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "admin",
											children: "Administrator (Full Access)"
										})] })
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "fn",
									children: "Full name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fn",
									placeholder: "e.g. John Doe",
									value: form.fullName,
									onChange: (e) => setForm({
										...form,
										fullName: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "em",
									children: "Email address *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "em",
									type: "email",
									placeholder: "e.g. parent@example.com",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "pw",
									children: "Initial Password (min 6 characters) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pw",
									type: "text",
									placeholder: "e.g. Parent123",
									value: form.password,
									onChange: (e) => setForm({
										...form,
										password: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ph",
									children: "Phone number (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ph",
									placeholder: "+250 788 123 456",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => create.mutate(),
						disabled: !form.email || form.password.length < 6 || !form.fullName || create.isPending,
						children: [
							"Create ",
							form.role,
							" account"
						]
					}) })
				] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by name, email, or phone...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							className: "pl-8 text-xs h-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: roleFilter === "all" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("all"),
								children: [
									"All (",
									counts.all,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: roleFilter === "parent" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("parent"),
								children: [
									"Parents (",
									counts.parent,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: roleFilter === "teacher" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("teacher"),
								children: [
									"Teachers (",
									counts.teacher,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: roleFilter === "secretary" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("secretary"),
								children: [
									"Secretaries (",
									counts.secretary,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: roleFilter === "admin" ? "default" : "ghost",
								size: "sm",
								className: "h-7 text-xs px-2.5",
								onClick: () => setRoleFilter("admin"),
								children: [
									"Admins (",
									counts.admin,
									")"
								]
							})
						]
					})]
				}),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: "Only administrators and secretaries can view this page."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Phone" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium text-sm",
							children: u.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs",
							children: u.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: u.phone || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: u.role === "admin" ? "destructive" : u.role === "parent" ? "secondary" : "default",
							className: "text-xs capitalize",
							children: u.role ?? "—"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: u.active ? "default" : "secondary",
							children: u.active ? "Active" : "Disabled"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Reset password",
									onClick: () => reset.mutate(u.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Activate / deactivate",
									onClick: () => toggle.mutate({
										userId: u.id,
										active: !u.active
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
								}),
								currentRole === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									title: "Delete",
									onClick: () => del.mutate(u.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
								})
							]
						})
					] }, u.id)), !filteredUsers.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: 6,
						className: "text-center py-8 text-muted-foreground text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto size-8 text-muted-foreground/50 mb-2" }), "No user accounts found matching your filters."]
					}) })] })] })
				})
			]
		}) })]
	});
}
//#endregion
export { UsersPage as component };
