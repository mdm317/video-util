import { cn } from "@/lib/utils";

type DraggableRangeSelectorProp = {
  isLeft: boolean;
  left?: number;
  right?: number;
  onMouseDown:(e:React.MouseEvent)=>void
};

export const DraggableRangeSelector = ({
  isLeft,
  left,
  right,
  onMouseDown
}: DraggableRangeSelectorProp) => {
  return (
    <div
    onMouseDown={onMouseDown}
      className={cn(
        "absolute top-0 bottom-0 w-1 shadow-lg hover:w-1.5 cursor-ew-resize",
        isLeft
          ? "bg-emerald-500  shadow-emerald-500/50 hover:shadow-emerald-500/70"
          : "bg-violet-500 shadow-violet-500/50 hover:shadow-violet-500/70"
      )}
      // className="absolute inset-y-0 z-20 flex items-center cursor-ew-resize"
      style={{
        left:`${left}%`,
        right:`${right}%`,
      }}
    ></div>
  );
};
