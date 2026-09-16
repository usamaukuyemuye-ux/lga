import { SchoolLogo } from "./logo";

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
            <li>+250 780 000 000</li>
            <li>Kigali, Rwanda</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-foreground">School Hours</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>Monday – Friday · 07:30 – 16:30</li>
            <li>Gate & QR Scanning opens at 07:00</li>
            <li>Weekend: Closed for activities</li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {year} Little Gems Academy. All rights reserved.
      </div>
    </footer>
  );
}
