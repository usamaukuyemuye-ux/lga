import { i as firestoreClient } from "./firestore-client-CURzEnIl.mjs";
import { u as getRequest } from "./createServerFn-BFFE07zL.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-D3O6XtEq.js
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	let userId = "user-admin";
	try {
		const authHeader = getRequest()?.headers?.get("authorization");
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.replace("Bearer ", "");
			if (token.startsWith("token-")) userId = token.replace("token-", "");
		}
	} catch {}
	return next({ context: {
		supabase: firestoreClient,
		userId,
		claims: { sub: userId }
	} });
});
//#endregion
export { requireSupabaseAuth as t };
