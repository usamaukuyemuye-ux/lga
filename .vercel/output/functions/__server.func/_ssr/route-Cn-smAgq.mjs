import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as roleLabel, r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { Ct as CalendarClock, Dt as Bell, E as QrCode, Et as BookOpenCheck, K as LayoutDashboard, L as Menu, Ot as Baby, R as Megaphone, S as School, T as Receipt, V as LogOut, X as IdCard, Z as GraduationCap, _ as ShieldAlert, g as ShieldCheck, l as Trophy, n as Wallet, r as Users, rt as FileChartColumnIncreasing, v as Settings, wt as CalendarCheck, x as ScrollText } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getReadAnnouncementIds } from "./device-notifications-BMIcetfI.mjs";
import { t as SchoolLogo } from "./logo-BzveDTdy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Cn-smAgq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/school/footer.tsx";
function SiteFooter() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
		className: "mt-10 border-t bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, {
					size: "md",
					showText: true,
					subtitle: "Excellence in Primary Education"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 9,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-sm text-muted-foreground leading-relaxed",
					children: "Attendance monitoring, announcements, student ID cards, and parent communications."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 10,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 8,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-semibold text-foreground",
						children: "Support & Inquiries"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 15,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "mt-2 space-y-1 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "contact@littlegemsacademy.edu" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 17,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "ukuyemuyeusam@gmail.com" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 18,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "+250 780 000 000" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 19,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Kigali, Rwanda" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 20,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 16,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 14,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-semibold text-foreground",
						children: "School Hours"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 24,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "mt-2 space-y-1 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Monday – Friday · 07:30 – 16:30" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 26,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Gate & QR Scanning opens at 07:00" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 27,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Weekend: Closed for activities" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 28,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 25,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 23,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 7,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6",
			children: [
				"© ",
				year,
				" Little Gems Academy. All rights reserved."
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 32,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/route.tsx?tsr-split=component";
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"parent",
			"finance",
			"owner",
			"head_of_studies",
			"student"
		]
	},
	{
		to: "/children",
		label: "My Children",
		icon: Baby,
		roles: ["parent"]
	},
	{
		to: "/scan",
		label: "QR Scanner",
		icon: QrCode,
		roles: ["admin", "secretary"]
	},
	{
		to: "/attendance",
		label: "Attendance",
		icon: CalendarCheck,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/students",
		label: "Students",
		icon: GraduationCap,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/assignments",
		label: "Assignments",
		icon: BookOpenCheck,
		roles: [
			"teacher",
			"parent",
			"head_of_studies",
			"admin",
			"owner",
			"student"
		]
	},
	{
		to: "/timetable",
		label: "Timetable",
		icon: CalendarClock,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/permissions",
		label: "Permissions",
		icon: ShieldCheck,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"parent",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/discipline",
		label: "Discipline",
		icon: ShieldAlert,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"parent",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/activities",
		label: "Activities & Clubs",
		icon: Trophy,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"parent",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/finance",
		label: "Finance & Fees",
		icon: Wallet,
		roles: [
			"admin",
			"finance",
			"owner"
		]
	},
	{
		to: "/payments",
		label: "My Payments",
		icon: Receipt,
		roles: ["parent"]
	},
	{
		to: "/cards",
		label: "ID Cards & QR",
		icon: IdCard,
		roles: ["admin", "secretary"]
	},
	{
		to: "/classes",
		label: "Classes",
		icon: School,
		roles: [
			"admin",
			"secretary",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/users",
		label: "Users & Roles",
		icon: Users,
		roles: ["admin", "secretary"]
	},
	{
		to: "/reports",
		label: "Reports",
		icon: FileChartColumnIncreasing,
		roles: [
			"admin",
			"secretary",
			"teacher",
			"parent",
			"owner",
			"finance",
			"head_of_studies"
		]
	},
	{
		to: "/notifications",
		label: "Email Log",
		icon: Bell,
		roles: [
			"admin",
			"secretary",
			"parent",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/announcements",
		label: "Announcements",
		icon: Megaphone,
		roles: [
			"admin",
			"parent",
			"teacher",
			"secretary",
			"finance",
			"owner",
			"head_of_studies",
			"student"
		]
	},
	{
		to: "/audit",
		label: "Activity Logs",
		icon: ScrollText,
		roles: [
			"admin",
			"owner",
			"head_of_studies"
		]
	},
	{
		to: "/settings",
		label: "School Settings",
		icon: Settings,
		roles: ["admin"]
	}
];
function Layout() {
	const { role, profile, signOut, user } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: classAccess } = useQuery({
		queryKey: ["teacher-class-access", user?.id],
		enabled: role === "teacher" && !!user?.id,
		queryFn: async () => {
			const [own, approved] = await Promise.all([supabase.from("classes").select("id").eq("teacher_id", user.id), supabase.from("permission_requests").select("id").eq("teacher_id", user.id).eq("status", "approved")]);
			return (own.data?.length ?? 0) + (approved.data?.length ?? 0);
		}
	});
	const { data: parentAlerts } = useQuery({
		queryKey: ["parent-alerts", user?.id],
		enabled: role === "parent" && !!user?.id,
		refetchInterval: 6e4,
		queryFn: async () => {
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const { count } = await supabase.from("notifications").select("id", {
				count: "exact",
				head: true
			}).gte("created_at", `${today}T00:00:00.000Z`);
			return count ?? 0;
		}
	});
	const { data: pendingDisciplineCount } = useQuery({
		queryKey: ["pending-discipline-count", user?.id],
		enabled: role === "parent" && !!user?.id,
		refetchInterval: 3e4,
		queryFn: async () => {
			const { data } = await supabase.from("discipline_incidents").select("id").eq("parent_id", user.id).eq("parent_acknowledged", false);
			return data?.length ?? 0;
		}
	});
	const { data: announcementsData } = useQuery({
		queryKey: ["announcements-sidebar-count"],
		queryFn: async () => {
			const { data } = await supabase.from("announcements").select("id, audience, is_pinned").order("created_at", { ascending: false });
			return data ?? [];
		},
		refetchInterval: 3e4
	});
	const [readIds, setReadIds] = (0, import_react.useState)(() => getReadAnnouncementIds());
	(0, import_react.useEffect)(() => {
		const handleReadChange = () => setReadIds(getReadAnnouncementIds());
		window.addEventListener("announcements-read-changed", handleReadChange);
		window.addEventListener("storage", handleReadChange);
		return () => {
			window.removeEventListener("announcements-read-changed", handleReadChange);
			window.removeEventListener("storage", handleReadChange);
		};
	}, []);
	const unreadAnnouncementsCount = (announcementsData ?? []).filter((a) => !readIds.has(a.id)).length;
	const hideStudents = role === "teacher" && !classAccess;
	const items = NAV.filter((i) => (!role || i.roles.includes(role)) && !(hideStudents && (i.to === "/students" || i.to === "/attendance")));
	const current = NAV.find((i) => i.to === pathname);
	const handleSignOut = async () => {
		await signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/settings",
						onClick: () => setOpen(false),
						title: "School Settings & Logo",
						className: "group flex items-center gap-3 border-b border-sidebar-border px-5 py-4 transition-colors hover:bg-sidebar-accent/50",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, { size: "md" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 211,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-bold leading-tight truncate group-hover:text-primary",
								children: "Little Gems Academy"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 213,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs opacity-70",
								children: role ? roleLabel[role] : "Loading…"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 216,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 212,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 210,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
						className: "flex-1 space-y-1 overflow-y-auto p-3",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", pathname === item.to ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(item.icon, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 221,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "truncate",
									children: item.label
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 222,
									columnNumber: 15
								}, this),
								item.to === "/notifications" && role === "parent" && !!parentAlerts && /* @__PURE__ */ (void 0)("span", {
									className: "ml-auto grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground",
									children: parentAlerts
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 223,
									columnNumber: 87
								}, this),
								item.to === "/discipline" && role === "parent" && !!pendingDisciplineCount && pendingDisciplineCount > 0 && /* @__PURE__ */ (void 0)("span", {
									className: "ml-auto flex items-center justify-center rounded-full bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-xs",
									children: pendingDisciplineCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 226,
									columnNumber: 124
								}, this),
								item.to === "/announcements" && unreadAnnouncementsCount > 0 && /* @__PURE__ */ (void 0)("span", {
									className: "ml-auto flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse",
									children: [
										/* @__PURE__ */ (void 0)("span", { className: "size-1.5 rounded-full bg-white animate-ping" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 230,
											columnNumber: 19
										}, this),
										unreadAnnouncementsCount,
										" New"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 229,
									columnNumber: 80
								}, this)
							]
						}, item.to, true, {
							fileName: _jsxFileName,
							lineNumber: 220,
							columnNumber: 30
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 219,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "border-t border-sidebar-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "truncate px-2 text-sm font-medium",
								children: profile?.full_name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "truncate px-2 text-xs opacity-70",
								children: profile?.email
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 237,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								className: "mt-2 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
								onClick: handleSignOut,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 239,
									columnNumber: 13
								}, this), " Sign out"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 238,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 235,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 209,
				columnNumber: 7
			}, this),
			open && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
				onClick: () => setOpen(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 244,
				columnNumber: 16
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex min-h-screen flex-col lg:pl-64",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "sticky top-0 z-20 flex items-center gap-3 border-b bg-card/80 px-4 py-3 backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								onClick: () => setOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, { className: "size-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 248,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, {
								size: "sm",
								className: "hidden sm:inline-flex"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "truncate font-semibold leading-tight",
									children: "Little Gems Academy"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										current?.label ?? "Dashboard",
										" · ",
										role ? roleLabel[role] : ""
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 254,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 252,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "ml-auto flex items-center gap-2",
								children: [
									unreadAnnouncementsCount > 0 && /* @__PURE__ */ (void 0)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "h-8 gap-1.5 border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300 text-xs",
										children: /* @__PURE__ */ (void 0)(Link, {
											to: "/announcements",
											children: [
												/* @__PURE__ */ (void 0)(Megaphone, { className: "size-3.5 text-rose-600 animate-bounce" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 262,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("span", {
													className: "hidden sm:inline",
													children: "Announcements"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 263,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("span", {
													className: "rounded-full bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white",
													children: unreadAnnouncementsCount
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 264,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 261,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 260,
										columnNumber: 46
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "hidden text-right sm:block pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "truncate text-sm font-medium",
											children: profile?.full_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 271,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: profile?.email
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 272,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 270,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										size: "sm",
										className: "hidden lg:inline-flex",
										onClick: handleSignOut,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 275,
											columnNumber: 15
										}, this), " Sign out"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 274,
										columnNumber: 13
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 247,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
						className: "flex-1 p-4 sm:p-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 280,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 279,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteFooter, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 282,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 246,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 208,
		columnNumber: 10
	}, this);
}
//#endregion
export { Layout as component };
