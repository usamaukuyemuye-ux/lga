import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Upload, RotateCcw, Check, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useSchoolLogo,
  saveSchoolLogo,
  resetSchoolLogoToDefault,
  processImageFileToDataUrl,
  DEFAULT_SCHOOL_LOGO,
} from "@/lib/school-logo";
import { SchoolLogo } from "./logo";

export function SchoolLogoManager() {
  const { logoUrl, isCustom } = useSchoolLogo();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG, or WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Please select an image under 10MB.");
      return;
    }

    try {
      setUploading(true);
      const dataUrl = await processImageFileToDataUrl(file);
      setPreviewUrl(dataUrl);
      await saveSchoolLogo(dataUrl);
      toast.success(
        "School logo updated successfully! It is now active across the entire application.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload school logo. Please try another image.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleReset = async () => {
    if (!isCustom && !previewUrl) {
      toast.info("Already using the default school logo.");
      return;
    }
    try {
      setUploading(true);
      setPreviewUrl(null);
      await resetSchoolLogoToDefault();
      toast.success("Reset to default Little Gems Academy emblem.");
    } catch {
      toast.error("Failed to reset logo.");
    } finally {
      setUploading(false);
    }
  };

  const currentDisplayUrl = previewUrl || logoUrl || DEFAULT_SCHOOL_LOGO;

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4.5 text-primary" />
              School Logo & Branding
            </CardTitle>
            <CardDescription>
              Upload a photo to be used as the official school logo everywhere in the application.
            </CardDescription>
          </div>
          <Badge variant={isCustom ? "default" : "outline"} className="text-xs">
            {isCustom ? "Custom Logo Active" : "Default Academy Logo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* DRAG AND DROP ZONE */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/60 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={onFileChange}
            className="hidden"
          />

          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
            <Upload className="size-7" />
          </div>

          <p className="text-sm font-semibold text-foreground">
            Click to browse or drag & drop your school logo
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports PNG, JPG, WebP, or SVG (square or circular recommended, max 10MB)
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 pointer-events-none"
            disabled={uploading}
          >
            {uploading ? "Processing photo…" : "Select photo from computer"}
          </Button>
        </div>

        {/* LIVE PREVIEWS IN DIFFERENT APP CONTEXTS */}
        <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-amber-500" />
            Live Preview Everywhere In App
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* 1. Header / Navigation Preview */}
            <div className="rounded-lg border bg-background p-3 shadow-2xs">
              <p className="text-[11px] text-muted-foreground mb-2">Sidebar / Navigation</p>
              <div className="flex items-center gap-2.5">
                <SchoolLogo size="md" overrideSrc={currentDisplayUrl} />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">Little Gems Academy</p>
                  <p className="text-[10px] text-muted-foreground">Admin Portal</p>
                </div>
              </div>
            </div>

            {/* 2. Student ID Card / Badge Preview */}
            <div className="rounded-lg border bg-background p-3 shadow-2xs">
              <p className="text-[11px] text-muted-foreground mb-2">Student ID Card</p>
              <div className="flex items-center gap-2 rounded bg-gradient-to-r from-blue-700 to-indigo-900 p-2 text-white">
                <SchoolLogo size="sm" overrideSrc={currentDisplayUrl} />
                <span className="text-[11px] font-bold tracking-tight uppercase">Little Gems</span>
              </div>
            </div>

            {/* 3. Login View Header Preview */}
            <div className="rounded-lg border bg-background p-3 shadow-2xs">
              <p className="text-[11px] text-muted-foreground mb-2">Login Screen</p>
              <div className="flex items-center gap-2">
                <SchoolLogo size="lg" overrideSrc={currentDisplayUrl} />
                <span className="text-xs font-semibold">Centered Banner</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3.5 text-emerald-500" />
            Saved logo automatically synchronizes across all devices and active sessions.
          </div>

          <div className="flex items-center gap-2">
            {(isCustom || previewUrl) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={uploading}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="size-3.5 mr-1" />
                Reset to default
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs"
            >
              <Upload className="size-3.5 mr-1" />
              {isCustom ? "Change photo" : "Upload photo"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
