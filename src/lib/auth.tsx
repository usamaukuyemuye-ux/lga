import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_ACCOUNTS } from "@/integrations/firebase/seed";
import { type CampusCode, CAMPUSES } from "@/lib/school";

export type AppRole =
  | "admin"
  | "secretary"
  | "teacher"
  | "parent"
  | "finance"
  | "owner"
  | "head_of_studies"
  | "student";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  active: boolean;
  campus?: CampusCode | null;
}

interface AuthValue {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  profile: Profile | null;
  loading: boolean;
  activeCampus: CampusCode | "all";
  setActiveCampus: (campus: CampusCode | "all") => void;
  canSwitchCampus: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  session: null,
  user: null,
  role: null,
  profile: null,
  loading: true,
  activeCampus: "all",
  setActiveCampus: () => {},
  canSwitchCampus: false,
  refresh: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCampusOverride, setSelectedCampusOverride] = useState<CampusCode | "all" | null>(
    () => {
      try {
        const saved = localStorage.getItem("lga_active_campus");
        return (saved === "1" || saved === "2" || saved === "all") ? (saved as any) : null;
      } catch {
        return null;
      }
    }
  );

  const load = async (uid: string | undefined, userEmail?: string | null) => {
    if (!uid) {
      setRole(null);
      setProfile(null);
      return;
    }

    const email = (userEmail ?? "").toLowerCase().trim();
    const demo = DEMO_ACCOUNTS.find(
      (a) => a.id === uid || (email && a.email.toLowerCase() === email),
    );

    let resolvedRole: AppRole | null = demo ? demo.role : null;
    let resolvedProf: Profile | null = demo
      ? {
          id: demo.id,
          full_name: demo.name,
          email: demo.email,
          phone: "+250 780 000 000",
          active: true,
          campus: (demo.id === "user-secretary" || demo.id === "user-teacher") ? "1" : null,
        }
      : null;

    if (!resolvedRole && (email === "usamaukuyemuye@gmail.com" || email.includes("admin"))) {
      resolvedRole = "admin";
    }

    try {
      const [{ data: roles }, { data: prof }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase
          .from("profiles")
          .select("id, full_name, email, phone, active, campus")
          .eq("id", uid)
          .maybeSingle(),
      ]);
      const fetchedRole = ((roles?.[0]?.role as AppRole | undefined) ?? null) as AppRole | null;
      if (fetchedRole) resolvedRole = fetchedRole;
      if (prof) resolvedProf = prof as Profile;
    } catch {
      // Keep resolvedRole / resolvedProf fallbacks
    }

    setRole(resolvedRole);
    setProfile(resolvedProf);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setTimeout(() => void load(next?.user?.id, next?.user?.email), 0);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await load(data.session?.user?.id, data.session?.user?.email);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Role-based campus permissions:
  // Admin, Owner, and Head of Studies can view all campuses or switch between them.
  // Other roles (Teachers, Secretary, Parents, Finance) are bound to their assigned campus or default to campus 1.
  const canSwitchCampus = role === "admin" || role === "owner" || role === "head_of_studies";

  let activeCampus: CampusCode | "all" = "all";
  if (canSwitchCampus) {
    activeCampus = selectedCampusOverride ?? "all";
  } else if (profile?.campus === "2" || profile?.campus === "1") {
    activeCampus = profile.campus;
  } else {
    // Default staff / parents to campus 1 (Kacyiru) if not explicitly designated
    activeCampus = "1";
  }

  const handleSetActiveCampus = (campus: CampusCode | "all") => {
    if (canSwitchCampus) {
      setSelectedCampusOverride(campus);
      try {
        localStorage.setItem("lga_active_campus", campus);
      } catch {
        // ignore
      }
    }
  };

  const value: AuthValue = {
    session,
    user: session?.user ?? null,
    role,
    profile,
    loading,
    activeCampus,
    setActiveCampus: handleSetActiveCampus,
    canSwitchCampus,
    refresh: async () => load(session?.user?.id, session?.user?.email),
    signOut: async () => {
      await supabase.auth.signOut();
      setRole(null);
      setProfile(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export const roleLabel: Record<AppRole, string> = {
  admin: "Administrator",
  secretary: "Secretary",
  teacher: "Teacher",
  parent: "Parent",
  finance: "Finance Officer",
  owner: "School Owner",
  head_of_studies: "Head of Studies",
  student: "Student (P6)",
};
