'use client'
import { useFFmpeg } from "@/features/video/api/loadFFmpeg";
import VideoTrimmer from "@/features/video/components/TimeLine/VideoTrimmer";

export default function Home() {
  const {data} = useFFmpeg()
  console.log('ffmpeg', data)
  return (
    <div className="m-4 relative w-100 h-24">
      <img className="absolute top-0 left-0 w-100 h-24" src="https://picsum.photos/200/300" width={400} height={90}/>
      <VideoTrimmer/>
    </div>
  );
}
