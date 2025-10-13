import { FFmpeg, FileData } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { TranscodeProp } from "../types";

export const initFFmpeg = () => {
  const ffmpeg = new FFmpeg();

  return ffmpeg;
};
const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
export const loadFFmpeg = async (ffmpeg: FFmpeg) => {
  if (ffmpeg.loaded) {
    return ffmpeg;
  }

  return await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
};

export const buildVolumeAdjustArgs = (volume: string) => {
  return `-filter:a "volume=${volume}" -c:v copy`.split(" ");
};

export const transcode = async (
  ffmpeg: FFmpeg,
  { fileData, args, inputFileMIME, outputFileMIME }: TranscodeProp
) => {
  const inputFileName = `input.${inputFileMIME}`;
  await ffmpeg.writeFile(inputFileName, fileData);
  await ffmpeg.exec(["-i", inputFileName, ...args, "output.mp4"]);
  const data = await ffmpeg.readFile(`output${outputFileMIME}`);
  return data;
};
