import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-BDsOcMHY.js
var $$splitComponentImporter = () => import("./students-Cu9gZshp.mjs");
var Route = createFileRoute("/_authenticated/students")({
	head: () => ({ meta: [
		{ title: "Students & Parents — SchoolTrack Attendance" },
		{
			name: "description",
			content: "Register and manage student records and parent accounts."
		},
		{
			property: "og:title",
			content: "Students & Parents — SchoolTrack Attendance"
		},
		{
			property: "og:description",
			content: "Register and manage student records and parent accounts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var ACADEMIC_YEARS = [
	"2029-2030",
	"2028-2029",
	"2027-2028",
	"2026-2027",
	"2025-2026",
	"2024-2025",
	"2023-2024",
	"2022-2023",
	"2021-2022",
	"2020-2021",
	"2019-2020",
	"2018-2019",
	"2017-2018",
	"2016-2017",
	"2015-2016"
];
var DEFAULT_ACADEMIC_YEAR = "2025-2026";
//#endregion
export { DEFAULT_ACADEMIC_YEAR as n, Route as r, ACADEMIC_YEARS as t };
