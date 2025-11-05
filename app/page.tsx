'use client'
import { useFFmpeg } from "@/features/video/api/loadFFmpeg";
import VideoTrimmer from "@/features/video/components/TimeLine/VideoTrimmer";

export default function Home() {
  const {data} = useFFmpeg()
  console.log('ffmpeg', data)
  return (
    <div className="m-4 relative w-100 h-24">
      <VideoTrimmer/>
    </div>
  );
}
