"use client";

import { useSize } from "@/hooks/use-size";
import React, { useEffect, useMemo, useRef } from "react";
import { Loader } from "lucide-react";
import { useTimelineThumbnails } from "@/features/video/timeline/api/use-timeline-thumbnails";
import { round } from "@/lib/math";

type TimeLineViewProps = {
  videoFile: File;
  videoElement?: HTMLVideoElement;
};

function TimelineView({ videoFile, videoElement }: TimeLineViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useSize(containerRef);

  const { data: thumbnails, mutate } = useTimelineThumbnails();

  const thumbnailData = useMemo(() => {
    if (!size || !videoElement) {
      return undefined;
    }
    const { videoWidth, videoHeight, duration } = videoElement;
    if (videoWidth === 0 || videoHeight === 0 || duration === 0) {
      throw Error();
    }
    const thumnailWidth = (size.height * videoWidth) / videoHeight;
    const thumnailHeight = (videoHeight / videoWidth) * thumnailWidth;
    const neededFrame = Math.max(Math.ceil(size.width / thumnailWidth), 1);
    const step = round(duration / neededFrame, 2);
    return {
      step,
      neededFrame,
      width: thumnailWidth,
      height: thumnailHeight,
    };
  }, [size, videoElement]);

  useEffect(() => {
    if (thumbnailData?.neededFrame) {
      mutate({
        file: videoFile,
        mime: videoFile.type,
        step: thumbnailData.step,
        neededFrame: thumbnailData?.neededFrame,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate, thumbnailData?.neededFrame, videoFile]);

  const renderThumbnails = () => {
    if (!thumbnailData) {
      return null;
    }
    if (!thumbnails) {
      return [...new Array(thumbnailData.neededFrame)].map(() => (
        <>
          <Loader
            className=""
            width={thumbnailData.width}
            height={thumbnailData.height}
          />
        </>
      ));
    }
    return (
      <>
        {thumbnails.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            width={thumbnailData.width}
            height={thumbnailData.height}
            src={url}
            alt="thumb"
          />
        ))}
      </>
    );
  };

  return (
    <div className="w-full h-full flex" ref={containerRef}>
      {renderThumbnails()}
    </div>
  );
}

export default TimelineView;
