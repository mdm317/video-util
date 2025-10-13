import { FileData } from "@ffmpeg/ffmpeg";

export type TranscodeProp = {
  args: string[];
  fileData: FileData;
  inputFileMIME: string;
  outputFileMIME: string;
};
