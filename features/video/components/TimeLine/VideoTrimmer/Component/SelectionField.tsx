import { useDraggable } from "@dnd-kit/core";
import { DragableProp } from "../types";

export const SelectionField = ({
  left: _left,
  right: _right,
}: Omit<DragableProp, 'id'>) => {
  const { transform: transformLeft } = useDraggable({ id: "left" });
  const { transform: transformRight } = useDraggable({ id: "right" });

  const left = (_left ?? 0) + (transformLeft?.x ?? 0);
  const right = (_right ?? 0) - (transformRight?.x ?? 0);

  return (
    <div
      className="absolute inset-y-0 pointer-events-none"
      style={{
        left,
        right,
      }}
    >
      <div className="h-full w-full rounded-md bg-primary/10 shadow-sm" />
    </div>
  );
};
