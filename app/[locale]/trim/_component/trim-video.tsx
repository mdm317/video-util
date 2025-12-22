import { useState, useMemo } from "react";
import { round } from "@/lib/math";
import { formatTime } from "@/lib/utils/format-time";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

import {
  TimelineIndicator,
  TimelineView,
  TimelineRangeSelector,
} from "@/features/video/timeline";
import { useTranslations } from "next-intl";
import type { TrimRangePercent } from "@/features/video/trim/types";
import { DownloadTrimVideo, TrimInfo } from "@/features/video/trim";
import { useVideoControl } from "@/features/video/hooks/use-video-control";

type TrimVideoProp = {
  file: File;
};

export function TrimVideo({ file }: TrimVideoProp) {
  const t = useTranslations("Trim.controls");

  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [videoMeta, setVideoMeta] = useState<null | HTMLVideoElement>(null);
  const duration = videoMeta?.duration ?? 0;

  const [range, setRange] = useState<TrimRangePercent>([0, 100]);
  const handleChangeRange = (newRange: TrimRangePercent) => {
    setRange(range);
    if (range[0] === newRange[0]) {
      const videoTime = (range[1] * duration) / 100;
      seek(videoTime);
      return;
    }
    const videoTime = (range[0] * duration) / 100;
    seek(videoTime);
    return;
  };

  const startSeconds = (duration * range[0]) / 100;
  const endSeconds = (duration * range[1]) / 100;

  const { isPlay, controls, play, seek, togglePlay } = useVideoControl({
    onEnded: () => {
      seek(startSeconds ?? 0);
    },
    endSeconds,
  });
  const videoElement = controls?.ref.current;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex w-full flex-col gap-8">
        <video
          src={videoUrl}
          onLoadedData={(e) => {
            setVideoMeta(e.currentTarget);
          }}
          {...controls}
          controls
          className="aspect-video w-full rounded-lg border border-muted"
        ></video>
        <TrimInfo
          startSeconds={round(startSeconds, 1)}
          endSeconds={round(endSeconds, 1)}
        />
        {videoMeta && videoElement ? (
          <>
            <div className="h-28 relative pt-3">
              <div className="absolute h-full w-full top-0 left-0 overflow-hidden">
                <TimelineView videoFile={file} videoMeta={videoMeta} />
              </div>
              <div className="absolute h-full w-full top-0 left-0">
                <TimelineRangeSelector
                  range={range}
                  onChange={handleChangeRange}
                  labels={{
                    start: formatTime(startSeconds),
                    end: formatTime(endSeconds),
                  }}
                />
              </div>
              <TimelineIndicator videoElement={videoElement} isPlay={isPlay} />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  seek(startSeconds);
                  play();
                }}
                variant="outline"
                className="h-12 w-14 flex-none"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                onClick={togglePlay}
                variant="outline"
                className="flex-1 h-12"
              >
                {isPlay ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    {t("pause")}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    {t("play")}
                  </>
                )}
              </Button>
              <DownloadTrimVideo
                endSeconds={endSeconds}
                startSeconds={startSeconds}
                file={file}
                label={t("export")}
                loadingLabel={t("exporting")}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
