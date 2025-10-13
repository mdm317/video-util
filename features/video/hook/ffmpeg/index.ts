import { useMutation, useQuery } from "@tanstack/react-query";
import {
  buildVolumeAdjustArgs,
  initFFmpeg,
  loadFFmpeg,
  transcode,
} from "../../lib/ffmpeg";
import { INFINITE_CACHE } from "next/dist/lib/constants";
import { TranscodeProp } from "../../types";

export const useFFmpeg = () => {
  return useQuery({
    queryKey: ["ffmpeg", "load"],
    queryFn: async () => {
      const newFFmpeg = initFFmpeg();
      return await loadFFmpeg(newFFmpeg);
    },
    staleTime: INFINITE_CACHE,
  });
};

export const useVolumnAdjustMutation = () => {
  const { data: ffmpeg } = useFFmpeg();
  return useMutation({
    mutationFn: async (
      prop: Omit<TranscodeProp, "args"> & { volumn: string }
    ) => {
      if (!ffmpeg || ffmpeg === true) {
        return;
      }
      const args = buildVolumeAdjustArgs(prop.volumn);
      await transcode(ffmpeg, {
        args,
        ...prop,
      });
    },
  });
};
