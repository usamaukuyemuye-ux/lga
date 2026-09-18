import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Pin, Plus, Trash2, ExternalLink, X, Loader2, Calendar, Volume2, VolumeX, BellRing } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/school/ui";
import { fmtDate } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { playChimeSound, isNotificationSoundEnabled, setNotificationSoundEnabled } from "@/lib/notification-sound";

export const Route = createFileRoute("/_authenticated/announcements")({
  head: () => ({
    meta: [
      { title: "School Announcements — Little Gems Academy" },
      {
        name: "description",
        content: "Official Little Gems Academy circulars, notices, and announcements.",
      },
      { property: "og:title", content: "School Announcements — Little Gems Academy" },
      {
        property: "og:description",
        content: "Official Little Gems Academy circulars, notices, and announcements.",
      },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { role, profile, user } = useAuth();
  const qc = useQueryClient();
  const canManage =
    role === "admin" || role === "secretary" || role === "owner" || role === "head_of_studies";

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [actionLabel, setActionLabel] = useState("");
  const [actionUrl, setActionUrl] = useState("");

  const { data: rawAnnouncements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

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

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setNotificationSoundEnabled(next);
    if (next) {
      playChimeSound("announcement");
      toast.success("Announcement chime sound enabled");
    } else {
      toast.info("Announcement chime sound muted");
    }
  };

  const add = useMutation({
    mutationFn: async () => {
      const { error, data } = await supabase
        .from("announcements")
        .insert({
          title: title.trim(),
          body: body.trim(),
          is_pinned: isPinned,
          action_label: actionLabel.trim() || null,
          action_url: actionUrl.trim() || null,
          created_by: user?.id ?? null,
          author_name: profile?.full_name || "School Administration",
          author_role: role || "Staff",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      playChimeSound("announcement");
      setTitle("");
      setBody("");
      setActionLabel("");
      setActionUrl("");
      setIsPinned(false);
      setShowCreateForm(false);
      toast.success("Announcement posted with broadcast chime");
      void qc.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Announcement removed");
      void qc.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const announcementsList = useMemo(() => {
    const list = rawAnnouncements ?? [];
    return [...list].sort((a, b) => {
      const aPinned = a.is_pinned ? 1 : 0;
      const bPinned = b.is_pinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [rawAnnouncements]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="School Announcements"
        description="Official school circulars, notices, and administrative updates."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSound}
              className={cn(
                "h-8 text-xs gap-1.5",
                soundEnabled ? "text-primary border-primary/30" : "text-muted-foreground",
              )}
              title={soundEnabled ? "Notification sound enabled" : "Notification sound muted"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="size-3.5 text-primary" />
                  <span>Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="size-3.5" />
                  <span>Muted</span>
                </>
              )}
            </Button>

            {canManage && (
              <Button
                onClick={() => setShowCreateForm((prev) => !prev)}
                variant={showCreateForm ? "outline" : "default"}
                size="sm"
                className="gap-1.5 h-8 text-xs"
              >
                {showCreateForm ? (
                  <>
                    <X className="size-3.5" /> Close
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" /> Post Announcement
                  </>
                )}
              </Button>
            )}
          </div>
        }
      />

      {/* Creation form for Admin / Secretary / Head of Studies / Owner */}
      {canManage && showCreateForm && (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              New Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. End of Term Examination Schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message Content <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={4}
                placeholder="Write the announcement message details..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="leading-relaxed"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action Button Label (Optional)
                </label>
                <Input
                  placeholder="e.g. View Timetable"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action Link URL (Optional)
                </label>
                <Input
                  placeholder="/timetable or https://..."
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary size-4"
                />
                <Pin className="size-3.5 text-primary" />
                Pin to the top of noticeboard
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => add.mutate()}
                disabled={!title.trim() || !body.trim() || add.isPending}
                size="sm"
                className="gap-2"
              >
                {add.isPending && <Loader2 className="size-4 animate-spin" />}
                Publish Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements Stream */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span>Loading announcements...</span>
        </div>
      ) : announcementsList.length === 0 ? (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-2">
            <Megaphone className="size-8 text-muted-foreground/50" />
            <p className="font-semibold text-foreground">No announcements posted yet</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              School circulars and announcements will appear here once published.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcementsList.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "transition-all",
                item.is_pinned && "border-primary/40 shadow-xs bg-card/60",
              )}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {item.author_name || "School Administration"}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {fmtDate(item.created_at)}
                      </span>
                      {item.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary ml-1">
                          <Pin className="size-3 fill-primary text-primary" /> Pinned
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground pt-0.5">{item.title}</h3>
                  </div>

                  {canManage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                      title="Delete announcement"
                      onClick={() => remove.mutate(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>

                <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {item.body}
                </div>

                {item.action_label && item.action_url && (
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5">
                      <a href={item.action_url} target="_blank" rel="noreferrer">
                        {item.action_label}
                        <ExternalLink className="size-3 ml-0.5" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
