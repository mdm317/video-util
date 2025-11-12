import { round } from "@/lib/math";
import React from "react";

type TrimInfoProp = {
  startSeconds: number | null;
  endSeconds: number | null;
};
function TrimInfo({ startSeconds, endSeconds }: TrimInfoProp) {
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
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Start Time
        </p>
        <p className="text-2xl font-bold text-emerald-400">{startTimeStr}s</p>
      </div>
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Duration
        </p>
        <p className="text-2xl font-bold text-blue-400">{durationStr}s</p>
      </div>
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          End Time
        </p>
        <p className="text-2xl font-bold text-violet-400">{endTimeStr}s</p>
      </div>
    </div>
  );
}

export default TrimInfo;
