import { initFFmpeg, loadFFmpeg } from "@/lib/ffmpeg";
import {
  queryOptions, useQuery
} from "@tanstack/react-query";

import { INFINITE_CACHE } from "next/dist/lib/constants";

export const useFFmpegQueryOption = queryOptions({
  queryKey: ["ffmpeg", "load"],
  queryFn: async () => {
    const newFFmpeg = initFFmpeg();
    const loadedFFmpeg = await loadFFmpeg(newFFmpeg);
    if (loadedFFmpeg === true) {
      return newFFmpeg;
    }
    if (loadedFFmpeg === false) {
      throw Error("");
    }
    return loadedFFmpeg;
  },
  staleTime: INFINITE_CACHE,
  retry: false,
});
export const useFFmpeg = () => {
  return useQuery(useFFmpegQueryOption);
};

