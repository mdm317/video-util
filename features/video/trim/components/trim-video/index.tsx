import { useVideo } from "@/hooks/use-video";
import { useState } from "react";
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

type TrimVideoProp = {
  file: File;
};
function TrimVideo({ file }: TrimVideoProp) {
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

  const [startPercent, setStartPercent] = useState(0);
  const [endPercent, setEndPercent] = useState(100);

  const startSeconds = videoElement
    ? (videoElement.duration * startPercent) / 100
    : 0;

  const endSeconds = videoElement
    ? (videoElement.duration * endPercent) / 100
    : 0;

  const handleChangeRange = (
    range: [number, number] | [number, undefined] | [undefined, number],
  ) => {
    if (range[0] != null && range[1] != null) {
      setStartPercent(range[0]);
      setEndPercent(range[1]);
      if (videoElement) {
        setVideoTime((range[0] * videoElement.duration) / 100);
      }
    } else if (range[0] != null) {
      setStartPercent(range[0]);
      if (videoElement) {
        setVideoTime((range[0] * videoElement.duration) / 100);
      }
    } else {
      setEndPercent(range[1]);
      if (videoElement) {
        setVideoTime((range[1] * videoElement.duration) / 100);
      }
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
              rangePercent={[startPercent, endPercent]}
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

export default TrimVideo;
