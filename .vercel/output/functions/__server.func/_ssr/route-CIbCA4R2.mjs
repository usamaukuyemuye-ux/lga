import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as roleLabel, r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { Ct as CalendarClock, Dt as Bell, E as QrCode, Et as BookOpenCheck, K as LayoutDashboard, L as Menu, Ot as Baby, R as Megaphone, S as School, T as Receipt, V as LogOut, X as IdCard, Z as GraduationCap, _ as ShieldAlert, g as ShieldCheck, l as Trophy, n as Wallet, r as Users, rt as FileChartColumnIncreasing, v as Settings, wt as CalendarCheck, x as ScrollText } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getReadAnnouncementIds } from "./device-notifications-BMIcetfI.mjs";
import { t as SchoolLogo } from "./logo-DWjWTi6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CIbCA4R2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteFooter() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-10 border-t bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, {
					size: "md",
					showText: true,
					subtitle: "Excellence in Primary Education"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground leading-relaxed",
					children: "Attendance monitoring, announcements, student ID cards, and parent communications."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "Support & Inquiries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "contact@littlegemsacademy.edu" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ukuyemuyeusam@gmail.com" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "+250 780 000 000" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Kigali, Rwanda" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "School Hours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Monday – Friday · 07:30 – 16:30" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Gate & QR Scanning opens at 07:00" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Weekend: Closed for activities" })
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6",
			children: [
				"© ",
				year,
				" Little Gems Academy. All rights reserved."
			]
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/settings",
						onClick: () => setOpen(false),
						title: "School Settings & Logo",
						className: "group flex items-center gap-3 border-b border-sidebar-border px-5 py-4 transition-colors hover:bg-sidebar-accent/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, { size: "md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold leading-tight truncate group-hover:text-primary",
								children: "Little Gems Academy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs opacity-70",
								children: role ? roleLabel[role] : "Loading…"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1 overflow-y-auto p-3",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", pathname === item.to ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: item.label
								}),
								item.to === "/notifications" && role === "parent" && !!parentAlerts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground",
									children: parentAlerts
								}),
								item.to === "/discipline" && role === "parent" && !!pendingDisciplineCount && pendingDisciplineCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto flex items-center justify-center rounded-full bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-xs",
									children: pendingDisciplineCount
								}),
								item.to === "/announcements" && unreadAnnouncementsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-auto flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-white animate-ping" }),
										unreadAnnouncementsCount,
										" New"
									]
								})
							]
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-sidebar-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate px-2 text-sm font-medium",
								children: profile?.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate px-2 text-xs opacity-70",
								children: profile?.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "mt-2 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
								onClick: handleSignOut,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
							})
						]
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col lg:pl-64",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex items-center gap-3 border-b bg-card/80 px-4 py-3 backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								onClick: () => setOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, {
								size: "sm",
								className: "hidden sm:inline-flex"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold leading-tight",
									children: "Little Gems Academy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										current?.label ?? "Dashboard",
										" · ",
										role ? roleLabel[role] : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-2",
								children: [
									unreadAnnouncementsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "h-8 gap-1.5 border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/announcements",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-3.5 text-rose-600 animate-bounce" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "Announcements"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white",
													children: unreadAnnouncementsCount
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden text-right sm:block pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: profile?.full_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: profile?.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "hidden lg:inline-flex",
										onClick: handleSignOut,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 p-4 sm:p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
				]
			})
		]
	});
}
//#endregion
export { Layout as component };
