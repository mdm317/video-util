import React from "react";
import { useTrimVideo } from "../../../api/use-trim-video";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";

type DownloadTrimVideoProp = {
  startSeconds: number;
  endSeconds: number;
  file: File;
  label: string;
  loadingLabel: string;
};
function DownloadTrimVideo({
  startSeconds,
  endSeconds,
  file,
  label,
  loadingLabel,
}: DownloadTrimVideoProp) {
  const { mutateAsync, isPending } = useTrimVideo();
  const handleDownload = () => {
    mutateAsync({
      file,
      startSeconds: startSeconds ?? 0,
      endSeconds: endSeconds ?? 0,
    }).then((blob) => {
      const mime = file.type.replace("video/", "");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `downloaded.${mime}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  };
  return (
    <Button
      onClick={handleDownload}
      disabled={isPending}
      className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-black"
    >
      {isPending ? (
        <>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}

export default DownloadTrimVideo;
