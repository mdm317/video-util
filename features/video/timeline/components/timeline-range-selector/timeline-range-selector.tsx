import { memo, useRef, useState } from "react";
import { useSize } from "@/hooks/use-size";
import { Overlay } from "./components/overlay";
import { DraggableRangeSelector } from "./components/draggable-range-selector";
import { cn } from "@/lib/utils/cn";
import type { TrimRangePercent } from "@/features/video/trim/types";

const MINIMUM_PERCENT = 3;

type TimelineRangeSelectorProp = {
  range: TrimRangePercent;
  onChange: (range: TrimRangePercent) => void;
  labels?: {
    start?: string;
    end?: string;
  };
};

type DragId = "left" | "right" | "both";
function TimelineRangeSelector({
  range,
  onChange,
  labels,
}: TimelineRangeSelectorProp) {
  const divRef = useRef<null | HTMLDivElement>(null);
  const rect = useSize(divRef);

  const [dragId, setDragId] = useState<null | DragId>(null);
  const [originCordinateX, setOriginCordinateX] = useState(0);
  const [originRange, setOriginRange] = useState<[number, number]>([0, 100]);

  const onMouseDown = (e: React.MouseEvent, id: DragId) => {
    setDragId(id);
    setOriginCordinateX(e.clientX);
    setOriginRange(range);
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
          originRange[1] - MINIMUM_PERCENT,
        );
        onChange([newLeftPercent, range[1]]);
        break;
      }
      case "right": {
        const newRightPercent = Math.max(
          Math.min(originRange[1] + movePercent, 100),
          originRange[0] + MINIMUM_PERCENT,
        );
        onChange([range[0], newRightPercent]);
        break;
      }
      case "both": {
        onChange([
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
      data-testid="timeline-range-selector"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="h-full w-full relative"
      ref={divRef}
    >
      <Overlay isLeft={true} widthPercent={range[0]} />
      <DraggableRangeSelector
        testId="left-drag"
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "left")}
        left={range[0]}
        time={labels?.start}
        showTime={dragId === "left" || dragId === "both"}
      />
      <div
        className={cn(
          "absolute h-full z-10 cursor-grab",
          "ring-4 ring-foreground bg-foreground/10",
        )}
        style={{
          left: `${range[0]}%`,
          width: `${range[1] - range[0]}%`,
        }}
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "both")}
      ></div>
      <DraggableRangeSelector
        testId="right-drag"
        onMouseDown={(e: React.MouseEvent) => onMouseDown(e, "right")}
        right={100 - range[1]}
        time={labels?.end}
        showTime={dragId === "right" || dragId === "both"}
      />
      <Overlay isLeft={false} widthPercent={100 - range[1]} />
    </div>
  );
}

export default memo(TimelineRangeSelector);
