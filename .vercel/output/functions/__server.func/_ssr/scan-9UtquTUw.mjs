import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-9UtquTUw.js
var $$splitComponentImporter = () => import("./scan-XUd2K1v_.mjs");
var Route = createFileRoute("/_authenticated/scan")({
	validateSearch: (search) => ({ tab: search["tab"] === "staff" ? "staff" : "students" }),
	head: () => ({ meta: [
		{ title: "QR Scanner — SchoolTrack Attendance" },
		{
			name: "description",
			content: "Scan a student ID card to record attendance instantly."
		},
		{
			property: "og:title",
			content: "QR Scanner — SchoolTrack Attendance"
		},
		{
			property: "og:description",
			content: "Scan a student ID card to record attendance instantly."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
