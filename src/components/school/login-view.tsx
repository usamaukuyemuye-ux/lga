import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoData } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolLogo } from "@/components/school/logo";

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      }
    });

    seedDemoData()
      .catch(() => undefined)
      .finally(() => setSeeding(false));
  }, [navigate]);

  const doSignIn = async (mail: string, pass: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: mail.trim(),
      password: pass,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/dashboard", replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSignIn(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20 dark:bg-background">
      <div className="w-full max-w-md space-y-5">
        {/* 1. School Logo and Name */}
        <div className="flex flex-col items-center text-center">
          <SchoolLogo size="xl" className="mb-2 shadow-xs" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Little Gems Academy</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Primary School & Academy Portal</p>
        </div>

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

              <Button type="submit" className="w-full h-9 text-xs font-semibold" disabled={loading}>
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
                disabled={seeding || loading}
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

        <p className="text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Little Gems Academy · All rights reserved
        </p>
      </div>
    </div>
  );
}
