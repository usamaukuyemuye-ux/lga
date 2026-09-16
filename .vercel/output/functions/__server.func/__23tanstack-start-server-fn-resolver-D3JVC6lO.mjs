//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-D3JVC6lO.js
var manifest = {
	"07cc230b8ff3fc4fb98b2ea4e3e53b03835cdf7028f66357d34608903a02b98f": {
		functionName: "seedDemoData_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DAU9ESht.mjs")
	},
	"35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240": {
		functionName: "adminListUsers_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DAU9ESht.mjs")
	},
	"363f9bde910a0450fb2363c2086d51dfc3007e168f448e2890c0711f7a281f81": {
		functionName: "adminSetActive_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DAU9ESht.mjs")
	},
	"383c69ebe7c3de2a67cd286820f5fed3f6de5a034af21a6bb758f43874866aa5": {
		functionName: "adminResetPassword_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DAU9ESht.mjs")
	},
	"7112ee1cf0cbede9015f0e18a2217611f7bdbf6ab36f0fccbe3aef15d408c6df": {
		functionName: "queueAttendanceNotification_createServerFn_handler",
		importer: () => import("./_ssr/notify.functions-BtBjnsWH.mjs")
	},
	"75454526e81445e210b3752ed6012b474b177f745b67b452ea06088e76834860": {
		functionName: "adminDeleteUser_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DAU9ESht.mjs")
	},
	"9e2c7b3651fdf5f47a11420a03b87a06f8054b52bbc825f423a1beeb88080ac9": {
		functionName: "adminCreateUser_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-DAU9ESht.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
