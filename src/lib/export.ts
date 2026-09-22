import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { DEFAULT_LOGO_BASE64 } from "./school-logo-base64";
import { getStoredSchoolLogo } from "./school-logo";

export interface SchoolContactBranding {
  name: string;
  subtitle: string;
  phone: string;
  email: string;
  altEmail?: string;
  address: string;
  website: string;
}

export const SCHOOL_CONTACT: SchoolContactBranding = {
  name: "Little Gems Academy",
  subtitle: "Excellence in Primary Education · Primary School & Academy",
  phone: "+250 781 087 077",
  email: "contact@littlegemsacademy.edu",
  altEmail: "ukuyemuyeusam@gmail.com",
  address: "Kigali, Rwanda",
  website: "lgatest.online",
};

/**
 * Returns a base64 image data URL suitable for embedding in jsPDF documents.
 */
function getSchoolLogoForDoc(): string {
  if (typeof window !== "undefined") {
    try {
      const stored = getStoredSchoolLogo();
      if (stored && stored.startsWith("data:image/")) {
        return stored;
      }
    } catch {
      // Fall back to default
    }
  }
  return DEFAULT_LOGO_BASE64;
}

export function exportPdf(
  title: string,
  head: string[],
  rows: (string | number)[][],
  fileName: string,
  metaSubtitle?: string,
) {
  const isLandscape = head.length > 6;
  const doc = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Draw School Logo
  const logoData = getSchoolLogoForDoc();
  try {
    const format = logoData.includes("png") ? "PNG" : "JPEG";
    doc.addImage(logoData, format, 14, 9, 21, 21);
  } catch (err) {
    console.warn("Could not draw logo on PDF document:", err);
  }

  // 2. Draw School Header & Contact Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(SCHOOL_CONTACT.name.toUpperCase(), 38, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(SCHOOL_CONTACT.subtitle, 38, 20);

  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    `${SCHOOL_CONTACT.address}  |  Phone: ${SCHOOL_CONTACT.phone}  |  Email: ${SCHOOL_CONTACT.email}`,
    38,
    25,
  );
  doc.text(
    `Alt Contact: ${SCHOOL_CONTACT.altEmail}  |  Portal: ${SCHOOL_CONTACT.website}`,
    38,
    29.5,
  );

  // 3. Right Header Info Box
  const rightX = pageWidth - 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text("OFFICIAL ATTENDANCE REPORT", rightX, 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const formattedDate = new Date().toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${formattedDate}`, rightX, 20, { align: "right" });
  doc.text(`Total Records: ${rows.length}`, rightX, 25, { align: "right" });
  if (metaSubtitle) {
    doc.text(metaSubtitle, rightX, 29.5, { align: "right" });
  }

  // 4. Accent Divider Lines
  doc.setDrawColor(29, 78, 216); // Blue brand color
  doc.setLineWidth(1.4);
  doc.line(14, 33.5, 48, 33.5);

  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.4);
  doc.line(48, 33.5, pageWidth - 14, 33.5);

  // 5. Document / Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 14, 40);

  // 6. Report AutoTable
  autoTable(doc, {
    head: [head],
    body: rows,
    startY: 43,
    styles: {
      fontSize: head.length > 8 ? 7.5 : 8.5,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [29, 78, 216],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: head.length > 8 ? 8 : 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 16 },
    didDrawPage: (data) => {
      // Footer line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

      // Left footer text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Little Gems Academy · Kigali, Rwanda · Tel: ${SCHOOL_CONTACT.phone} · ${SCHOOL_CONTACT.email}`,
        14,
        pageHeight - 6.5,
      );

      // Right page number
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 14,
        pageHeight - 6.5,
        { align: "right" },
      );
    },
  });

  doc.save(`${fileName}.pdf`);
}

export function exportExcel(
  head: string[],
  rows: (string | number)[][],
  fileName: string,
  title?: string,
) {
  const reportTitle = title || "Attendance Report";
  const headerRows: (string | number)[][] = [
    ["LITTLE GEMS ACADEMY - OFFICIAL REPORT"],
    [`Report: ${reportTitle}`],
    [
      `Contact: ${SCHOOL_CONTACT.phone} | ${SCHOOL_CONTACT.email} | ${SCHOOL_CONTACT.altEmail} | Location: ${SCHOOL_CONTACT.address}`,
    ],
    [`Generated: ${new Date().toLocaleString()} | Total Records: ${rows.length}`],
    [],
    head,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(headerRows);

  // Column width formatting
  const colWidths = head.map((h, colIndex) => {
    let maxLen = String(h).length;
    for (const r of rows) {
      const val = r[colIndex];
      if (val !== undefined && val !== null) {
        maxLen = Math.max(maxLen, String(val).length);
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 12), 40) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

