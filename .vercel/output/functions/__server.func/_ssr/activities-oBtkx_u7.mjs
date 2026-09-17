import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useAuth } from "./auth-hSns5Wa1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { c as fmtDate, r as StatCard, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { F as Palette, I as Music, P as Pen, Tt as BookOpen, b as Search, et as FileSpreadsheet, f as Trash2, ft as Clock, h as Shield, ht as CircleAlert, it as Eye, k as Plus, l as Trophy, lt as Crown, m as Sparkles, mt as CircleCheck, o as UserPlus, ot as Dumbbell, r as Users, s as UserCheck, st as Download, vt as Check, z as MapPin } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as exportPdf, t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities-oBtkx_u7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_COLORS = {
	Sports: {
		badge: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
		icon: Dumbbell
	},
	"Arts & Culture": {
		badge: "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
		icon: Palette
	},
	"Academic & STEM": {
		badge: "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
		icon: BookOpen
	},
	"Music & Performing": {
		badge: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
		icon: Music
	},
	"Leadership & Clubs": {
		badge: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
		icon: Crown
	}
};
var DEFAULT_CLUBS = [
	{
		id: "club-football",
		name: "Football Team (School Eagles)",
		category: "Sports",
		description: "Official school football squad. Training focuses on footwork, tactical set-pieces, match fitness, and inter-school championships.",
		schedule: "Tuesdays & Thursdays, 3:45 PM - 5:15 PM",
		venue: "Main Sports Pitch",
		coach_id: null,
		coach_email: "sports@school.com",
		coach_name: "Coach David Kamanzi",
		coach_phone: "+250 788 123 456",
		capacity: 26,
		fee: "Included in Tuition",
		status: "active"
	},
	{
		id: "club-volleyball",
		name: "Volleyball Club",
		category: "Sports",
		description: "Competitive and recreational volleyball for all grades. Training covers serving, setting, spiking, and friendly tournaments.",
		schedule: "Wednesdays & Fridays, 3:30 PM - 4:45 PM",
		venue: "Outdoor Sports Court",
		coach_id: "user-teacher",
		coach_email: "teacher@school.com",
		coach_name: "Jane Smith",
		coach_phone: "+250 788 234 567",
		capacity: 20,
		fee: "Free",
		status: "active"
	},
	{
		id: "club-robotics",
		name: "Robotics & STEM Club",
		category: "Academic & STEM",
		description: "Hands-on robotics kits, visual block programming, electronics sensors, and competition builds for regional science fairs.",
		schedule: "Mondays, 3:30 PM - 5:00 PM",
		venue: "Science & Innovation Lab",
		coach_id: "user-teacher",
		coach_email: "teacher@school.com",
		coach_name: "Jane Smith",
		coach_phone: "+250 788 345 678",
		capacity: 18,
		fee: "KSh 1,000 / Term",
		status: "active"
	},
	{
		id: "club-drama",
		name: "Drama & Theater Society",
		category: "Arts & Culture",
		description: "Stage acting, voice projection, creative improvisation, costume design, and annual school musical drama production.",
		schedule: "Tuesdays & Fridays, 3:30 PM - 5:00 PM",
		venue: "School Auditorium",
		coach_id: null,
		coach_email: "drama@school.com",
		coach_name: "Mrs. Grace Mukamana",
		coach_phone: "+250 788 456 789",
		capacity: 25,
		fee: "Free",
		status: "active"
	},
	{
		id: "club-chess",
		name: "Chess & Strategy Club",
		category: "Academic & STEM",
		description: "Critical thinking, opening theory, tactical puzzles, tournament etiquette, and blitz championship games.",
		schedule: "Wednesdays, 3:30 PM - 4:45 PM",
		venue: "Library Resource Room",
		coach_id: null,
		coach_email: "chess@school.com",
		coach_name: "Mr. John Bizimana",
		coach_phone: "+250 788 567 890",
		capacity: 24,
		fee: "Free",
		status: "active"
	},
	{
		id: "club-music",
		name: "Music Band & Choir",
		category: "Music & Performing",
		description: "Ensemble vocals, acoustic guitar, brass instruments, and choral performances at national celebrations and school assemblies.",
		schedule: "Thursdays, 3:30 PM - 5:00 PM",
		venue: "Music Studio",
		coach_id: null,
		coach_email: "music@school.com",
		coach_name: "Ms. Aline Ingabire",
		coach_phone: "+250 788 678 901",
		capacity: 30,
		fee: "Free",
		status: "active"
	}
];
function ActivitiesPage() {
	const qc = useQueryClient();
	const { user, profile } = useAuth();
	const role = profile?.role;
	const isAdminOrSec = role === "admin" || role === "secretary" || role === "owner";
	const isTeacher = role === "teacher";
	const isParent = role === "parent";
	const canAssignStudent = isAdminOrSec || isTeacher;
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("cards");
	const [selectedClubForRoster, setSelectedClubForRoster] = (0, import_react.useState)(null);
	const [teacherViewScope, setTeacherViewScope] = (0, import_react.useState)("my_clubs");
	const [rosterScope, setRosterScope] = (0, import_react.useState)("my_members");
	const [showClubDialog, setShowClubDialog] = (0, import_react.useState)(false);
	const [editingClub, setEditingClub] = (0, import_react.useState)(null);
	const [showAssignDialog, setShowAssignDialog] = (0, import_react.useState)(false);
	const [clubName, setClubName] = (0, import_react.useState)("");
	const [clubCategory, setClubCategory] = (0, import_react.useState)("Sports");
	const [clubDesc, setClubDesc] = (0, import_react.useState)("");
	const [clubSchedule, setClubSchedule] = (0, import_react.useState)("");
	const [clubVenue, setClubVenue] = (0, import_react.useState)("");
	const [clubCoachId, setClubCoachId] = (0, import_react.useState)("");
	const [clubCoachEmail, setClubCoachEmail] = (0, import_react.useState)("");
	const [clubCoach, setClubCoach] = (0, import_react.useState)("");
	const [clubCoachPhone, setClubCoachPhone] = (0, import_react.useState)("");
	const [clubCapacity, setClubCapacity] = (0, import_react.useState)("25");
	const [clubFee, setClubFee] = (0, import_react.useState)("Free");
	const [assignStudentId, setAssignStudentId] = (0, import_react.useState)("");
	const [assignClubId, setAssignClubId] = (0, import_react.useState)("");
	const [assignRole, setAssignRole] = (0, import_react.useState)("Member");
	const [assignNotes, setAssignNotes] = (0, import_react.useState)("");
	const { data: clubs = DEFAULT_CLUBS, isLoading: clubsLoading } = useQuery({
		queryKey: ["clubs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("clubs").select("*").order("name");
			if (error || !data || data.length === 0) return DEFAULT_CLUBS;
			return data;
		}
	});
	const { data: memberships = [], isLoading: membersLoading } = useQuery({
		queryKey: ["club_memberships"],
		queryFn: async () => {
			const { data, error } = await supabase.from("club_memberships").select("*").order("enrolled_at", { ascending: false });
			if (error || !data) return [];
			return data;
		}
	});
	const { data: students = [] } = useQuery({
		queryKey: ["students_for_clubs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("*, classes(name)").order("full_name");
			if (error || !data) return [];
			return data;
		}
	});
	const { data: teachers = [] } = useQuery({
		queryKey: ["teachers_for_club_assignment"],
		queryFn: async () => {
			const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
			const ids = (roles ?? []).map((r) => r.user_id);
			if (!ids.length) return [{
				id: "user-teacher",
				full_name: "Jane Smith",
				email: "teacher@school.com",
				phone: "+250 788 234 567"
			}];
			const { data } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", ids).order("full_name");
			if (!data || data.length === 0) return [{
				id: "user-teacher",
				full_name: "Jane Smith",
				email: "teacher@school.com",
				phone: "+250 788 234 567"
			}];
			return data;
		}
	});
	const isClubLead = (0, import_react.useCallback)((c) => {
		if (!c || !user) return false;
		return c.coach_id && c.coach_id === user.id || c.coach_email && user.email && c.coach_email.toLowerCase() === user.email.toLowerCase() || c.coach_name && profile?.full_name && c.coach_name.toLowerCase().trim() === profile.full_name.toLowerCase().trim();
	}, [user, profile]);
	const teacherLedClubs = (0, import_react.useMemo)(() => {
		if (!isTeacher) return [];
		return clubs.filter(isClubLead);
	}, [
		isTeacher,
		clubs,
		isClubLead
	]);
	const assignableClubs = (0, import_react.useMemo)(() => {
		if (isAdminOrSec) return clubs;
		if (isTeacher) return teacherLedClubs;
		return [];
	}, [
		isAdminOrSec,
		isTeacher,
		clubs,
		teacherLedClubs
	]);
	const teacherLedClubIds = (0, import_react.useMemo)(() => {
		return new Set(teacherLedClubs.map((c) => c.id));
	}, [teacherLedClubs]);
	const parentChildren = (0, import_react.useMemo)(() => {
		if (!isParent || !user) return [];
		return students.filter((s) => s.parent_id === user.id || s.parent_email === user.email);
	}, [
		isParent,
		user,
		students
	]);
	const parentChildIds = (0, import_react.useMemo)(() => {
		return new Set(parentChildren.map((c) => c.id));
	}, [parentChildren]);
	const parentChildrenMemberships = (0, import_react.useMemo)(() => {
		if (!isParent) return [];
		return memberships.filter((m) => parentChildIds.has(m.student_id) || m.parent_id && m.parent_id === user?.id);
	}, [
		isParent,
		memberships,
		parentChildIds,
		user
	]);
	const clubMemberCounts = (0, import_react.useMemo)(() => {
		const counts = {};
		for (const m of memberships) counts[m.club_id] = (counts[m.club_id] || 0) + 1;
		return counts;
	}, [memberships]);
	const filteredClubs = (0, import_react.useMemo)(() => {
		return clubs.filter((c) => {
			if (isTeacher && teacherViewScope === "my_clubs") {
				if (!isClubLead(c)) return false;
			}
			const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.coach_name.toLowerCase().includes(q) || c.venue.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		});
	}, [
		clubs,
		isTeacher,
		teacherViewScope,
		selectedCategory,
		searchQuery,
		isClubLead
	]);
	const filteredRoster = (0, import_react.useMemo)(() => {
		return memberships.filter((m) => {
			if (isTeacher && rosterScope === "my_members") {
				if (!teacherLedClubIds.has(m.club_id)) return false;
			}
			const club = clubs.find((c) => c.id === m.club_id);
			const matchesCategory = selectedCategory === "all" || club && club.category === selectedCategory;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch = !q || m.student_name.toLowerCase().includes(q) || m.student_code.toLowerCase().includes(q) || m.class_name.toLowerCase().includes(q) || club && club.name.toLowerCase().includes(q) || m.role_in_club.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		});
	}, [
		memberships,
		clubs,
		isTeacher,
		rosterScope,
		teacherLedClubIds,
		selectedCategory,
		searchQuery
	]);
	const saveClubMutation = useMutation({
		mutationFn: async () => {
			if (!isAdminOrSec) throw new Error("Permission Denied: Only Administrators and Secretaries can create or edit clubs.");
			if (!clubName.trim()) throw new Error("Club name is required.");
			if (!clubSchedule.trim()) throw new Error("Weekly schedule is required.");
			if (!clubVenue.trim()) throw new Error("Venue is required.");
			if (!clubCoach.trim()) throw new Error("Coach / Supervisor name is required.");
			const clubData = {
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
				status: "active"
			};
			if (editingClub) {
				const { error } = await supabase.from("clubs").update(clubData).eq("id", editingClub.id);
				if (error) throw error;
				await logAudit("clubs.updated", "clubs", {
					id: editingClub.id,
					name: clubData.name
				});
			} else {
				const newId = `club-${Date.now()}`;
				const { error } = await supabase.from("clubs").insert({
					id: newId,
					...clubData,
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (error) throw error;
				await logAudit("clubs.created", "clubs", {
					id: newId,
					name: clubData.name
				});
			}
		},
		onSuccess: () => {
			toast.success(editingClub ? "Club details updated." : "New Club created successfully!");
			setShowClubDialog(false);
			setEditingClub(null);
			qc.invalidateQueries({ queryKey: ["clubs"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to save club.");
		}
	});
	const deleteClubMutation = useMutation({
		mutationFn: async (clubId) => {
			if (!isAdminOrSec) throw new Error("Permission Denied: Only Administrators and Secretaries can delete clubs.");
			const { error } = await supabase.from("clubs").delete().eq("id", clubId);
			if (error) throw error;
			await supabase.from("club_memberships").delete().eq("club_id", clubId);
			await logAudit("clubs.deleted", "clubs", { id: clubId });
		},
		onSuccess: () => {
			toast.success("Club removed.");
			qc.invalidateQueries({ queryKey: ["clubs"] });
			qc.invalidateQueries({ queryKey: ["club_memberships"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to delete club.");
		}
	});
	const assignStudentMutation = useMutation({
		mutationFn: async () => {
			if (!assignStudentId) throw new Error("Please select a student.");
			if (!assignClubId) throw new Error("Please select a club or activity.");
			const selectedStudent = students.find((s) => s.id === assignStudentId);
			if (!selectedStudent) throw new Error("Student not found.");
			const selectedClub = clubs.find((c) => c.id === assignClubId);
			if (!selectedClub) throw new Error("Club not found.");
			if (isTeacher && !isClubLead(selectedClub)) throw new Error("Permission Denied: Teachers can only enroll members or readers into clubs they lead.");
			if (memberships.find((m) => m.club_id === assignClubId && m.student_id === assignStudentId)) throw new Error(`${selectedStudent.full_name} is already enrolled in ${selectedClub.name}.`);
			const membershipId = `mem-${Date.now()}`;
			const newMembership = {
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
				enrolled_at: (/* @__PURE__ */ new Date()).toISOString(),
				enrolled_by_name: profile?.full_name || "Staff",
				enrolled_by_role: role || "staff"
			};
			const { error } = await supabase.from("club_memberships").insert(newMembership);
			if (error) throw error;
			await logAudit("clubs.student_assigned", "club_memberships", {
				membership_id: membershipId,
				club_id: assignClubId,
				student_id: selectedStudent.id,
				role: assignRole
			});
		},
		onSuccess: () => {
			toast.success("Student successfully enrolled into club!");
			setShowAssignDialog(false);
			setAssignStudentId("");
			setAssignClubId("");
			setAssignRole("Member");
			setAssignNotes("");
			qc.invalidateQueries({ queryKey: ["club_memberships"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to assign student.");
		}
	});
	const removeMembershipMutation = useMutation({
		mutationFn: async (membershipId) => {
			const membership = memberships.find((m) => m.id === membershipId);
			if (isTeacher && membership) {
				const club = clubs.find((c) => c.id === membership.club_id);
				if (club && !isClubLead(club)) throw new Error("Permission Denied: Teachers can only remove members from clubs they lead.");
			}
			const { error } = await supabase.from("club_memberships").delete().eq("id", membershipId);
			if (error) throw error;
			await logAudit("clubs.student_removed", "club_memberships", { id: membershipId });
		},
		onSuccess: () => {
			toast.success("Student removed from club.");
			qc.invalidateQueries({ queryKey: ["club_memberships"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to remove student from club.");
		}
	});
	const handleExportPdf = () => {
		exportPdf("Extracurricular Activities & Club Rosters", [
			"Student Name",
			"Code",
			"Class",
			"Club / Activity",
			"Category",
			"Role / Position",
			"Enrolled Date",
			"Staff"
		], filteredRoster.map((m) => {
			const club = clubs.find((c) => c.id === m.club_id);
			return [
				m.student_name,
				m.student_code,
				m.class_name,
				club?.name || "—",
				club?.category || "—",
				m.role_in_club,
				fmtDate(m.enrolled_at),
				m.enrolled_by_name
			];
		}), `activities_roster_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`);
	};
	const handleExportExcel = () => {
		exportExcel(filteredRoster.map((m) => {
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
				Notes: m.notes || ""
			};
		}), `activities_roster_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
	};
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
	const handleOpenEditClub = (club) => {
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
	const handleOpenAssign = (specificClubId) => {
		let targetClubId = "";
		if (specificClubId) {
			const targetClub = clubs.find((c) => c.id === specificClubId);
			if (targetClub) if (isAdminOrSec || isClubLead(targetClub)) targetClubId = specificClubId;
			else {
				toast.error("You can only enroll students into clubs and activities that you lead.");
				return;
			}
		}
		if (!targetClubId) targetClubId = assignableClubs[0]?.id || "";
		setAssignStudentId("");
		setAssignClubId(targetClubId);
		setAssignRole("Member");
		setAssignNotes("");
		setShowAssignDialog(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Activities & Clubs",
				description: isParent ? "View extracurricular activities, sports team schedules, venues, and your child's club participation." : "Manage athletic sports teams, arts, STEM clubs, and student roster enrollments.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportPdf,
							disabled: filteredRoster.length === 0,
							className: "gap-1.5 text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportExcel,
							disabled: filteredRoster.length === 0,
							className: "gap-1.5 text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5" }), " Excel"]
						}),
						canAssignStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => handleOpenAssign(),
							className: "gap-1.5 text-xs h-9 font-semibold shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4 text-primary" }), " Assign Student"]
						}),
						isAdminOrSec && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleOpenAddClub,
							size: "sm",
							className: "gap-1.5 text-xs h-9 font-semibold shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Club / Activity"]
						}),
						isParent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "text-xs px-2.5 py-1 bg-muted/50 border-border text-muted-foreground gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5 text-primary" }), " Parent Access: Read-Only"]
						})
					]
				})
			}),
			isParent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your Children's Club Participations" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "text-xs",
						children: [
							parentChildrenMemberships.length,
							" Enrolled",
							" ",
							parentChildrenMemberships.length === 1 ? "Activity" : "Activities"
						]
					})]
				}), parentChildrenMemberships.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "None of your children are currently enrolled in any extracurricular clubs. Explore the active clubs below and contact their class teacher or sports coordinator to join!"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
					children: parentChildrenMemberships.map((m) => {
						const club = clubs.find((c) => c.id === m.club_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border rounded-lg p-3 text-xs space-y-2 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground block text-sm",
									children: m.student_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [
										m.class_name,
										" (",
										m.student_code,
										")"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] bg-primary/10 text-primary border-primary/30",
									children: m.role_in_club
								})]
							}), club && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 pt-1 border-t text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-medium text-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.name })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.schedule })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.venue })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-foreground/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Coach: ",
											club.coach_name,
											" ",
											club.coach_phone && `(${club.coach_phone})`
										] })]
									})
								]
							})]
						}, m.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Clubs & Teams",
						value: clubs.length,
						subtitle: "Extracurricular offerings",
						icon: Trophy,
						iconColor: "text-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Student Enrollments",
						value: memberships.length,
						subtitle: "Across all activities",
						icon: Users,
						iconColor: "text-blue-600 dark:text-blue-400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Athletic Sports Teams",
						value: clubs.filter((c) => c.category === "Sports").length,
						subtitle: "Football, Volleyball, Athletics",
						icon: Dumbbell,
						iconColor: "text-emerald-600 dark:text-emerald-400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Academic & Arts Clubs",
						value: clubs.filter((c) => c.category !== "Sports").length,
						subtitle: "STEM, Drama, Chess, Music",
						icon: Sparkles,
						iconColor: "text-purple-600 dark:text-purple-400"
					})
				]
			}),
			isTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-primary/25 bg-primary/5 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs font-bold text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Teacher Extracurricular Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "text-[10px] bg-primary/10 text-primary border-primary/25 font-semibold",
							children: [teacherLedClubs.length, " Led by You"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: "You can register and assign student members or readers to clubs you lead. Admins & secretaries manage all clubs school-wide."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center bg-card p-1 rounded-lg border shadow-2xs self-stretch sm:self-auto shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTeacherViewScope("my_clubs"),
						className: cn("px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5", teacherViewScope === "my_clubs" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3 text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"My Led Clubs (",
							teacherLedClubs.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTeacherViewScope("all"),
						className: cn("px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer", teacherViewScope === "all" ? "bg-primary text-primary-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"All School Clubs (",
							clubs.length,
							")"
						] })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0",
						children: [
							"all",
							"Sports",
							"Academic & STEM",
							"Arts & Culture",
							"Music & Performing",
							"Leadership & Clubs"
						].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedCategory(cat),
							className: cn("px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer", selectedCategory === cat ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted/40 hover:bg-muted text-foreground border border-transparent hover:border-border"),
							children: cat === "all" ? "All Categories" : cat
						}, cat))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 justify-between sm:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search club, coach, venue...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "h-8 pl-8 text-xs"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-muted/60 p-1 rounded-lg border shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setViewMode("cards"),
							className: cn("px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer", viewMode === "cards" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
							children: "Clubs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setViewMode("roster"),
							className: cn("px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1", viewMode === "roster" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Master Roster" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px] px-1 py-0 h-3.5",
								children: memberships.length
							})]
						})]
					})]
				})]
			}),
			viewMode === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: filteredClubs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center space-y-2 border rounded-xl bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-10 text-muted-foreground/50 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-sm",
						children: isTeacher && teacherViewScope === "my_clubs" ? "No Clubs Led By You" : "No Clubs or Activities Found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground max-w-sm mx-auto",
						children: isTeacher && teacherViewScope === "my_clubs" ? "You are not designated as the coach or supervisor for any clubs currently. Switch to 'All School Clubs' to explore or request club leadership from an administrator." : "No extracurricular activities match your current category or search filters."
					}),
					isTeacher && teacherViewScope === "my_clubs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setTeacherViewScope("all"),
						className: "text-xs mt-2",
						children: "View All School Clubs"
					}),
					isAdminOrSec && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: handleOpenAddClub,
						className: "gap-1.5 text-xs mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Create First Club"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
				children: filteredClubs.map((club) => {
					const enrolledCount = clubMemberCounts[club.id] || 0;
					const capacity = club.capacity || 25;
					const pct = Math.min(100, Math.round(enrolledCount / capacity * 100));
					const categoryConfig = CATEGORY_COLORS[club.category] || CATEGORY_COLORS.Sports;
					const CategoryIcon = categoryConfig.icon;
					const isMyLedClub = isClubLead(club);
					const parentChildrenInClub = isParent ? parentChildrenMemberships.filter((m) => m.club_id === club.id) : [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: cn("relative flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-sm transition-all border-border/80", isMyLedClub && "ring-1 ring-amber-500/30 border-amber-500/30"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "p-4 pb-2 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: cn("text-[10px] font-semibold flex items-center gap-1", categoryConfig.badge),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.category })]
									}), isMyLedClub && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "You Lead" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: club.fee || "Free"
									}), isAdminOrSec && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center ml-1 border-l pl-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-6 text-muted-foreground hover:text-foreground cursor-pointer",
											onClick: () => handleOpenEditClub(club),
											title: "Edit club settings",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-6 text-muted-foreground hover:text-destructive cursor-pointer",
											onClick: () => {
												if (confirm(`Are you sure you want to remove "${club.name}" and its student enrollments?`)) deleteClubMutation.mutate(club.id);
											},
											title: "Delete club",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
										})]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base font-bold text-foreground",
								children: club.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs line-clamp-2 mt-1 leading-relaxed",
								children: club.description
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 pt-1 space-y-3",
							children: [
								parentChildrenInClub.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-emerald-500/10 border border-emerald-500/30 rounded-md p-2 text-xs flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Enrolled:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: parentChildrenInClub.map((m) => `${m.student_name} (${m.role_in_club})`).join(", ") })
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-foreground font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.schedule })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: club.venue })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 text-emerald-600 shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Coach: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: club.coach_name
												})] }),
												club.coach_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] text-muted-foreground",
													children: [
														"(",
														club.coach_phone,
														")"
													]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Roster Enrollment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [
												enrolledCount,
												" / ",
												capacity,
												" Students (",
												pct,
												"%)"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-muted rounded-full h-1.5 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("h-full rounded-full transition-all", pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-primary"),
											style: { width: `${pct}%` }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-8 text-xs font-semibold gap-1.5 flex-1",
										onClick: () => {
											setSelectedClubForRoster(club);
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }),
											" View Members (",
											enrolledCount,
											")"
										]
									}), isAdminOrSec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90",
										onClick: () => handleOpenAssign(club.id),
										title: "Direct insert student to this club",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " Assign"]
									}) : isTeacher && isMyLedClub ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90",
										onClick: () => handleOpenAssign(club.id),
										title: "Enroll student or reader into your club",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " Assign"]
									}) : isTeacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground italic px-1",
										children: ["Led by ", club.coach_name]
									}) : null]
								})
							]
						})]
					}, club.id);
				})
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Master Club Membership Roster" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: isTeacher ? "Students registered in your led clubs and activities across the school." : "Active students assigned to school sports teams and extracurricular clubs."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [isTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center bg-muted/60 p-0.5 rounded-lg border text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setRosterScope("my_members"),
								className: cn("px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium", rosterScope === "my_members" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"),
								children: "My Club Members"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRosterScope("all"),
								className: cn("px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium", rosterScope === "all" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"),
								children: [
									"All School (",
									memberships.length,
									")"
								]
							})]
						}), canAssignStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => handleOpenAssign(),
							className: "gap-1.5 text-xs h-8 font-semibold shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " Assign Student"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:hidden flex items-center justify-between px-3.5 py-2.5 bg-primary/10 border-b border-primary/20 text-xs text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Swipe table horizontally to view full club membership records" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground font-semibold shrink-0",
							children: "Scroll →"
						})]
					}), filteredRoster.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-9 text-muted-foreground/50 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: "No Student Enrollments Found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground max-w-sm mx-auto",
								children: "No students match your current category or search criteria."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto touch-pan-x scrollbar-thin",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
							className: "w-full min-w-[950px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[180px]",
										children: "Student"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[100px]",
										children: "Class"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[180px]",
										children: "Club / Activity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[120px]",
										children: "Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[130px]",
										children: "Role / Position"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[120px]",
										children: "Enrolled Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[130px]",
										children: "Enrolled By"
									}),
									canAssignStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right w-[80px]",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredRoster.map((m) => {
								const club = clubs.find((c) => c.id === m.club_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: cn("text-xs hover:bg-muted/30", isParent && parentChildIds.has(m.student_id) ? "bg-primary/5 font-medium" : ""),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
											className: "whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: m.student_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-[10px] text-primary",
												children: m.student_code
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] font-normal",
											children: m.class_name || "Unassigned"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground",
											children: club?.name || "—"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: club?.venue || "—"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: club?.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: cn("text-[10px] font-semibold", CATEGORY_COLORS[club.category]?.badge || ""),
											children: club.category
										}) : "—" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground",
											children: m.role_in_club
										}), m.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]",
											children: m.notes
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "whitespace-nowrap text-muted-foreground",
											children: fmtDate(m.enrolled_at)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
											className: "whitespace-nowrap text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: m.enrolled_by_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] capitalize",
												children: m.enrolled_by_role
											})]
										}),
										canAssignStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right whitespace-nowrap",
											children: isAdminOrSec || teacherLedClubIds.has(m.club_id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "size-7 text-muted-foreground hover:text-destructive cursor-pointer",
												onClick: () => {
													if (confirm(`Remove ${m.student_name} from ${club?.name || "this club"}?`)) removeMembershipMutation.mutate(m.id);
												},
												title: "Remove from club",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground italic px-1",
												children: "Read-only"
											})
										})
									]
								}, m.id);
							}) })]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showClubDialog,
				onOpenChange: setShowClubDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-primary" }), editingClub ? "Edit Club / Activity Details" : "Add New Club or Activity"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Configure activity name, coaching staff, venue, meeting schedule, and capacity."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "club-name",
										className: "text-xs font-semibold",
										children: ["Club / Activity Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "club-name",
										placeholder: "e.g. Football Team, Volleyball Club, Robotics & STEM...",
										value: clubName,
										onChange: (e) => setClubName(e.target.value),
										className: "text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "club-category",
											className: "text-xs font-semibold",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: clubCategory,
											onValueChange: (val) => setClubCategory(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "club-category",
												className: "text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Category" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Sports",
													children: "Sports & Athletics"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Academic & STEM",
													children: "Academic & STEM"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Arts & Culture",
													children: "Arts & Culture"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Music & Performing",
													children: "Music & Performing"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Leadership & Clubs",
													children: "Leadership & Clubs"
												})
											] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "club-capacity",
											className: "text-xs font-semibold",
											children: "Capacity (Max Students)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "club-capacity",
											type: "number",
											placeholder: "25",
											value: clubCapacity,
											onChange: (e) => setClubCapacity(e.target.value),
											className: "text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "club-schedule",
											className: "text-xs font-semibold",
											children: ["Weekly Schedule ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "club-schedule",
											placeholder: "e.g. Tuesdays & Thursdays, 3:45 PM - 5:15 PM",
											value: clubSchedule,
											onChange: (e) => setClubSchedule(e.target.value),
											className: "text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "club-venue",
											className: "text-xs font-semibold",
											children: ["Venue / Location ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "club-venue",
											placeholder: "e.g. Main Sports Pitch, Sports Hall, Lab 2",
											value: clubVenue,
											onChange: (e) => setClubVenue(e.target.value),
											className: "text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "club-lead-select",
										className: "text-xs font-semibold flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assign Lead Teacher (Club Supervisor)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground font-normal",
											children: "Grants teacher management privileges"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: clubCoachId || "custom",
										onValueChange: (val) => {
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
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "club-lead-select",
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a registered teacher or custom coach..." })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
											className: "max-h-60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "custom",
												children: "External Coach / Custom Coach Name"
											}), teachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: t.id,
												children: [
													t.full_name,
													" (",
													t.email,
													")"
												]
											}, t.id))]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "club-coach",
											className: "text-xs font-semibold",
											children: ["Coach / Supervisor Display Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "club-coach",
											placeholder: "e.g. Coach David Kamanzi",
											value: clubCoach,
											onChange: (e) => setClubCoach(e.target.value),
											className: "text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "club-phone",
											className: "text-xs font-semibold",
											children: "Coach Contact Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "club-phone",
											placeholder: "e.g. +250 788 123 456",
											value: clubCoachPhone,
											onChange: (e) => setClubCoachPhone(e.target.value),
											className: "text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "club-fee",
										className: "text-xs font-semibold",
										children: "Fee Structure"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "club-fee",
										placeholder: "e.g. Free, Included in Tuition, or KSh 1,000 / Term",
										value: clubFee,
										onChange: (e) => setClubFee(e.target.value),
										className: "text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "club-desc",
										className: "text-xs font-semibold",
										children: "Description & Objectives"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "club-desc",
										rows: 3,
										placeholder: "Overview of training drills, tournaments, and objectives...",
										value: clubDesc,
										onChange: (e) => setClubDesc(e.target.value),
										className: "text-xs leading-relaxed"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setShowClubDialog(false);
									setEditingClub(null);
								},
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => saveClubMutation.mutate(),
								disabled: saveClubMutation.isPending,
								size: "sm",
								className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), saveClubMutation.isPending ? "Saving Club..." : editingClub ? "Update Club" : "Create Club"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showAssignDialog,
				onOpenChange: setShowAssignDialog,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4 text-primary" }), "Assign Student to Club or Activity"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: isAdminOrSec ? "Direct Access: Administrators and secretaries can enroll students into any club directly." : "Teacher Access: You can register and assign students into the clubs you lead."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								isAdminOrSec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-primary/10 border border-primary/20 rounded-lg p-2.5 text-xs flex items-center gap-2 text-foreground font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Direct Access:" }), " You can insert any student into any school club or athletic team directly."] })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-amber-500/10 border border-amber-500/25 rounded-lg p-2.5 text-xs flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Teacher Leadership:" }),
										" You are registering students into clubs you lead (",
										assignableClubs.length,
										" available)."
									] })]
								}),
								isTeacher && assignableClubs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-rose-500/10 border border-rose-500/25 rounded-lg p-3 text-xs text-rose-900 dark:text-rose-200 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 text-rose-600 dark:text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No Led Clubs Assigned to You" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] leading-relaxed",
										children: "You are not currently designated as the supervisor or coach of any active extracurricular club. Please contact your school administrator or secretary to be designated as a club lead."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "assign-student",
										className: "text-xs font-semibold",
										children: ["Select Student ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assignStudentId,
										onValueChange: setAssignStudentId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "assign-student",
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose student..." })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "max-h-60",
											children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: s.id,
												children: [
													s.full_name,
													" — ",
													s.classes?.name || "Unassigned",
													" (",
													s.student_code,
													")"
												]
											}, s.id))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "assign-club",
										className: "text-xs font-semibold flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Select Club or Team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})] }), isTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-amber-700 dark:text-amber-300 font-normal",
											children: "Showing your led clubs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assignClubId,
										onValueChange: setAssignClubId,
										disabled: assignableClubs.length === 0,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "assign-club",
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: assignableClubs.length === 0 ? "No led clubs available" : "Choose club or team..." })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "max-h-60",
											children: assignableClubs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: c.id,
												children: [
													c.name,
													" (",
													c.category,
													") — Coach: ",
													c.coach_name
												]
											}, c.id))
										})]
									})]
								}),
								(() => {
									const selectedClub = clubs.find((c) => c.id === assignClubId);
									if (!selectedClub) return null;
									const currentCount = clubMemberCounts[selectedClub.id] || 0;
									const cap = selectedClub.capacity || 25;
									const isFull = currentCount >= cap;
									const categoryConfig = CATEGORY_COLORS[selectedClub.category] || CATEGORY_COLORS.Sports;
									const CategoryIcon = categoryConfig.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg border bg-muted/40 space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold text-foreground flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5 text-primary" }),
														" ",
														selectedClub.name
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: cn("text-[10px]", categoryConfig.badge),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { className: "size-2.5 mr-1" }), selectedClub.category]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground grid grid-cols-2 gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Coach: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: selectedClub.coach_name
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Venue: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-foreground",
														children: selectedClub.venue
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-span-2",
														children: ["Schedule: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-foreground",
															children: selectedClub.schedule
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[11px] pt-1 border-t",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [
														"Enrollment: ",
														currentCount,
														" / ",
														cap,
														" students (",
														Math.round(currentCount / cap * 100),
														"%)"
													]
												}), isFull ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "destructive",
													className: "text-[10px]",
													children: "Club at Capacity"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: "text-[10px]",
													children: "Available Spots"
												})]
											})
										]
									});
								})(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "assign-role",
										className: "text-xs font-semibold",
										children: ["Role / Position in Club ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assignRole,
										onValueChange: setAssignRole,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "assign-role",
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select role" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Member",
												children: "Regular Member / Player"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Club Reader / Speaker",
												children: "Club Reader / Speaker"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Club Leader / President",
												children: "Club Leader / President"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Team Captain",
												children: "Team Captain"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Vice Captain",
												children: "Vice Captain"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Club Secretary",
												children: "Club Student Secretary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Goalkeeper",
												children: "Goalkeeper"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Setter",
												children: "Setter"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Striker",
												children: "Striker"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Lead Builder",
												children: "Lead Builder / Coder"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "First Violin",
												children: "Lead Musician / Vocalist"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "assign-notes",
										className: "text-xs font-semibold",
										children: "Notes / Jersey Number / Reader Topic (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "assign-notes",
										placeholder: "e.g. Reader Book: Macbeth, Jersey #10, Starting XI...",
										value: assignNotes,
										onChange: (e) => setAssignNotes(e.target.value),
										className: "text-xs"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setShowAssignDialog(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => assignStudentMutation.mutate(),
								disabled: assignStudentMutation.isPending || !assignStudentId || !assignClubId || assignableClubs.length === 0,
								size: "sm",
								className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), assignStudentMutation.isPending ? "Enrolling..." : "Enroll Student"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(selectedClubForRoster),
				onOpenChange: (open) => {
					if (!open) setSelectedClubForRoster(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-xl max-h-[85vh] overflow-y-auto",
					children: selectedClubForRoster && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2 text-base font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-primary" }),
									selectedClubForRoster.name,
									" — Member Roster"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: selectedClubForRoster.category
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs",
							children: [
								"Coach: ",
								selectedClubForRoster.coach_name,
								" · Schedule:",
								" ",
								selectedClubForRoster.schedule,
								" · Venue: ",
								selectedClubForRoster.venue
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs",
							children: (() => {
								const clubMembers = memberships.filter((m) => m.club_id === selectedClubForRoster.id);
								if (clubMembers.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-8 text-center text-muted-foreground border rounded-lg bg-muted/20",
									children: "No students currently enrolled in this club."
								});
								const canManageThisClub = isAdminOrSec || isClubLead(selectedClubForRoster);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border rounded-lg overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
										className: "text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "text-xs bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Class" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role / Position" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Enrolled Date" }),
												canManageThisClub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
													className: "text-right",
													children: "Action"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: clubMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "text-xs hover:bg-muted/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
													className: "font-semibold text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: m.student_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] font-mono text-primary font-normal",
														children: m.student_code
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: m.class_name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: "text-[10px]",
													children: m.role_in_club
												}), m.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground mt-0.5",
													children: m.notes
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-muted-foreground",
													children: fmtDate(m.enrolled_at)
												}),
												canManageThisClub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "size-6 text-muted-foreground hover:text-destructive cursor-pointer",
														onClick: () => {
															if (confirm(`Remove ${m.student_name} from ${selectedClubForRoster.name}?`)) removeMembershipMutation.mutate(m.id);
														},
														title: "Remove student",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
													})
												})
											]
										}, m.id)) })]
									})
								});
							})()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									memberships.filter((m) => m.club_id === selectedClubForRoster.id).length,
									" /",
									" ",
									selectedClubForRoster.capacity,
									" Students enrolled"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [(isAdminOrSec || isClubLead(selectedClubForRoster)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "gap-1 text-xs font-semibold cursor-pointer",
									onClick: () => {
										const cid = selectedClubForRoster.id;
										setSelectedClubForRoster(null);
										handleOpenAssign(cid);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), " + Assign Student"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSelectedClubForRoster(null),
									children: "Close"
								})]
							})]
						})
					] })
				})
			})
		]
	});
}
//#endregion
export { ActivitiesPage as component };
