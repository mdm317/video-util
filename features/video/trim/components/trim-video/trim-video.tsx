import { useVideo } from "@/hooks/use-video";
import { ceil, round } from "@/lib/math";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

import {
  TimelineIndicator,
  TimelineView,
  TimelineTrimmer,
} from "@/features/video/timeline";
import TrimInfo from "./components/trim-info";
import DownloadTrimVideo from "./components/download-trim-video";
import { useTranslations } from "next-intl";
import { useTrimRange } from "./hooks/use-trim-range";
import type { TrimRangePercentPatch } from "@/features/video/trim/types";

type TrimVideoProp = {
  file: File;
};
export function TrimVideo({ file }: TrimVideoProp) {
  const { isPlay, props, videoElement, pause, play, setVideoTime } = useVideo(
    file,
    {
      onPlay: (e) => {
        const videoElement = e.currentTarget;
        const stopWhenEnd: VideoFrameRequestCallback = (_, metaData) => {
          if (metaData.mediaTime >= endSeconds) {
            videoElement.currentTime = endSeconds;
            videoElement.pause();
            return;
          }
          videoElement.requestVideoFrameCallback(stopWhenEnd);
        };
        videoElement.requestVideoFrameCallback(stopWhenEnd);
      },
      onEnded: () => {
        setVideoTime(startSeconds ?? 0);
      },
    },
  );
  const t = useTranslations("Trim.controls");

  const { startPercent, endPercent, rangePercent, setRangePercent } =
    useTrimRange();

  const startSeconds = videoElement
    ? (videoElement.duration * startPercent) / 100
    : 0;

  const endSeconds = videoElement
    ? (videoElement.duration * endPercent) / 100
    : 0;

  const handleChangeRange = (range: TrimRangePercentPatch) => {
    setRangePercent(range);
    if (videoElement) {
      const seekPercent = range[0] != null ? range[0] : range[1];
      setVideoTime((seekPercent * videoElement.duration) / 100);
    }
  };

  const handlePlay = () => {
    if (isPlay) {
      pause();
    } else {
      if (
        videoElement &&
        endSeconds &&
        ceil(videoElement.currentTime, 2) >= endSeconds
      ) {
        videoElement.currentTime = startSeconds;
      }
      play();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex w-full flex-col gap-8">
        <video
          {...props}
          controls
          className="aspect-video w-full rounded-lg border border-muted"
        ></video>
        <TrimInfo
          startSeconds={round(startSeconds, 1)}
          endSeconds={round(endSeconds, 1)}
        />
        <div className="h-28 relative pt-3">
          <div className="absolute h-full w-full top-0 left-0 overflow-hidden">
            <TimelineView videoFile={file} videoElement={videoElement} />
          </div>
          <div className="absolute h-full w-full top-0 left-0">
            <TimelineTrimmer
              rangePercent={rangePercent}
              setRangePercent={handleChangeRange}
              duration={videoElement?.duration}
            />
          </div>
          <TimelineIndicator videoElement={videoElement} isPlay={isPlay} />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (videoElement) {
                videoElement.currentTime = startSeconds;
                play();
              }
            }}
            variant="outline"
            className="h-12 w-14 flex-none"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={handlePlay}
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
      </div>
    </div>
  );
}
