import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discipline-Di7qLwEn.js
var $$splitComponentImporter = () => import("./discipline-We4YZQGR.mjs");
var Route = createFileRoute("/_authenticated/discipline")({
	validateSearch: (search) => ({
		studentId: typeof search.studentId === "string" ? search.studentId : void 0,
		view: typeof search.view === "string" ? search.view : void 0
	}),
	head: () => ({ meta: [
		{ title: "Student Discipline & Conduct — Little Gems Academy" },
		{
			name: "description",
			content: "Track student conduct, punctuality notices, behavioral incidents, and parent acknowledgements."
		},
		{
			property: "og:title",
			content: "Student Discipline & Conduct — Little Gems Academy"
		},
		{
			property: "og:description",
			content: "Track student conduct, punctuality notices, behavioral incidents, and parent acknowledgements."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
