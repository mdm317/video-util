import { useFFmpegQueryOption } from "@/features/video";
import { round } from "@/lib/math";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseTrimVideoProp = {
  file: File;
  startSeconds: number;
  endSeconds: number;
};

export const useTrimVideo = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      startSeconds,
      endSeconds,
    }: UseTrimVideoProp) => {
      const ffmpeg = await client.ensureQueryData(useFFmpegQueryOption);
      const mime = file.type;
      if (!mime.includes("video/")) {
        // not support video mime
        throw Error("");
      }
      const inputFileName = `input.${mime.replace("video/", "")}`;
      const outputFileName = `output.${mime.replace("video/", "")}`;

      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      await ffmpeg.writeFile(inputFileName, fileData);

      const args = [
        "-ss",
        round(startSeconds, 3).toString(),
        "-to",
        round(endSeconds, 3).toString(),
        "-i",
        inputFileName,
        "-c",
        "copy",
        outputFileName,
      ];
      if (process.env.NODE_ENV === "development") {
        console.log("[trim-video-args]", args);
      }
      await ffmpeg.exec([...args]);

      const outFileData = await ffmpeg.readFile(outputFileName);
      const data = new Uint8Array(outFileData as unknown as ArrayBuffer);
      const blob = new Blob([data], { type: mime });
      return blob;
    },
    onError: (e) => {
      console.log("e", e);
    },
    retry: false,
  });
};
