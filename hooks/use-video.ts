import { useMemo, useState, VideoHTMLAttributes } from "react";

type UseVideoReturn = {
  props: VideoHTMLAttributes<HTMLVideoElement> | null;
  isPlay: boolean;
  pause: () => void;
  videoElement: HTMLVideoElement | undefined;
  setIsPlay: (play: boolean) => void;
  setVideoTime: (time: number) => void;
};

export const useVideo = (file: File): UseVideoReturn => {
  const [isPlay, setIsPlay] = useState(false);
  const [videoElement, setVideoElement] = useState<
    undefined | HTMLVideoElement
  >(undefined);
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);
  return {
    props: {
      src: videoUrl,
      onPlay: () => {
        setIsPlay(true);
      },
      onPause: () => {
        setIsPlay(false);
      },
      onLoadedData: (e) => {
        setVideoElement(e.currentTarget);
      },
    },
    isPlay,
    pause: () => {
      if (videoElement) {
        videoElement.pause();
      }
    },
    setIsPlay: (play: boolean) => {
      if (play) {
        videoElement?.play();
      } else {
        videoElement?.pause();
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
