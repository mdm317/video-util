import { cn } from "@/lib/utils";

type DraggableRangeSelectorProp = {
  isLeft: boolean;
  left?: number;
  right?: number;
  onMouseDown: (e: React.MouseEvent) => void
};

export const DraggableRangeSelector = ({
  isLeft,
  left,
  right,
  onMouseDown,
}: DraggableRangeSelectorProp) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        "absolute top-0 bottom-0 z-20 flex items-center justify-center w-4 cursor-ew-resize group outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      style={{
        left: left !== undefined ? `${left}%` : undefined,
        right: right !== undefined ? `${right}%` : undefined,
      }}
    >
      <div
        className={cn(
          "h-12 w-1.5 rounded-full transition-colors",
          "bg-white shadow-sm ring-1 ring-black/10",
          "group-hover:bg-gray-100 group-active:bg-gray-200"
        )}
      />
    </div>
  );
};
