import { t as supabase } from "./client-CNmXIlzH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/device-notifications-BMIcetfI.js
var COOKIE_NAME = "lga_device_id";
var STORAGE_KEY = "lga_device_id";
function getCookie(name) {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
	return match ? decodeURIComponent(match[3]) : null;
}
function setCookie(name, value, days = 365) {
	if (typeof document === "undefined") return;
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
function getOrCreateDeviceId() {
	if (typeof window === "undefined") return "server";
	let deviceId = getCookie(COOKIE_NAME);
	if (deviceId) {
		try {
			localStorage.setItem(STORAGE_KEY, deviceId);
		} catch (e) {}
		return deviceId;
	}
	try {
		const fromStorage = localStorage.getItem(STORAGE_KEY);
		if (fromStorage) {
			setCookie(COOKIE_NAME, fromStorage);
			return fromStorage;
		}
	} catch (e) {}
	deviceId = "dev_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
	setCookie(COOKIE_NAME, deviceId);
	try {
		localStorage.setItem(STORAGE_KEY, deviceId);
	} catch (e) {}
	return deviceId;
}
async function registerDeviceNotification(role) {
	if (typeof window === "undefined") return;
	const deviceId = getOrCreateDeviceId();
	const pushGranted = "Notification" in window && Notification.permission === "granted";
	try {
		await supabase.from("device_registrations").upsert({
			id: deviceId,
			device_id: deviceId,
			user_agent: navigator.userAgent,
			platform: navigator.platform || "Web",
			push_enabled: pushGranted,
			role: role || "guest",
			last_seen: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "id" });
	} catch (e) {
		console.debug("Device notification registration noted:", e);
	}
}
function dispatchLocalNotification(title, body, actionUrl) {
	if (typeof window === "undefined" || !("Notification" in window)) return;
	if (Notification.permission === "granted") try {
		const notif = new Notification(`💎 Little Gems Academy: ${title}`, {
			body: body.slice(0, 160),
			icon: "/little-gems-logo.png",
			badge: "/little-gems-logo.png"
		});
		if (actionUrl) notif.onclick = () => {
			window.focus();
			window.location.href = actionUrl;
		};
	} catch (e) {
		console.warn("Notification dispatch failed:", e);
	}
}
function getReadAnnouncementIds() {
	if (typeof window === "undefined") return /* @__PURE__ */ new Set();
	try {
		const raw = localStorage.getItem("read_announcements");
		return raw ? new Set(JSON.parse(raw)) : /* @__PURE__ */ new Set();
	} catch (e) {
		return /* @__PURE__ */ new Set();
	}
}
//#endregion
export { getReadAnnouncementIds as n, registerDeviceNotification as r, dispatchLocalNotification as t };
