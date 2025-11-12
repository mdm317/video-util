import { cn } from "@/lib/utils";

type OverlayProp = {
  isLeft: boolean;
  widthPercent: number;
}
export const Overlay = ({ isLeft, widthPercent }: OverlayProp) => {

  return (
    <div
      className={cn(
        "absolute inset-y-0 pointer-events-none",
        isLeft ? "left-0" : "right-0",
      )}
      style={{
        width:`${widthPercent}%`
      }}
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
             isLeft ? "left-0" : "right-0",
          )}
        />
      </div>
    </div>
  );
};
