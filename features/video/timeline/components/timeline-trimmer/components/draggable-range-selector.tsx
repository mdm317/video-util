import { cn } from "@/lib/utils";

type DraggableRangeSelectorProp = {
  left?: number;
  right?: number;
  onMouseDown: (e: React.MouseEvent) => void;
  time?: string;
  showTime?: boolean;
};

export const DraggableRangeSelector = ({
  left,
  right,
  onMouseDown,
  time,
  showTime,
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
      {showTime && (
        <div className="absolute select-none -top-8 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
          {time}
        </div>
      )}
      <div
        className={cn(
          "h-12 w-1.5 rounded-full transition-colors",
          "bg-foreground shadow-sm ring-1 ring-background",
          "group-hover:bg-foreground/90 group-active:bg-foreground/80"
        )}
      />
    </div>
  );
};
