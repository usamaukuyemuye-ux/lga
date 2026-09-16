import { a as seedInitialData, t as DEMO_ACCOUNTS } from "./firestore-client-CURzEnIl.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D3O6XtEq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DAU9ESht.js
var seedDemoData_createServerFn_handler = createServerRpc({
	id: "07cc230b8ff3fc4fb98b2ea4e3e53b03835cdf7028f66357d34608903a02b98f",
	name: "seedDemoData",
	filename: "src/lib/admin.functions.ts"
}, (opts) => seedDemoData.__executeServer(opts));
var seedDemoData = createServerFn({ method: "POST" }).handler(seedDemoData_createServerFn_handler, async () => {
	await seedInitialData();
	return {
		ok: true,
		accounts: DEMO_ACCOUNTS.map((u) => ({
			email: u.email,
			password: u.password,
			role: u.role
		}))
	};
});
async function assertAdminOrSecretary(supabase, userId) {
	const [adminRes, secRes] = await Promise.all([supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	}), supabase.rpc("has_role", {
		_user_id: userId,
		_role: "secretary"
	})]);
	if (!adminRes.data && !secRes.data) throw new Error("Only administrators and secretaries can manage user accounts.");
}
var adminCreateUser_createServerFn_handler = createServerRpc({
	id: "9e2c7b3651fdf5f47a11420a03b87a06f8054b52bbc825f423a1beeb88080ac9",
	name: "adminCreateUser",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminCreateUser.__executeServer(opts));
var adminCreateUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminCreateUser_createServerFn_handler, async ({ data, context }) => {
	await assertAdminOrSecretary(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Eft1CVvx.mjs");
	const id = `user-${Date.now()}`;
	await supabaseAdmin.from("profiles").upsert({
		id,
		full_name: data.fullName,
		email: data.email,
		phone: data.phone ?? null,
		active: true
	});
	await supabaseAdmin.from("user_roles").upsert({
		user_id: id,
		role: data.role
	}, { onConflict: "user_id,role" });
	return { id };
});
var adminResetPassword_createServerFn_handler = createServerRpc({
	id: "383c69ebe7c3de2a67cd286820f5fed3f6de5a034af21a6bb758f43874866aa5",
	name: "adminResetPassword",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminResetPassword.__executeServer(opts));
var adminResetPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminResetPassword_createServerFn_handler, async ({ data, context }) => {
	await assertAdminOrSecretary(context.supabase, context.userId);
	return { ok: true };
});
var adminDeleteUser_createServerFn_handler = createServerRpc({
	id: "75454526e81445e210b3752ed6012b474b177f745b67b452ea06088e76834860",
	name: "adminDeleteUser",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteUser.__executeServer(opts));
var adminDeleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminDeleteUser_createServerFn_handler, async ({ data, context }) => {
	await assertAdminOrSecretary(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Eft1CVvx.mjs");
	await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
	await supabaseAdmin.from("profiles").delete().eq("id", data.userId);
	return { ok: true };
});
var adminListUsers_createServerFn_handler = createServerRpc({
	id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
	name: "adminListUsers",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
var adminListUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(adminListUsers_createServerFn_handler, async ({ context }) => {
	await assertAdminOrSecretary(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Eft1CVvx.mjs");
	const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name, email, phone, active, created_at").order("created_at", { ascending: false });
	const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
	const roleMap = new Map((roles ?? []).map((r) => [r.user_id, r.role]));
	return (profiles ?? []).map((p) => ({
		...p,
		role: roleMap.get(p.id) ?? null
	}));
});
var adminSetActive_createServerFn_handler = createServerRpc({
	id: "363f9bde910a0450fb2363c2086d51dfc3007e168f448e2890c0711f7a281f81",
	name: "adminSetActive",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetActive.__executeServer(opts));
var adminSetActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminSetActive_createServerFn_handler, async ({ data, context }) => {
	await assertAdminOrSecretary(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Eft1CVvx.mjs");
	await supabaseAdmin.from("profiles").update({ active: data.active }).eq("id", data.userId);
	return { ok: true };
});
//#endregion
export { adminCreateUser_createServerFn_handler, adminDeleteUser_createServerFn_handler, adminListUsers_createServerFn_handler, adminResetPassword_createServerFn_handler, adminSetActive_createServerFn_handler, seedDemoData_createServerFn_handler };
