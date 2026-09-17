import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { D as Printer, E as QrCode, Z as GraduationCap, dt as Copy, g as ShieldCheck, m as Sparkles, mt as CircleCheck, st as Download, vt as Check } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SchoolLogo } from "./logo-DWjWTi6G.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-qr-modal-Df1TaQ-t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function StudentQrModal({ open, onOpenChange, student }) {
	const [qrDataUrl, setQrDataUrl] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [format, setFormat] = (0, import_react.useState)("badge");
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const qrValue = student?.qr_token || student?.student_code || "";
	(0, import_react.useEffect)(() => {
		let active = true;
		if (student && qrValue) {
			setGenerating(true);
			import_lib.toDataURL(qrValue, {
				margin: 1,
				width: 360,
				errorCorrectionLevel: "H",
				color: {
					dark: "#000000",
					light: "#ffffff"
				}
			}).then((url) => {
				if (active) {
					setQrDataUrl(url);
					setGenerating(false);
				}
			}).catch((err) => {
				console.error("Failed generating QR code:", err);
				if (active) setGenerating(false);
			});
		} else setQrDataUrl("");
		return () => {
			active = false;
		};
	}, [student, qrValue]);
	const handlePrint = () => {
		document.body.classList.add("printing-modal");
		const cleanup = () => {
			document.body.classList.remove("printing-modal");
			window.removeEventListener("afterprint", cleanup);
		};
		window.addEventListener("afterprint", cleanup);
		setTimeout(() => {
			window.print();
			setTimeout(cleanup, 1e3);
		}, 50);
	};
	const handleDownloadQr = () => {
		if (!qrDataUrl || !student) return;
		const link = document.createElement("a");
		link.href = qrDataUrl;
		link.download = `${student.student_code}_qr_code.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success(`Downloaded QR code for ${student.full_name}`);
	};
	const handleCopyToken = () => {
		if (!qrValue) return;
		navigator.clipboard.writeText(qrValue);
		setCopied(true);
		toast.success("QR Token copied to clipboard");
		setTimeout(() => setCopied(false), 2e3);
	};
	if (!student) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl overflow-y-auto max-h-[92vh] printable-modal-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "no-print",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-semibold",
								children: "Printable Student QR Pass & Profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
								className: "text-xs",
								children: ["Official scannable gate attendance credential for ", student.full_name]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
								value: format,
								onValueChange: (v) => setFormat(v),
								className: "no-print",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "h-8 p-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "badge",
										className: "text-xs px-2.5 h-7",
										children: "ID Badge"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "sheet",
										className: "text-xs px-2.5 h-7",
										children: "Full Pass Sheet"
									})]
								})
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px] gap-1 py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Token:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: qrValue
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-7 px-2 text-xs gap-1",
							onClick: handleCopyToken,
							title: "Copy QR token string",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-7 text-xs gap-1.5",
							onClick: handleDownloadQr,
							disabled: !qrDataUrl || generating,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download PNG" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "h-7 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs",
							onClick: handlePrint,
							disabled: !qrDataUrl || generating,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print Pass" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-2",
					children: format === "badge" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "student-qr-card-print",
						className: "print-area mx-auto w-full max-w-[460px] rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-md overflow-hidden print:border-2 print:border-black print:shadow-none print:m-0 print:w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-900 print:bg-slate-900 print:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-xs tracking-wider uppercase",
										children: "Little Gems Academy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-300 tracking-tight",
										children: "Official Student Gate Pass · 2025/2026"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-2.5" }), " ACTIVE"]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 grid grid-cols-5 gap-3 items-center bg-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-3 space-y-2 pr-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold tracking-wider text-slate-500 block",
											children: "Student Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base font-extrabold text-slate-900 leading-tight",
											children: student.full_name
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 pt-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-slate-50 rounded p-1.5 border border-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] uppercase font-semibold text-slate-500 block",
													children: "Student ID"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-slate-900 text-[11px]",
													children: student.student_code
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-slate-50 rounded p-1.5 border border-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] uppercase font-semibold text-slate-500 block",
													children: "Class"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-slate-900 text-[11px] truncate block",
													children: student.classes?.name || "Unassigned"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-slate-600 space-y-0.5 pt-1",
											children: [student.parent_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-slate-700",
														children: "Guardian:"
													}),
													" ",
													student.parent_name
												]
											}), student.parent_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate font-mono",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-slate-700",
														children: "Emergency:"
													}),
													" ",
													student.parent_phone
												]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center",
									children: [
										qrDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: qrDataUrl,
											alt: `QR Code for ${student.full_name}`,
											className: "size-28 sm:size-32 object-contain bg-white rounded border border-slate-300 p-1"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-28 sm:size-32 flex items-center justify-center bg-slate-100 rounded border animate-pulse",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-8 text-slate-400" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-mono font-bold text-slate-700 mt-1 truncate max-w-full",
											children: student.qr_token || student.student_code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[8px] text-slate-500",
											children: "Scan at entrance & exit"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-slate-100 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-600 print:bg-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified SchoolTrack Credential" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono",
									children: ["ID: ", student.student_code]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "student-qr-sheet-print",
						className: "print-area mx-auto w-full max-w-[500px] rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-md p-6 space-y-4 print:border-2 print:border-black print:shadow-none print:m-0 print:w-full print:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b-2 border-slate-900 pb-3 text-center space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-6 text-slate-900" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-extrabold uppercase tracking-wider text-slate-900",
											children: "Little Gems Academy"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-slate-700 uppercase tracking-widest",
										children: "Official Student Identity & Gate Attendance Pass"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-500 flex items-center justify-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Academic Year 2025/2026" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kigali Campus Front Gate Terminal" })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center py-2 bg-slate-50 rounded-xl border border-slate-200 text-center p-4",
								children: [
									qrDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: qrDataUrl,
										alt: `Scannable QR for ${student.full_name}`,
										className: "size-44 object-contain bg-white rounded-lg border-2 border-slate-400 p-2 shadow-xs"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-44 flex items-center justify-center bg-slate-100 rounded border animate-pulse",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-12 text-slate-400" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 font-mono font-bold text-sm tracking-wider text-slate-900 bg-white px-3 py-0.5 rounded border border-slate-300",
										children: qrValue
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-600 mt-1 max-w-xs leading-tight",
										children: "Hold this QR code directly in front of the school scanner camera to log daily arrival and departure."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border rounded-lg overflow-hidden border-slate-300 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full text-left border-collapse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-slate-200 bg-slate-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-semibold text-slate-600 w-1/3 border-r border-slate-200",
												children: "Student Full Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-bold text-slate-900",
												children: student.full_name
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-slate-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Student ID Code"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-mono font-bold text-slate-900",
												children: student.student_code
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-slate-200 bg-slate-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Assigned Classroom"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-medium text-slate-900",
												children: student.classes?.name || "Unassigned"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-slate-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Gender / Date of Birth"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-2 text-slate-900 capitalize",
												children: [
													student.gender || "—",
													" · ",
													student.date_of_birth || "—"
												]
											})]
										}),
										student.parent_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-slate-200 bg-slate-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Parent / Guardian"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-2 text-slate-900",
												children: [
													student.parent_name,
													" ",
													student.parent_phone ? `(${student.parent_phone})` : ""
												]
											})]
										})
									] })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-slate-700 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-emerald-600" }), " Authorized Gate Pass"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Valid for all school terms · Little Gems Academy" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right border-t border-slate-400 pt-1 min-w-32",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[9px] uppercase tracking-wider text-slate-400 font-semibold",
										children: "Authorized Signature"
									})
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "no-print gap-2 sm:justify-between border-t pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-500 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Formatted for standard letter or card printers." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => onOpenChange(false),
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handlePrint,
							disabled: !qrDataUrl || generating,
							className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), "Print Preview"]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { TabsTrigger as i, Tabs as n, TabsList as r, StudentQrModal as t };
