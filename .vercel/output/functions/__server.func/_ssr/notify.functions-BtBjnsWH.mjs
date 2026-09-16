import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D3O6XtEq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notify.functions-BtBjnsWH.js
var queueAttendanceNotification_createServerFn_handler = createServerRpc({
	id: "7112ee1cf0cbede9015f0e18a2217611f7bdbf6ab36f0fccbe3aef15d408c6df",
	name: "queueAttendanceNotification",
	filename: "src/lib/notify.functions.ts"
}, (opts) => queueAttendanceNotification.__executeServer(opts));
var queueAttendanceNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(queueAttendanceNotification_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Eft1CVvx.mjs");
	const { error } = await supabaseAdmin.from("notifications").insert({
		student_id: data.studentId,
		parent_id: data.parentId,
		recipient_email: data.recipientEmail,
		subject: data.subject,
		body: data.body,
		status: "sent"
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { queueAttendanceNotification_createServerFn_handler };
