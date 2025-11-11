import React from "react";

function TimeIndicator() {
  return (
    <>
      <div
        className="absolute top-0 bottom-0 bg-red-500/50"
        style={{
          left: `${10}%`,
          width: `2px`,
          pointerEvents: "none",
        }}
      />

      <div className="absolute bottom-1 left-2 text-xs text-slate-300 font-mono">
        {10}s
      </div>
      <div className="absolute bottom-1 right-2 text-xs text-slate-300 font-mono">
        {20}s
      </div>
      <div
        className="absolute bottom-1 transform translate-x-[-50%] text-xs text-red-300 font-mono"
        style={{ left: `${10}%` }}
      >
        {30}s
      </div>
    </>
  );
}

export default TimeIndicator;
