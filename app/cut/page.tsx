"use client";

import { useMemo, useState } from "react";
import { FileInput, FileUploader } from "@/components/ui/file-upload";
import TimeLineView from "@/features/video/components/TimeLine/TimeLineView";
import { round } from "@/lib/math";
import TrimInfo from "./component/trim-info";
import TimeIndicator from "./component/time-indicator";
import VideoTrimmer from "@/features/video/components/TimeLine/video-trimmer";

export default function CutPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setVideoCurrentTime(video.currentTime);
  };
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const videoUrl = useMemo(() => file && URL.createObjectURL(file), [file]);
  const [videoElement, setVideoElement] = useState<
    undefined | HTMLVideoElement
  >(undefined);

  const [rangePercent, setRangePercent] = useState<[number, number]>([0, 100]);

  const startSeconds = videoElement
    ? round((videoElement.duration * rangePercent[0]) / 100, 1)
    : null;

  const endSeconds = videoElement
    ? round((videoElement.duration * rangePercent[1]) / 100, 1)
    : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <FileUploader
        value={[]}
        onValueChange={(files) => {
          if (files) {
            setFile(files[0]);
          }
        }}
        dropzoneOptions={{
          accept: {
            "video/*": [],
          },
          maxFiles: 1,
          multiple: false,
        }}
        reSelect
        className="flex flex-col gap-3"
      >
        <FileInput className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 bg-muted/30 text-center transition-colors hover:border-muted-foreground/80">
          <div className="flex flex-col items-center justify-center gap-2 px-6 text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              {file
                ? "다른 영상을 선택하려면 클릭 또는 드래그"
                : "여기에 영상을 업로드하세요"}
            </span>
            <span className="text-xs">
              MP4, MOV 등 표준 영상 포맷을 지원합니다. 최대 1개의 파일을 선택할
              수 있습니다.
            </span>
            {file && (
              <span className="text-xs text-muted-foreground/80">
                현재 선택된 파일: {file.name}
              </span>
            )}
          </div>
        </FileInput>
      </FileUploader>

      {file && videoUrl && (
        <div className="flex w-full flex-col gap-4">
          <video
            onTimeUpdate={handleTimeUpdate}
            key={videoUrl}
            src={videoUrl}
            controls
            className="aspect-video w-full rounded-lg border border-muted"
            onLoadedData={(e) => {
              setVideoElement(e.currentTarget);
            }}
          >
            <track kind="captions" />
          </video>
          <TrimInfo startSeconds={startSeconds} endSeconds={endSeconds} />
          <div className="h-14 overflow-hidden relative">
            <div className="absolute h-full w-full top-0 left-0">
              <TimeLineView videoFile={file} videoElement={videoElement} />
            </div>
            <div className="absolute h-full w-full top-0 left-0">
              <VideoTrimmer
                rangePercent={rangePercent}
                setRangePercent={setRangePercent}
              />
            </div>
            <TimeIndicator />
          </div>
        </div>
      )}
    </div>
  );
}
