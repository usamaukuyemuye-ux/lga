import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timetable-D6aNC_Sb.js
var $$splitComponentImporter = () => import("./timetable-CHId4p-q.mjs");
var Route = createFileRoute("/_authenticated/timetable")({
	head: () => ({ meta: [
		{ title: "Timetable — SchoolTrack" },
		{
			name: "description",
			content: "Subjects, times, classes and the teacher assigned to each lesson."
		},
		{
			property: "og:title",
			content: "Timetable — SchoolTrack"
		},
		{
			property: "og:description",
			content: "Subjects, times, classes and the teacher assigned to each lesson."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
//#endregion
export { Route as n, DAYS as t };
