import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D3O6XtEq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-4Ko9UcMs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-B7CmVUM2.js
var seedDemoData = createServerFn({ method: "POST" }).handler(createSsrRpc("07cc230b8ff3fc4fb98b2ea4e3e53b03835cdf7028f66357d34608903a02b98f"));
var adminCreateUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("9e2c7b3651fdf5f47a11420a03b87a06f8054b52bbc825f423a1beeb88080ac9"));
var adminResetPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("383c69ebe7c3de2a67cd286820f5fed3f6de5a034af21a6bb758f43874866aa5"));
var adminDeleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("75454526e81445e210b3752ed6012b474b177f745b67b452ea06088e76834860"));
var adminListUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240"));
var adminSetActive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("363f9bde910a0450fb2363c2086d51dfc3007e168f448e2890c0711f7a281f81"));
//#endregion
export { adminSetActive as a, adminResetPassword as i, adminDeleteUser as n, seedDemoData as o, adminListUsers as r, adminCreateUser as t };
