import { ceil } from "@/lib/math";
import { RefObject, useRef, useState, VideoHTMLAttributes } from "react";

type UseVideoReturn = {
  controls:
    | (VideoHTMLAttributes<HTMLVideoElement> & {
        ref: RefObject<HTMLVideoElement | null>;
      })
    | null;
  isPlay: boolean;
  pause: () => void;
  play: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
};
type UseVideoOption = VideoHTMLAttributes<HTMLVideoElement> & {
  endSeconds?: number;
  startSeconds?: number;
};

export const useVideoControl = (option: UseVideoOption): UseVideoReturn => {
  const [isPlay, setIsPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const endSeconds = option?.endSeconds;
  const startSeconds = option?.startSeconds;

  const registerEndHandler = () => {
    if (endSeconds == null) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const stopWhenEnd: VideoFrameRequestCallback = (_, metaData) => {
      if (metaData.mediaTime >= endSeconds) {
        videoElement.currentTime = endSeconds;
        videoElement.pause();
        return;
      }
      videoElement.requestVideoFrameCallback(stopWhenEnd);
    };
    videoElement.requestVideoFrameCallback(stopWhenEnd);
  };

  return {
    controls: {
      ref: videoRef,
      onPlay: (e) => {
        setIsPlay(true);
        option?.onPlay?.(e);
        registerEndHandler();
      },
      onPause: () => {
        setIsPlay(false);
      },
      onEnded: (e) => {
        option?.onEnded?.(e);
      },
    },
    isPlay,
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    togglePlay: () => {
      if (!videoRef.current) {
        return;
      }
      if (isPlay) {
        videoRef.current.pause();
      } else {
        if (
          endSeconds != null &&
          ceil(videoRef.current.currentTime, 2) >= endSeconds
        ) {
          console.log("sss");
          videoRef.current.currentTime = startSeconds ?? 0;
        }
        videoRef.current.play();
      }
    },
  };
};
