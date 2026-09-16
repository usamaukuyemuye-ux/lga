import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { D as Printer, E as QrCode, Z as GraduationCap, dt as Copy, g as ShieldCheck, m as Sparkles, mt as CircleCheck, st as Download, vt as Check } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SchoolLogo } from "./logo-BzveDTdy.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-qr-modal-Bm-lPn7q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var _jsxFileName$1 = "/app/applet/src/components/ui/tabs.tsx";
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 12,
	columnNumber: 3
}, void 0));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 27,
	columnNumber: 3
}, void 0));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 42,
	columnNumber: 3
}, void 0));
TabsContent.displayName = Content.displayName;
var _jsxFileName = "/app/applet/src/components/school/student-qr-modal.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "max-w-2xl overflow-y-auto max-h-[92vh] printable-modal-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, {
					className: "no-print",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 137,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
								className: "text-base font-semibold",
								children: "Printable Student QR Pass & Profile"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 140,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
								className: "text-xs",
								children: ["Official scannable gate attendance credential for ", student.full_name]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 143,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
								value: format,
								onValueChange: (v) => setFormat(v),
								className: "no-print",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, {
									className: "h-8 p-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "badge",
										className: "text-xs px-2.5 h-7",
										children: "ID Badge"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 156,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "sheet",
										className: "text-xs px-2.5 h-7",
										children: "Full Pass Sheet"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 159,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 149,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 134,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 133,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "no-print flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px] gap-1 py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Token:" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-foreground",
								children: qrValue
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 173,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-7 px-2 text-xs gap-1",
							onClick: handleCopyToken,
							title: "Copy QR token string",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3 text-emerald-600" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 182,
								columnNumber: 25
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "size-3" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 182,
								columnNumber: 73
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: copied ? "Copied" : "Copy" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 175,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 170,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-7 text-xs gap-1.5",
							onClick: handleDownloadQr,
							disabled: !qrDataUrl || generating,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Download PNG" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 196,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 188,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							className: "h-7 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs",
							onClick: handlePrint,
							disabled: !qrDataUrl || generating,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 204,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Print Pass" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 205,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 198,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 187,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "py-2",
					children: format === "badge" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						id: "student-qr-card-print",
						className: "print-area mx-auto w-full max-w-[460px] rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-md overflow-hidden print:border-2 print:border-black print:shadow-none print:m-0 print:w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-900 print:bg-slate-900 print:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SchoolLogo, { size: "sm" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "font-bold text-xs tracking-wider uppercase",
										children: "Little Gems Academy"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 223,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] text-slate-300 tracking-tight",
										children: "Official Student Gate Pass · 2025/2026"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 226,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 222,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 220,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "inline-flex items-center gap-1 rounded bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/40",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "size-2.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 233,
											columnNumber: 21
										}, this), " ACTIVE"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 232,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 231,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-4 grid grid-cols-5 gap-3 items-center bg-white",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "col-span-3 space-y-2 pr-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] uppercase font-bold tracking-wider text-slate-500 block",
											children: "Student Name"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 243,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-base font-extrabold text-slate-900 leading-tight",
											children: student.full_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 242,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-2 gap-2 pt-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "bg-slate-50 rounded p-1.5 border border-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[9px] uppercase font-semibold text-slate-500 block",
													children: "Student ID"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 253,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono font-bold text-slate-900 text-[11px]",
													children: student.student_code
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 256,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 252,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "bg-slate-50 rounded p-1.5 border border-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[9px] uppercase font-semibold text-slate-500 block",
													children: "Class"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 261,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-semibold text-slate-900 text-[11px] truncate block",
													children: student.classes?.name || "Unassigned"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 264,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 260,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 251,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[10px] text-slate-600 space-y-0.5 pt-1",
											children: [student.parent_name && /* @__PURE__ */ (void 0)("div", {
												className: "truncate",
												children: [
													/* @__PURE__ */ (void 0)("span", {
														className: "font-semibold text-slate-700",
														children: "Guardian:"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 273,
														columnNumber: 25
													}, this),
													" ",
													student.parent_name
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 272,
												columnNumber: 23
											}, this), student.parent_phone && /* @__PURE__ */ (void 0)("div", {
												className: "truncate font-mono",
												children: [
													/* @__PURE__ */ (void 0)("span", {
														className: "font-semibold text-slate-700",
														children: "Emergency:"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 279,
														columnNumber: 25
													}, this),
													" ",
													student.parent_phone
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 278,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 270,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 241,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center",
									children: [
										qrDataUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
											src: qrDataUrl,
											alt: `QR Code for ${student.full_name}`,
											className: "size-28 sm:size-32 object-contain bg-white rounded border border-slate-300 p-1"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 289,
											columnNumber: 21
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "size-28 sm:size-32 flex items-center justify-center bg-slate-100 rounded border animate-pulse",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-8 text-slate-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 296,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 295,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[9px] font-mono font-bold text-slate-700 mt-1 truncate max-w-full",
											children: student.qr_token || student.student_code
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 299,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[8px] text-slate-500",
											children: "Scan at entrance & exit"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 302,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 287,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 239,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-slate-100 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-600 print:bg-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "size-3 text-emerald-600" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 309,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Verified SchoolTrack Credential" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 310,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 308,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono",
									children: ["ID: ", student.student_code]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 312,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 307,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 214,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						id: "student-qr-sheet-print",
						className: "print-area mx-auto w-full max-w-[500px] rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-md p-6 space-y-4 print:border-2 print:border-black print:shadow-none print:m-0 print:w-full print:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "border-b-2 border-slate-900 pb-3 text-center space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "size-6 text-slate-900" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 324,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
											className: "text-base font-extrabold uppercase tracking-wider text-slate-900",
											children: "Little Gems Academy"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 325,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 323,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] font-semibold text-slate-700 uppercase tracking-widest",
										children: "Official Student Identity & Gate Attendance Pass"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 329,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] text-slate-500 flex items-center justify-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Academic Year 2025/2026" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 333,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 334,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Kigali Campus Front Gate Terminal" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 335,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 332,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 322,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col items-center justify-center py-2 bg-slate-50 rounded-xl border border-slate-200 text-center p-4",
								children: [
									qrDataUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: qrDataUrl,
										alt: `Scannable QR for ${student.full_name}`,
										className: "size-44 object-contain bg-white rounded-lg border-2 border-slate-400 p-2 shadow-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 342,
										columnNumber: 19
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "size-44 flex items-center justify-center bg-slate-100 rounded border animate-pulse",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QrCode, { className: "size-12 text-slate-400" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 349,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 348,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-2 font-mono font-bold text-sm tracking-wider text-slate-900 bg-white px-3 py-0.5 rounded border border-slate-300",
										children: qrValue
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 352,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] text-slate-600 mt-1 max-w-xs leading-tight",
										children: "Hold this QR code directly in front of the school scanner camera to log daily arrival and departure."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 355,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "border rounded-lg overflow-hidden border-slate-300 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
									className: "w-full text-left border-collapse",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
											className: "border-b border-slate-200 bg-slate-50",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-semibold text-slate-600 w-1/3 border-r border-slate-200",
												children: "Student Full Name"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 366,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-bold text-slate-900",
												children: student.full_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 369,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 365,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
											className: "border-b border-slate-200",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Student ID Code"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 372,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-mono font-bold text-slate-900",
												children: student.student_code
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 375,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 371,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
											className: "border-b border-slate-200 bg-slate-50",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Assigned Classroom"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 380,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-medium text-slate-900",
												children: student.classes?.name || "Unassigned"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 383,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 379,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
											className: "border-b border-slate-200",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Gender / Date of Birth"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 388,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "p-2 text-slate-900 capitalize",
												children: [
													student.gender || "—",
													" · ",
													student.date_of_birth || "—"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 391,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 387,
											columnNumber: 21
										}, this),
										student.parent_name && /* @__PURE__ */ (void 0)("tr", {
											className: "border-b border-slate-200 bg-slate-50",
											children: [/* @__PURE__ */ (void 0)("td", {
												className: "p-2 font-semibold text-slate-600 border-r border-slate-200",
												children: "Parent / Guardian"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 397,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("td", {
												className: "p-2 text-slate-900",
												children: [
													student.parent_name,
													" ",
													student.parent_phone ? `(${student.parent_phone})` : ""
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 400,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 396,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 364,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 363,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 362,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1 text-slate-700 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-3 text-emerald-600" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 414,
											columnNumber: 21
										}, this), " Authorized Gate Pass"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 413,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: "Valid for all school terms · Little Gems Academy" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 412,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-right border-t border-slate-400 pt-1 min-w-32",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "block text-[9px] uppercase tracking-wider text-slate-400 font-semibold",
										children: "Authorized Signature"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 419,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 418,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 411,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 317,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 211,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
					className: "no-print gap-2 sm:justify-between border-t pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "size-2 rounded-full bg-emerald-500 inline-block" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 431,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Formatted for standard letter or card printers." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 432,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 430,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => onOpenChange(false),
							children: "Close"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 435,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							onClick: handlePrint,
							disabled: !qrDataUrl || generating,
							className: "gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 444,
								columnNumber: 15
							}, this), "Print Preview"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 438,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 434,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 429,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 132,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 131,
		columnNumber: 5
	}, this);
}
//#endregion
export { TabsTrigger as i, Tabs as n, TabsList as r, StudentQrModal as t };
