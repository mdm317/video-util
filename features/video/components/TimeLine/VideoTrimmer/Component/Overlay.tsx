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
        "absolute inset-y-0 pointer-events-none",
        id === "left" ? "left-0" : "right-0"
      )}
      style={{ width }}
    >
      <div
        className={cn(
          "relative h-full w-full backdrop-blur-xs",
       
        )}
      >
        <span
          className={cn(
            "absolute inset-y-0 w-px",
            "bg-primary/40",
            id === "left" ? "right-0" : "left-0"
          )}
        />
      </div>
    </div>
  );
};
