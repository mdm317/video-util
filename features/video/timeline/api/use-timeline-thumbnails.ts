import { useFFmpegQueryOption } from "@/features/video";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type VideoThumbnailProp = {
  file: File;
  mime: string;
  secondsPerFrame: number;
  neededFrame: number;
};

export const useTimelineThumbnails = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      mime,
      secondsPerFrame,
      neededFrame,
    }: VideoThumbnailProp) => {
      const ffmpeg = await client.ensureQueryData(useFFmpegQueryOption);

      if (!mime.includes("video/")) {
        // not support video mime
        throw Error("");
      }
      const inputFileName = `input.${mime.replace("video/", "")}`;

      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      await ffmpeg.writeFile(inputFileName, fileData);

      for (let index = 0; index < neededFrame ; index++) {
        const args = [
          "-ss",
          (secondsPerFrame * (index + 1)).toString(),
          "-i",
          inputFileName,
          "-frames:v",
          "1",
          `thumb_${index}.png`,
        ];
        await ffmpeg.exec(args);
      }


      const list = await Promise.allSettled(
        [...new Array(neededFrame)].map(async (_, i) => {
          const filename = `thumb_${i}.png`;
          const fileData = await ffmpeg.readFile(filename);
          const data = new Uint8Array(fileData as unknown as ArrayBuffer);
          const blob = new Blob([data], { type: "image/png" });
          return URL.createObjectURL(blob);
        })
      );
      return list.map((item)=>{
        if(item.status==='fulfilled'){
          return item.value
        }else{
          return null;
        }
      })
    },
    onError: (e) => {
      console.log("e", e);
    },
    retry: false,
  });
};
