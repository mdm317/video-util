import {
  DndContext,
  DragEndEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { useRef, useState } from "react";
import { Overlay } from "./Component/Overlay";
import { SelectionField } from "./Component/SelectionField";
import { useSize } from "@/hooks/use-size";
import { DraggableRangeSelector } from "./Component/DraggableRangeSelector";

const MINIMUM_PX = 20;
function VideoTrimmer() {
  const divRef = useRef<null | HTMLDivElement>(null);
  const rect = useSize(divRef);
  const [leftPx, setLeftPx] = useState(0);
  const [rightPx, setRightPx] = useState(0);

  const sensors = useSensors(useSensor(PointerSensor));

  const restrictMinimumInterval: Modifier = ({ active, transform }) => {
    if (!rect) {
      return transform;
    }
    const containerWidth = rect.width;
    switch (active?.id) {
      case "left":
        const newLeftPx = leftPx + transform.x;
        if (newLeftPx < 0) {
          return {
            ...transform,
            x: -leftPx,
          };
        }
        if (newLeftPx + rightPx + MINIMUM_PX > containerWidth) {
          return {
            ...transform,
            x: containerWidth - rightPx - MINIMUM_PX - leftPx,
          };
        }
        return transform;

      case "right":
        const newRightPx = rightPx - transform.x;
        if (newRightPx < 0) {
          return {
            ...transform,
            x: rightPx,
          };
        }
        if (leftPx + newRightPx + MINIMUM_PX > containerWidth) {
          return {
            ...transform,
            x: leftPx + MINIMUM_PX - containerWidth + rightPx,
          };
        }
        return transform;
    }
    return transform;
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { delta, active } = e;
    switch (active.id) {
      case "left":
        setLeftPx((prev) => prev + delta.x);
        break;
      case "right":
        setRightPx((prev) => prev - delta.x);
        break;
      default:
        break;
    }
  };
  return (
    <div className="h-full w-full relative" ref={divRef}>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[
          restrictToParentElement,
          restrictToHorizontalAxis,
          restrictMinimumInterval,
        ]}
      >
        <Overlay id="left" left={leftPx} />
        <DraggableRangeSelector id="left" left={leftPx} />
        <SelectionField left={leftPx} right={rightPx} />
        <DraggableRangeSelector id="right" right={rightPx} />
        <Overlay id="right" right={rightPx} />
      </DndContext>
    </div>
  );
}

export default VideoTrimmer;
