import { o as __toESM } from "../_runtime.mjs";
import { t as DEMO_ACCOUNTS } from "./firestore-client-CURzEnIl.mjs";
import { t as supabase } from "./client-CNmXIlzH.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-hSns5Wa1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)({
	session: null,
	user: null,
	role: null,
	profile: null,
	loading: true,
	refresh: async () => {},
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [role, setRole] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async (uid, userEmail) => {
		if (!uid) {
			setRole(null);
			setProfile(null);
			return;
		}
		const email = (userEmail ?? "").toLowerCase().trim();
		const demo = DEMO_ACCOUNTS.find((a) => a.id === uid || email && a.email.toLowerCase() === email);
		let resolvedRole = demo ? demo.role : null;
		let resolvedProf = demo ? {
			id: demo.id,
			full_name: demo.name,
			email: demo.email,
			phone: "+250 780 000 000",
			active: true
		} : null;
		if (!resolvedRole && (email === "usamaukuyemuye@gmail.com" || email.includes("admin"))) resolvedRole = "admin";
		try {
			const [{ data: roles }, { data: prof }] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", uid), supabase.from("profiles").select("id, full_name, email, phone, active").eq("id", uid).maybeSingle()]);
			const fetchedRole = roles?.[0]?.role ?? null;
			if (fetchedRole) resolvedRole = fetchedRole;
			if (prof) resolvedProf = prof;
		} catch {}
		setRole(resolvedRole);
		setProfile(resolvedProf);
	};
	(0, import_react.useEffect)(() => {
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
	const value = {
		session,
		user: session?.user ?? null,
		role,
		profile,
		loading,
		refresh: async () => load(session?.user?.id, session?.user?.email),
		signOut: async () => {
			await supabase.auth.signOut();
			setRole(null);
			setProfile(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
var useAuth = () => (0, import_react.useContext)(AuthContext);
var roleLabel = {
	admin: "Administrator",
	secretary: "Secretary",
	teacher: "Teacher",
	parent: "Parent",
	finance: "Finance Officer",
	owner: "School Owner",
	head_of_studies: "Head of Studies",
	student: "Student (P6)"
};
//#endregion
export { roleLabel as n, useAuth as r, AuthProvider as t };
