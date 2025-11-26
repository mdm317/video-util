'use client'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect, useState
} from "react";
import { useFFmpeg } from "../api/use-ffmpeg";

type FFmpegProgressContextValue = number;

const FFmpegProgressContext = createContext<FFmpegProgressContextValue | null>(
  null
);

export const FFmpegProgressProvider = ({ children }: PropsWithChildren) => {
  const { data: ffmpeg } = useFFmpeg();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ffmpeg) return;

    // const onLog = ({ type, message }: { type: string; message: string }) => {
    //   console.log(`[${type}] ${message}`);
    //   console.log('')
    // };

    const onProgress = ({ progress }: { progress: number }) => {
      setProgress(Number((progress * 100).toFixed(1)));
    };

    // ffmpeg.on("log", onLog);
    ffmpeg.on("progress", onProgress);

    return () => {
      // ffmpeg.off("log", onLog);
      ffmpeg.off("progress", onProgress);
    };
  }, [ffmpeg]);

  return (
    <FFmpegProgressContext.Provider value={progress}>
      {children}
    </FFmpegProgressContext.Provider>
  );
};

export const useFFmpegProgress = () => {
  const context = useContext(FFmpegProgressContext);

  return context;
};
