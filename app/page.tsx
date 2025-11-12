"use client";
import { useCallback, useState } from "react";

export default function Home() {
  const { data } = useFFmpeg();
  const [ren, setRen] = useState([1, 1]);

  const onDrag = useCallback(([l, r]: any) => {
    console.log([l, r]);
  }, []);

  return (
    <div className="m-4 relative w-100 h-24">
      <img
        className="absolute top-0 left-0 w-100 h-24"
        src="https://picsum.photos/200/300"
        width={400}
        height={90}
      />
    </div>
  );
}
