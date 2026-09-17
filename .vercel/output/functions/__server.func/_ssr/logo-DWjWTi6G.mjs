import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { Q as Gem } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-DWjWTi6G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_SCHOOL_LOGO = "/little-gems-logo.png";
var STORAGE_KEY = "school_custom_logo";
var EVENT_NAME = "school_logo_updated";
/**
* Get the currently cached logo URL synchronously
*/
function getStoredSchoolLogo() {
	if (typeof window === "undefined") return DEFAULT_SCHOOL_LOGO;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && saved.trim()) return saved;
	} catch {}
	return DEFAULT_SCHOOL_LOGO;
}
/**
* Hook to reactively get the active school logo anywhere in the application.
*/
function useSchoolLogo() {
	const [logoUrl, setLogoUrl] = (0, import_react.useState)(DEFAULT_SCHOOL_LOGO);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const cached = getStoredSchoolLogo();
		if (cached && cached !== "/little-gems-logo.png") setLogoUrl(cached);
		const handleUpdate = (e) => {
			const customEvent = e;
			if (customEvent.detail) setLogoUrl(customEvent.detail);
			else setLogoUrl(getStoredSchoolLogo());
		};
		const handleStorage = (e) => {
			if (e.key === STORAGE_KEY) setLogoUrl(e.newValue || "/little-gems-logo.png");
		};
		window.addEventListener(EVENT_NAME, handleUpdate);
		window.addEventListener("storage", handleStorage);
		let active = true;
		(async () => {
			try {
				setIsLoading(true);
				const { data } = await supabase.from("school_settings").select("logo_url").maybeSingle();
				if (active && data?.logo_url) {
					setLogoUrl(data.logo_url);
					try {
						localStorage.setItem(STORAGE_KEY, data.logo_url);
					} catch {}
				}
			} catch (err) {
				console.warn("Could not load school logo from settings:", err);
			} finally {
				if (active) setIsLoading(false);
			}
		})();
		return () => {
			active = false;
			window.removeEventListener(EVENT_NAME, handleUpdate);
			window.removeEventListener("storage", handleStorage);
		};
	}, []);
	return {
		logoUrl: logoUrl || "/little-gems-logo.png",
		isCustom: Boolean(logoUrl && logoUrl !== "/little-gems-logo.png"),
		isLoading
	};
}
/**
* Resize and compress an image file to a data URL (max 512x512) for fast persistence
*/
async function processImageFileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read image file"));
		reader.onload = (e) => {
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Invalid image format"));
			img.onload = () => {
				const maxDimension = 512;
				let { width, height } = img;
				if (width > maxDimension || height > maxDimension) if (width > height) {
					height = Math.round(height * maxDimension / width);
					width = maxDimension;
				} else {
					width = Math.round(width * maxDimension / height);
					height = maxDimension;
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) return resolve(e.target?.result);
				ctx.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/png", .9));
			};
			img.src = e.target?.result;
		};
		reader.readAsDataURL(file);
	});
}
/**
* Save new logo to database and local cache, broadcasting to all UI components.
*/
async function saveSchoolLogo(logoDataUrl) {
	try {
		localStorage.setItem(STORAGE_KEY, logoDataUrl);
	} catch (err) {
		console.warn("Local storage full, saving to database only", err);
	}
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: logoDataUrl }));
	try {
		const { data: existing } = await supabase.from("school_settings").select("id").maybeSingle();
		const targetId = existing?.id || "default";
		await supabase.from("school_settings").upsert({
			id: targetId,
			logo_url: logoDataUrl,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (err) {
		console.error("Failed to update school logo in database:", err);
		throw err;
	}
}
/**
* Reset logo back to the school default
*/
async function resetSchoolLogoToDefault() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {}
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_SCHOOL_LOGO }));
	try {
		const { data: existing } = await supabase.from("school_settings").select("id").maybeSingle();
		const targetId = existing?.id || "default";
		await supabase.from("school_settings").upsert({
			id: targetId,
			logo_url: null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (err) {
		console.warn("Could not reset logo in database:", err);
	}
}
function SchoolLogo({ className, size = "md", showText = false, subtitle = "Primary School & Academy", textClassName, darkText = false, overrideSrc }) {
	const { logoUrl } = useSchoolLogo();
	const activeSrc = overrideSrc || logoUrl;
	const [imgError, setImgError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setImgError(false);
	}, [activeSrc]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("relative shrink-0 overflow-hidden rounded-xl bg-transparent transition-transform hover:scale-105", {
				sm: "size-8",
				md: "size-10",
				lg: "size-12",
				xl: "size-16"
			}[size]),
			children: !imgError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: activeSrc,
				alt: "Little Gems Academy Logo",
				className: "size-full rounded-xl object-contain",
				onError: () => setImgError(true),
				suppressHydrationWarning: true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-full items-center justify-center rounded-xl bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: size === "sm" ? "size-4" : size === "lg" ? "size-6" : size === "xl" ? "size-8" : "size-5" })
			})
		}), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("min-w-0 flex-1 leading-tight", textClassName),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block font-bold tracking-tight", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", size === "xl" && "text-xl", darkText ? "text-foreground" : "text-inherit"),
				children: "Little Gems Academy"
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block text-xs font-medium opacity-75 truncate", darkText ? "text-muted-foreground" : "text-inherit/75"),
				children: subtitle
			})]
		})]
	});
}
//#endregion
export { useSchoolLogo as a, saveSchoolLogo as i, processImageFileToDataUrl as n, resetSchoolLogoToDefault as r, SchoolLogo as t };
