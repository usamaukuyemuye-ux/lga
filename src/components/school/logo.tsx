import React, { useState, useEffect } from "react";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchoolLogo } from "@/lib/school-logo";

interface SchoolLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  textClassName?: string;
  darkText?: boolean;
  overrideSrc?: string;
}

export function SchoolLogo({
  className,
  size = "md",
  showText = false,
  subtitle = "Primary School & Academy",
  textClassName,
  darkText = false,
  overrideSrc,
}: SchoolLogoProps) {
  const { logoUrl } = useSchoolLogo();
  const activeSrc = overrideSrc || logoUrl;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [activeSrc]);

  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
    xl: "size-16",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-transparent transition-transform hover:scale-105",
          sizeClasses[size],
        )}
      >
        {!imgError ? (
          <img
            src={activeSrc}
            alt="Little Gems Academy Logo"
            className="size-full rounded-xl object-contain"
            onError={() => setImgError(true)}
            suppressHydrationWarning
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Gem
              className={
                size === "sm"
                  ? "size-4"
                  : size === "lg"
                    ? "size-6"
                    : size === "xl"
                      ? "size-8"
                      : "size-5"
              }
            />
          </div>
        )}
      </div>

      {showText && (
        <div className={cn("min-w-0 flex-1 leading-tight", textClassName)}>
          <span
            className={cn(
              "block font-bold tracking-tight",
              size === "sm" && "text-sm",
              size === "md" && "text-base",
              size === "lg" && "text-lg",
              size === "xl" && "text-xl",
              darkText ? "text-foreground" : "text-inherit",
            )}
          >
            Little Gems Academy
          </span>
          {subtitle && (
            <span
              className={cn(
                "block text-xs font-medium opacity-75 truncate",
                darkText ? "text-muted-foreground" : "text-inherit/75",
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
