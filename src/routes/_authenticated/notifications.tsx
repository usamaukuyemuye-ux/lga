import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/school/ui";
import { fmtDate, fmtTime } from "@/lib/school";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Volume2, VolumeX, BellRing } from "lucide-react";
import { toast } from "sonner";
import { playChimeSound, isNotificationSoundEnabled, setNotificationSoundEnabled } from "@/lib/notification-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications Log — Little Gems Academy" },
      {
        name: "description",
        content: "History of attendance notifications sent to parents.",
      },
      { property: "og:title", content: "Notifications Log — Little Gems Academy" },
      {
        property: "og:description",
        content: "History of attendance notifications sent to parents.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(isNotificationSoundEnabled());
    const handlePref = (e: any) => {
      if (typeof e?.detail?.enabled === "boolean") {
        setSoundEnabled(e.detail.enabled);
      }
    };
    window.addEventListener("lga-sound-pref-changed", handlePref);
    return () => window.removeEventListener("lga-sound-pref-changed", handlePref);
  }, []);

  const handleTestChime = () => {
    playChimeSound("notification");
    toast.success("Playing notification chime preview", {
      description: "Sound will play whenever attendance alerts and circulars are delivered.",
    });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setNotificationSoundEnabled(next);
    if (next) {
      playChimeSound("notification");
      toast.success("Notification sound chime enabled");
    } else {
      toast.info("Notification chime muted");
    }
  };

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
        description="Review attendance alert emails dispatched to parents with real-time sound."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSound}
              className={cn(
                "h-8 text-xs gap-1.5",
                soundEnabled ? "text-primary border-primary/30" : "text-muted-foreground",
              )}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="size-3.5 text-primary" />
                  <span>Chime Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="size-3.5" />
                  <span>Muted</span>
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestChime}
              className="h-8 text-xs gap-1.5"
            >
              <BellRing className="size-3.5" />
              <span>Test Chime</span>
            </Button>
          </div>
        }
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
