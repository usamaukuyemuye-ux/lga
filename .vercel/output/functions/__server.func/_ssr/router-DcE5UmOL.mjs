import { o as __toESM } from "../_runtime.mjs";
import { p as doc, r as getDocFromServer } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { n as db, r as ensureSeeded } from "./firestore-client-CURzEnIl.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth, t as AuthProvider } from "./auth-D2xkuHOZ.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as registerDeviceNotification, t as dispatchLocalNotification } from "./device-notifications-BMIcetfI.mjs";
import { t as Route$20 } from "./discipline-Di7qLwEn.mjs";
import { t as Route$21 } from "./scan-CoObJ7-m.mjs";
import { r as Route$22 } from "./students-BDsOcMHY.mjs";
import { n as Route$23 } from "./timetable-D6aNC_Sb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DcE5UmOL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-DGXmATdC.css";
function reportAppError(error, context = {}) {
	if (typeof window === "undefined") return;
	console.error("[SchoolTrack Error]", error, context);
}
var _jsxFileName$1 = "/app/applet/src/components/ui/sonner.tsx";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 7,
		columnNumber: 5
	}, void 0);
};
async function testConnection() {
	try {
		await getDocFromServer(doc(db, "test", "connection"));
	} catch (error) {
		if (error instanceof Error && error.message.includes("the client is offline")) console.error("Please check your Firebase configuration.");
	}
}
function GlobalNotificationWatcher() {
	const { role, user } = useAuth();
	(0, import_react.useEffect)(() => {
		registerDeviceNotification(role || (user ? "authenticated" : "guest"));
		if (typeof supabase?.channel !== "function") return;
		try {
			const channel = supabase.channel("global-school-broadcasts").on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "announcements"
			}, (payload) => {
				const item = payload?.new;
				if (!item?.title) return;
				dispatchLocalNotification(item.title, item.body || "New announcement from Little Gems Academy", "/announcements");
				toast.info(`💎 Little Gems Academy: ${item.title}`, {
					description: item.body?.slice(0, 100),
					duration: 8e3
				});
			}).subscribe();
			return () => {
				if (typeof supabase?.removeChannel === "function") supabase.removeChannel(channel);
			};
		} catch (e) {
			console.warn("Global broadcast watcher subscription issue:", e);
		}
	}, [role, user]);
	return null;
}
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 30,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 23,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 22,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportAppError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 51,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 50,
		columnNumber: 5
	}, this);
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Little Gems Academy — Primary School Portal" },
			{
				name: "description",
				content: "Little Gems Academy attendance management, announcements, and parent portal."
			},
			{
				name: "author",
				content: "Little Gems Academy"
			},
			{
				property: "og:title",
				content: "Little Gems Academy — Primary School Portal"
			},
			{
				property: "og:description",
				content: "Little Gems Academy attendance management, announcements, and parent portal."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/little-gems-logo.png",
				type: "image/png"
			},
			{
				rel: "shortcut icon",
				href: "/little-gems-logo.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 118,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 117,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 122,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 120,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 116,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	(0, import_react.useEffect)(() => {
		testConnection();
		ensureSeeded();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlobalNotificationWatcher, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 139,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 141,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster$1, {
				richColors: true,
				position: "top-right"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 142,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 138,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 137,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$18 = () => import("./routes-BULZfnJG.mjs");
var Route$18 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Little Gems Academy — Sign in" },
		{
			name: "description",
			content: "Sign in to Little Gems Academy school attendance and management portal."
		},
		{
			property: "og:title",
			content: "Little Gems Academy — Sign in"
		},
		{
			property: "og:description",
			content: "Sign in to Little Gems Academy school attendance and management portal."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./route-Cn-smAgq.mjs");
var Route$17 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./auth-i8tLRk4I.mjs");
var Route$16 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — Little Gems Academy" },
		{
			name: "description",
			content: "Sign in to Little Gems Academy attendance & school management portal."
		},
		{
			property: "og:title",
			content: "Sign in — Little Gems Academy"
		},
		{
			property: "og:description",
			content: "Sign in to Little Gems Academy attendance & school management portal."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./activities-DNy14XfV.mjs");
var Route$15 = createFileRoute("/_authenticated/activities")({
	head: () => ({ meta: [
		{ title: "Activities & Clubs — SchoolTrack" },
		{
			name: "description",
			content: "Extracurricular clubs, athletic sports teams, and student membership rosters."
		},
		{
			property: "og:title",
			content: "Activities & Clubs — SchoolTrack"
		},
		{
			property: "og:description",
			content: "Extracurricular clubs, athletic sports teams, and student membership rosters."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./announcements-CpviGg49.mjs");
var Route$14 = createFileRoute("/_authenticated/announcements")({
	head: () => ({ meta: [
		{ title: "School Announcements — Little Gems Academy" },
		{
			name: "description",
			content: "Official Little Gems Academy circulars, notices, and announcements."
		},
		{
			property: "og:title",
			content: "School Announcements — Little Gems Academy"
		},
		{
			property: "og:description",
			content: "Official Little Gems Academy circulars, notices, and announcements."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./assignments-CmJ9iw3u.mjs");
var Route$13 = createFileRoute("/_authenticated/assignments")({
	head: () => ({ meta: [{ title: "Assignments & Homework — Little Gems Academy" }, {
		name: "description",
		content: "Create, submit, and mark classroom assignments for teachers, parents, and academic heads."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./attendance-N19aM3ZT.mjs");
var Route$12 = createFileRoute("/_authenticated/attendance")({
	head: () => ({ meta: [
		{ title: "Attendance & Register — SchoolTrack" },
		{
			name: "description",
			content: "Mark student attendance, review absence permissions, and export historical logs."
		},
		{
			property: "og:title",
			content: "Attendance & Register — SchoolTrack"
		},
		{
			property: "og:description",
			content: "Mark student attendance, review absence permissions, and export historical logs."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./audit-DACsJ8qf.mjs");
var Route$11 = createFileRoute("/_authenticated/audit")({
	head: () => ({ meta: [
		{ title: "Activity Logs — SchoolTrack" },
		{
			name: "description",
			content: "System activity and audit trail for administrators."
		},
		{
			property: "og:title",
			content: "Activity Logs — SchoolTrack"
		},
		{
			property: "og:description",
			content: "System activity and audit trail for administrators."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./cards-DC7FdfnC.mjs");
var Route$10 = createFileRoute("/_authenticated/cards")({
	head: () => ({ meta: [
		{ title: "Student ID Cards — SchoolTrack Attendance" },
		{
			name: "description",
			content: "Generate and print student ID cards with unique QR codes."
		},
		{
			property: "og:title",
			content: "Student ID Cards — SchoolTrack Attendance"
		},
		{
			property: "og:description",
			content: "Generate and print student ID cards with unique QR codes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./children-BJhSSBK6.mjs");
var Route$9 = createFileRoute("/_authenticated/children")({
	head: () => ({ meta: [
		{ title: "My Children — SchoolTrack" },
		{
			name: "description",
			content: "View your child's profile, daily attendance, and submit leave permissions."
		},
		{
			property: "og:title",
			content: "My Children — SchoolTrack"
		},
		{
			property: "og:description",
			content: "View your child's profile, daily attendance, and submit leave permissions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./classes-DvsZVhkr.mjs");
var Route$8 = createFileRoute("/_authenticated/classes")({
	head: () => ({ meta: [
		{ title: "Classes — SchoolTrack Attendance" },
		{
			name: "description",
			content: "Create and manage school classes and their student allocation."
		},
		{
			property: "og:title",
			content: "Classes — SchoolTrack Attendance"
		},
		{
			property: "og:description",
			content: "Create and manage school classes and their student allocation."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard-CYnZiynm.mjs");
var Route$7 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — SchoolTrack" },
		{
			name: "description",
			content: "School attendance and operations dashboard"
		},
		{
			property: "og:title",
			content: "Dashboard — SchoolTrack"
		},
		{
			property: "og:description",
			content: "School attendance and operations dashboard"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./finance-lmmhk3pu.mjs");
var Route$6 = createFileRoute("/_authenticated/finance")({
	head: () => ({ meta: [
		{ title: "Finance & Fees — SchoolTrack" },
		{
			name: "description",
			content: "Record school fee payments and track balances per student."
		},
		{
			property: "og:title",
			content: "Finance & Fees — SchoolTrack"
		},
		{
			property: "og:description",
			content: "Record school fee payments and track balances per student."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./notifications-BKd_mmSH.mjs");
var Route$5 = createFileRoute("/_authenticated/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications Log — SchoolTrack" },
		{
			name: "description",
			content: "History of attendance notifications sent to parents."
		},
		{
			property: "og:title",
			content: "Notifications Log — SchoolTrack"
		},
		{
			property: "og:description",
			content: "History of attendance notifications sent to parents."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./payments-BqAra4RO.mjs");
var Route$4 = createFileRoute("/_authenticated/payments")({
	head: () => ({ meta: [
		{ title: "My Payments — SchoolTrack" },
		{
			name: "description",
			content: "See every school fee payment recorded for your children."
		},
		{
			property: "og:title",
			content: "My Payments — SchoolTrack"
		},
		{
			property: "og:description",
			content: "See every school fee payment recorded for your children."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./permissions-Dvcn9RuI.mjs");
var Route$3 = createFileRoute("/_authenticated/permissions")({
	head: () => ({ meta: [
		{ title: "Permissions & Requests — SchoolTrack" },
		{
			name: "description",
			content: "Student leave permissions, attendance corrections, and teacher class access requests."
		},
		{
			property: "og:title",
			content: "Permissions & Requests — SchoolTrack"
		},
		{
			property: "og:description",
			content: "Student leave permissions, attendance corrections, and teacher class access requests."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./reports-D9tfmlXs.mjs");
var Route$2 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [
		{ title: "Reports — SchoolTrack Attendance" },
		{
			name: "description",
			content: "Daily, weekly, monthly attendance and tuition fee reports with PDF and Excel export."
		},
		{
			property: "og:title",
			content: "Reports — SchoolTrack Attendance"
		},
		{
			property: "og:description",
			content: "Daily, weekly, monthly attendance and tuition fee reports."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./settings-D1BWl8uw.mjs");
var Route$1 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [
		{ title: "School Settings & Logo — Little Gems Academy" },
		{
			name: "description",
			content: "Manage school profile, logo branding, and system backups."
		},
		{
			property: "og:title",
			content: "School Settings & Logo — Little Gems Academy"
		},
		{
			property: "og:description",
			content: "Manage school profile, logo branding, and system backups."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./users-C8J3zIZY.mjs");
var Route = createFileRoute("/_authenticated/users")({
	head: () => ({ meta: [
		{ title: "Users & Roles — SchoolTrack Attendance" },
		{
			name: "description",
			content: "Create teacher, secretary and parent accounts and manage their access."
		},
		{
			property: "og:title",
			content: "Users & Roles — SchoolTrack Attendance"
		},
		{
			property: "og:description",
			content: "Create teacher, secretary and parent accounts and manage their access."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRoute = Route$17.update({
	id: "/_authenticated",
	getParentRoute: () => Route$19
});
var AuthRoute = Route$16.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedActivitiesRoute: Route$15.update({
		id: "/activities",
		path: "/activities",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAnnouncementsRoute: Route$14.update({
		id: "/announcements",
		path: "/announcements",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAssignmentsRoute: Route$13.update({
		id: "/assignments",
		path: "/assignments",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAttendanceRoute: Route$12.update({
		id: "/attendance",
		path: "/attendance",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAuditRoute: Route$11.update({
		id: "/audit",
		path: "/audit",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedCardsRoute: Route$10.update({
		id: "/cards",
		path: "/cards",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedChildrenRoute: Route$9.update({
		id: "/children",
		path: "/children",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedClassesRoute: Route$8.update({
		id: "/classes",
		path: "/classes",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDashboardRoute: Route$7.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDisciplineRoute: Route$20.update({
		id: "/discipline",
		path: "/discipline",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedFinanceRoute: Route$6.update({
		id: "/finance",
		path: "/finance",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedNotificationsRoute: Route$5.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedPaymentsRoute: Route$4.update({
		id: "/payments",
		path: "/payments",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedPermissionsRoute: Route$3.update({
		id: "/permissions",
		path: "/permissions",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedReportsRoute: Route$2.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedScanRoute: Route$21.update({
		id: "/scan",
		path: "/scan",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedSettingsRoute: Route$1.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedStudentsRoute: Route$22.update({
		id: "/students",
		path: "/students",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedTimetableRoute: Route$23.update({
		id: "/timetable",
		path: "/timetable",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedUsersRoute: Route.update({
		id: "/users",
		path: "/users",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 3e4,
			refetchOnWindowFocus: false,
			retry: 1
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
