import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { a as fetchAttendance, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-D7opOoI2.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { C as Save, Y as Image, c as Upload, m as Sparkles, st as Download, vt as Check, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useSchoolLogo, i as saveSchoolLogo, n as processImageFileToDataUrl, r as resetSchoolLogoToDefault, t as SchoolLogo } from "./logo-BzveDTdy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-D1BWl8uw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/school/school-logo-manager.tsx";
function SchoolLogoManager() {
	const { logoUrl, isCustom } = useSchoolLogo();
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [previewUrl, setPreviewUrl] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const handleFile = async (file) => {
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file (PNG, JPG, SVG, or WebP)");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("File is too large. Please select an image under 10MB.");
			return;
		}
		try {
			setUploading(true);
			const dataUrl = await processImageFileToDataUrl(file);
			setPreviewUrl(dataUrl);
			await saveSchoolLogo(dataUrl);
			toast.success("School logo updated successfully! It is now active across the entire application.");
		} catch (err) {
			console.error(err);
			toast.error("Failed to upload school logo. Please try another image.");
		} finally {
			setUploading(false);
		}
	};
	const onFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
		else if (e.type === "dragleave") setDragActive(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	};
	const handleReset = async () => {
		if (!isCustom && !previewUrl) {
			toast.info("Already using the default school logo.");
			return;
		}
		try {
			setUploading(true);
			setPreviewUrl(null);
			await resetSchoolLogoToDefault();
			toast.success("Reset to default Little Gems Academy emblem.");
		} catch {
			toast.error("Failed to reset logo.");
		} finally {
			setUploading(false);
		}
	};
	const currentDisplayUrl = previewUrl || logoUrl || "/little-gems-logo.png";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
		className: "border-border/80 shadow-xs",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, { className: "size-4.5 text-primary" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 102,
					columnNumber: 15
				}, this), "School Logo & Branding"]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 101,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Upload a photo to be used as the official school logo everywhere in the application." }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 105,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 100,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
				variant: isCustom ? "default" : "outline",
				className: "text-xs",
				children: isCustom ? "Custom Logo Active" : "Default Academy Logo"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 109,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 99,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 98,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					onDragEnter: handleDrag,
					onDragLeave: handleDrag,
					onDragOver: handleDrag,
					onDrop: handleDrop,
					onClick: () => fileInputRef.current?.click(),
					className: `group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-muted/30"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/png,image/jpeg,image/webp,image/svg+xml",
							onChange: onFileChange,
							className: "hidden"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 128,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "size-7" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 137,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 136,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm font-semibold text-foreground",
							children: "Click to browse or drag & drop your school logo"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 140,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Supports PNG, JPG, WebP, or SVG (square or circular recommended, max 10MB)"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 143,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "mt-4 pointer-events-none",
							disabled: uploading,
							children: uploading ? "Processing photo…" : "Select photo from computer"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 147,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 116,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-xl border bg-muted/20 p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "size-3.5 text-amber-500" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 161,
							columnNumber: 13
						}, this), "Live Preview Everywhere In App"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 160,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border bg-background p-3 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] text-muted-foreground mb-2",
									children: "Sidebar / Navigation"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 168,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, {
										size: "md",
										overrideSrc: currentDisplayUrl
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 170,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs font-bold truncate",
											children: "Little Gems Academy"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 172,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "Admin Portal"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 173,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 171,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 169,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 167,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border bg-background p-3 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] text-muted-foreground mb-2",
									children: "Student ID Card"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 180,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 rounded bg-gradient-to-r from-blue-700 to-indigo-900 p-2 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, {
										size: "sm",
										overrideSrc: currentDisplayUrl
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 182,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-bold tracking-tight uppercase",
										children: "Little Gems"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 183,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 181,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 179,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg border bg-background p-3 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] text-muted-foreground mb-2",
									children: "Login Screen"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 189,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, {
										size: "lg",
										overrideSrc: currentDisplayUrl
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 191,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-semibold",
										children: "Centered Banner"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 192,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 190,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 188,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 165,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 159,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3.5 text-emerald-500" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 201,
							columnNumber: 13
						}, this), "Saved logo automatically synchronizes across all devices and active sessions."]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 200,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [(isCustom || previewUrl) && /* @__PURE__ */ (void 0)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: handleReset,
							disabled: uploading,
							className: "text-xs text-muted-foreground hover:text-destructive",
							children: [/* @__PURE__ */ (void 0)(RotateCcw, { className: "size-3.5 mr-1" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 215,
								columnNumber: 17
							}, this), "Reset to default"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 207,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "button",
							size: "sm",
							onClick: () => fileInputRef.current?.click(),
							disabled: uploading,
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "size-3.5 mr-1" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 226,
								columnNumber: 15
							}, this), isCustom ? "Change photo" : "Upload photo"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 219,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 205,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 199,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 114,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 97,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/settings.tsx?tsr-split=component";
function SettingsPage() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		school_name: "",
		address: "",
		phone: "",
		email: "",
		notify_email: ""
	});
	const { data } = useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			const { data } = await supabase.from("school_settings").select("*").maybeSingle();
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (data) setForm({
			school_name: data.school_name || "",
			address: data.address || "",
			phone: data.phone || "",
			email: data.email || "",
			notify_email: data.notify_email || ""
		});
	}, [data]);
	const save = async () => {
		const targetId = data?.id || "default";
		const { error } = await supabase.from("school_settings").update(form).eq("id", targetId);
		if (error) {
			toast.error(error.message);
			return;
		}
		await logAudit("settings.update", "school_settings", {});
		toast.success("School details saved");
		qc.invalidateQueries({ queryKey: ["settings"] });
	};
	const backup = async () => {
		const [students, attendance] = await Promise.all([fetchStudents(), fetchAttendance()]);
		const blob = new Blob([JSON.stringify({
			students,
			attendance,
			exportedAt: (/* @__PURE__ */ new Date()).toISOString()
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `schooltrack-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		await logAudit("system.backup", "system", {});
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "School Settings",
				description: "Manage school profile details, official school logo, and system backups."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogoManager, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "text-base",
				children: "School Details"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 85,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "These details appear on ID cards, reports and parent notifications." }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 84,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "space-y-4 p-5",
				children: [[
					["school_name", "School name"],
					["address", "Address"],
					["phone", "Phone"],
					["email", "School email"],
					["notify_email", "Notification sender / reply-to email"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: key,
						children: label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						id: key,
						value: form[key],
						onChange: (e) => setForm({
							...form,
							[key]: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 15
					}, this)]
				}, key, true, {
					fileName: _jsxFileName,
					lineNumber: 91,
					columnNumber: 207
				}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => void save(),
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 99,
						columnNumber: 13
					}, this), " Save school details"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 98,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 90,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "text-base",
				children: "Backup & Export"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 107,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Download a full JSON snapshot of students and attendance records." }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 108,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				onClick: () => void backup(),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 13
				}, this), " Download backup"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 105,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 76,
		columnNumber: 10
	}, this);
}
//#endregion
export { SettingsPage as component };
