import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { DragableProp } from "../types";

export const Overlay = ({ id, left, right }: DragableProp) => {
  const { transform } = useDraggable({ id });
  const width =
    id === "left"
      ? (left ?? 0) + (transform?.x ?? 0)
      : (right ?? 0) - (transform?.x ?? 0);

  return (
    <div
      className={cn(
        "absolute bg-amber-950 h-full",
        id === "left" ? "left-0" : "right-0"
      )}
      style={{ width }}
    ></div>
  );
};
