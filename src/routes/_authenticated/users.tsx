import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, KeyRound, Trash2, Power, Search, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/school/ui";
import { useAuth } from "@/lib/auth";
import {
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  adminResetPassword,
  adminSetActive,
} from "@/lib/admin.functions";
import { logAudit } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — SchoolTrack Attendance" },
      {
        name: "description",
        content: "Create teacher, secretary and parent accounts and manage their access.",
      },
      { property: "og:title", content: "Users & Roles — SchoolTrack Attendance" },
      {
        property: "og:description",
        content: "Create teacher, secretary and parent accounts and manage their access.",
      },
    ],
  }),
  component: UsersPage,
});

type Role = "admin" | "secretary" | "teacher" | "parent" | "finance";

function UsersPage() {
  const { role: currentRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "parent" as Role,
  });

  const { data: users, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminListUsers(),
  });

  const filteredUsers = useMemo(() => {
    return (users ?? []).filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        u.full_name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone && u.phone.toLowerCase().includes(term));
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const counts = useMemo(() => {
    const list = users ?? [];
    return {
      all: list.length,
      parent: list.filter((u) => u.role === "parent").length,
      teacher: list.filter((u) => u.role === "teacher").length,
      secretary: list.filter((u) => u.role === "secretary").length,
      admin: list.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  const create = useMutation({
    mutationFn: async () => {
      await adminCreateUser({ data: form });
      await logAudit("user.create", "users", { email: form.email, role: form.role });
    },
    onSuccess: () => {
      toast.success(`${form.role === "parent" ? "Parent" : "User"} account created`);
      setOpen(false);
      setForm({ fullName: "", email: "", password: "", phone: "", role: "parent" });
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reset = useMutation({
    mutationFn: async (userId: string) => {
      const password = prompt("New password (min 6 characters)");
      if (!password) return;
      await adminResetPassword({ data: { userId, password } });
      await logAudit("user.reset_password", "users", { userId });
    },
    onSuccess: () => toast.success("Password updated"),
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async (v: { userId: string; active: boolean }) => {
      await adminSetActive({ data: v });
      await logAudit("user.toggle_active", "users", v);
    },
    onSuccess: () => {
      toast.success("Account updated");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (userId: string) => {
      await adminDeleteUser({ data: { userId } });
      await logAudit("user.delete", "users", { userId });
    },
    onSuccess: () => {
      toast.success("User deleted");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users & Roles"
        description="Administrators and secretaries can create teacher, secretary, and parent accounts and manage access."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="size-4" /> Create account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create user account</DialogTitle>
                <DialogDescription>
                  Create parent, teacher, or administrative accounts with immediate login access.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm({ ...form, role: v as Role })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent (Family Portal)</SelectItem>
                      <SelectItem value="teacher">Teacher (Class Rosters)</SelectItem>
                      <SelectItem value="secretary">Secretary (Front Desk & Gate)</SelectItem>
                      {currentRole === "admin" && (
                        <>
                          <SelectItem value="finance">Finance Officer</SelectItem>
                          <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fn">Full name *</Label>
                  <Input
                    id="fn"
                    placeholder="e.g. John Doe"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="em">Email address *</Label>
                  <Input
                    id="em"
                    type="email"
                    placeholder="e.g. parent@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw">Initial Password (min 6 characters) *</Label>
                  <Input
                    id="pw"
                    type="text"
                    placeholder="e.g. Parent123"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">Phone number (optional)</Label>
                  <Input
                    id="ph"
                    placeholder="+250 788 123 456"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => create.mutate()}
                  disabled={
                    !form.email || form.password.length < 6 || !form.fullName || create.isPending
                  }
                >
                  Create {form.role} account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Controls: Search & Role Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto">
              <Button
                variant={roleFilter === "all" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setRoleFilter("all")}
              >
                All ({counts.all})
              </Button>
              <Button
                variant={roleFilter === "parent" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setRoleFilter("parent")}
              >
                Parents ({counts.parent})
              </Button>
              <Button
                variant={roleFilter === "teacher" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setRoleFilter("teacher")}
              >
                Teachers ({counts.teacher})
              </Button>
              <Button
                variant={roleFilter === "secretary" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setRoleFilter("secretary")}
              >
                Secretaries ({counts.secretary})
              </Button>
              <Button
                variant={roleFilter === "admin" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setRoleFilter("admin")}
              >
                Admins ({counts.admin})
              </Button>
            </div>
          </div>

          {isError && (
            <p className="text-sm text-destructive">
              Only administrators and secretaries can view this page.
            </p>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium text-sm">{u.full_name}</TableCell>
                    <TableCell className="text-xs">{u.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "destructive"
                            : u.role === "parent"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs capitalize"
                      >
                        {u.role ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.active ? "default" : "secondary"}>
                        {u.active ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Reset password"
                        onClick={() => reset.mutate(u.id)}
                      >
                        <KeyRound className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Activate / deactivate"
                        onClick={() => toggle.mutate({ userId: u.id, active: !u.active })}
                      >
                        <Power className="size-4" />
                      </Button>
                      {currentRole === "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => del.mutate(u.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredUsers.length && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      <Users className="mx-auto size-8 text-muted-foreground/50 mb-2" />
                      No user accounts found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
