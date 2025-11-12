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

      const args = [
        "-ss",
        round(startSeconds, 3).toString(),
        "-to",
        round(endSeconds, 3).toString(),
        "-c",
        "copy",
        outputFileName,
      ];

      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      await ffmpeg.writeFile(inputFileName, fileData);

      await ffmpeg.exec(["-i", inputFileName, ...args]);

      const outFileData = await ffmpeg.readFile(outputFileName);
      const data = new Uint8Array(outFileData as unknown as ArrayBuffer);
      const blob = new Blob([data], { type: "image/png" });
      return blob;
    },
    onError: (e) => {
      console.log("e", e);
    },
    retry: false,
  });
};
