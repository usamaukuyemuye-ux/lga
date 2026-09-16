import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/school/ui";
import { fmtDate, fmtTime } from "@/lib/school";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications Log — SchoolTrack" },
      {
        name: "description",
        content: "History of attendance notifications sent to parents.",
      },
      { property: "og:title", content: "Notifications Log — SchoolTrack" },
      {
        property: "og:description",
        content: "History of attendance notifications sent to parents.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: emailData, isLoading: loadingEmail } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*, students(full_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Notifications Log"
        description="Review attendance alert emails dispatched to parents."
      />

      <div className="space-y-3">
        {(emailData ?? []).map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{n.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    To {n.recipient_email} · {n.students?.full_name ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={n.status === "sent" ? "default" : "secondary"}
                    className="capitalize text-[10px]"
                  >
                    {n.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {fmtDate(n.created_at)} · {fmtTime(n.created_at)}
                  </p>
                </div>
              </div>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">
                {n.body}
              </pre>
            </CardContent>
          </Card>
        ))}
        {!emailData?.length && !loadingEmail && (
          <Card className="p-8 text-center border-dashed">
            <Mail className="size-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No email notifications dispatched yet.</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              When attendance alerts are sent to parents, records will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
