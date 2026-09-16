import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Printer,
  QrCode,
  Download,
  Copy,
  Check,
  GraduationCap,
  ShieldCheck,
  User,
  School,
  Phone,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SchoolLogo } from "@/components/school/logo";

export type StudentProfileForQr = {
  id: string;
  full_name: string;
  student_code: string;
  class_id?: string | null;
  gender?: string | null;
  religion?: string | null;
  date_of_birth?: string | null;
  parent_name?: string | null;
  parent_email?: string | null;
  parent_phone?: string | null;
  address?: string | null;
  photo_url?: string | null;
  qr_token?: string | null;
  classes?: { name: string } | null;
};

interface StudentQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileForQr | null;
}

export function StudentQrModal({ open, onOpenChange, student }: StudentQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<"badge" | "sheet">("badge");
  const [generating, setGenerating] = useState(false);

  const qrValue = student?.qr_token || student?.student_code || "";

  useEffect(() => {
    let active = true;
    if (student && qrValue) {
      setGenerating(true);
      QRCode.toDataURL(qrValue, {
        margin: 1,
        width: 360,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then((url) => {
          if (active) {
            setQrDataUrl(url);
            setGenerating(false);
          }
        })
        .catch((err) => {
          console.error("Failed generating QR code:", err);
          if (active) setGenerating(false);
        });
    } else {
      setQrDataUrl("");
    }
    return () => {
      active = false;
    };
  }, [student, qrValue]);

  const handlePrint = () => {
    document.body.classList.add("printing-modal");
    const cleanup = () => {
      document.body.classList.remove("printing-modal");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => {
      window.print();
      // Fallback cleanup in case afterprint does not fire in all browsers
      setTimeout(cleanup, 1000);
    }, 50);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !student) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${student.student_code}_qr_code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded QR code for ${student.full_name}`);
  };

  const handleCopyToken = () => {
    if (!qrValue) return;
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    toast.success("QR Token copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[92vh] printable-modal-content">
        <DialogHeader className="no-print">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <QrCode className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Printable Student QR Pass & Profile
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Official scannable gate attendance credential for {student.full_name}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Tabs
                value={format}
                onValueChange={(v) => setFormat(v as "badge" | "sheet")}
                className="no-print"
              >
                <TabsList className="h-8 p-0.5">
                  <TabsTrigger value="badge" className="text-xs px-2.5 h-7">
                    ID Badge
                  </TabsTrigger>
                  <TabsTrigger value="sheet" className="text-xs px-2.5 h-7">
                    Full Pass Sheet
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </DialogHeader>

        {/* Action Toolbar (no-print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[11px] gap-1 py-0.5">
              <span>Token:</span>
              <strong className="text-foreground">{qrValue}</strong>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={handleCopyToken}
              title="Copy QR token string"
            >
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl || generating}
            >
              <Download className="size-3.5" />
              <span>Download PNG</span>
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              onClick={handlePrint}
              disabled={!qrDataUrl || generating}
            >
              <Printer className="size-3.5" />
              <span>Print Pass</span>
            </Button>
          </div>
        </div>

        {/* Printable Area - Formatted specifically for @media print defined in CSS */}
        <div className="py-2">
          {format === "badge" ? (
            /* Badge Format (Compact, landscape card suitable for printing on ID card stock or standard paper) */
            <div
              id="student-qr-card-print"
              className="print-area mx-auto w-full max-w-[460px] rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-md overflow-hidden print:border-2 print:border-black print:shadow-none print:m-0 print:w-full"
            >
              {/* Card Header */}
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-900 print:bg-slate-900 print:text-white">
                <div className="flex items-center gap-2.5">
                  <SchoolLogo size="sm" />
                  <div>
                    <div className="font-bold text-xs tracking-wider uppercase">
                      Little Gems Academy
                    </div>
                    <div className="text-[10px] text-slate-300 tracking-tight">
                      Official Student Gate Pass · 2025/2026
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/40">
                    <Sparkles className="size-2.5" /> ACTIVE
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 grid grid-cols-5 gap-3 items-center bg-white">
                {/* Student Details (3 cols) */}
                <div className="col-span-3 space-y-2 pr-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                      Student Name
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {student.full_name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-slate-50 rounded p-1.5 border border-slate-200">
                      <span className="text-[9px] uppercase font-semibold text-slate-500 block">
                        Student ID
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-[11px]">
                        {student.student_code}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded p-1.5 border border-slate-200">
                      <span className="text-[9px] uppercase font-semibold text-slate-500 block">
                        Class
                      </span>
                      <span className="font-semibold text-slate-900 text-[11px] truncate block">
                        {student.classes?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 space-y-0.5 pt-1">
                    {student.parent_name && (
                      <div className="truncate">
                        <span className="font-semibold text-slate-700">Guardian:</span>{" "}
                        {student.parent_name}
                      </div>
                    )}
                    {student.parent_phone && (
                      <div className="truncate font-mono">
                        <span className="font-semibold text-slate-700">Emergency:</span>{" "}
                        {student.parent_phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Container (2 cols) */}
                <div className="col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code for ${student.full_name}`}
                      className="size-28 sm:size-32 object-contain bg-white rounded border border-slate-300 p-1"
                    />
                  ) : (
                    <div className="size-28 sm:size-32 flex items-center justify-center bg-slate-100 rounded border animate-pulse">
                      <QrCode className="size-8 text-slate-400" />
                    </div>
                  )}
                  <span className="text-[9px] font-mono font-bold text-slate-700 mt-1 truncate max-w-full">
                    {student.qr_token || student.student_code}
                  </span>
                  <span className="text-[8px] text-slate-500">Scan at entrance & exit</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-600 print:bg-slate-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-emerald-600" />
                  <span>Verified SchoolTrack Credential</span>
                </div>
                <div className="font-mono">ID: {student.student_code}</div>
              </div>
            </div>
          ) : (
            /* Full Sheet Format (Formal Document Sheet) */
            <div
              id="student-qr-sheet-print"
              className="print-area mx-auto w-full max-w-[500px] rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-md p-6 space-y-4 print:border-2 print:border-black print:shadow-none print:m-0 print:w-full print:p-6"
            >
              {/* Sheet Header */}
              <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="size-6 text-slate-900" />
                  <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900">
                    Little Gems Academy
                  </h2>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-widest">
                  Official Student Identity & Gate Attendance Pass
                </p>
                <div className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
                  <span>Academic Year 2025/2026</span>
                  <span>·</span>
                  <span>Kigali Campus Front Gate Terminal</span>
                </div>
              </div>

              {/* Center QR Code */}
              <div className="flex flex-col items-center justify-center py-2 bg-slate-50 rounded-xl border border-slate-200 text-center p-4">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Scannable QR for ${student.full_name}`}
                    className="size-44 object-contain bg-white rounded-lg border-2 border-slate-400 p-2 shadow-xs"
                  />
                ) : (
                  <div className="size-44 flex items-center justify-center bg-slate-100 rounded border animate-pulse">
                    <QrCode className="size-12 text-slate-400" />
                  </div>
                )}
                <div className="mt-2 font-mono font-bold text-sm tracking-wider text-slate-900 bg-white px-3 py-0.5 rounded border border-slate-300">
                  {qrValue}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 max-w-xs leading-tight">
                  Hold this QR code directly in front of the school scanner camera to log daily
                  arrival and departure.
                </p>
              </div>

              {/* Student Profile Specs Table */}
              <div className="border rounded-lg overflow-hidden border-slate-300 text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                        Student Full Name
                      </td>
                      <td className="p-2 font-bold text-slate-900">{student.full_name}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold text-slate-600 border-r border-slate-200">
                        Student ID Code
                      </td>
                      <td className="p-2 font-mono font-bold text-slate-900">
                        {student.student_code}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-semibold text-slate-600 border-r border-slate-200">
                        Assigned Classroom
                      </td>
                      <td className="p-2 font-medium text-slate-900">
                        {student.classes?.name || "Unassigned"}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold text-slate-600 border-r border-slate-200">
                        Gender / Date of Birth
                      </td>
                      <td className="p-2 text-slate-900 capitalize">
                        {student.gender || "—"} · {student.date_of_birth || "—"}
                      </td>
                    </tr>
                    {student.parent_name && (
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td className="p-2 font-semibold text-slate-600 border-r border-slate-200">
                          Parent / Guardian
                        </td>
                        <td className="p-2 text-slate-900">
                          {student.parent_name}{" "}
                          {student.parent_phone ? `(${student.parent_phone})` : ""}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Validation & Security Notice */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <CheckCircle2 className="size-3 text-emerald-600" /> Authorized Gate Pass
                  </div>
                  <div>Valid for all school terms · Little Gems Academy</div>
                </div>
                <div className="text-right border-t border-slate-400 pt-1 min-w-32">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                    Authorized Signature
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (no-print) */}
        <DialogFooter className="no-print gap-2 sm:justify-between border-t pt-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 inline-block" />
            <span>Formatted for standard letter or card printers.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              disabled={!qrDataUrl || generating}
              className="gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Printer className="size-3.5" />
              Print Preview
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
