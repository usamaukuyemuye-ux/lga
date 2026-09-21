import { SchoolLogo } from "./logo";
import { openCookiePreferencesModal } from "./cookie-banner";
import { ShieldCheck, Cookie, Bell } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3">
        <div>
          <SchoolLogo size="md" showText={true} subtitle="Excellence in Primary Education" />
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Attendance monitoring, announcements, student ID cards, and parent communications.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-foreground">Support & Inquiries</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>contact@littlegemsacademy.edu</li>
            <li>ukuyemuyeusam@gmail.com</li>
            <li>+250 781 087 077</li>
            <li>Kigali, Rwanda</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-foreground">School Hours & Gate</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>Monday – Friday · 07:30 – 16:30</li>
            <li>Gate & QR Scanning opens at 07:00</li>
            <li>Weekend: Closed for activities</li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span>© {year} Little Gems Academy. All rights reserved.</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="size-3.5" /> Portal Security Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={openCookiePreferencesModal}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Cookie className="size-3.5" /> Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
