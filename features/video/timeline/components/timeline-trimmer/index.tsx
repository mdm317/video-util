import { memo, useRef, useState } from "react";
import { useSize } from "@/hooks/use-size";
import { Overlay } from "./components/overlay";
import { DraggableRangeSelector } from "./components/draggable-range-selector";
import { cn } from "@/lib/utils";

const MINIMUM_PERCENT = 3;

type VideoTrimmerProp = {
  rangePercent: [number, number];
  setRangePercent: (range: [number, number] | [number, undefined] | [undefined, number]) => void;
};
type DragId = "left" | "right" | "both";
function VideoTrimmer({ rangePercent, setRangePercent }: VideoTrimmerProp) {
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
      className="h-full w-full relative"
      ref={divRef}
    >
      <Overlay isLeft={true} widthPercent={rangePercent[0]} />
      <DraggableRangeSelector
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "left")}
        isLeft={true}
        left={rangePercent[0]}
      />
      <div
        className={cn("absolute h-full w-fit cursor-grab")}
        style={{
          left: `${rangePercent[0] + 1}%`,
          width: `${rangePercent[1] - rangePercent[0] - 1}%`,
        }}
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "both")}
      ></div>
      <DraggableRangeSelector
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "right")}
        isLeft={false}
        right={100 - rangePercent[1]}
      />
      <Overlay isLeft={false} widthPercent={100 - rangePercent[1]} />
    </div>
  );
}

export default memo(VideoTrimmer);
