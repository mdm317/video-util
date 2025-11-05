import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { DragableProp } from "../types";

export const DraggableRangeSelector = ({ id, left, right }: DragableProp) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const moveX = transform?.x ?? 0;
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute top-0 bottom-0 w-1 shadow-lg hover:w-1.5 cursor-ew-resize",
        id === "left"
          ? "bg-emerald-500  shadow-emerald-500/50 hover:shadow-emerald-500/70"
          : "bg-violet-500 shadow-violet-500/50 hover:shadow-violet-500/70"
      )}
      // className="absolute inset-y-0 z-20 flex items-center cursor-ew-resize"
      style={{
        left,
        right,
        transform: `translateX(${moveX}px)`,
      }}
      {...listeners}
      {...attributes}
    ></div>
  );
};
