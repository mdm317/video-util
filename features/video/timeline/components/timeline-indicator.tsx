import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils/format-time";

type TimelineIndicatorProp = {
  isPlay: boolean;
  videoElement?: HTMLVideoElement;
};
function TimelineIndicator({ videoElement, isPlay }: TimelineIndicatorProp) {
  const [left, setleft] = useState(0);
  const currentTime = videoElement?.currentTime ?? 0;

  useEffect(() => {
    const settingLeft = () => {
      if (!videoElement) {
        return;
      }
      if (videoElement.paused) {
        const newleft =
          (videoElement.currentTime / videoElement.duration) * 100;

        setleft(newleft);
        return;
      }

      const newleft = (videoElement.currentTime / videoElement.duration) * 100;
      setleft(newleft);
      requestAnimationFrame(settingLeft);
    };

    if (isPlay) {
      requestAnimationFrame(settingLeft);
    }
  }, [isPlay, videoElement]);

  return (
    <>
      <div
        className="absolute -top-3 bottom-0 z-30 pointer-events-none flex flex-col items-center group"
        style={{
          left: `${left}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-l-transparent border-r-transparent border-t-red-500 drop-shadow-sm" />
        <div className="w-0.5 flex-1 bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
        {isPlay && (
          <div className="absolute top-full mt-2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
            {formatTime(currentTime)}
          </div>
        )}
      </div>
    </>
  );
}

export default TimelineIndicator;
