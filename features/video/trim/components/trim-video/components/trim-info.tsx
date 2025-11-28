import { round } from "@/lib/math";
import { useTranslations } from "next-intl";
import React from "react";

type TrimInfoProp = {
  startSeconds: number | null;
  endSeconds: number | null;
};
function TrimInfo({ startSeconds, endSeconds }: TrimInfoProp) {
  const t = useTranslations("Trim.info");
  const startTimeStr = startSeconds ?? "-";
  const endTimeStr = endSeconds ?? "-";
  const durationStr =
    startSeconds != null
      ? endSeconds != null
        ? round(endSeconds - startSeconds, 1)
        : "-"
      : "-";
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
          {t("start")}
        </p>
        <p className="text-2xl font-bold text-foreground">{startTimeStr}s</p>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
          {t("duration")}
        </p>
        <p className="text-2xl font-bold text-foreground">{durationStr}s</p>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
          {t("end")}
        </p>
        <p className="text-2xl font-bold text-foreground">{endTimeStr}s</p>
      </div>
    </div>
  );
}

export default TrimInfo;
