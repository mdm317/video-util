import {
  useMemo, useState
} from "react";
import TimeLineView from "../../components/TimeLine/TimeLineView";

type CuttingVideoProps = {
  videoFile: File;
};

function CuttingVideo({ videoFile }: CuttingVideoProps) {
  const videoUrl = useMemo(() => URL.createObjectURL(videoFile), [videoFile]);
  const [videoElement, setVideoElement] = useState<
    undefined | HTMLVideoElement
  >(undefined);

  return (
    <div className="flex w-full flex-col gap-4">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        className="aspect-video w-full rounded-lg border border-muted"
        onLoadedData={(e) => {
          console.log('target', e.currentTarget)
          setVideoElement(e.currentTarget);
        }}
      >
        <track kind="captions" />
      </video>
      <div className="h-14 overflow-hidden relative">
        <TimeLineView videoFile={videoFile} videoElement={videoElement} />
      </div>
    </div>
  );
}

export default CuttingVideo;
