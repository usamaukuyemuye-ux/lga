import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { W as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SchoolLogo } from "./logo-DWjWTi6G.mjs";
import { o as seedDemoData } from "./admin.functions-B7CmVUM2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-view-B_XkFV7i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var demoAccounts = [
	{
		role: "Administrator",
		email: "admin@school.com",
		password: "Admin123"
	},
	{
		role: "School Owner",
		email: "owner@school.com",
		password: "Owner123"
	},
	{
		role: "Head of Studies",
		email: "headofstudies@school.com",
		password: "Studies123"
	},
	{
		role: "Secretary",
		email: "secretary@school.com",
		password: "Secretary123"
	},
	{
		role: "Teacher",
		email: "teacher@school.com",
		password: "Teacher123"
	},
	{
		role: "Finance Officer",
		email: "finance@school.com",
		password: "Finance123"
	},
	{
		role: "Parent",
		email: "parent@school.com",
		password: "Parent123"
	}
];
function LoginView() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [seeding, setSeeding] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({
				to: "/dashboard",
				replace: true
			});
		});
		seedDemoData().catch(() => void 0).finally(() => setSeeding(false));
	}, [navigate]);
	const doSignIn = async (mail, pass) => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: mail.trim(),
			password: pass
		});
		setLoading(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Welcome back");
		navigate({
			to: "/dashboard",
			replace: true
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		await doSignIn(email, password);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20 dark:bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, {
							size: "xl",
							className: "mb-2 shadow-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold tracking-tight text-foreground",
							children: "Little Gems Academy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Primary School & Academy Portal"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-semibold",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Use your school account credentials to continue."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "login-email",
										className: "text-xs font-medium",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "login-email",
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "you@school.com",
										autoComplete: "email",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "login-password",
										className: "text-xs font-medium",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "login-password",
										type: "password",
										required: true,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "••••••••",
										autoComplete: "current-password",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									className: "w-full h-9 text-xs font-semibold",
									disabled: loading,
									children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-2" }) : null, "Sign in"]
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2.5 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Demo Accounts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: seeding ? "Preparing test accounts…" : "Click any account to sign in instantly:"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "grid gap-1.5 pb-4",
						children: demoAccounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: seeding || loading,
							onClick: () => {
								setEmail(a.email);
								setPassword(a.password);
								doSignIn(a.email, a.password);
							},
							className: "flex items-center justify-between rounded-md border border-border/70 bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-accent hover:border-primary/40 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: a.role
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground font-mono",
								children: [
									a.email,
									" · ",
									a.password
								]
							})]
						}, a.email))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-[11px] text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Little Gems Academy · All rights reserved"
					]
				})
			]
		})
	});
}
//#endregion
export { LoginView as t };
