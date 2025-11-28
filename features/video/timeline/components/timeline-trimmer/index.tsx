import { memo, useRef, useState } from "react";
import { useSize } from "@/hooks/use-size";
import { Overlay } from "./components/overlay";
import { DraggableRangeSelector } from "./components/draggable-range-selector";
import { cn, formatTime } from "@/lib/utils";

const MINIMUM_PERCENT = 3;

type VideoTrimmerProp = {
  rangePercent: [number, number];
  setRangePercent: (range: [number, number] | [number, undefined] | [undefined, number]) => void;
  duration?: number;
};

type DragId = "left" | "right" | "both";
function VideoTrimmer({ rangePercent, setRangePercent, duration = 0 }: VideoTrimmerProp) {
  const divRef = useRef<null | HTMLDivElement>(null);
  const rect = useSize(divRef);

  const [dragId, setDragId] = useState<null | DragId>(null);
  const [originCordinateX, setOriginCordinateX] = useState(0);
  const [originRange, setOriginRange] = useState<[number, number]>([0, 100]);

  const onMouseDown = (e: React.MouseEvent, id: DragId) => {
    setDragId(id);
    setOriginCordinateX(e.clientX);
    setOriginRange(rangePercent);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragId || !rect) {
      return;
    }
    const movePercent = ((e.clientX - originCordinateX) / rect.width) * 100;
    switch (dragId) {
      case "left": {
        const newLeftPercent = Math.min(
          Math.max(originRange[0] + movePercent, 0),
          originRange[1] - MINIMUM_PERCENT
        );
        setRangePercent([newLeftPercent, undefined]);
        break;
      }
      case "right": {
        const newRightPercent = Math.max(
          Math.min(originRange[1] + movePercent, 100),
          originRange[0] + MINIMUM_PERCENT
        );
        setRangePercent([undefined, newRightPercent]);
        break;
      }
      case "both": {
        setRangePercent([
          Math.max(originRange[0] + movePercent, 0),
          Math.min(100, originRange[1] + movePercent),
        ]);
        break;
      }
    }
  };
  const onMouseUp = () => {
    if (dragId) {
      setDragId(null);
    }
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="h-full w-full relative"
      ref={divRef}
    >
      <Overlay isLeft={true} widthPercent={rangePercent[0]} />
      <DraggableRangeSelector
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "left")}
        left={rangePercent[0]}
        time={formatTime((duration * rangePercent[0]) / 100)}
        showTime={dragId === "left" || dragId === "both"}
      />
      <div
        className={cn(
          "absolute h-full z-10 cursor-grab",
          "ring-4 ring-foreground bg-foreground/10"
        )}
        style={{
          left: `${rangePercent[0]}%`,
          width: `${rangePercent[1] - rangePercent[0]}%`,
        }}
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "both")}
      ></div>
      <DraggableRangeSelector
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "right")}
        right={100 - rangePercent[1]}
        time={formatTime((duration * rangePercent[1]) / 100)}
        showTime={dragId === "right" || dragId === "both"}
      />
      <Overlay isLeft={false} widthPercent={100 - rangePercent[1]} />
    </div>
  );
}

export default memo(VideoTrimmer);
