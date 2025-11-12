import { useFFmpegQueryOption } from "@/features/video";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type VideoThumbnailProp = {
  file: File;
  mime: string;
  step: number;
  neededFrame: number;
};

export const useTimelineThumbnails = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      mime,
      step,
      neededFrame,
    }: VideoThumbnailProp) => {
      const ffmpeg = await client.ensureQueryData(useFFmpegQueryOption);

      if (!mime.includes("video/")) {
        // not support video mime
        throw Error("");
      }
      const inputFileName = `input.${mime.replace("video/", "")}`;

      const args = ["-vf", `fps=1/${step}`, "-qscale:v", "2", "thumb_%d.png"];

      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      await ffmpeg.writeFile(inputFileName, fileData);

      await ffmpeg.exec(["-i", inputFileName, ...args]);

      const images: string[] = await Promise.all(
        [...new Array(neededFrame)].map(async (_, i) => {
          const filename = `thumb_${i + 1}.png`;
          const fileData = await ffmpeg.readFile(filename);
          const data = new Uint8Array(fileData as unknown as ArrayBuffer);
          const blob = new Blob([data], { type: "image/png" });
          return URL.createObjectURL(blob);
        })
      );
      return images;
    },
    onError: (e) => {
      console.log("e", e);
    },
    retry: false,
  });
};
