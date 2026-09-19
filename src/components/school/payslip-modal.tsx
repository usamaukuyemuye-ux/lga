import React from "react";
import { Printer, FileText, CheckCircle2, Building2, User, Calendar, CreditCard, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolLogo } from "@/components/school/logo";
import { fmtDate } from "@/lib/school";

export type SalaryRecord = {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_email?: string | null;
  staff_duty?: string | null;
  staff_role?: string | null;
  staff_phone?: string | null;
  staff_photo_url?: string | null;
  month_year: string; // "YYYY-MM"
  base_amount: number;
  allowances?: number | null;
  deductions?: number | null;
  net_amount: number;
  currency?: string | null;
  payment_method?: string | null;
  payment_date: string;
  reference?: string | null;
  notes?: string | null;
  status: string;
  paid_by?: string | null;
  paid_by_name?: string | null;
  created_at?: string;
};

interface PayslipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salary: SalaryRecord | null;
}

export function formatMonthName(monthYear: string): string {
  if (!monthYear) return "—";
  try {
    const [yearStr, monthStr] = monthYear.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const d = new Date(year, month, 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return monthYear;
  }
}

export function PayslipModal({ open, onOpenChange, salary }: PayslipModalProps) {
  if (!salary) return null;

  const currency = salary.currency || "RWF";
  const base = Number(salary.base_amount || 0);
  const allowances = Number(salary.allowances || 0);
  const deductions = Number(salary.deductions || 0);
  const gross = base + allowances;
  const net = Number(salary.net_amount || gross - deductions);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto printable-modal-content">
        <DialogHeader className="no-print border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Staff Payslip</DialogTitle>
                <DialogDescription className="text-xs">
                  {salary.staff_name} · {formatMonthName(salary.month_year)}
                </DialogDescription>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 cursor-pointer no-print h-8 text-xs"
            >
              <Printer className="size-3.5" />
              <span>Print Payslip</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Payslip Container */}
        <div
          id="official-payslip-print"
          className="print-area bg-white text-slate-900 border rounded-xl p-6 shadow-sm space-y-6 print:border-none print:shadow-none print:p-2"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <SchoolLogo size="md" />
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                  Little Gems Academy
                </h2>
                <p className="text-xs text-slate-500">
                  KG 11 Ave, Kigali, Rwanda · Tel: +250 788 123 456
                </p>
                <p className="text-[11px] text-slate-400">
                  Finance & Payroll Department · bursar@littlegems.ac.rw
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                OFFICIAL PAYSLIP
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1.5">
                {formatMonthName(salary.month_year)}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Ref: {salary.reference || `PAY-${salary.month_year}-${salary.id.slice(-4)}`}
              </p>
            </div>
          </div>

          {/* Employee Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Staff Name
              </span>
              <span className="font-semibold text-slate-800 text-sm block truncate">
                {salary.staff_name}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Duty / Position
              </span>
              <span className="font-medium text-slate-800 block truncate">
                {salary.staff_duty || "Academic Staff"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Contact Phone
              </span>
              <span className="font-medium text-slate-800 block">
                {salary.staff_phone || "+250 780 000 000"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Payment Date
              </span>
              <span className="font-medium text-slate-800 block">
                {salary.payment_date ? fmtDate(salary.payment_date) : fmtDate(new Date())}
              </span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            {/* Earnings */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 border-b flex justify-between">
                <span>Earnings & Additions</span>
                <span>Amount ({currency})</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-800">
                    {base.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Allowances (Transport/Responsibility)</span>
                  <span className="font-semibold text-slate-800">
                    {allowances.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-slate-900">
                  <span>Gross Earnings</span>
                  <span>{gross.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 border-b flex justify-between">
                <span>Statutory Deductions</span>
                <span>Amount ({currency})</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">RSSB & Health Contributions</span>
                  <span className="font-semibold text-slate-800">
                    {deductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Other Deductions</span>
                  <span className="font-semibold text-slate-800">0</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-rose-700">
                  <span>Total Deductions</span>
                  <span>- {deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                Net Disbursed Remuneration
              </span>
              <p className="text-xs text-slate-300">
                Processed via {salary.payment_method?.toUpperCase() || "DIRECT BANK TRANSFER"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tight text-white">
                {currency} {net.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block flex items-center justify-end gap-1">
                <CheckCircle2 className="size-3" /> Paid & Cleared
              </span>
            </div>
          </div>

          {/* Payment Details & Notes */}
          <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border text-slate-600">
            <div className="grid sm:grid-cols-2 gap-2">
              <p>
                <strong className="text-slate-800">Payment Reference:</strong>{" "}
                <span className="font-mono">{salary.reference || "Standard Payroll"}</span>
              </p>
              <p>
                <strong className="text-slate-800">Disbursed By:</strong>{" "}
                {salary.paid_by_name || "Finance Department"}
              </p>
            </div>
            {salary.notes && (
              <p className="pt-1 text-[11px] text-slate-500 italic">
                Note: {salary.notes}
              </p>
            )}
          </div>

          {/* Authorization & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-6">
              <div>
                <div className="h-10 border-b border-slate-400 border-dashed flex items-end">
                  <span className="font-serif italic text-slate-700 text-sm">
                    {salary.paid_by_name || "Peter Habimana"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider pt-1">
                  Bursar / Finance Officer Signature
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-10 border-b border-slate-400 border-dashed flex items-end">
                  <span className="font-serif italic text-slate-700 text-sm">
                    {salary.staff_name}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider pt-1">
                  Employee Acknowledgment Signature
                </p>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center text-[10px] text-slate-400 border-t pt-3">
            This is a computer-generated official payroll voucher of Little Gems Academy. All statutory deductions comply with Rwanda Labor Law.
          </div>
        </div>

        <DialogFooter className="no-print">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs h-8">
            Close
          </Button>
          <Button onClick={handlePrint} className="gap-1.5 text-xs h-8">
            <Printer className="size-3.5" /> Print Payslip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
