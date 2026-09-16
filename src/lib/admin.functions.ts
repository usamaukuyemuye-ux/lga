import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEMO_ACCOUNTS, seedInitialData } from "@/integrations/firebase/seed";

type Role = "admin" | "secretary" | "teacher" | "parent" | "finance" | "owner";

export const seedDemoData = createServerFn({ method: "POST" }).handler(async () => {
  await seedInitialData();
  return {
    ok: true,
    accounts: DEMO_ACCOUNTS.map((u) => ({
      email: u.email,
      password: u.password,
      role: u.role,
    })),
  };
});

async function assertAdminOrSecretary(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> },
  userId: string,
) {
  const [adminRes, secRes] = await Promise.all([
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabase.rpc("has_role", { _user_id: userId, _role: "secretary" }),
  ]);
  if (!adminRes.data && !secRes.data) {
    throw new Error("Only administrators and secretaries can manage user accounts.");
  }
}

export const adminCreateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: { email: string; password: string; fullName: string; phone?: string; role: Role }) => d,
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrSecretary(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = `user-${Date.now()}`;
    await supabaseAdmin.from("profiles").upsert({
      id,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone ?? null,
      active: true,
    });
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: id, role: data.role }, { onConflict: "user_id,role" });
    return { id };
  });

export const adminResetPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; password: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdminOrSecretary(context.supabase as never, context.userId);
    return { ok: true };
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdminOrSecretary(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    await supabaseAdmin.from("profiles").delete().eq("id", data.userId);
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrSecretary(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, phone, active, created_at")
      .order("created_at", { ascending: false });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const roleMap = new Map((roles ?? []).map((r: any) => [r.user_id, r.role]));
    return (profiles ?? []).map((p: any) => ({ ...p, role: roleMap.get(p.id) ?? null }));
  });

export const adminSetActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; active: boolean }) => d)
  .handler(async ({ data, context }) => {
    await assertAdminOrSecretary(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ active: data.active }).eq("id", data.userId);
    return { ok: true };
  });
