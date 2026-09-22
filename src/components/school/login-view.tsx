import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ArrowRight, LogOut, CheckCircle2, Shield, Lock, Cookie } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoData } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolLogo } from "@/components/school/logo";
import { playChimeSound } from "@/lib/notification-sound";
import { checkLoginRateLimit, recordFailedLoginAttempt, resetLoginAttempts, sanitizeInput } from "@/lib/security";
import { openCookiePreferencesModal } from "@/components/school/cookie-banner";

const demoAccounts = [
  { role: "Administrator", email: "admin@school.com", password: "Admin123" },
  { role: "School Owner", email: "owner@school.com", password: "Owner123" },
  { role: "Head of Studies", email: "headofstudies@school.com", password: "Studies123" },
  { role: "Secretary", email: "secretary@school.com", password: "Secretary123" },
  { role: "Teacher", email: "teacher@school.com", password: "Teacher123" },
  { role: "Finance Officer", email: "finance@school.com", password: "Finance123" },
  { role: "Parent", email: "parent@school.com", password: "Parent123" },
];

export function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(true);
  const [currentSessionUser, setCurrentSessionUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    // Check if an existing session exists for display, but do NOT auto-redirect
    // The login page is always opened first so users can review, switch accounts, or proceed
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setCurrentSessionUser({
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.full_name || data.session.user.email,
        });
      }
    });

    seedDemoData()
      .catch(() => undefined)
      .finally(() => setSeeding(false));
  }, []);

  const [lockoutSec, setLockoutSec] = useState<number | null>(null);

  useEffect(() => {
    if (lockoutSec === null || lockoutSec <= 0) return;
    const timer = setInterval(() => {
      setLockoutSec((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSec]);

  const doSignIn = async (mail: string, pass: string) => {
    const cleanMail = sanitizeInput(mail);

    // 1. Security Check: Rate limiting & brute force protection
    const rateCheck = checkLoginRateLimit(cleanMail);
    if (!rateCheck.allowed) {
      setLockoutSec(rateCheck.waitSeconds || 30);
      toast.error("Account security lockout", {
        description: `Too many failed attempts. Please wait ${rateCheck.waitSeconds || 30} seconds before retrying.`,
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanMail,
      password: pass,
    });
    setLoading(false);

    if (error) {
      const attempt = recordFailedLoginAttempt(cleanMail);
      if (attempt.isLocked) {
        setLockoutSec(attempt.waitSeconds || 30);
        toast.error("Security cooldown active", {
          description: `5 consecutive failed attempts detected. Retries temporarily paused for ${attempt.waitSeconds}s.`,
        });
      } else {
        toast.error(error.message, {
          description: `Security warning: ${attempt.remainingAttempts} login attempt(s) remaining before temporary lockout.`,
        });
      }
      return;
    }

    // Reset failed counter upon successful verification
    resetLoginAttempts(cleanMail);
    playChimeSound("success");
    toast.success("Welcome back", {
      description: "Session authenticated with secure cookie protection.",
    });
    navigate({ to: "/dashboard", replace: true });
  };

  const handleSignOutCurrent = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setCurrentSessionUser(null);
    setLoading(false);
    toast.info("Signed out. Please enter credentials or select an account.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSignIn(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20 dark:bg-background">
      <div className="w-full max-w-md space-y-4">
        {/* 1. School Logo and Name */}
        <div className="flex flex-col items-center text-center">
          <SchoolLogo size="xl" className="mb-2 shadow-xs" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Little Gems Academy</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Primary School & Academy Portal</p>
        </div>

        {/* Existing Active Session Banner (if signed in) */}
        {currentSessionUser && (
          <Card className="border-primary/30 bg-primary/5 shadow-xs">
            <CardContent className="p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    Signed in as {currentSessionUser.name || currentSessionUser.email}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {currentSessionUser.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 h-8 text-xs font-semibold"
                  onClick={() => navigate({ to: "/dashboard", replace: true })}
                >
                  Enter Dashboard
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleSignOutCurrent}
                  disabled={loading}
                >
                  <LogOut className="size-3.5 mr-1 text-muted-foreground" />
                  Switch Account
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 2. Login Form */}
        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-base font-semibold">Sign in</CardTitle>
            <CardDescription className="text-xs">
              Use your school account credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-medium">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.com"
                  autoComplete="email"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-xs font-medium">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-9 text-xs"
                />
              </div>

              {lockoutSec !== null && lockoutSec > 0 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive flex items-center gap-2">
                  <Lock className="size-4 shrink-0" />
                  <span>
                    Temporary lockout active: please wait <strong>{lockoutSec}s</strong> before retrying.
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-9 text-xs font-semibold"
                disabled={loading || (lockoutSec !== null && lockoutSec > 0)}
              >
                {loading ? <Loader2 className="size-3.5 animate-spin mr-2" /> : null}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 3. Demo Accounts */}
        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-2.5 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Demo Accounts
            </CardTitle>
            <CardDescription className="text-xs">
              {seeding ? "Preparing test accounts…" : "Click any account to sign in instantly:"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1.5 pb-4">
            {demoAccounts.map((a) => (
              <button
                key={a.email}
                type="button"
                disabled={seeding || loading || (lockoutSec !== null && lockoutSec > 0)}
                onClick={() => {
                  setEmail(a.email);
                  setPassword(a.password);
                  void doSignIn(a.email, a.password);
                }}
                className="flex items-center justify-between rounded-md border border-border/70 bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-accent hover:border-primary/40 disabled:opacity-50"
              >
                <span className="font-semibold text-foreground">{a.role}</span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {a.email} · {a.password}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Shield className="size-3" /> Encrypted & Protected
          </span>
          <span>·</span>
          <button
            type="button"
            onClick={openCookiePreferencesModal}
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            <Cookie className="size-3" /> Cookie Settings
          </button>
        </div>

        <div className="text-center text-[11px] text-muted-foreground space-y-0.5">
          <p>Support: <span className="font-medium text-foreground">+250 781 087 077</span> · contact@littlegemsacademy.edu</p>
          <p>© {new Date().getFullYear()} Little Gems Academy · All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
