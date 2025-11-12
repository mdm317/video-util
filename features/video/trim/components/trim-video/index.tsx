import { useVideo } from "@/hooks/use-video";
import { useEffect, useState } from "react";
import { round } from "@/lib/math";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

import {
  TimelineIndicator,
  TimelineView,
  TimelineTrimmer,
} from "@/features/video/timeline";
import TrimInfo from "./components/trim-info";
import DownloadTrimVideo from "./components/download-trim-video";
import { useTranslations } from "next-intl";

type TrimVideoProp = {
  file: File;
};
function TrimVideo({ file }: TrimVideoProp) {
  const { isPlay, props, videoElement, pause, setIsPlay, setVideoTime } =
    useVideo(file);
  const t = useTranslations("Trim.controls");

  const onEnded = () => {
    setVideoTime(startSeconds ?? 0);
  };

  const [rangePercent, setRangePercent] = useState<[number, number]>([0, 100]);

  const handleChangeRange = (range: [number, number]) => {
    setRangePercent(range);
    if (videoElement) {
      pause();
      setVideoTime((range[0] * videoElement.duration) / 100);
    }
  };

  const startSeconds = videoElement
    ? round((videoElement.duration * rangePercent[0]) / 100, 1)
    : 0;

  const endSeconds = videoElement
    ? round((videoElement.duration * rangePercent[1]) / 100, 1)
    : 0;

  useEffect(() => {
    if (!videoElement) {
      return;
    }
    const stopWhenEnd = () => {
      if (!videoElement) {
        return;
      }
      if (videoElement.paused) {
        return;
      }
      if (endSeconds && videoElement.currentTime >= endSeconds) {
        videoElement.pause();
        return;
      }
      videoElement.requestVideoFrameCallback(stopWhenEnd);
    };
    if (isPlay) {
      videoElement.requestVideoFrameCallback(stopWhenEnd);
    }
  }, [endSeconds, isPlay, videoElement, setVideoTime, startSeconds]);

  const handlePlay = () => {
    if (isPlay) {
      setIsPlay(false);
    } else {
      if (videoElement && endSeconds && videoElement.currentTime > endSeconds) {
        setVideoTime(startSeconds ?? 0);
      }
      setIsPlay(true);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex w-full flex-col gap-4">
        <video
          {...props}
          controls
          onEnded={onEnded}
          className="aspect-video w-full rounded-lg border border-muted"
        ></video>
        <TrimInfo startSeconds={startSeconds} endSeconds={endSeconds} />
        <div className="h-14 overflow-hidden relative">
          <div className="absolute h-full w-full top-0 left-0">
            <TimelineView videoFile={file} videoElement={videoElement} />
          </div>
          <div className="absolute h-full w-full top-0 left-0">
            <TimelineTrimmer
              rangePercent={rangePercent}
              setRangePercent={handleChangeRange}
            />
          </div>
          <TimelineIndicator videoElement={videoElement} isPlay={isPlay} />
        </div>
        <div className="flex gap-3">
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

export default TrimVideo;
