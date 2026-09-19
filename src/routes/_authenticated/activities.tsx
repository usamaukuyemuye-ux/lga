import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  Plus,
  Users,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Shield,
  Activity,
  Check,
  CheckCircle2,
  Trash2,
  Edit2,
  Phone,
  Info,
  Sparkles,
  Download,
  FileSpreadsheet,
  AlertCircle,
  Dumbbell,
  Music,
  Palette,
  BookOpen,
  Crown,
  ChevronRight,
  X,
  Eye,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/school/ui";
import { fmtDate, logAudit } from "@/lib/school";
import { exportExcel, exportPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/activities")({
  head: () => ({
    meta: [
      { title: "Activities & Clubs — Little Gems Academy" },
      {
        name: "description",
        content: "Extracurricular clubs, athletic sports teams, and student membership rosters.",
      },
      { property: "og:title", content: "Activities & Clubs — Little Gems Academy" },
      {
        property: "og:description",
        content: "Extracurricular clubs, athletic sports teams, and student membership rosters.",
      },
    ],
  }),
  component: ActivitiesPage,
});

export interface Club {
  id: string;
  name: string;
  category:
    "Sports" | "Arts & Culture" | "Academic & STEM" | "Music & Performing" | "Leadership & Clubs";
  description: string;
  schedule: string;
  venue: string;
  coach_id?: string | null;
  coach_email?: string | null;
  coach_name: string;
  coach_phone?: string | null;
  capacity: number;
  fee?: string | null;
  status: "active" | "inactive";
  created_at?: string;
}

export interface ClubMembership {
  id: string;
  club_id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  class_name: string;
  parent_id?: string | null;
  parent_name?: string | null;
  role_in_club: string;
  notes?: string | null;
  enrolled_at: string;
  enrolled_by_name: string;
  enrolled_by_role: string;
}

const CATEGORY_COLORS: Record<string, { badge: string; icon: any }> = {
  Sports: {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    icon: Dumbbell,
  },
  "Arts & Culture": {
    badge:
      "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
    icon: Palette,
  },
  "Academic & STEM": {
    badge:
      "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    icon: BookOpen,
  },
  "Music & Performing": {
    badge:
      "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    icon: Music,
  },
  "Leadership & Clubs": {
    badge:
      "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
    icon: Crown,
  },
};

const DEFAULT_CLUBS: Club[] = [
  {
    id: "club-football",
    name: "Football Team (School Eagles)",
    category: "Sports",
    description:
      "Official school football squad. Training focuses on footwork, tactical set-pieces, match fitness, and inter-school championships.",
    schedule: "Tuesdays & Thursdays, 3:45 PM - 5:15 PM",
    venue: "Main Sports Pitch",
    coach_id: null,
    coach_email: "sports@school.com",
    coach_name: "Coach David Kamanzi",
    coach_phone: "+250 788 123 456",
    capacity: 26,
    fee: "Included in Tuition",
    status: "active",
  },
  {
    id: "club-volleyball",
    name: "Volleyball Club",
    category: "Sports",
    description:
      "Competitive and recreational volleyball for all grades. Training covers serving, setting, spiking, and friendly tournaments.",
    schedule: "Wednesdays & Fridays, 3:30 PM - 4:45 PM",
    venue: "Outdoor Sports Court",
    coach_id: "user-teacher",
    coach_email: "teacher@school.com",
    coach_name: "Jane Smith",
    coach_phone: "+250 788 234 567",
    capacity: 20,
    fee: "Free",
    status: "active",
  },
  {
    id: "club-robotics",
    name: "Robotics & STEM Club",
    category: "Academic & STEM",
    description:
      "Hands-on robotics kits, visual block programming, electronics sensors, and competition builds for regional science fairs.",
    schedule: "Mondays, 3:30 PM - 5:00 PM",
    venue: "Science & Innovation Lab",
    coach_id: "user-teacher",
    coach_email: "teacher@school.com",
    coach_name: "Jane Smith",
    coach_phone: "+250 788 345 678",
    capacity: 18,
    fee: "KSh 1,000 / Term",
    status: "active",
  },
  {
    id: "club-drama",
    name: "Drama & Theater Society",
    category: "Arts & Culture",
    description:
      "Stage acting, voice projection, creative improvisation, costume design, and annual school musical drama production.",
    schedule: "Tuesdays & Fridays, 3:30 PM - 5:00 PM",
    venue: "School Auditorium",
    coach_id: null,
    coach_email: "drama@school.com",
    coach_name: "Mrs. Grace Mukamana",
    coach_phone: "+250 788 456 789",
    capacity: 25,
    fee: "Free",
    status: "active",
  },
  {
    id: "club-chess",
    name: "Chess & Strategy Club",
    category: "Academic & STEM",
    description:
      "Critical thinking, opening theory, tactical puzzles, tournament etiquette, and blitz championship games.",
    schedule: "Wednesdays, 3:30 PM - 4:45 PM",
    venue: "Library Resource Room",
    coach_id: null,
    coach_email: "chess@school.com",
    coach_name: "Mr. John Bizimana",
    coach_phone: "+250 788 567 890",
    capacity: 24,
    fee: "Free",
    status: "active",
  },
  {
    id: "club-music",
    name: "Music Band & Choir",
    category: "Music & Performing",
    description:
      "Ensemble vocals, acoustic guitar, brass instruments, and choral performances at national celebrations and school assemblies.",
    schedule: "Thursdays, 3:30 PM - 5:00 PM",
    venue: "Music Studio",
    coach_id: null,
    coach_email: "music@school.com",
    coach_name: "Ms. Aline Ingabire",
    coach_phone: "+250 788 678 901",
    capacity: 30,
    fee: "Free",
    status: "active",
  },
];

function ActivitiesPage() {
  const qc = useQueryClient();
  const { user, profile } = useAuth();
  const role = profile?.role;

  // Role Permissions
  // Admin, Secretary, and Owner have full unrestricted access to create, edit, delete, and insert students into ANY club
  const isAdminOrSec = role === "admin" || role === "secretary" || role === "owner";
  // Teacher role
  const isTeacher = role === "teacher";
  // Parent role (strictly read-only)
  const isParent = role === "parent";
  // Staff who can assign students: Admins, Secretaries, and Teachers (teachers restricted to clubs they lead)
  const canAssignStudent = isAdminOrSec || isTeacher;

  // Filter and View States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "roster">("cards");
  const [selectedClubForRoster, setSelectedClubForRoster] = useState<Club | null>(null);

  // Teacher View Scope: Defaults to "my_clubs" so teacher only sees the clubs they lead
  const [teacherViewScope, setTeacherViewScope] = useState<"my_clubs" | "all">("my_clubs");
  // Master Roster Scope for Teacher: defaults to "my_members"
  const [rosterScope, setRosterScope] = useState<"my_members" | "all">("my_members");

  // Modal Dialog States
  const [showClubDialog, setShowClubDialog] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);

  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Form States for Add/Edit Club
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState<Club["category"]>("Sports");
  const [clubDesc, setClubDesc] = useState("");
  const [clubSchedule, setClubSchedule] = useState("");
  const [clubVenue, setClubVenue] = useState("");
  const [clubCoachId, setClubCoachId] = useState("");
  const [clubCoachEmail, setClubCoachEmail] = useState("");
  const [clubCoach, setClubCoach] = useState("");
  const [clubCoachPhone, setClubCoachPhone] = useState("");
  const [clubCapacity, setClubCapacity] = useState("25");
  const [clubFee, setClubFee] = useState("Free");

  // Form States for Assign Student
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assignClubId, setAssignClubId] = useState("");
  const [assignRole, setAssignRole] = useState("Member");
  const [assignNotes, setAssignNotes] = useState("");

  // 1. Fetch Clubs
  const { data: clubs = DEFAULT_CLUBS, isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clubs").select("*").order("name");
      if (error || !data || data.length === 0) {
        return DEFAULT_CLUBS;
      }
      return data as Club[];
    },
  });

  // 2. Fetch Memberships
  const { data: memberships = [], isLoading: membersLoading } = useQuery<ClubMembership[]>({
    queryKey: ["club_memberships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_memberships")
        .select("*")
        .order("enrolled_at", { ascending: false });
      if (error || !data) return [];
      return data as ClubMembership[];
    },
  });

  // 3. Fetch Students for Assignment Dropdown
  const { data: students = [] } = useQuery<any[]>({
    queryKey: ["students_for_clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*, classes(name)")
        .order("full_name");
      if (error || !data) return [];
      return data;
    },
  });

  // 4. Fetch Teachers for Club Lead selection (Admin & Secretary can pick registered teachers)
  const { data: teachers = [] } = useQuery<
    { id: string; full_name: string; email: string; phone?: string }[]
  >({
    queryKey: ["teachers_for_club_assignment"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher");
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) {
        return [
          {
            id: "user-teacher",
            full_name: "Jane Smith",
            email: "teacher@school.com",
            phone: "+250 788 234 567",
          },
        ];
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", ids)
        .order("full_name");
      if (!data || data.length === 0) {
        return [
          {
            id: "user-teacher",
            full_name: "Jane Smith",
            email: "teacher@school.com",
            phone: "+250 788 234 567",
          },
        ];
      }
      return data;
    },
  });

  // Helper to check if current logged in user leads a club
  const isClubLead = useCallback(
    (c: Club) => {
      if (!c || !user) return false;
      return (
        (c.coach_id && c.coach_id === user.id) ||
        (c.coach_email && user.email && c.coach_email.toLowerCase() === user.email.toLowerCase()) ||
        (c.coach_name &&
          profile?.full_name &&
          c.coach_name.toLowerCase().trim() === profile.full_name.toLowerCase().trim())
      );
    },
    [user, profile],
  );

  // Clubs that the current teacher leads
  const teacherLedClubs = useMemo(() => {
    if (!isTeacher) return [];
    return clubs.filter(isClubLead);
  }, [isTeacher, clubs, isClubLead]);

  // Assignable Clubs:
  // - Admin & Secretary can insert into ANY club directly!
  // - Teacher will ONLY see clubs and activities which he/she leads!
  const assignableClubs = useMemo(() => {
    if (isAdminOrSec) return clubs;
    if (isTeacher) return teacherLedClubs;
    return [];
  }, [isAdminOrSec, isTeacher, clubs, teacherLedClubs]);

  // Set of club IDs the teacher leads (for roster filtering)
  const teacherLedClubIds = useMemo(() => {
    return new Set(teacherLedClubs.map((c) => c.id));
  }, [teacherLedClubs]);

  // Parent's Children Mapping
  const parentChildren = useMemo(() => {
    if (!isParent || !user) return [];
    return students.filter((s) => s.parent_id === user.id || s.parent_email === user.email);
  }, [isParent, user, students]);

  const parentChildIds = useMemo(() => {
    return new Set(parentChildren.map((c) => c.id));
  }, [parentChildren]);

  // Parent's Children Memberships
  const parentChildrenMemberships = useMemo(() => {
    if (!isParent) return [];
    return memberships.filter(
      (m) => parentChildIds.has(m.student_id) || (m.parent_id && m.parent_id === user?.id),
    );
  }, [isParent, memberships, parentChildIds, user]);

  // Combined Membership counts per club
  const clubMemberCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of memberships) {
      counts[m.club_id] = (counts[m.club_id] || 0) + 1;
    }
    return counts;
  }, [memberships]);

  // Filtered Clubs
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      // If teacher has toggled "My Led Clubs", restrict to clubs they lead
      if (isTeacher && teacherViewScope === "my_clubs") {
        if (!isClubLead(c)) return false;
      }

      const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.coach_name.toLowerCase().includes(q) ||
        c.venue.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [clubs, isTeacher, teacherViewScope, selectedCategory, searchQuery, isClubLead]);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return memberships.filter((m) => {
      // If teacher has "my_members" filter active, only show members in their led clubs
      if (isTeacher && rosterScope === "my_members") {
        if (!teacherLedClubIds.has(m.club_id)) return false;
      }

      const club = clubs.find((c) => c.id === m.club_id);
      const matchesCategory =
        selectedCategory === "all" || (club && club.category === selectedCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.student_name.toLowerCase().includes(q) ||
        m.student_code.toLowerCase().includes(q) ||
        m.class_name.toLowerCase().includes(q) ||
        (club && club.name.toLowerCase().includes(q)) ||
        m.role_in_club.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [
    memberships,
    clubs,
    isTeacher,
    rosterScope,
    teacherLedClubIds,
    selectedCategory,
    searchQuery,
  ]);

  // Mutations
  // 1. Create or Edit Club (Admin & Secretary have direct access to create and edit any club)
  const saveClubMutation = useMutation({
    mutationFn: async () => {
      if (!isAdminOrSec) {
        throw new Error(
          "Permission Denied: Only Administrators and Secretaries can create or edit clubs.",
        );
      }
      if (!clubName.trim()) throw new Error("Club name is required.");
      if (!clubSchedule.trim()) throw new Error("Weekly schedule is required.");
      if (!clubVenue.trim()) throw new Error("Venue is required.");
      if (!clubCoach.trim()) throw new Error("Coach / Supervisor name is required.");

      const clubData: Partial<Club> = {
        name: clubName.trim(),
        category: clubCategory,
        description: clubDesc.trim(),
        schedule: clubSchedule.trim(),
        venue: clubVenue.trim(),
        coach_id: clubCoachId || null,
        coach_email: clubCoachEmail || null,
        coach_name: clubCoach.trim(),
        coach_phone: clubCoachPhone.trim() || null,
        capacity: parseInt(clubCapacity) || 25,
        fee: clubFee.trim() || "Free",
        status: "active",
      };

      if (editingClub) {
        const { error } = await supabase.from("clubs").update(clubData).eq("id", editingClub.id);
        if (error) throw error;
        await logAudit("clubs.updated", "clubs", { id: editingClub.id, name: clubData.name });
      } else {
        const newId = `club-${Date.now()}`;
        const { error } = await supabase.from("clubs").insert({
          id: newId,
          ...clubData,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
        await logAudit("clubs.created", "clubs", { id: newId, name: clubData.name });
      }
    },
    onSuccess: () => {
      toast.success(editingClub ? "Club details updated." : "New Club created successfully!");
      setShowClubDialog(false);
      setEditingClub(null);
      void qc.invalidateQueries({ queryKey: ["clubs"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save club.");
    },
  });

  // 2. Delete Club (Admin & Secretary only)
  const deleteClubMutation = useMutation({
    mutationFn: async (clubId: string) => {
      if (!isAdminOrSec) {
        throw new Error("Permission Denied: Only Administrators and Secretaries can delete clubs.");
      }
      const { error } = await supabase.from("clubs").delete().eq("id", clubId);
      if (error) throw error;
      // Also delete memberships
      await supabase.from("club_memberships").delete().eq("club_id", clubId);
      await logAudit("clubs.deleted", "clubs", { id: clubId });
    },
    onSuccess: () => {
      toast.success("Club removed.");
      void qc.invalidateQueries({ queryKey: ["clubs"] });
      void qc.invalidateQueries({ queryKey: ["club_memberships"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete club.");
    },
  });

  // 3. Assign Student to Club:
  // - Admin & Secretary can insert into ANY club directly!
  // - Teacher can ONLY assign/register students into clubs they lead!
  const assignStudentMutation = useMutation({
    mutationFn: async () => {
      if (!assignStudentId) throw new Error("Please select a student.");
      if (!assignClubId) throw new Error("Please select a club or activity.");

      const selectedStudent = students.find((s) => s.id === assignStudentId);
      if (!selectedStudent) throw new Error("Student not found.");

      const selectedClub = clubs.find((c) => c.id === assignClubId);
      if (!selectedClub) throw new Error("Club not found.");

      // Security check: If teacher, must lead this club
      if (isTeacher && !isClubLead(selectedClub)) {
        throw new Error(
          "Permission Denied: Teachers can only enroll members or readers into clubs they lead.",
        );
      }

      // Check if already member
      const existing = memberships.find(
        (m) => m.club_id === assignClubId && m.student_id === assignStudentId,
      );
      if (existing) {
        throw new Error(
          `${selectedStudent.full_name} is already enrolled in ${selectedClub.name}.`,
        );
      }

      const membershipId = `mem-${Date.now()}`;
      const newMembership: ClubMembership = {
        id: membershipId,
        club_id: assignClubId,
        student_id: selectedStudent.id,
        student_name: selectedStudent.full_name,
        student_code: selectedStudent.student_code,
        class_name: selectedStudent.classes?.name || "Unassigned",
        parent_id: selectedStudent.parent_id || null,
        parent_name: selectedStudent.parent_name || null,
        role_in_club: assignRole.trim() || "Member",
        notes: assignNotes.trim() || null,
        enrolled_at: new Date().toISOString(),
        enrolled_by_name: profile?.full_name || "Staff",
        enrolled_by_role: role || "staff",
      };

      const { error } = await supabase.from("club_memberships").insert(newMembership);
      if (error) throw error;

      await logAudit("clubs.student_assigned", "club_memberships", {
        membership_id: membershipId,
        club_id: assignClubId,
        student_id: selectedStudent.id,
        role: assignRole,
      });
    },
    onSuccess: () => {
      toast.success("Student successfully enrolled into club!");
      setShowAssignDialog(false);
      setAssignStudentId("");
      setAssignClubId("");
      setAssignRole("Member");
      setAssignNotes("");
      void qc.invalidateQueries({ queryKey: ["club_memberships"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to assign student.");
    },
  });

  // 4. Remove Student from Club:
  // - Admin & Secretary can remove any student
  // - Teacher can only remove students from clubs they lead
  const removeMembershipMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const membership = memberships.find((m) => m.id === membershipId);
      if (isTeacher && membership) {
        const club = clubs.find((c) => c.id === membership.club_id);
        if (club && !isClubLead(club)) {
          throw new Error(
            "Permission Denied: Teachers can only remove members from clubs they lead.",
          );
        }
      }
      const { error } = await supabase.from("club_memberships").delete().eq("id", membershipId);
      if (error) throw error;
      await logAudit("clubs.student_removed", "club_memberships", { id: membershipId });
    },
    onSuccess: () => {
      toast.success("Student removed from club.");
      void qc.invalidateQueries({ queryKey: ["club_memberships"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove student from club.");
    },
  });

  // Export Roster
  const handleExportPdf = () => {
    const rows = filteredRoster.map((m) => {
      const club = clubs.find((c) => c.id === m.club_id);
      return [
        m.student_name,
        m.student_code,
        m.class_name,
        club?.name || "—",
        club?.category || "—",
        m.role_in_club,
        fmtDate(m.enrolled_at),
        m.enrolled_by_name,
      ];
    });

    exportPdf(
      "Extracurricular Activities & Club Rosters",
      [
        "Student Name",
        "Code",
        "Class",
        "Club / Activity",
        "Category",
        "Role / Position",
        "Enrolled Date",
        "Staff",
      ],
      rows,
      `activities_roster_${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  };

  const handleExportExcel = () => {
    const rows = filteredRoster.map((m) => {
      const club = clubs.find((c) => c.id === m.club_id);
      return {
        "Student Name": m.student_name,
        "Student Code": m.student_code,
        Class: m.class_name,
        "Club / Activity": club?.name || "",
        Category: club?.category || "",
        "Role in Club": m.role_in_club,
        "Enrolled Date": fmtDate(m.enrolled_at),
        "Enrolled By": `${m.enrolled_by_name} (${m.enrolled_by_role})`,
        Notes: m.notes || "",
      };
    });

    exportExcel(rows, `activities_roster_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Helper to open Add Club (Admin/Secretary)
  const handleOpenAddClub = () => {
    setEditingClub(null);
    setClubName("");
    setClubCategory("Sports");
    setClubDesc("");
    setClubSchedule("");
    setClubVenue("");
    setClubCoachId("");
    setClubCoachEmail("");
    setClubCoach(profile?.full_name || "");
    setClubCoachPhone("");
    setClubCapacity("25");
    setClubFee("Free");
    setShowClubDialog(true);
  };

  // Helper to open Edit Club (Admin/Secretary)
  const handleOpenEditClub = (club: Club) => {
    setEditingClub(club);
    setClubName(club.name);
    setClubCategory(club.category);
    setClubDesc(club.description);
    setClubSchedule(club.schedule);
    setClubVenue(club.venue);
    setClubCoachId(club.coach_id || "");
    setClubCoachEmail(club.coach_email || "");
    setClubCoach(club.coach_name);
    setClubCoachPhone(club.coach_phone || "");
    setClubCapacity(String(club.capacity));
    setClubFee(club.fee || "Free");
    setShowClubDialog(true);
  };

  // Helper to open Assign Student:
  // Pre-selects specificClubId if valid for user, or defaults to the first assignable club
  const handleOpenAssign = (specificClubId?: string) => {
    let targetClubId = "";
    if (specificClubId) {
      const targetClub = clubs.find((c) => c.id === specificClubId);
      if (targetClub) {
        if (isAdminOrSec || isClubLead(targetClub)) {
          targetClubId = specificClubId;
        } else {
          toast.error("You can only enroll students into clubs and activities that you lead.");
          return;
        }
      }
    }
    if (!targetClubId) {
      targetClubId = assignableClubs[0]?.id || "";
    }
    setAssignStudentId("");
    setAssignClubId(targetClubId);
    setAssignRole("Member");
    setAssignNotes("");
    setShowAssignDialog(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activities & Clubs"
        description={
          isParent
            ? "View extracurricular activities, sports team schedules, venues, and your child's club participation."
            : "Manage athletic sports teams, arts, STEM clubs, and student roster enrollments."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={filteredRoster.length === 0}
              className="gap-1.5 text-xs h-9"
            >
              <Download className="size-3.5" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={filteredRoster.length === 0}
              className="gap-1.5 text-xs h-9"
            >
              <FileSpreadsheet className="size-3.5" /> Excel
            </Button>

            {/* Staff: Assign Student button */}
            {canAssignStudent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenAssign()}
                className="gap-1.5 text-xs h-9 font-semibold shadow-xs"
              >
                <UserPlus className="size-4 text-primary" /> Assign Student
              </Button>
            )}

            {/* Admin: Add Club button */}
            {isAdminOrSec && (
              <Button
                onClick={handleOpenAddClub}
                size="sm"
                className="gap-1.5 text-xs h-9 font-semibold shadow-sm"
              >
                <Plus className="size-4" /> Add Club / Activity
              </Button>
            )}

            {isParent && (
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-1 bg-muted/50 border-border text-muted-foreground gap-1.5"
              >
                <Eye className="size-3.5 text-primary" /> Parent Access: Read-Only
              </Badge>
            )}
          </div>
        }
      />

      {/* Parent Attention / Children's Clubs Banner */}
      {isParent && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <Trophy className="size-4 text-primary" />
              <span>Your Children's Club Participations</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {parentChildrenMemberships.length} Enrolled{" "}
              {parentChildrenMemberships.length === 1 ? "Activity" : "Activities"}
            </Badge>
          </div>

          {parentChildrenMemberships.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              None of your children are currently enrolled in any extracurricular clubs. Explore the
              active clubs below and contact their class teacher or sports coordinator to join!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {parentChildrenMemberships.map((m) => {
                const club = clubs.find((c) => c.id === m.club_id);
                return (
                  <div
                    key={m.id}
                    className="bg-card border rounded-lg p-3 text-xs space-y-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <span className="font-bold text-foreground block text-sm">
                          {m.student_name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {m.class_name} ({m.student_code})
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-primary/10 text-primary border-primary/30"
                      >
                        {m.role_in_club}
                      </Badge>
                    </div>

                    {club && (
                      <div className="space-y-1 pt-1 border-t text-[11px] text-muted-foreground">
                        <div className="font-medium text-foreground flex items-center gap-1.5">
                          <Trophy className="size-3.5 text-amber-500" />
                          <span>{club.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3 text-muted-foreground" />
                          <span>{club.schedule}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3 text-muted-foreground" />
                          <span>{club.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-foreground/80">
                          <UserCheck className="size-3 text-emerald-600" />
                          <span>
                            Coach: {club.coach_name} {club.coach_phone && `(${club.coach_phone})`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clubs & Teams"
          value={clubs.length}
          subtitle="Extracurricular offerings"
          icon={Trophy}
          iconColor="text-primary"
        />
        <StatCard
          title="Total Student Enrollments"
          value={memberships.length}
          subtitle="Across all activities"
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Athletic Sports Teams"
          value={clubs.filter((c) => c.category === "Sports").length}
          subtitle="Football, Volleyball, Athletics"
          icon={Dumbbell}
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Academic & Arts Clubs"
          value={clubs.filter((c) => c.category !== "Sports").length}
          subtitle="STEM, Drama, Chess, Music"
          icon={Sparkles}
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Teacher Leadership Banner & View Scope Switcher */}
      {isTeacher && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Crown className="size-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Teacher Extracurricular Dashboard</span>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-primary/10 text-primary border-primary/25 font-semibold"
                >
                  {teacherLedClubs.length} Led by You
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                You can register and assign student members or readers to clubs you lead. Admins &
                secretaries manage all clubs school-wide.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-card p-1 rounded-lg border shadow-2xs self-stretch sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setTeacherViewScope("my_clubs")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                teacherViewScope === "my_clubs"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Crown className="size-3 text-amber-300" />
              <span>My Led Clubs ({teacherLedClubs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTeacherViewScope("all")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                teacherViewScope === "all"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>All School Clubs ({clubs.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters and View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              "all",
              "Sports",
              "Academic & STEM",
              "Arts & Culture",
              "Music & Performing",
              "Leadership & Clubs",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border",
                )}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Search box */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search club, coach, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                viewMode === "cards"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Clubs
            </button>
            <button
              type="button"
              onClick={() => setViewMode("roster")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1",
                viewMode === "roster"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Master Roster</span>
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-3.5">
                {memberships.length}
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Club Cards vs Master Roster Table */}
      {viewMode === "cards" ? (
        <div>
          {filteredClubs.length === 0 ? (
            <div className="py-16 text-center space-y-2 border rounded-xl bg-card">
              <Trophy className="size-10 text-muted-foreground/50 mx-auto" />
              <div className="font-semibold text-sm">
                {isTeacher && teacherViewScope === "my_clubs"
                  ? "No Clubs Led By You"
                  : "No Clubs or Activities Found"}
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {isTeacher && teacherViewScope === "my_clubs"
                  ? "You are not designated as the coach or supervisor for any clubs currently. Switch to 'All School Clubs' to explore or request club leadership from an administrator."
                  : "No extracurricular activities match your current category or search filters."}
              </p>
              {isTeacher && teacherViewScope === "my_clubs" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTeacherViewScope("all")}
                  className="text-xs mt-2"
                >
                  View All School Clubs
                </Button>
              )}
              {isAdminOrSec && (
                <Button size="sm" onClick={handleOpenAddClub} className="gap-1.5 text-xs mt-2">
                  <Plus className="size-3.5" /> Create First Club
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClubs.map((club) => {
                const enrolledCount = clubMemberCounts[club.id] || 0;
                const capacity = club.capacity || 25;
                const pct = Math.min(100, Math.round((enrolledCount / capacity) * 100));
                const categoryConfig = CATEGORY_COLORS[club.category] || CATEGORY_COLORS.Sports;
                const CategoryIcon = categoryConfig.icon;
                const isMyLedClub = isClubLead(club);

                // Check if parent's child is in this club
                const parentChildrenInClub = isParent
                  ? parentChildrenMemberships.filter((m) => m.club_id === club.id)
                  : [];

                return (
                  <Card
                    key={club.id}
                    className={cn(
                      "relative flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-sm transition-all border-border/80",
                      isMyLedClub && "ring-1 ring-amber-500/30 border-amber-500/30",
                    )}
                  >
                    <CardHeader className="p-4 pb-2 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold flex items-center gap-1",
                              categoryConfig.badge,
                            )}
                          >
                            <CategoryIcon className="size-3" />
                            <span>{club.category}</span>
                          </Badge>

                          {/* Teacher Lead Badge */}
                          {isMyLedClub && (
                            <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
                              <Crown className="size-3 text-amber-600 dark:text-amber-400" />
                              <span>You Lead</span>
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {club.fee || "Free"}
                          </span>

                          {/* Admin & Secretary Edit/Delete Controls */}
                          {isAdminOrSec && (
                            <div className="flex items-center ml-1 border-l pl-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={() => handleOpenEditClub(club)}
                                title="Edit club settings"
                              >
                                <Edit2 className="size-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 text-muted-foreground hover:text-destructive cursor-pointer"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Are you sure you want to remove "${club.name}" and its student enrollments?`,
                                    )
                                  ) {
                                    deleteClubMutation.mutate(club.id);
                                  }
                                }}
                                title="Delete club"
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <CardTitle className="text-base font-bold text-foreground">
                          {club.name}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2 mt-1 leading-relaxed">
                          {club.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-3">
                      {/* Parent Child Badge if enrolled */}
                      {parentChildrenInClub.length > 0 && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-2 text-xs flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-medium">
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>
                            Enrolled:{" "}
                            <strong>
                              {parentChildrenInClub
                                .map((m) => `${m.student_name} (${m.role_in_club})`)
                                .join(", ")}
                            </strong>
                          </span>
                        </div>
                      )}

                      {/* Details Box */}
                      <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          <span>{club.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                          <span>{club.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="size-3.5 text-emerald-600 shrink-0" />
                          <span>
                            Coach: <strong className="text-foreground">{club.coach_name}</strong>
                          </span>
                          {club.coach_phone && (
                            <span className="text-[11px] text-muted-foreground">
                              ({club.coach_phone})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enrollment Capacity Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Roster Enrollment</span>
                          <span className="font-semibold text-foreground">
                            {enrolledCount} / {capacity} Students ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-primary",
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold gap-1.5 flex-1"
                          onClick={() => {
                            setSelectedClubForRoster(club);
                          }}
                        >
                          <Users className="size-3.5" /> View Members ({enrolledCount})
                        </Button>

                        {/* Assign student: Direct for Admin/Secretary, or restricted to Led Clubs for Teachers */}
                        {isAdminOrSec ? (
                          <Button
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleOpenAssign(club.id)}
                            title="Direct insert student to this club"
                          >
                            <UserPlus className="size-3.5" /> Assign
                          </Button>
                        ) : isTeacher && isMyLedClub ? (
                          <Button
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleOpenAssign(club.id)}
                            title="Enroll student or reader into your club"
                          >
                            <UserPlus className="size-3.5" /> Assign
                          </Button>
                        ) : isTeacher ? (
                          <span className="text-[11px] text-muted-foreground italic px-1">
                            Led by {club.coach_name}
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Master Roster Table View with Mobile Scrollability */
        <Card className="shadow-xs overflow-hidden">
          <CardHeader className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span>Master Club Membership Roster</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {isTeacher
                  ? "Students registered in your led clubs and activities across the school."
                  : "Active students assigned to school sports teams and extracurricular clubs."}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {/* Teacher Roster Scope Switcher */}
              {isTeacher && (
                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border text-xs">
                  <button
                    type="button"
                    onClick={() => setRosterScope("my_members")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium",
                      rosterScope === "my_members"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    My Club Members
                  </button>
                  <button
                    type="button"
                    onClick={() => setRosterScope("all")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium",
                      rosterScope === "all"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    All School ({memberships.length})
                  </button>
                </div>
              )}

              {canAssignStudent && (
                <Button
                  size="sm"
                  onClick={() => handleOpenAssign()}
                  className="gap-1.5 text-xs h-8 font-semibold shadow-xs"
                >
                  <UserPlus className="size-3.5" /> Assign Student
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Mobile Swipe Notice */}
            <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-primary/10 border-b border-primary/20 text-xs text-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="size-3.5 text-primary shrink-0" />
                <span>Swipe table horizontally to view full club membership records</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold shrink-0">
                Scroll →
              </span>
            </div>

            {filteredRoster.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Users className="size-9 text-muted-foreground/50 mx-auto" />
                <div className="font-semibold text-sm">No Student Enrollments Found</div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No students match your current category or search criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto touch-pan-x scrollbar-thin">
                <Table className="w-full min-w-[950px]">
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="w-[180px]">Student</TableHead>
                      <TableHead className="w-[100px]">Class</TableHead>
                      <TableHead className="w-[180px]">Club / Activity</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="w-[130px]">Role / Position</TableHead>
                      <TableHead className="w-[120px]">Enrolled Date</TableHead>
                      <TableHead className="w-[130px]">Enrolled By</TableHead>
                      {canAssignStudent && (
                        <TableHead className="text-right w-[80px]">Action</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoster.map((m) => {
                      const club = clubs.find((c) => c.id === m.club_id);
                      const isMyChild = isParent && parentChildIds.has(m.student_id);

                      return (
                        <TableRow
                          key={m.id}
                          className={cn(
                            "text-xs hover:bg-muted/30",
                            isMyChild ? "bg-primary/5 font-medium" : "",
                          )}
                        >
                          <TableCell className="whitespace-nowrap">
                            <div className="font-semibold text-foreground">{m.student_name}</div>
                            <div className="font-mono text-[10px] text-primary">
                              {m.student_code}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-normal">
                              {m.class_name || "Unassigned"}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="font-medium text-foreground">{club?.name || "—"}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {club?.venue || "—"}
                            </div>
                          </TableCell>

                          <TableCell>
                            {club?.category ? (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  CATEGORY_COLORS[club.category]?.badge || "",
                                )}
                              >
                                {club.category}
                              </Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                              {m.role_in_club}
                            </span>
                            {m.notes && (
                              <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]">
                                {m.notes}
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {fmtDate(m.enrolled_at)}
                          </TableCell>

                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            <div>{m.enrolled_by_name}</div>
                            <div className="text-[10px] capitalize">{m.enrolled_by_role}</div>
                          </TableCell>

                          {/* Staff: Remove Student from Club (Admin/Sec or Lead Teacher) */}
                          {canAssignStudent && (
                            <TableCell className="text-right whitespace-nowrap">
                              {isAdminOrSec || teacherLedClubIds.has(m.club_id) ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Remove ${m.student_name} from ${club?.name || "this club"}?`,
                                      )
                                    ) {
                                      removeMembershipMutation.mutate(m.id);
                                    }
                                  }}
                                  title="Remove from club"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic px-1">
                                  Read-only
                                </span>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog 1: Add or Edit Club (Admin / Secretary) */}
      <Dialog open={showClubDialog} onOpenChange={setShowClubDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="size-4 text-primary" />
              {editingClub ? "Edit Club / Activity Details" : "Add New Club or Activity"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure activity name, coaching staff, venue, meeting schedule, and capacity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="club-name" className="text-xs font-semibold">
                Club / Activity Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="club-name"
                placeholder="e.g. Football Team, Volleyball Club, Robotics & STEM..."
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="club-category" className="text-xs font-semibold">
                  Category
                </Label>
                <Select value={clubCategory} onValueChange={(val: any) => setClubCategory(val)}>
                  <SelectTrigger id="club-category" className="text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sports">Sports & Athletics</SelectItem>
                    <SelectItem value="Academic & STEM">Academic & STEM</SelectItem>
                    <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                    <SelectItem value="Music & Performing">Music & Performing</SelectItem>
                    <SelectItem value="Leadership & Clubs">Leadership & Clubs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="club-capacity" className="text-xs font-semibold">
                  Capacity (Max Students)
                </Label>
                <Input
                  id="club-capacity"
                  type="number"
                  placeholder="25"
                  value={clubCapacity}
                  onChange={(e) => setClubCapacity(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="club-schedule" className="text-xs font-semibold">
                  Weekly Schedule <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="club-schedule"
                  placeholder="e.g. Tuesdays & Thursdays, 3:45 PM - 5:15 PM"
                  value={clubSchedule}
                  onChange={(e) => setClubSchedule(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="club-venue" className="text-xs font-semibold">
                  Venue / Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="club-venue"
                  placeholder="e.g. Main Sports Pitch, Sports Hall, Lab 2"
                  value={clubVenue}
                  onChange={(e) => setClubVenue(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Teacher / Coach Selection (Admin / Secretary can pick registered teachers) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="club-lead-select"
                className="text-xs font-semibold flex items-center justify-between"
              >
                <span>Assign Lead Teacher (Club Supervisor)</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Grants teacher management privileges
                </span>
              </Label>
              <Select
                value={clubCoachId || "custom"}
                onValueChange={(val) => {
                  if (val === "custom") {
                    setClubCoachId("");
                    setClubCoachEmail("");
                  } else {
                    const t = teachers.find((tch) => tch.id === val);
                    if (t) {
                      setClubCoachId(t.id);
                      setClubCoach(t.full_name);
                      setClubCoachEmail(t.email);
                      if (t.phone) setClubCoachPhone(t.phone);
                    }
                  }
                }}
              >
                <SelectTrigger id="club-lead-select" className="text-xs">
                  <SelectValue placeholder="Select a registered teacher or custom coach..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="custom">External Coach / Custom Coach Name</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name} ({t.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="club-coach" className="text-xs font-semibold">
                  Coach / Supervisor Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="club-coach"
                  placeholder="e.g. Coach David Kamanzi"
                  value={clubCoach}
                  onChange={(e) => setClubCoach(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="club-phone" className="text-xs font-semibold">
                  Coach Contact Phone
                </Label>
                <Input
                  id="club-phone"
                  placeholder="e.g. +250 788 123 456"
                  value={clubCoachPhone}
                  onChange={(e) => setClubCoachPhone(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="club-fee" className="text-xs font-semibold">
                Fee Structure
              </Label>
              <Input
                id="club-fee"
                placeholder="e.g. Free, Included in Tuition, or KSh 1,000 / Term"
                value={clubFee}
                onChange={(e) => setClubFee(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="club-desc" className="text-xs font-semibold">
                Description & Objectives
              </Label>
              <Textarea
                id="club-desc"
                rows={3}
                placeholder="Overview of training drills, tournaments, and objectives..."
                value={clubDesc}
                onChange={(e) => setClubDesc(e.target.value)}
                className="text-xs leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowClubDialog(false);
                setEditingClub(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveClubMutation.mutate()}
              disabled={saveClubMutation.isPending}
              size="sm"
              className="gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Check className="size-4" />
              {saveClubMutation.isPending
                ? "Saving Club..."
                : editingClub
                  ? "Update Club"
                  : "Create Club"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Assign Student to Club (Admin, Secretary, Teacher) */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <UserPlus className="size-4 text-primary" />
              Assign Student to Club or Activity
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isAdminOrSec
                ? "Direct Access: Administrators and secretaries can enroll students into any club directly."
                : "Teacher Access: You can register and assign students into the clubs you lead."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Access Role Indicator */}
            {isAdminOrSec ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-2.5 text-xs flex items-center gap-2 text-foreground font-medium">
                <Shield className="size-4 text-primary shrink-0" />
                <span>
                  <strong>Direct Access:</strong> You can insert any student into any school club or
                  athletic team directly.
                </span>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg p-2.5 text-xs flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                <Crown className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>Teacher Leadership:</strong> You are registering students into clubs you
                  lead ({assignableClubs.length} available).
                </span>
              </div>
            )}

            {/* If Teacher has 0 led clubs */}
            {isTeacher && assignableClubs.length === 0 && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-lg p-3 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="size-4 text-rose-600 dark:text-rose-400" />
                  <span>No Led Clubs Assigned to You</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  You are not currently designated as the supervisor or coach of any active
                  extracurricular club. Please contact your school administrator or secretary to be
                  designated as a club lead.
                </p>
              </div>
            )}

            {/* Student Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="assign-student" className="text-xs font-semibold">
                Select Student <span className="text-destructive">*</span>
              </Label>
              <Select value={assignStudentId} onValueChange={setAssignStudentId}>
                <SelectTrigger id="assign-student" className="text-xs">
                  <SelectValue placeholder="Choose student..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name} — {s.classes?.name || "Unassigned"} ({s.student_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Club Selector: Only clubs teacher leads (for teachers), or all clubs (for admin & sec) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="assign-club"
                className="text-xs font-semibold flex items-center justify-between"
              >
                <span>
                  Select Club or Team <span className="text-destructive">*</span>
                </span>
                {isTeacher && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-normal">
                    Showing your led clubs
                  </span>
                )}
              </Label>
              <Select
                value={assignClubId}
                onValueChange={setAssignClubId}
                disabled={assignableClubs.length === 0}
              >
                <SelectTrigger id="assign-club" className="text-xs">
                  <SelectValue
                    placeholder={
                      assignableClubs.length === 0
                        ? "No led clubs available"
                        : "Choose club or team..."
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {assignableClubs.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.category}) — Coach: {c.coach_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Live Selected Club Preview Card */}
            {(() => {
              const selectedClub = clubs.find((c) => c.id === assignClubId);
              if (!selectedClub) return null;
              const currentCount = clubMemberCounts[selectedClub.id] || 0;
              const cap = selectedClub.capacity || 25;
              const isFull = currentCount >= cap;
              const categoryConfig =
                CATEGORY_COLORS[selectedClub.category] || CATEGORY_COLORS.Sports;
              const CategoryIcon = categoryConfig.icon;

              return (
                <div className="p-2.5 rounded-lg border bg-muted/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Trophy className="size-3.5 text-primary" /> {selectedClub.name}
                    </span>
                    <Badge variant="outline" className={cn("text-[10px]", categoryConfig.badge)}>
                      <CategoryIcon className="size-2.5 mr-1" />
                      {selectedClub.category}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground grid grid-cols-2 gap-1">
                    <div>
                      Coach: <strong className="text-foreground">{selectedClub.coach_name}</strong>
                    </div>
                    <div>
                      Venue: <span className="text-foreground">{selectedClub.venue}</span>
                    </div>
                    <div className="col-span-2">
                      Schedule: <span className="text-foreground">{selectedClub.schedule}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t">
                    <span className="text-muted-foreground">
                      Enrollment: {currentCount} / {cap} students (
                      {Math.round((currentCount / cap) * 100)}%)
                    </span>
                    {isFull ? (
                      <Badge variant="destructive" className="text-[10px]">
                        Club at Capacity
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Available Spots
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Role in Club (includes Club Reader / Speaker) */}
            <div className="space-y-1.5">
              <Label htmlFor="assign-role" className="text-xs font-semibold">
                Role / Position in Club <span className="text-destructive">*</span>
              </Label>
              <Select value={assignRole} onValueChange={setAssignRole}>
                <SelectTrigger id="assign-role" className="text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Regular Member / Player</SelectItem>
                  <SelectItem value="Club Reader / Speaker">Club Reader / Speaker</SelectItem>
                  <SelectItem value="Club Leader / President">Club Leader / President</SelectItem>
                  <SelectItem value="Team Captain">Team Captain</SelectItem>
                  <SelectItem value="Vice Captain">Vice Captain</SelectItem>
                  <SelectItem value="Club Secretary">Club Student Secretary</SelectItem>
                  <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                  <SelectItem value="Setter">Setter</SelectItem>
                  <SelectItem value="Striker">Striker</SelectItem>
                  <SelectItem value="Lead Builder">Lead Builder / Coder</SelectItem>
                  <SelectItem value="First Violin">Lead Musician / Vocalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes / Jersey Number */}
            <div className="space-y-1.5">
              <Label htmlFor="assign-notes" className="text-xs font-semibold">
                Notes / Jersey Number / Reader Topic (Optional)
              </Label>
              <Input
                id="assign-notes"
                placeholder="e.g. Reader Book: Macbeth, Jersey #10, Starting XI..."
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => assignStudentMutation.mutate()}
              disabled={
                assignStudentMutation.isPending ||
                !assignStudentId ||
                !assignClubId ||
                assignableClubs.length === 0
              }
              size="sm"
              className="gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Check className="size-4" />
              {assignStudentMutation.isPending ? "Enrolling..." : "Enroll Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog 3: View Club Roster Modal (Available to All, Read-only for parents) */}
      <Dialog
        open={Boolean(selectedClubForRoster)}
        onOpenChange={(open) => {
          if (!open) setSelectedClubForRoster(null);
        }}
      >
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedClubForRoster && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-2 pr-4">
                  <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                    <Trophy className="size-4 text-primary" />
                    {selectedClubForRoster.name} — Member Roster
                  </DialogTitle>
                  <Badge variant="outline" className="text-xs">
                    {selectedClubForRoster.category}
                  </Badge>
                </div>
                <DialogDescription className="text-xs">
                  Coach: {selectedClubForRoster.coach_name} · Schedule:{" "}
                  {selectedClubForRoster.schedule} · Venue: {selectedClubForRoster.venue}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                {(() => {
                  const clubMembers = memberships.filter(
                    (m) => m.club_id === selectedClubForRoster.id,
                  );

                  if (clubMembers.length === 0) {
                    return (
                      <div className="py-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
                        No students currently enrolled in this club.
                      </div>
                    );
                  }

                  const canManageThisClub = isAdminOrSec || isClubLead(selectedClubForRoster);

                  return (
                    <div className="border rounded-lg overflow-hidden">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow className="text-xs bg-muted/40">
                            <TableHead>Student</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Role / Position</TableHead>
                            <TableHead>Enrolled Date</TableHead>
                            {canManageThisClub && (
                              <TableHead className="text-right">Action</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clubMembers.map((m) => (
                            <TableRow key={m.id} className="text-xs hover:bg-muted/30">
                              <TableCell className="font-semibold text-foreground">
                                <div>{m.student_name}</div>
                                <div className="text-[10px] font-mono text-primary font-normal">
                                  {m.student_code}
                                </div>
                              </TableCell>
                              <TableCell>{m.class_name}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-[10px]">
                                  {m.role_in_club}
                                </Badge>
                                {m.notes && (
                                  <div className="text-[10px] text-muted-foreground mt-0.5">
                                    {m.notes}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {fmtDate(m.enrolled_at)}
                              </TableCell>
                              {canManageThisClub && (
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 text-muted-foreground hover:text-destructive cursor-pointer"
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Remove ${m.student_name} from ${selectedClubForRoster.name}?`,
                                        )
                                      ) {
                                        removeMembershipMutation.mutate(m.id);
                                      }
                                    }}
                                    title="Remove student"
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })()}
              </div>

              <DialogFooter className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">
                  {memberships.filter((m) => m.club_id === selectedClubForRoster.id).length} /{" "}
                  {selectedClubForRoster.capacity} Students enrolled
                </div>
                <div className="flex items-center gap-2">
                  {(isAdminOrSec || isClubLead(selectedClubForRoster)) && (
                    <Button
                      size="sm"
                      className="gap-1 text-xs font-semibold cursor-pointer"
                      onClick={() => {
                        const cid = selectedClubForRoster.id;
                        setSelectedClubForRoster(null);
                        handleOpenAssign(cid);
                      }}
                    >
                      <UserPlus className="size-3.5" /> + Assign Student
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClubForRoster(null)}
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
