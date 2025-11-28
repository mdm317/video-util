import { useMemo, useState, VideoHTMLAttributes } from "react";

type UseVideoReturn = {
  props: VideoHTMLAttributes<HTMLVideoElement> | null;
  isPlay: boolean;
  pause: () => void;
  videoElement: HTMLVideoElement | undefined;
  play: () => void;
  setVideoTime: (time: number) => void;
};
type UseVideoOption = {
  onPlay?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onEnded?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
};

export const useVideo = (
  file: File,
  option: UseVideoOption,
): UseVideoReturn => {
  const [isPlay, setIsPlay] = useState(false);
  const [videoElement, setVideoElement] = useState<
    undefined | HTMLVideoElement
  >(undefined);
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);
  return {
    props: {
      src: videoUrl,
      onPlay: (e) => {
        setIsPlay(true);
        option?.onPlay?.(e);
      },
      onPause: () => {
        setIsPlay(false);
      },
      onLoadedData: (e) => {
        setVideoElement(e.currentTarget);
      },
      onEnded: (e) => {
        option?.onEnded?.(e);
      },
    },
    isPlay,
    pause: () => {
      if (videoElement) {
        videoElement.pause();
      }
    },
    play: () => {
      if (videoElement) {
        videoElement.play();
      }
    },
    setVideoTime: (time: number) => {
      if (videoElement) {
        videoElement.currentTime = time;
      }
    },
    videoElement,
  };
};
