import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  QrCode,
  CalendarCheck,
  FileBarChart,
  Bell,
  Settings,
  ScrollText,
  IdCard,
  School,
  LogOut,
  Menu,
  Megaphone,
  Baby,
  Wallet,
  Receipt,
  CalendarClock,
  ShieldCheck,
  ShieldAlert,
  Trophy,
  BookOpenCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, roleLabel, type AppRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/school/footer";
import { SchoolLogo } from "@/components/school/logo";
import { getReadAnnouncementIds } from "@/lib/device-notifications";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/" });
    return { user: data.user };
  },
  component: Layout,
});

type NavItem = { to: string; label: string; icon: typeof Users; roles: AppRole[] };

const NAV: NavItem[] = [
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
      "student",
    ],
  },
  { to: "/children", label: "My Children", icon: Baby, roles: ["parent"] },
  { to: "/scan", label: "QR Scanner", icon: QrCode, roles: ["admin", "secretary"] },

  {
    to: "/attendance",
    label: "Attendance",
    icon: CalendarCheck,
    roles: ["admin", "secretary", "teacher", "owner", "head_of_studies"],
  },
  {
    to: "/students",
    label: "Students",
    icon: GraduationCap,
    roles: ["admin", "secretary", "teacher", "owner", "head_of_studies"],
  },
  {
    to: "/assignments",
    label: "Assignments",
    icon: BookOpenCheck,
    roles: ["teacher", "parent", "head_of_studies", "admin", "owner", "student"],
  },
  {
    to: "/timetable",
    label: "Timetable",
    icon: CalendarClock,
    roles: ["admin", "secretary", "teacher", "owner", "head_of_studies"],
  },
  {
    to: "/permissions",
    label: "Permissions",
    icon: ShieldCheck,
    roles: ["admin", "secretary", "teacher", "parent", "owner", "head_of_studies"],
  },
  {
    to: "/discipline",
    label: "Discipline",
    icon: ShieldAlert,
    roles: ["admin", "secretary", "teacher", "parent", "owner", "head_of_studies"],
  },
  {
    to: "/activities",
    label: "Activities & Clubs",
    icon: Trophy,
    roles: ["admin", "secretary", "teacher", "parent", "owner", "head_of_studies"],
  },
  { to: "/finance", label: "Finance & Fees", icon: Wallet, roles: ["admin", "finance", "owner"] },
  { to: "/payments", label: "My Payments", icon: Receipt, roles: ["parent"] },
  { to: "/cards", label: "ID Cards & QR", icon: IdCard, roles: ["admin", "secretary"] },
  {
    to: "/classes",
    label: "Classes",
    icon: School,
    roles: ["admin", "secretary", "owner", "head_of_studies"],
  },
  { to: "/users", label: "Users & Roles", icon: Users, roles: ["admin", "secretary"] },
  {
    to: "/reports",
    label: "Reports",
    icon: FileBarChart,
    roles: ["admin", "secretary", "teacher", "parent", "owner", "finance", "head_of_studies"],
  },
  {
    to: "/notifications",
    label: "Email Log",
    icon: Bell,
    roles: ["admin", "secretary", "parent", "owner", "head_of_studies"],
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
      "student",
    ],
  },
  {
    to: "/audit",
    label: "Activity Logs",
    icon: ScrollText,
    roles: ["admin", "owner", "head_of_studies"],
  },
  { to: "/settings", label: "School Settings", icon: Settings, roles: ["admin"] },
];

function Layout() {
  const { role, profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const { data: classAccess } = useQuery({
    queryKey: ["teacher-class-access", user?.id],
    enabled: role === "teacher" && !!user?.id,
    queryFn: async () => {
      const [own, approved] = await Promise.all([
        supabase.from("classes").select("id").eq("teacher_id", user!.id),
        supabase
          .from("permission_requests")
          .select("id")
          .eq("teacher_id", user!.id)
          .eq("status", "approved"),
      ]);
      return (own.data?.length ?? 0) + (approved.data?.length ?? 0);
    },
  });

  const { data: parentAlerts } = useQuery({
    queryKey: ["parent-alerts", user?.id],
    enabled: role === "parent" && !!user?.id,
    refetchInterval: 60000,
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00.000Z`);
      return count ?? 0;
    },
  });

  const { data: pendingDisciplineCount } = useQuery({
    queryKey: ["pending-discipline-count", user?.id],
    enabled: role === "parent" && !!user?.id,
    refetchInterval: 30000,
    queryFn: async () => {
      const { data } = await supabase
        .from("discipline_incidents")
        .select("id")
        .eq("parent_id", user!.id)
        .eq("parent_acknowledged", false);
      return data?.length ?? 0;
    },
  });

  // Announcements query for unread badge in sidebar
  const { data: announcementsData } = useQuery({
    queryKey: ["announcements-sidebar-count"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, audience, is_pinned")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    refetchInterval: 30000,
  });

  const [readIds, setReadIds] = useState<Set<string>>(() => getReadAnnouncementIds());

  useEffect(() => {
    const handleReadChange = () => setReadIds(getReadAnnouncementIds());
    window.addEventListener("announcements-read-changed", handleReadChange);
    window.addEventListener("storage", handleReadChange);
    return () => {
      window.removeEventListener("announcements-read-changed", handleReadChange);
      window.removeEventListener("storage", handleReadChange);
    };
  }, []);

  const unreadAnnouncementsCount = (announcementsData ?? []).filter(
    (a) => !readIds.has(a.id),
  ).length;

  const hideStudents = role === "teacher" && !classAccess;
  const items = NAV.filter(
    (i) =>
      (!role || i.roles.includes(role)) &&
      !(hideStudents && (i.to === "/students" || i.to === "/attendance")),
  );
  const current = NAV.find((i) => i.to === pathname);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link
          to="/settings"
          onClick={() => setOpen(false)}
          title="School Settings & Logo"
          className="group flex items-center gap-3 border-b border-sidebar-border px-5 py-4 transition-colors hover:bg-sidebar-accent/50"
        >
          <SchoolLogo size="md" />
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-tight truncate group-hover:text-primary">
              Little Gems Academy
            </p>
            <p className="text-xs opacity-70">{role ? roleLabel[role] : "Loading…"}</p>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.to
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4" />
              <span className="truncate">{item.label}</span>
              {item.to === "/notifications" && role === "parent" && !!parentAlerts && (
                <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground">
                  {parentAlerts}
                </span>
              )}
              {item.to === "/discipline" &&
                role === "parent" &&
                !!pendingDisciplineCount &&
                pendingDisciplineCount > 0 && (
                  <span className="ml-auto flex items-center justify-center rounded-full bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-xs">
                    {pendingDisciplineCount}
                  </span>
                )}
              {item.to === "/announcements" && unreadAnnouncementsCount > 0 && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                  {unreadAnnouncementsCount} New
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <p className="truncate px-2 text-sm font-medium">{profile?.full_name}</p>
          <p className="truncate px-2 text-xs opacity-70">{profile?.email}</p>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/80 px-4 py-3 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <SchoolLogo size="sm" className="hidden sm:inline-flex" />
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">Little Gems Academy</p>
            <p className="truncate text-xs text-muted-foreground">
              {current?.label ?? "Dashboard"} · {role ? roleLabel[role] : ""}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {unreadAnnouncementsCount > 0 && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300 text-xs"
              >
                <Link to="/announcements">
                  <Megaphone className="size-3.5 text-rose-600 animate-bounce" />
                  <span className="hidden sm:inline">Announcements</span>
                  <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {unreadAnnouncementsCount}
                  </span>
                </Link>
              </Button>
            )}

            <div className="hidden text-right sm:block pr-2">
              <p className="truncate text-sm font-medium">{profile?.full_name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
