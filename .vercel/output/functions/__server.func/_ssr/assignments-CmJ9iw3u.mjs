import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as useAuth } from "./auth-D2xkuHOZ.mjs";
import { n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { c as fmtDate, o as fetchClasses, s as fetchStudents, t as PageHeader } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrEuILZf.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { C as Save, Et as BookOpenCheck, W as LoaderCircle, _ as ShieldAlert, et as FileSpreadsheet, f as Trash2, k as Plus, mt as CircleCheck, q as KeyRound } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { t as exportExcel } from "./export-OxObhwWT.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as dispatchLocalNotification } from "./device-notifications-BMIcetfI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assignments-CmJ9iw3u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/assignments.tsx?tsr-split=component";
function AssignmentsPage() {
	const { role, profile, user } = useAuth();
	const qc = useQueryClient();
	const isTeacher = role === "teacher";
	const isParent = role === "parent";
	const isHeadOfStudies = role === "head_of_studies";
	const isAdmin = role === "admin" || role === "owner";
	const isSecretary = role === "secretary";
	const [selectedAssignmentId, setSelectedAssignmentId] = (0, import_react.useState)(null);
	const [createDialogOpen, setCreateDialogOpen] = (0, import_react.useState)(false);
	const [viewingAnswerSubmission, setViewingAnswerSubmission] = (0, import_react.useState)(null);
	const [answeringAssignment, setAnsweringAssignment] = (0, import_react.useState)(null);
	const [answeringStudentId, setAnsweringStudentId] = (0, import_react.useState)("");
	const [submissionAnswerText, setSubmissionAnswerText] = (0, import_react.useState)("");
	const [selectedMarks, setSelectedMarks] = (0, import_react.useState)({});
	const [savingKey, setSavingKey] = (0, import_react.useState)(null);
	const [newClassId, setNewClassId] = (0, import_react.useState)("");
	const [newSubject, setNewSubject] = (0, import_react.useState)("");
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	const [newQuestions, setNewQuestions] = (0, import_react.useState)("");
	const [newTotalPoints, setNewTotalPoints] = (0, import_react.useState)("100");
	const [newDueDate, setNewDueDate] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 7);
		return d.toISOString().slice(0, 10);
	});
	const { data: classes } = useQuery({
		queryKey: ["classes"],
		queryFn: fetchClasses
	});
	const { data: students } = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents
	});
	const DEMO_SAMPLE_IDS = (0, import_react.useMemo)(() => /* @__PURE__ */ new Set([
		"asg-1",
		"asg-2",
		"asg-3",
		"asg-math-p4",
		"asg-sci-p6"
	]), []);
	useQuery({
		queryKey: ["purge_demo_sample_assignments"],
		queryFn: async () => {
			for (const id of [
				"asg-1",
				"asg-2",
				"asg-3",
				"asg-math-p4",
				"asg-sci-p6"
			]) try {
				await supabase.from("assignments").delete().eq("id", id);
			} catch {}
			for (const id of [
				"sub-1",
				"sub-math-p4-std-0001",
				"sub-math-p4-std-0002"
			]) try {
				await supabase.from("assignment_submissions").delete().eq("id", id);
			} catch {}
			try {
				await supabase.from("profiles").delete().eq("id", "user-student");
				await supabase.from("users").delete().eq("id", "user-student");
			} catch {}
			try {
				await supabase.from("students").update({
					class_id: "class-p1",
					parent_id: "user-parent"
				}).eq("id", "std-0001");
			} catch {}
			return true;
		},
		staleTime: Infinity
	});
	const { data: assignments, isLoading: assignmentsLoading } = useQuery({
		queryKey: ["assignments"],
		queryFn: async () => {
			const { data, error } = await supabase.from("assignments").select("*").order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []).filter((a) => !DEMO_SAMPLE_IDS.has(a.id));
		}
	});
	const { data: submissions } = useQuery({
		queryKey: ["assignment_submissions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("assignment_submissions").select("*").order("submitted_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const [studentKeyInput, setStudentKeyInput] = (0, import_react.useState)("");
	const [linkingStudent, setLinkingStudent] = (0, import_react.useState)(false);
	const myChildren = (0, import_react.useMemo)(() => {
		if (!isParent || !students) return [];
		return students.filter((s) => s.parent_id === user?.id || s.parent_id === "user-parent" && (user?.email === "parent@school.com" || user?.id === "user-parent") || s.parent_email && user?.email && s.parent_email.toLowerCase() === user.email.toLowerCase());
	}, [
		isParent,
		students,
		user?.id,
		user?.email
	]);
	const handleLinkStudentKey = async () => {
		const key = studentKeyInput.trim().toUpperCase();
		if (!key) {
			toast.error("Please enter a Student Key (e.g. STD-0001).");
			return;
		}
		setLinkingStudent(true);
		try {
			const match = (students ?? []).find((s) => s.student_code?.toUpperCase() === key);
			if (!match) {
				toast.error(`No student found with Student Key "${key}". Please verify the key with the school.`);
				setLinkingStudent(false);
				return;
			}
			const { error } = await supabase.from("students").update({
				parent_id: user?.id ?? "user-parent",
				parent_email: user?.email ?? "parent@school.com"
			}).eq("id", match.id);
			if (error) throw error;
			toast.success(`Success! Linked ${match.full_name} (${match.student_code}) to your account.`);
			setStudentKeyInput("");
			qc.invalidateQueries({ queryKey: ["students"] });
			qc.invalidateQueries({ queryKey: ["assignments"] });
		} catch (err) {
			toast.error(err?.message || "Failed to link student key.");
		} finally {
			setLinkingStudent(false);
		}
	};
	const submissionMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		(submissions ?? []).forEach((sub) => {
			map.set(`${sub.assignment_id}_${sub.student_id}`, sub);
		});
		return map;
	}, [submissions]);
	const visibleAssignments = (0, import_react.useMemo)(() => {
		return (assignments ?? []).filter((asg) => {
			if (isTeacher) return asg.teacher_id === user?.id || user?.id && asg.teacher_id === "user-teacher" && user?.email === "teacher@school.com" || profile?.full_name && asg.teacher_name && asg.teacher_name.trim().toLowerCase() === profile.full_name.trim().toLowerCase() || user?.email && asg.teacher_id === user.email;
			if (isParent) return myChildren.some((child) => child.class_id === asg.class_id);
			return true;
		});
	}, [
		assignments,
		isTeacher,
		isParent,
		myChildren,
		user,
		profile
	]);
	const activeAssignment = (0, import_react.useMemo)(() => {
		if (visibleAssignments.length === 0) return null;
		if (selectedAssignmentId) {
			const found = visibleAssignments.find((a) => a.id === selectedAssignmentId);
			if (found) return found;
		}
		return visibleAssignments[0];
	}, [visibleAssignments, selectedAssignmentId]);
	const createAssignmentMutation = useMutation({
		mutationFn: async () => {
			if (!newClassId) throw new Error("Please select a class for this assignment.");
			if (!newSubject.trim()) throw new Error("Please enter the subject.");
			if (!newTitle.trim()) throw new Error("Please provide an assignment title.");
			if (!newQuestions.trim()) throw new Error("Please type the assignment question(s).");
			const selectedClass = classes?.find((c) => c.id === newClassId);
			const assignmentId = `asg-${Date.now()}`;
			const payload = {
				id: assignmentId,
				teacher_id: user?.id ?? "user-teacher",
				teacher_name: profile?.full_name ?? "Teacher",
				class_id: newClassId,
				class_name: selectedClass?.name ?? "Class",
				title: newTitle.trim(),
				subject: newSubject.trim(),
				questions: newQuestions.trim(),
				description: newQuestions.trim(),
				target_student_ids: ["all"],
				due_date: newDueDate,
				total_points: parseInt(newTotalPoints, 10) || 100,
				status: "active",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const { error } = await supabase.from("assignments").insert(payload);
			if (error) throw error;
			try {
				const classStudents = (students ?? []).filter((s) => s.class_id === newClassId);
				for (const st of classStudents) {
					const notifId = `asg-notif-${assignmentId}-${st.id}`;
					await supabase.from("parent_notifications").insert({
						id: notifId,
						parent_id: st.parent_id || null,
						student_id: st.id,
						student_name: st.full_name,
						student_code: st.student_code,
						title: `New Assignment: ${newTitle.trim()} (${newSubject.trim()})`,
						body: `A new assignment has been assigned for ${selectedClass?.name ?? "Class"}: "${newTitle.trim()}". Subject: ${newSubject.trim()}, Marks: ${newTotalPoints}, Deadline: ${newDueDate ? fmtDate(newDueDate) : "Open"}. Please log in to submit answers.`,
						type: "assignment",
						created_at: (/* @__PURE__ */ new Date()).toISOString(),
						read: false
					});
					if (st.parent_email) await supabase.from("notifications").insert({
						id: `notif-${assignmentId}-${st.id}`,
						student_id: st.id,
						parent_id: st.parent_id || null,
						recipient_email: st.parent_email,
						subject: `New Assignment Alert: ${newTitle.trim()} (${selectedClass?.name ?? "Class"})`,
						body: `Dear Parent of ${st.full_name} (${st.student_code}),\n\nA new assignment has been posted for ${selectedClass?.name ?? "Primary 1"}:\n\nTitle: ${newTitle.trim()}\nSubject: ${newSubject.trim()}\nTotal Marks: ${newTotalPoints}\nDeadline: ${newDueDate ? fmtDate(newDueDate) : "Open"}\n\nPlease log in to the Parent Portal to view the questions, submit answers, and review marks.\n\nThank you,\nLittle Gems Academy`,
						status: "sent",
						created_at: (/* @__PURE__ */ new Date()).toISOString()
					});
				}
				dispatchLocalNotification(`New Assignment: ${newTitle.trim()}`, `Posted for ${selectedClass?.name ?? "Class"}. All parents have been notified.`, "/assignments");
			} catch (notifErr) {
				console.warn("Could not dispatch notifications:", notifErr);
			}
			return payload;
		},
		onSuccess: (newAsg) => {
			toast.success(`Assignment saved! All parents of ${newAsg.class_name} have been notified.`);
			setCreateDialogOpen(false);
			setNewClassId("");
			setNewSubject("");
			setNewTitle("");
			setNewQuestions("");
			setNewTotalPoints("100");
			setSelectedAssignmentId(newAsg.id);
			qc.invalidateQueries({ queryKey: ["assignments"] });
			qc.invalidateQueries({ queryKey: ["parent_notifications"] });
			qc.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteAssignmentMutation = useMutation({
		mutationFn: async (asgId) => {
			const { error } = await supabase.from("assignments").delete().eq("id", asgId);
			if (error) throw error;
			try {
				await supabase.from("assignment_submissions").delete().eq("assignment_id", asgId);
			} catch {}
			return asgId;
		},
		onSuccess: (deletedId) => {
			toast.success("Assignment removed successfully.");
			if (selectedAssignmentId === deletedId) setSelectedAssignmentId(null);
			qc.invalidateQueries({ queryKey: ["assignments"] });
			qc.invalidateQueries({ queryKey: ["assignment_submissions"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const submitAnswerMutation = useMutation({
		mutationFn: async () => {
			if (!answeringAssignment) throw new Error("No assignment selected.");
			if (!answeringStudentId) throw new Error("Student ID missing.");
			if (!submissionAnswerText.trim()) throw new Error("Please type your answer before saving.");
			const st = students?.find((s) => s.id === answeringStudentId);
			const payload = {
				id: `sub-${answeringAssignment.id}-${answeringStudentId}`,
				assignment_id: answeringAssignment.id,
				student_id: answeringStudentId,
				student_name: st?.full_name ?? "Student",
				parent_id: user?.id ?? void 0,
				class_id: answeringAssignment.class_id,
				answers: submissionAnswerText.trim(),
				status: "submitted",
				score: null,
				max_score: answeringAssignment.total_points ?? 100,
				teacher_feedback: null,
				submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const { error } = await supabase.from("assignment_submissions").upsert(payload);
			if (error) throw error;
			return payload;
		},
		onSuccess: () => {
			toast.success("Assignment answer saved and submitted successfully!");
			setAnsweringAssignment(null);
			setSubmissionAnswerText("");
			qc.invalidateQueries({ queryKey: ["assignment_submissions"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const handleSaveStudentMark = async (st, sub, asg, markValue) => {
		if (!markValue.trim()) {
			toast.error("Please select a mark before saving.");
			return;
		}
		const numScore = parseFloat(markValue);
		if (isNaN(numScore) || numScore < 0) {
			toast.error("Invalid mark value.");
			return;
		}
		const key = `${asg.id}_${st.id}`;
		setSavingKey(key);
		try {
			if (sub?.id) {
				const { error } = await supabase.from("assignment_submissions").update({
					score: numScore,
					status: "graded",
					marked_at: (/* @__PURE__ */ new Date()).toISOString()
				}).eq("id", sub.id);
				if (error) throw error;
			} else {
				const subId = `sub-${asg.id}-${st.id}`;
				const { error } = await supabase.from("assignment_submissions").upsert({
					id: subId,
					assignment_id: asg.id,
					student_id: st.id,
					student_name: st.full_name,
					class_id: asg.class_id,
					answers: "Marked by teacher in classroom session.",
					score: numScore,
					max_score: asg.total_points ?? 100,
					status: "graded",
					submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
					marked_at: (/* @__PURE__ */ new Date()).toISOString(),
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (error) throw error;
			}
			toast.success(`Mark ${numScore}/${asg.total_points ?? 100} saved for ${st.full_name}!`);
			qc.invalidateQueries({ queryKey: ["assignment_submissions"] });
		} catch (err) {
			toast.error(err.message || "Failed to save mark.");
		} finally {
			setSavingKey(null);
		}
	};
	const handleExportToExcel = (asg) => {
		const classStudents = (students ?? []).filter((s) => s.class_id === asg.class_id);
		if (classStudents.length === 0) {
			toast.error("No students in this class to export.");
			return;
		}
		exportExcel([
			"Student ID",
			"Name of Student",
			"Assignment",
			"Subject",
			"Answer Status",
			"Sent Answer",
			"Marks",
			"Max Marks",
			"Submitted Date"
		], classStudents.map((st) => {
			const sub = submissionMap.get(`${asg.id}_${st.id}`);
			return [
				st.student_code,
				st.full_name,
				asg.title,
				asg.subject || "General",
				sub ? "Sent" : "Not Sent",
				sub?.answers || "-",
				sub?.score != null ? sub.score : "-",
				sub?.max_score ?? asg.total_points ?? 100,
				sub?.submitted_at ? fmtDate(sub.submitted_at) : "-"
			];
		}), `${asg.title.replace(/[^a-zA-Z0-9]/g, "_")}_Marks_Sheet`);
		toast.success("Assignment marks exported to Excel (.xlsx)!");
	};
	const getMarksOptions = (maxScore) => {
		const max = Math.max(1, maxScore || 100);
		const options = [];
		const step = max <= 20 ? 1 : max <= 50 ? 5 : 5;
		for (let i = max; i >= 0; i -= step) options.push(i);
		if (!options.includes(0)) options.push(0);
		return options;
	};
	const canCreate = !isSecretary && (isTeacher || isHeadOfStudies || isAdmin || !role);
	if (isSecretary) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "py-20 flex flex-col items-center justify-center text-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-full bg-muted p-4 mb-4 border",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "size-8 text-amber-500" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 504,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 503,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-xl font-bold tracking-tight",
				children: "Access Restricted"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 506,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground max-w-md mt-2",
				children: "The Assignments module is not available for secretaries. This section is restricted to teachers, parents, students, and academic administrators."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 507,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 502,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Classroom Assignments & Homework",
				description: isParent ? "View your child's assignments, read questions, and submit typed answers." : "Click an assignment to view student IDs, names, sent answers, and set marks.",
				action: canCreate ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => setCreateDialogOpen(true),
					className: "gap-2 bg-primary text-primary-foreground font-semibold shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 516,
						columnNumber: 15
					}, this), " Make Assignment"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 515,
					columnNumber: 261
				}, this) : void 0
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 515,
				columnNumber: 7
			}, this),
			assignmentsLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-6 animate-spin text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 520,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Loading assignments..." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 521,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 519,
				columnNumber: 29
			}, this) : visibleAssignments.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "border-dashed py-14 text-center",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "flex flex-col items-center justify-center space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpenCheck, { className: "size-10 text-muted-foreground/50" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 524,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-semibold text-foreground",
							children: "No assignments found"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 526,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground max-w-md",
							children: isParent ? "There are currently no active assignments for your children." : "No assignments have been created yet. Click 'Make Assignment' above to create Assignment 1."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 527,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 525,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 523,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 522,
				columnNumber: 52
			}, this) : isParent ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-lg border bg-card p-4 shadow-xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-sm font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 543,
								columnNumber: 19
							}, this), "Assigned Student Key(s)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 542,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Assignments are automatically displayed for children linked to your account via their Student Key."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 546,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 541,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								placeholder: "Enter Student Key (e.g. STD-0001)",
								value: studentKeyInput,
								onChange: (e) => setStudentKeyInput(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleLinkStudentKey();
									}
								},
								className: "h-8 text-xs w-56 font-mono"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 554,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								onClick: handleLinkStudentKey,
								disabled: linkingStudent || !studentKeyInput.trim(),
								className: "h-8 text-xs gap-1.5 font-semibold",
								children: [linkingStudent ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-3.5 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 561,
									columnNumber: 37
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 561,
									columnNumber: 85
								}, this), "Link Key"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 560,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 553,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 540,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-2 pt-1 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Your Linked Children:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 569,
							columnNumber: 15
						}, this), myChildren.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs text-amber-600 dark:text-amber-400 italic",
							children: "No children currently linked. Enter a Student Key (e.g. STD-0001) above to link your child."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 572,
							columnNumber: 42
						}, this) : myChildren.map((child) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: "secondary",
							className: "text-xs py-1 px-2.5 flex items-center gap-1.5 bg-muted/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-foreground",
									children: child.full_name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 576,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-muted-foreground font-mono",
									children: [
										"(Key: ",
										child.student_code,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 577,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-primary font-medium",
									children: ["• ", classes?.find((c) => c.id === child.class_id)?.name ?? child.class_id]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 580,
									columnNumber: 21
								}, this)
							]
						}, child.id, true, {
							fileName: _jsxFileName,
							lineNumber: 575,
							columnNumber: 51
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 568,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 539,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-lg border bg-card shadow-xs overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-4 border-b bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-sm font-bold text-foreground",
							children: "Assigned Homework & Marks"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 589,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Review assigned questions, marks (read-only), deadlines, and submit typed answers."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 590,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 588,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
							className: "bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Child (Student Key)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 599,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Assignment"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 600,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Subject"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 601,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Teacher"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 602,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Marks (Read-Only)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 603,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Deadline"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 604,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold",
									children: "Status"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 605,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
									className: "text-xs font-semibold text-right",
									children: "Action"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 606,
									columnNumber: 21
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 598,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 597,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: visibleAssignments.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							colSpan: 8,
							className: "text-center py-8 text-xs text-muted-foreground",
							children: "No assignments created yet."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 611,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 610,
							columnNumber: 54
						}, this) : myChildren.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
							colSpan: 8,
							className: "text-center py-8 text-xs text-muted-foreground",
							children: "Please link your child using their Student Key above to view their classroom assignments."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 615,
							columnNumber: 23
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 614,
							columnNumber: 61
						}, this) : visibleAssignments.flatMap((asg, idx) => {
							const matchingChildren = myChildren.filter((c) => c.class_id === asg.class_id);
							if (matchingChildren.length === 0) return [];
							return matchingChildren.map((child) => {
								const sub = submissionMap.get(`${asg.id}_${child.id}`);
								const isSubmitted = !!sub;
								const isGraded = sub?.status === "graded";
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-foreground block",
												children: child.full_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 628,
												columnNumber: 31
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[11px] text-muted-foreground font-mono",
												children: [
													"Key: ",
													child.student_code,
													" • ",
													asg.class_name
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 631,
												columnNumber: 31
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 627,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-bold text-foreground block",
												children: [
													"Assignment ",
													idx + 1,
													": ",
													asg.title
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 636,
												columnNumber: 31
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[11px] text-muted-foreground line-clamp-1 font-mono",
												children: asg.questions
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 639,
												columnNumber: 31
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 635,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-medium text-primary",
											children: asg.subject || "General"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 643,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: asg.teacher_name || "Teacher"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 646,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-mono font-semibold",
											children: isGraded ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm",
													children: [
														sub.score,
														" / ",
														sub.max_score,
														" Marks"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 652,
													columnNumber: 35
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[10px] text-muted-foreground font-normal",
													children: "(Teacher Graded · Read-Only)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 655,
													columnNumber: 35
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 651,
												columnNumber: 43
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono text-xs font-semibold text-foreground",
													children: [asg.total_points ?? 100, " Total Marks"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 659,
													columnNumber: 35
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[10px] text-amber-600 dark:text-amber-400 font-normal",
													children: isSubmitted ? "Pending Grading" : "Not Sent"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 662,
													columnNumber: 35
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 658,
												columnNumber: 42
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 649,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground whitespace-nowrap",
											children: asg.due_date ? fmtDate(asg.due_date) : "Open"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 667,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: isGraded ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												className: "bg-emerald-600 text-white text-[10px] font-bold",
												children: [
													"Marked: ",
													sub.score,
													"/",
													sub.max_score
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 671,
												columnNumber: 43
											}, this) : isSubmitted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: "secondary",
												className: "text-blue-700 bg-blue-500/10 text-[10px]",
												children: "Submitted"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 673,
												columnNumber: 58
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: "outline",
												className: "text-amber-700 border-amber-400/40 text-[10px]",
												children: "Not Sent"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 675,
												columnNumber: 44
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 670,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-right whitespace-nowrap",
											children: !isSubmitted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												size: "sm",
												onClick: () => {
													setAnsweringAssignment(asg);
													setAnsweringStudentId(child.id);
													setSubmissionAnswerText("");
												},
												className: "h-7 text-xs",
												children: "Type Answer"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 680,
												columnNumber: 47
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => {
													setViewingAnswerSubmission({
														studentName: child.full_name,
														studentCode: child.student_code,
														assignmentTitle: asg.title,
														questions: asg.questions,
														answers: sub.answers,
														submittedAt: sub.submitted_at,
														score: sub.score,
														maxScore: sub.max_score
													});
												},
												className: "h-7 text-xs",
												children: "View Answer & Marks"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 686,
												columnNumber: 45
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 679,
											columnNumber: 29
										}, this)
									]
								}, `${asg.id}_${child.id}`, true, {
									fileName: _jsxFileName,
									lineNumber: 626,
									columnNumber: 26
								}, this);
							});
						}) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 609,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 596,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 595,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 587,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 537,
				columnNumber: 5
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: visibleAssignments.map((asg, idx) => {
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setSelectedAssignmentId(asg.id),
							className: `px-4 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-2 cursor-pointer ${activeAssignment?.id === asg.id ? "bg-primary text-primary-foreground border-primary shadow-xs" : "bg-card text-foreground hover:bg-muted/60 border-border"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-bold",
								children: ["Assignment ", idx + 1]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 717,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "opacity-80 font-normal",
								children: [
									"(",
									asg.title,
									" • ",
									asg.class_name,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 718,
								columnNumber: 19
							}, this)]
						}, asg.id, true, {
							fileName: _jsxFileName,
							lineNumber: 716,
							columnNumber: 18
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 713,
					columnNumber: 11
				}, this), activeAssignment && /* @__PURE__ */ (void 0)("div", {
					className: "rounded-lg border bg-card shadow-xs overflow-hidden space-y-0",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "p-4 border-b bg-muted/20 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-base font-bold text-foreground",
										children: [
											"Assignment",
											" ",
											visibleAssignments.findIndex((a) => a.id === activeAssignment.id) + 1,
											":",
											" ",
											activeAssignment.title
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 731,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(Badge, {
										variant: "outline",
										className: "text-xs",
										children: activeAssignment.class_name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 736,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 730,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1",
									children: [
										/* @__PURE__ */ (void 0)("span", { children: [
											/* @__PURE__ */ (void 0)("strong", {
												className: "text-foreground",
												children: "Subject:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 742,
												columnNumber: 23
											}, this),
											" ",
											activeAssignment.subject || "General"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 741,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: [
											/* @__PURE__ */ (void 0)("strong", {
												className: "text-foreground",
												children: "Total Marks:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 746,
												columnNumber: 23
											}, this),
											" ",
											activeAssignment.total_points ?? 100
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 745,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: [
											/* @__PURE__ */ (void 0)("strong", {
												className: "text-foreground",
												children: "Deadline:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 750,
												columnNumber: 23
											}, this),
											" ",
											activeAssignment.due_date ? fmtDate(activeAssignment.due_date) : "None"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 749,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 740,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 729,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => handleExportToExcel(activeAssignment),
									className: "h-8 gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-600/30 hover:bg-emerald-500/10",
									children: [/* @__PURE__ */ (void 0)(FileSpreadsheet, { className: "size-3.5 text-emerald-600" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 759,
										columnNumber: 21
									}, this), " Export Excel (.xlsx)"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 758,
									columnNumber: 19
								}, this), canCreate && /* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										if (window.confirm(`Are you sure you want to remove "${activeAssignment.title}"?`)) deleteAssignmentMutation.mutate(activeAssignment.id);
									},
									disabled: deleteAssignmentMutation.isPending,
									className: "h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 border-destructive/30",
									children: [deleteAssignmentMutation.isPending ? /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-3.5 animate-spin" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 767,
										columnNumber: 61
									}, this) : /* @__PURE__ */ (void 0)(Trash2, { className: "size-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 767,
										columnNumber: 109
									}, this), "Remove Assignment"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 762,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 756,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 728,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "px-4 py-3 bg-muted/10 border-b text-xs",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "font-semibold text-[11px] uppercase tracking-wider text-muted-foreground block mb-1",
								children: "Questions:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 775,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "whitespace-pre-wrap font-mono text-foreground leading-relaxed",
								children: activeAssignment.questions
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 778,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 774,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (void 0)(Table, { children: [/* @__PURE__ */ (void 0)(TableHeader, { children: /* @__PURE__ */ (void 0)(TableRow, {
								className: "bg-muted/40",
								children: [
									/* @__PURE__ */ (void 0)(TableHead, {
										className: "text-xs font-semibold w-36",
										children: "Student ID"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 793,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)(TableHead, {
										className: "text-xs font-semibold min-w-48",
										children: "Name of Students"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 794,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)(TableHead, {
										className: "text-xs font-semibold w-32",
										children: "Answer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 797,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)(TableHead, {
										className: "text-xs font-semibold min-w-48",
										children: "Marks"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 798,
										columnNumber: 23
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 792,
								columnNumber: 21
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 791,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)(TableBody, { children: (() => {
								const classStudents = (students ?? []).filter((s) => s.class_id === activeAssignment.class_id);
								if (classStudents.length === 0) return /* @__PURE__ */ (void 0)(TableRow, { children: /* @__PURE__ */ (void 0)(TableCell, {
									colSpan: 4,
									className: "text-center py-8 text-xs text-muted-foreground",
									children: "No students currently registered in this class."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 806,
									columnNumber: 29
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 805,
									columnNumber: 26
								}, this);
								return classStudents.map((st) => {
									const sub = submissionMap.get(`${activeAssignment.id}_${st.id}`);
									const isSent = !!sub;
									const key = `${activeAssignment.id}_${st.id}`;
									const currentMarkVal = selectedMarks[key] ?? (sub?.score != null ? String(sub.score) : "");
									const isSaving = savingKey === key;
									const maxScore = activeAssignment.total_points ?? 100;
									return /* @__PURE__ */ (void 0)(TableRow, {
										className: "hover:bg-muted/20",
										children: [
											/* @__PURE__ */ (void 0)(TableCell, {
												className: "text-xs font-mono font-medium text-muted-foreground",
												children: st.student_code || st.id.slice(0, 8)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 820,
												columnNumber: 29
											}, this),
											/* @__PURE__ */ (void 0)(TableCell, {
												className: "text-xs font-semibold text-foreground",
												children: st.full_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 825,
												columnNumber: 29
											}, this),
											/* @__PURE__ */ (void 0)(TableCell, {
												className: "text-xs",
												children: isSent ? /* @__PURE__ */ (void 0)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10",
													onClick: () => setViewingAnswerSubmission({
														studentName: st.full_name,
														studentCode: st.student_code,
														assignmentTitle: activeAssignment.title,
														questions: activeAssignment.questions,
														answers: sub.answers,
														submittedAt: sub.submitted_at,
														score: sub.score,
														maxScore: sub.max_score ?? maxScore
													}),
													children: "View"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 831,
													columnNumber: 41
												}, this) : /* @__PURE__ */ (void 0)("span", {
													className: "text-xs text-muted-foreground font-medium",
													children: "Not Sent"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 842,
													columnNumber: 45
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 830,
												columnNumber: 29
											}, this),
											/* @__PURE__ */ (void 0)(TableCell, {
												className: "text-xs",
												children: /* @__PURE__ */ (void 0)("div", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ (void 0)("select", {
															value: currentMarkVal,
															onChange: (e) => setSelectedMarks((prev) => ({
																...prev,
																[key]: e.target.value
															})),
															className: "h-8 text-xs border rounded-md px-2.5 bg-background font-mono cursor-pointer min-w-32 focus:outline-none focus:ring-1 focus:ring-primary",
															children: [/* @__PURE__ */ (void 0)("option", {
																value: "",
																children: "Select Marks"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 854,
																columnNumber: 35
															}, this), getMarksOptions(maxScore).map((m) => /* @__PURE__ */ (void 0)("option", {
																value: m,
																children: [
																	m,
																	" / ",
																	maxScore
																]
															}, m, true, {
																fileName: _jsxFileName,
																lineNumber: 855,
																columnNumber: 71
															}, this))]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 850,
															columnNumber: 33
														}, this),
														/* @__PURE__ */ (void 0)(Button, {
															size: "sm",
															disabled: isSaving || !currentMarkVal,
															onClick: () => handleSaveStudentMark(st, sub, activeAssignment, currentMarkVal),
															className: "h-8 text-xs gap-1 px-3",
															children: [isSaving ? /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-3 animate-spin" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 861,
																columnNumber: 47
															}, this) : /* @__PURE__ */ (void 0)(Save, { className: "size-3" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 861,
																columnNumber: 93
															}, this), "Save"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 860,
															columnNumber: 33
														}, this),
														sub?.status === "graded" && /* @__PURE__ */ (void 0)(Badge, {
															className: "bg-emerald-600 text-white text-[10px] font-bold gap-1 py-0.5",
															children: [
																/* @__PURE__ */ (void 0)(CircleCheck, { className: "size-2.5" }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 866,
																	columnNumber: 37
																}, this),
																" Saved: ",
																sub.score,
																"/",
																sub.max_score
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 865,
															columnNumber: 62
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 849,
													columnNumber: 31
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 848,
												columnNumber: 29
											}, this)
										]
									}, st.id, true, {
										fileName: _jsxFileName,
										lineNumber: 818,
										columnNumber: 26
									}, this);
								});
							})() }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 801,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 790,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 789,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 726,
					columnNumber: 32
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 711,
				columnNumber: 5
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: createDialogOpen,
				onOpenChange: setCreateDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-lg max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-lg font-bold",
							children: "Make Assignment"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 893,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Select class, enter subject, title, type the question, set marks, and deadline." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 894,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 892,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3.5 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold text-foreground",
										children: ["Class ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-destructive",
											children: "*"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 903,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 902,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: newClassId,
										onValueChange: setNewClassId,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Select class" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 907,
											columnNumber: 19
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 906,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: (classes ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id, false, {
											fileName: _jsxFileName,
											lineNumber: 910,
											columnNumber: 45
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 909,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 905,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 901,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold text-foreground",
										children: ["Subject ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-destructive",
											children: "*"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 920,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 919,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Mathematics, Science, English, Social Studies",
										value: newSubject,
										onChange: (e) => setNewSubject(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 922,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 918,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold text-foreground",
										children: ["Title ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-destructive",
											children: "*"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 928,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 927,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Fractions and Mixed Numbers Practice",
										value: newTitle,
										onChange: (e) => setNewTitle(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 930,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 926,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold text-foreground",
										children: ["Question ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-destructive",
											children: "*"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 936,
											columnNumber: 26
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 935,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 6,
										placeholder: "Type the question(s) here...",
										value: newQuestions,
										onChange: (e) => setNewQuestions(e.target.value),
										className: "font-mono text-xs leading-relaxed"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 938,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 934,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold text-foreground",
											children: ["Set Marks ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-destructive",
												children: "*"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 945,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 944,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											type: "number",
											placeholder: "e.g. 100",
											value: newTotalPoints,
											onChange: (e) => setNewTotalPoints(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 947,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 943,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold text-foreground",
											children: ["Deadline ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-destructive",
												children: "*"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 952,
												columnNumber: 28
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 951,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											type: "date",
											value: newDueDate,
											onChange: (e) => setNewDueDate(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 954,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 950,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 942,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 899,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								onClick: () => setCreateDialogOpen(false),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 961,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: () => createAssignmentMutation.mutate(),
								disabled: !newClassId || !newSubject.trim() || !newTitle.trim() || !newQuestions.trim() || createAssignmentMutation.isPending,
								className: "gap-2",
								children: [createAssignmentMutation.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 965,
									columnNumber: 54
								}, this), "Save Assignment"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 964,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 960,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 891,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 890,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: !!viewingAnswerSubmission,
				onOpenChange: (open) => !open && setViewingAnswerSubmission(null),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: viewingAnswerSubmission && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (void 0)(DialogHeader, { children: [/* @__PURE__ */ (void 0)(DialogTitle, {
							className: "text-base font-bold",
							children: ["Sent Assignment: ", viewingAnswerSubmission.studentName]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 979,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)(DialogDescription, { children: [
							"Student ID: ",
							viewingAnswerSubmission.studentCode,
							" •",
							" ",
							viewingAnswerSubmission.assignmentTitle
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 982,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 978,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider mb-1",
									children: "Question:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 990,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "p-2.5 bg-muted/30 rounded border font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed",
									children: viewingAnswerSubmission.questions
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 993,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 989,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-foreground block text-[11px] uppercase tracking-wider mb-1",
									children: "Student Sent Answer:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 999,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-muted/40 rounded border font-mono text-foreground whitespace-pre-wrap leading-relaxed",
									children: viewingAnswerSubmission.answers
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1002,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 998,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-muted/40 rounded border space-y-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "font-semibold text-foreground text-xs uppercase tracking-wider",
											children: "Teacher Marks Assessment:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1010,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)(Badge, {
											variant: "outline",
											className: "text-[10px] font-normal",
											children: "Read-Only"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1013,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1009,
										columnNumber: 19
									}, this), viewingAnswerSubmission.score != null ? /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between pt-1",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-xs text-muted-foreground",
											children: "Awarded Score:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1018,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400",
											children: [
												viewingAnswerSubmission.score,
												" / ",
												viewingAnswerSubmission.maxScore ?? 100,
												" ",
												"Marks"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1019,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1017,
										columnNumber: 60
									}, this) : /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground pt-1",
										children: [
											"Awaiting teacher grading. (Total possible:",
											" ",
											viewingAnswerSubmission.maxScore ?? 100,
											" marks)"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1023,
										columnNumber: 30
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1008,
									columnNumber: 17
								}, this),
								viewingAnswerSubmission.submittedAt && /* @__PURE__ */ (void 0)("div", {
									className: "text-[11px] text-muted-foreground",
									children: ["Submitted Date: ", fmtDate(viewingAnswerSubmission.submittedAt)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1029,
									columnNumber: 57
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 988,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)(DialogFooter, { children: /* @__PURE__ */ (void 0)(Button, {
							variant: "outline",
							onClick: () => setViewingAnswerSubmission(null),
							children: "Close"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1035,
							columnNumber: 17
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1034,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 977,
						columnNumber: 39
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 976,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 975,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: !!answeringAssignment,
				onOpenChange: (open) => !open && setAnsweringAssignment(null),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-lg max-h-[90vh] overflow-y-auto",
					children: answeringAssignment && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (void 0)(DialogHeader, { children: [/* @__PURE__ */ (void 0)(DialogTitle, {
							className: "text-lg font-bold",
							children: answeringAssignment.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1051,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)(DialogDescription, { children: "Type your answers below and click Save to submit to your teacher." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1052,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1050,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-md border",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-muted-foreground block text-[10px] uppercase",
									children: "Subject"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1060,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "font-medium text-foreground",
									children: answeringAssignment.subject || "General"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1063,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1059,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-muted-foreground block text-[10px] uppercase",
									children: "Teacher"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1068,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "font-medium text-foreground",
									children: answeringAssignment.teacher_name || "Teacher"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1071,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1067,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-muted-foreground block text-[10px] uppercase",
									children: "Total Marks"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1076,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "font-semibold font-mono text-foreground",
									children: [answeringAssignment.total_points ?? 100, " Marks"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1079,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1075,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-muted-foreground block text-[10px] uppercase",
									children: "Deadline"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1084,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "font-medium text-foreground",
									children: answeringAssignment.due_date ? fmtDate(answeringAssignment.due_date) : "None"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1087,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1083,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1058,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "text-xs font-semibold text-foreground uppercase tracking-wider block",
								children: "Questions:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1095,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "p-3 bg-muted/30 border rounded text-xs whitespace-pre-wrap font-mono leading-relaxed",
								children: answeringAssignment.questions
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1098,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1094,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (void 0)(Label, {
								className: "text-xs font-semibold text-foreground uppercase tracking-wider",
								children: ["Type Your Answer Here ", /* @__PURE__ */ (void 0)("span", {
									className: "text-destructive",
									children: "*"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1106,
									columnNumber: 41
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1105,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(Textarea, {
								rows: 8,
								placeholder: "Type your answers here...",
								value: submissionAnswerText,
								onChange: (e) => setSubmissionAnswerText(e.target.value),
								className: "font-mono text-xs leading-relaxed"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1108,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1104,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								onClick: () => setAnsweringAssignment(null),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1112,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(Button, {
								onClick: () => submitAnswerMutation.mutate(),
								disabled: !submissionAnswerText.trim() || submitAnswerMutation.isPending,
								children: submitAnswerMutation.isPending ? "Saving..." : "Save Answer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1115,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1111,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1049,
						columnNumber: 35
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1048,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1047,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 513,
		columnNumber: 10
	}, this);
}
//#endregion
export { AssignmentsPage as component };
