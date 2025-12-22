import { formatTime } from "@/lib/utils/format-time";
import { useTranslations } from "next-intl";

type TrimInfoProp = {
  startSeconds: number | null;
  endSeconds: number | null;
};
function TrimInfo({ startSeconds, endSeconds }: TrimInfoProp) {
  const t = useTranslations("Trim.info");
  const startTimeStr = formatTime(startSeconds ?? 0);
  const endTimeStr = formatTime(endSeconds ?? 0);
  const durationStr = formatTime(
    startSeconds != null && endSeconds != null
      ? Math.max(0, endSeconds - startSeconds)
      : 0,
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
          {t("start")}
        </p>
        <p className="text-2xl font-bold text-foreground">{startTimeStr}</p>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
          {t("duration")}
        </p>
        <p className="text-2xl font-bold text-foreground">{durationStr}</p>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
          {t("end")}
        </p>
        <p className="text-2xl font-bold text-foreground">{endTimeStr}</p>
      </div>
    </div>
  );
}

export default TrimInfo;
