import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export const initFFmpeg = () => {
  const ffmpeg = new FFmpeg();

  // ffmpeg.on("log", ({ type, message }) => {
  //   console.log(`[${type}] ${message}`);
  // });

  // ffmpeg.on("progress", ({ progress }) => {
  //   console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
  // });

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

// export const transcode = async (
//   ffmpeg: FFmpeg,
//   { fileData, args, inputFileMIME, outputFileMIME }: TranscodeProp
// ) => {
//   const inputFileName = `input.${inputFileMIME}`;
//   await ffmpeg.writeFile(inputFileName, fileData);
//   await ffmpeg.exec(["-i", inputFileName, ...args, "output.mp4"]);
//   const data = await ffmpeg.readFile(`output${outputFileMIME}`);
//   return data;
// };
