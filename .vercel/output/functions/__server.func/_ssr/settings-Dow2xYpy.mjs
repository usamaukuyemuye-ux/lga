import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { a as fetchAttendance, s as fetchStudents, t as PageHeader, u as logAudit } from "./school-DlWa798h.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as Save, Y as Image, c as Upload, m as Sparkles, st as Download, vt as Check, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useSchoolLogo, i as saveSchoolLogo, n as processImageFileToDataUrl, r as resetSchoolLogoToDefault, t as SchoolLogo } from "./logo-DWjWTi6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Dow2xYpy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/80 shadow-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4.5 text-primary" }), "School Logo & Branding"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Upload a photo to be used as the official school logo everywhere in the application." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: isCustom ? "default" : "outline",
				className: "text-xs",
				children: isCustom ? "Custom Logo Active" : "Default Academy Logo"
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onDragEnter: handleDrag,
					onDragLeave: handleDrag,
					onDragOver: handleDrag,
					onDrop: handleDrop,
					onClick: () => fileInputRef.current?.click(),
					className: `group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-muted/30"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/png,image/jpeg,image/webp,image/svg+xml",
							onChange: onFileChange,
							className: "hidden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: "Click to browse or drag & drop your school logo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Supports PNG, JPG, WebP, or SVG (square or circular recommended, max 10MB)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "mt-4 pointer-events-none",
							disabled: uploading,
							children: uploading ? "Processing photo…" : "Select photo from computer"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-muted/20 p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-amber-500" }), "Live Preview Everywhere In App"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-background p-3 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mb-2",
									children: "Sidebar / Navigation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, {
										size: "md",
										overrideSrc: currentDisplayUrl
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold truncate",
											children: "Little Gems Academy"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "Admin Portal"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-background p-3 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mb-2",
									children: "Student ID Card"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded bg-gradient-to-r from-blue-700 to-indigo-900 p-2 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, {
										size: "sm",
										overrideSrc: currentDisplayUrl
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold tracking-tight uppercase",
										children: "Little Gems"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-background p-3 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mb-2",
									children: "Login Screen"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, {
										size: "lg",
										overrideSrc: currentDisplayUrl
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold",
										children: "Centered Banner"
									})]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-500" }), "Saved logo automatically synchronizes across all devices and active sessions."]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [(isCustom || previewUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: handleReset,
							disabled: uploading,
							className: "text-xs text-muted-foreground hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5 mr-1" }), "Reset to default"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							onClick: () => fileInputRef.current?.click(),
							disabled: uploading,
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5 mr-1" }), isCustom ? "Change photo" : "Upload photo"]
						})]
					})]
				})
			]
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "School Settings",
				description: "Manage school profile details, official school logo, and system backups."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogoManager, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "School Details"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "These details appear on ID cards, reports and parent notifications." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 p-5",
				children: [[
					["school_name", "School name"],
					["address", "Address"],
					["phone", "Phone"],
					["email", "School email"],
					["notify_email", "Notification sender / reply-to email"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: key,
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: key,
						value: form[key],
						onChange: (e) => setForm({
							...form,
							[key]: e.target.value
						})
					})]
				}, key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => void save(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save school details"]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Backup & Export"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Download a full JSON snapshot of students and attendance records." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => void backup(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download backup"]
			}) })] })
		]
	});
}
//#endregion
export { SettingsPage as component };
