import { useDraggable } from "@dnd-kit/core";
import { DragableProp } from "../types";

export const DraggableRangeSelector = ({ id, left, right }: DragableProp) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const moveX = transform?.x ?? 0;
  return (
    <div
      ref={setNodeRef}
      className="absolute w-2 h-full z-10"
      style={{
        left,
        right,
        transform: `translateX(${moveX}px)`,
      }}
      {...listeners}
      {...attributes}
    >
      {id}
    </div>
  );
};
