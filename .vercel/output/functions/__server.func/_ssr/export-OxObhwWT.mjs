import { o as __toESM } from "../_runtime.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
import { n as writeFileSync, t as utils } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-OxObhwWT.js
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
function exportPdf(title, head, rows, fileName) {
	const doc = new import_jspdf_node_min.default({ orientation: head.length > 6 ? "landscape" : "portrait" });
	doc.setFontSize(16);
	doc.text(title, 14, 16);
	doc.setFontSize(10);
	doc.text((/* @__PURE__ */ new Date()).toLocaleString(), 14, 22);
	autoTable(doc, {
		head: [head],
		body: rows,
		startY: 28,
		styles: { fontSize: 9 },
		headStyles: { fillColor: [
			29,
			78,
			216
		] }
	});
	doc.save(`${fileName}.pdf`);
}
function exportExcel(head, rows, fileName) {
	const ws = utils.aoa_to_sheet([head, ...rows]);
	const wb = utils.book_new();
	utils.book_append_sheet(wb, ws, "Report");
	writeFileSync(wb, `${fileName}.xlsx`);
}
//#endregion
export { exportPdf as n, exportExcel as t };
