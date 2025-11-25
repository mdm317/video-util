import { useEffect, useState } from "react";

type TimelineIndicatorProp = {
  isPlay: boolean;
  videoElement?: HTMLVideoElement;
};
function TimelineIndicator({ videoElement, isPlay }: TimelineIndicatorProp) {
  const [left, setleft] = useState(0);

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
        style={{
          left: `${left}%`,
        }}
        className={
          "absolute pointer-events-none w-0.5 top-0 bottom-0 bg-red-500/50"
        }
      />

      <div className="absolute bottom-1 left-2 text-xs text-slate-300 font-mono">
        {10}s
      </div>
      <div className="absolute bottom-1 right-2 text-xs text-slate-300 font-mono">
        {20}s
      </div>
      <div
        className="absolute bottom-1 transform translate-x-[-50%] text-xs text-red-300 font-mono"
        style={{ left: `${10}%` }}
      >
        {30}s
      </div>
    </>
  );
}

export default TimelineIndicator;
