import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportPdf(
  title: string,
  head: string[],
  rows: (string | number)[][],
  fileName: string,
) {
  const doc = new jsPDF({ orientation: head.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.text(new Date().toLocaleString(), 14, 22);
  autoTable(doc, {
    head: [head],
    body: rows,
    startY: 28,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [29, 78, 216] },
  });
  doc.save(`${fileName}.pdf`);
}

export function exportExcel(head: string[], rows: (string | number)[][], fileName: string) {
  const ws = XLSX.utils.aoa_to_sheet([head, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
